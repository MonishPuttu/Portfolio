import { db } from "../db/db.js";
import { analytics, pageViews, projects, contacts } from "../db/schema.js";
import { eq, sql, gte } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { sendViewNotification } from "../services/emailService.js";

// Track page view
export const trackPageView = async (req, res) => {
  try {
    const { page_url, visitor_id } = req.body;
    const session_id = req.sessionId || uuidv4();

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

    // Send email notification for home page views
    if (page_url === "/" || page_url === "/home") {
      try {
        await sendViewNotification({ page: page_url, location: ipAddress });
      } catch (emailError) {
        console.error("View notification email failed:", emailError);
      }
    }

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
    const { event_type, event_data } = req.body;

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

    res.json({ success: true });
  } catch (error) {
    console.error("Track event error:", error);
    res.status(500).json({ success: false, error: "Failed to track event" });
  }
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
