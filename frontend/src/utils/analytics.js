import { useMemo } from "react";
import axios from "axios";
import API_URL from "../config/api";

/**
 * Visitor analytics.
 *
 * Two identities, deliberately: `visitor_id` persists across visits (so a
 * returning reader can be recognised), `session_id` lives only as long as the
 * tab (so one visit is one visit). The backend groups everything by the
 * session id and notifies once, when the visit ends.
 */

const VISITOR_KEY = "visitor_id";
const SESSION_KEY = "session_id";

const safeGet = (store, key) => {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (store, key, value) => {
  try {
    store.setItem(key, value);
  } catch {
    /* private mode — tracking just will not persist */
  }
};

const mintId = (prefix) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

/** Stable across visits. Its absence is what makes a visitor "new". */
export const getVisitorId = () => {
  let visitorId = safeGet(localStorage, VISITOR_KEY);
  if (!visitorId) {
    visitorId = mintId("visitor");
    safeSet(localStorage, VISITOR_KEY, visitorId);
  }
  return visitorId;
};

/**
 * Scoped to the tab. sessionStorage is the right home: it dies with the tab,
 * which is exactly the boundary of a visit, and it survives a reload — a
 * refresh should not read as a second person arriving.
 */
export const getSessionId = () => {
  let sessionId = safeGet(sessionStorage, SESSION_KEY);
  if (!sessionId) {
    sessionId = mintId("session");
    safeSet(sessionStorage, SESSION_KEY, sessionId);
  }
  return sessionId;
};

/** True when this browser has a visitor id from before this session. */
const isReturning = () => {
  const hadVisitor = Boolean(safeGet(localStorage, VISITOR_KEY));
  const hasSession = Boolean(safeGet(sessionStorage, SESSION_KEY));
  return hadVisitor && !hasSession;
};

/**
 * What the browser can say about itself that the server cannot infer.
 *
 * The timezone is the useful one: it locates a visitor to a region without a
 * geo lookup, and tells you what time it was where they were.
 */
const visitorContext = () => {
  const context = {};
  try {
    context.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    /* very old browser; the server falls back to the IP's timezone */
  }
  if (navigator.language) context.language = navigator.language;
  if (window.screen?.width) {
    context.screen = `${window.screen.width}×${window.screen.height}`;
  }
  if (document.referrer) context.referrer = document.referrer;
  context.landing_url = window.location.href.slice(0, 500);
  return context;
};

// The first call decides "returning", because getSessionId() is about to make
// this browser look like it has always had a session.
let returningVisitor = null;

export const trackPageView = async (pageUrl) => {
  try {
    if (returningVisitor === null) returningVisitor = isReturning();

    await axios.post(`${API_URL}/analytics/page-view`, {
      page_url: pageUrl,
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      returning: returningVisitor,
      ...visitorContext(),
    });
  } catch (error) {
    // Silently fail - don't disrupt UX
  }
};

export const trackEvent = async (eventType, eventData = {}) => {
  try {
    await axios.post(`${API_URL}/analytics/event`, {
      event_type: eventType,
      event_data: eventData,
      session_id: getSessionId(),
    });
  } catch (error) {
    // Silently fail
  }
};

/**
 * Two posts, because they answer different questions: the counter on the
 * project drives "most viewed", while the event is what lets the visit
 * notification say which project someone actually opened.
 */
export const trackProjectView = async (projectId, title) => {
  try {
    await Promise.allSettled([
      axios.post(`${API_URL}/projects/${projectId}/view`),
      trackEvent("project_view", { project_id: projectId, title }),
    ]);
  } catch (error) {
    // Silently fail
  }
};

/**
 * Tell the server the visit is over.
 *
 * `sendBeacon` is the only request that reliably survives a page being
 * unloaded — a fetch or an XHR started here is cancelled with the document.
 * If even this does not arrive, the server sweeps the visit closed on its
 * own; this just makes the recorded duration accurate.
 */
const sendVisitEnd = () => {
  try {
    const body = JSON.stringify({ session_id: getSessionId() });
    const url = `${API_URL}/analytics/visit-end`;

    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      return;
    }
    // Pre-beacon fallback. keepalive does the same job for fetch.
    fetch(url, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* nothing useful to do as the page goes away */
  }
};

let lifecycleBound = false;

/**
 * Binds the end-of-visit signals. Idempotent, so React's double-invoked
 * effects in development cannot register two listeners and send two beacons.
 *
 * Both events are needed: `pagehide` covers navigation and tab close on
 * desktop, `visibilitychange` is the only one iOS Safari reliably fires when
 * an app is backgrounded.
 */
export const startVisitTracking = () => {
  if (lifecycleBound || typeof window === "undefined") return () => {};
  lifecycleBound = true;

  const onHidden = () => {
    if (document.visibilityState === "hidden") sendVisitEnd();
  };

  window.addEventListener("pagehide", sendVisitEnd);
  document.addEventListener("visibilitychange", onHidden);

  return () => {
    window.removeEventListener("pagehide", sendVisitEnd);
    document.removeEventListener("visibilitychange", onHidden);
    lifecycleBound = false;
  };
};

/**
 * Stable identities. These wrap module-level functions with no state of their
 * own, so rebuilding them each render bought nothing and cost correctness:
 * an effect depending on `trackProject` re-fired every render and posted the
 * same project view twice per modal open.
 */
export const useAnalytics = () =>
  useMemo(
    () => ({
      trackPage: trackPageView,
      trackCustomEvent: trackEvent,
      trackProject: trackProjectView,
    }),
    [],
  );
