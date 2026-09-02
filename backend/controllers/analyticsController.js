import { db } from "../db/db.js";
import { analytics, pageViews, projects, contacts } from "../db/schema.js";
import { eq, sql, gte } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { sendVisitNotification } from "../services/emailService.js";
import { buildVisitReport } from "../services/visitReport.js";
import {
  endVisit as endTrackedVisit,
  onVisitComplete,
  recordEvent as recordTrackedEvent,
  recordPageView as recordTrackedPageView,
} from "../services/visitTracker.js";

/**
 * One notification per visit, sent when the visit ends.
 *
 * Registered once at module load rather than per request, so a burst of page
 * views cannot stack handlers.
 */
onVisitComplete(async (visit) => {
  try {
    const report = await buildVisitReport(visit);
    await sendVisitNotification({ ...visit, ...report });
  } catch (error) {
    console.error("Visit report failed:", error);
  }
});

/** The address the visitor actually came from, proxies accounted for. */
const clientIp = (req) => req.ip || req.socket?.remoteAddress || null;

/**
 * What a request tells us about the visitor beyond the page they asked for.
 * Client-supplied fields are length-capped: they end up in an email, and an
 * email is not the place to discover someone sent a megabyte of "language".
 */
const cap = (value, max = 200) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null;

const visitContext = (req) => ({
  ip: clientIp(req),
  userAgent: req.get("user-agent") || null,
  referrer: cap(req.body?.referrer, 500) || req.get("referer") || null,
  landingUrl: cap(req.body?.landing_url, 500),
  timezone: cap(req.body?.timezone, 64),
  language: cap(req.body?.language, 64),
  screen: cap(req.body?.screen, 32),
  returning: req.body?.returning === true,
});

// Track page view
export const trackPageView = async (req, res) => {
  try {
    const { page_url, visitor_id, session_id: clientSession } = req.body;
    // The client owns the session id: it is the only party that knows where
    // one visit stops and the next begins. `req.sessionId` was never set by
    // any middleware, so every view used to mint a new id and no two rows
    // could be grouped into a visit.
    const session_id = clientSession || visitor_id || uuidv4();

    // Insert page view
    await db.insert(pageViews).values({
      pageUrl: page_url,
      visitorId: visitor_id,
      sessionId: session_id,
    });

    // Track analytics event
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("user-agent");

    await db.insert(analytics).values({
      eventType: "page_view",
      eventData: { page_url },
      ipAddress,
      userAgent,
    });

    // Buffered, not emailed. The notification goes out once the visit ends,
    // which is the only moment its duration and page count are known.
    recordTrackedPageView(session_id, {
      pageUrl: page_url,
      context: visitContext(req),
    });

    res.json({ success: true, session_id });
  } catch (error) {
    console.error("Track page view error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to track page view" });
  }
};

// Track custom event
export const trackEvent = async (req, res) => {
  try {
    const { event_type, event_data, session_id } = req.body;

    if (!event_type) {
      return res.status(400).json({
        success: false,
        error: "event_type is required",
      });
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("user-agent");

    await db.insert(analytics).values({
      eventType: event_type,
      eventData: event_data || {},
      ipAddress,
      userAgent,
    });

    if (session_id) {
      recordTrackedEvent(session_id, { type: event_type, data: event_data });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Track event error:", error);
    res.status(500).json({ success: false, error: "Failed to track event" });
  }
};

/**
 * The visitor left. Sent by `navigator.sendBeacon` on pagehide, so it has to
 * answer fast and cannot be relied upon — the tracker sweeps abandoned visits
 * on its own. Always 204: a beacon has nobody left to read a response.
 */
export const endVisit = async (req, res) => {
  try {
    const { session_id } = req.body || {};
    if (session_id) endTrackedVisit(session_id);
  } catch (error) {
    console.error("End visit error:", error);
  }
  res.status(204).end();
};

// Get analytics stats
export const getAnalyticsStats = async (req, res) => {
  try {
    // Total page views
    const totalViewsResult = await db
      .select({ count: sql`count(*)` })
      .from(pageViews);
    const totalViews = parseInt(totalViewsResult[0]?.count || 0);

    // Unique visitors
    const uniqueVisitorsResult = await db
      .select({ count: sql`count(DISTINCT ${pageViews.visitorId})` })
      .from(pageViews);
    const uniqueVisitors = parseInt(uniqueVisitorsResult[0]?.count || 0);

    // Total project views
    const projectViewsResult = await db
      .select({ sum: sql`sum(${projects.viewCount})` })
      .from(projects);
    const projectViews = parseInt(projectViewsResult[0]?.sum || 0);

    // Recent contacts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentContactsResult = await db
      .select({ count: sql`count(*)` })
      .from(contacts)
      .where(gte(contacts.createdAt, sevenDaysAgo));
    const recentContacts = parseInt(recentContactsResult[0]?.count || 0);

    // Top events (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const topEventsResult = await db
      .select({
        eventType: analytics.eventType,
        count: sql`count(*)`,
      })
      .from(analytics)
      .where(gte(analytics.createdAt, thirtyDaysAgo))
      .groupBy(analytics.eventType)
      .orderBy(sql`count(*) DESC`)
      .limit(5);

    res.json({
      success: true,
      data: {
        total_views: totalViews,
        unique_visitors: uniqueVisitors,
        project_views: projectViews,
        recent_contacts: recentContacts,
        top_events: topEventsResult,
      },
    });
  } catch (error) {
    console.error("Get analytics stats error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch analytics" });
  }
};

// Get page views over time
export const getPageViewsOverTime = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const viewsOverTime = await db
      .select({
        date: sql`DATE(${pageViews.createdAt})`,
        count: sql`count(*)`,
      })
      .from(pageViews)
      .where(gte(pageViews.createdAt, startDate))
      .groupBy(sql`DATE(${pageViews.createdAt})`)
      .orderBy(sql`DATE(${pageViews.createdAt})`);

    res.json({ success: true, data: viewsOverTime });
  } catch (error) {
    console.error("Get page views over time error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch page views" });
  }
};

// Get popular projects
export const getPopularProjects = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const popularProjects = await db
      .select({
        id: projects.id,
        title: projects.title,
        company: projects.company,
        viewCount: projects.viewCount,
      })
      .from(projects)
      .orderBy(sql`${projects.viewCount} DESC`)
      .limit(parseInt(limit));

    res.json({ success: true, data: popularProjects });
  } catch (error) {
    console.error("Get popular projects error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch popular projects" });
  }
};
