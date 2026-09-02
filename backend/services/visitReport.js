import {
  describeReferrer,
  formatDuration,
  formatPlace,
  formatTime,
  lookupGeo,
  normaliseIp,
  parseCampaign,
  parseUserAgent,
} from "./visitorInsights.js";

/**
 * Renders a finished visit into the email that gets sent.
 *
 * Kept apart from the transport so the report can be built and inspected —
 * or printed to the console in development — without an SMTP connection.
 */

const escapeHtml = (value) => {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

/** The owner's own timezone, so timestamps read as local rather than UTC. */
const OWNER_TZ = process.env.OWNER_TIMEZONE || "Asia/Kolkata";

const PAGE_NAMES = {
  "/": "Home",
  "/home": "Home",
  "/projects": "Projects",
  "/about": "About",
  "/contact": "Contact",
  "/admin": "Admin",
};

const pageName = (url) => PAGE_NAMES[url] || url;

/** "Opened MLOps Pipeline" reads better than "project_view {id:4}". */
const describeEvent = (event) => {
  const data = event.data || {};
  switch (event.type) {
    case "project_view":
    case "project_open":
      return `Opened ${data.title || data.project_title || `project #${data.project_id ?? "?"}`}`;
    case "resume_download":
      return "Downloaded the résumé";
    case "contact_submit":
      return "Sent a message through the contact form";
    case "external_link":
      return `Followed a link to ${data.href || data.url || "elsewhere"}`;
    default:
      return event.type.replace(/_/g, " ");
  }
};

/**
 * Builds the full report for a completed visit. Performs the geo lookup, so
 * it is async; every other field is derived from what the request already
 * carried.
 */
export const buildVisitReport = async (visit) => {
  const context = visit.context || {};
  const ip = normaliseIp(context.ip);
  const ua = parseUserAgent(context.userAgent);
  const geo = await lookupGeo(ip);

  const place = formatPlace(geo);
  const duration = formatDuration(visit.durationMs);
  const referrer = describeReferrer(context.referrer);
  const campaign = parseCampaign(context.referrer, context.landingUrl);

  // Their clock, not the server's. A visit at 2am local is a different
  // signal from one at 2pm, and the browser already told us the zone.
  const visitorTz = context.timezone || geo?.timezone || null;

  const started = new Date(visit.startedAt);
  const ended = new Date(visit.endedAt);

  const pageCount = visit.pages.reduce((sum, page) => sum + page.views, 0);
  const entry = visit.pages[0];
  const exit = visit.pages[visit.pages.length - 1];

  const returning = Boolean(context.returning);

  const headline = ua.isBot
    ? `Bot visit — ${referrer.label}`
    : `${returning ? "Returning visitor" : "New visitor"}${place ? ` from ${place}` : ""}`;

  const subject = ua.isBot
    ? `Portfolio: crawler visit (${ua.browser || "unknown agent"})`
    : `Portfolio: ${returning ? "returning" : "new"} visitor${
        place ? ` from ${place}` : ""
      } — ${duration}, ${pageCount} page${pageCount === 1 ? "" : "s"}`;

  const summaryLine = `${headline} · ${duration} · ${pageCount} page${
    pageCount === 1 ? "" : "s"
  } · via ${referrer.label}`;

  // Rows are declared once and rendered into both the HTML and the plain
  // text part, so the two can never disagree.
  const rows = [
    ["Visited", `${formatTime(started, OWNER_TZ)} (your time)`],
    visitorTz && visitorTz !== OWNER_TZ
      ? ["Their local time", `${formatTime(started, visitorTz)} · ${visitorTz}`]
      : null,
    ["Time on site", duration],
    ["Ended", visit.endedBy === "beacon" ? "They closed the tab" : `Went idle (${visit.endedBy})`],
    ["Location", place || (ip ? "Unknown (no match for their IP)" : "Unknown")],
    geo?.postal ? ["Postal area", geo.postal] : null,
    geo?.org ? ["Network", geo.org] : null,
    ["IP address", ip || "Unknown"],
    ["Device", [ua.device, ua.os].filter(Boolean).join(" · ") || "Unknown"],
    ["Browser", ua.browser || "Unknown"],
    context.screen ? ["Screen", context.screen] : null,
    context.language ? ["Language", context.language] : null,
    ["Came from", referrer.url ? `${referrer.label} — ${referrer.url}` : referrer.label],
    campaign
      ? ["Campaign", Object.entries(campaign).map(([k, v]) => `${k}=${v}`).join(", ")]
      : null,
    ["Entry page", entry ? pageName(entry.url) : "Unknown"],
    visit.pages.length > 1 ? ["Exit page", pageName(exit.url)] : null,
    ["Pages viewed", String(pageCount)],
    returning ? ["Visitor", "Has been here before"] : ["Visitor", "First time here"],
  ].filter(Boolean);

  const journey = visit.pages.map((page) => {
    const seconds = Math.round((page.lastAt - page.at) / 1000);
    const repeat = page.views > 1 ? ` ×${page.views}` : "";
    return `${pageName(page.url)}${repeat}${seconds >= 1 ? ` — ${formatDuration(page.lastAt - page.at)}` : ""}`;
  });

  const actions = visit.events.map(describeEvent);

  // ── plain text ──────────────────────────────────────────────────
  const text = [
    headline,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    journey.length ? `Journey: ${journey.join("  ->  ")}` : "",
    actions.length ? `What they did: ${actions.join("; ")}` : "What they did: nothing beyond reading",
  ]
    .filter((line) => line !== "")
    .join("\n");

  // ── html ────────────────────────────────────────────────────────
  const rowHtml = rows
    .map(
      ([label, value]) => `
          <tr>
            <td style="padding:7px 14px 7px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
            <td style="padding:7px 0;color:#111827;font-size:13px;vertical-align:top;">${escapeHtml(value)}</td>
          </tr>`,
    )
    .join("");

  const listHtml = (items) =>
    items
      .map(
        (item) =>
          `<li style="margin:0 0 5px 0;color:#374151;font-size:13px;">${escapeHtml(item)}</li>`,
      )
      .join("");

  const html = `
  <div style="margin:0;padding:24px;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

      <div style="padding:20px 24px;background:#111827;">
        <p style="margin:0 0 4px 0;color:#9ca3af;font-size:11px;letter-spacing:.14em;text-transform:uppercase;">Portfolio visit</p>
        <h1 style="margin:0;color:#ffffff;font-size:19px;font-weight:600;">${escapeHtml(headline)}</h1>
        <p style="margin:6px 0 0 0;color:#9ca3af;font-size:13px;">${escapeHtml(
          `${duration} on site · ${pageCount} page${pageCount === 1 ? "" : "s"} · via ${referrer.label}`,
        )}</p>
      </div>

      <div style="padding:20px 24px;">
        <table style="width:100%;border-collapse:collapse;">${rowHtml}</table>
      </div>

      ${
        journey.length
          ? `<div style="padding:0 24px 20px 24px;">
        <p style="margin:0 0 8px 0;color:#6b7280;font-size:11px;letter-spacing:.14em;text-transform:uppercase;">Their path</p>
        <ol style="margin:0;padding-left:18px;">${listHtml(journey)}</ol>
      </div>`
          : ""
      }

      <div style="padding:0 24px 22px 24px;">
        <p style="margin:0 0 8px 0;color:#6b7280;font-size:11px;letter-spacing:.14em;text-transform:uppercase;">What they did</p>
        ${
          actions.length
            ? `<ul style="margin:0;padding-left:18px;">${listHtml(actions)}</ul>`
            : `<p style="margin:0;color:#9ca3af;font-size:13px;">Nothing beyond reading.</p>`
        }
      </div>

      <div style="padding:14px 24px;background:#f9fafb;border-top:1px solid #e5e7eb;">
        <p style="margin:0;color:#9ca3af;font-size:11px;">
          Session ${escapeHtml(visit.key)} · sent once per visit, when it ends.
        </p>
      </div>
    </div>
  </div>`;

  return { subject, text, html, summaryLine, headline, geo, ua, place, duration };
};

export default buildVisitReport;
