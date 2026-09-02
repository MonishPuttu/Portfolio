/**
 * Groups a stream of page views and events into one visit, so the owner gets
 * one notification per person rather than one per navigation.
 *
 * The old behaviour emailed on every "/" view, which meant a refresh was a
 * second email and a visit's duration could never be known — the mail was
 * already sent. Buffering until the visit ends costs a few minutes of delay
 * and buys time-on-site, pages read, and what they clicked.
 *
 * State is in memory on purpose. A visit is worth minutes, not durability;
 * if the process restarts mid-visit the notification is lost, which is the
 * right trade against a table of half-finished sessions.
 */

/** How long a silent visit is held open before it is assumed over. */
const IDLE_TIMEOUT_MS = Number(process.env.VISIT_IDLE_MS) || 3 * 60 * 1000;
/** A hard ceiling, so a pinned background tab cannot hold a visit forever. */
const MAX_VISIT_MS = Number(process.env.VISIT_MAX_MS) || 45 * 60 * 1000;
/** How often the sweep looks for visits that have gone quiet. */
const SWEEP_INTERVAL_MS = Number(process.env.VISIT_SWEEP_MS) || 30 * 1000;
/** Refuse to grow without bound if something starts forging session ids. */
const MAX_OPEN_VISITS = Number(process.env.VISIT_MAX_OPEN) || 2000;

const visits = new Map();
let onComplete = null;
let sweepTimer = null;

/** Registers what to do with a finished visit — in practice, email it. */
export const onVisitComplete = (handler) => {
  onComplete = handler;
};

const flush = (key, reason) => {
  const visit = visits.get(key);
  if (!visit) return;
  visits.delete(key);

  // Always the last time we heard from them, never the moment the sweep
  // noticed: idle time is not time on site.
  const endedAt = visit.lastSeenAt;
  const summary = {
    ...visit,
    endedAt,
    // Measured from the server's own clock at both ends. A client-reported
    // duration is a number a visitor can set to anything.
    durationMs: Math.max(0, endedAt - visit.startedAt),
    endedBy: reason,
  };

  if (!onComplete) return;
  Promise.resolve()
    .then(() => onComplete(summary))
    .catch((error) => console.error("Visit notification failed:", error));
};

const ensureSweep = () => {
  if (sweepTimer) return;
  sweepTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, visit] of visits) {
      if (now - visit.lastSeenAt >= IDLE_TIMEOUT_MS) {
        flush(key, "idle");
      } else if (now - visit.startedAt >= MAX_VISIT_MS) {
        flush(key, "max-duration");
      }
    }
  }, SWEEP_INTERVAL_MS);

  // Never hold the process open for the sweep alone.
  sweepTimer.unref?.();
};

/**
 * Record a page view. The first one opens the visit and fixes everything we
 * only learn once — the entry page, the referrer, the device.
 */
export const recordPageView = (key, { pageUrl, at = Date.now(), context = {} }) => {
  ensureSweep();

  let visit = visits.get(key);

  if (!visit) {
    if (visits.size >= MAX_OPEN_VISITS) return null;
    visit = {
      key,
      startedAt: at,
      lastSeenAt: at,
      pages: [],
      events: [],
      context,
    };
    visits.set(key, visit);
  } else {
    // Later requests can carry fields the first one lacked (a timezone that
    // arrived with the second beacon, say) but must not erase what we have.
    for (const [field, value] of Object.entries(context)) {
      if (value !== undefined && value !== null && visit.context[field] == null) {
        visit.context[field] = value;
      }
    }
  }

  visit.lastSeenAt = at;

  const last = visit.pages[visit.pages.length - 1];
  if (last && last.url === pageUrl) {
    // A refresh or a re-render is the same page, not a new one.
    last.views += 1;
    last.lastAt = at;
  } else if (visit.pages.length < 40) {
    visit.pages.push({ url: pageUrl, at, lastAt: at, views: 1 });
  }

  return visit;
};

/** Record a custom event (a project opened, a résumé downloaded). */
export const recordEvent = (key, { type, data, at = Date.now() }) => {
  const visit = visits.get(key);
  if (!visit) return null;

  visit.lastSeenAt = at;
  if (visit.events.length < 60) {
    visit.events.push({ type, data, at });
  }
  return visit;
};

/**
 * The visitor left and their browser told us so. This is the accurate ending
 * — the sweep is only the fallback for browsers that never got the chance.
 */
export const endVisit = (key, { at = Date.now() } = {}) => {
  const visit = visits.get(key);
  if (!visit) return false;
  visit.lastSeenAt = Math.max(visit.lastSeenAt, at);
  flush(key, "beacon");
  return true;
};

/** Test and shutdown seam: flush everything now. */
export const flushAll = (reason = "shutdown") => {
  for (const key of [...visits.keys()]) flush(key, reason);
};

export const openVisitCount = () => visits.size;
