/**
 * Turns a raw request into the things you actually want to know about a
 * visitor: where they are, what they are on, and how they got there.
 *
 * Everything here degrades. A missing user agent, a private IP, a geo
 * provider that is down or rate-limited — each of those costs one field, not
 * the notification.
 */

// ── IP ────────────────────────────────────────────────────────────

/** Strip the IPv6 wrapper Express leaves on IPv4 addresses behind a proxy. */
export const normaliseIp = (raw) => {
  if (!raw) return null;
  const ip = String(raw).trim();
  if (ip.startsWith("::ffff:")) return ip.slice(7);
  return ip;
};

/**
 * Addresses no geo provider can say anything useful about: loopback, private
 * ranges, link-local. Looking these up wastes a request and a rate limit.
 */
export const isPrivateIp = (ip) => {
  if (!ip) return true;
  if (ip === "::1" || ip === "127.0.0.1" || ip === "localhost") return true;
  if (/^10\./.test(ip)) return true;
  if (/^192\.168\./.test(ip)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true;
  if (/^169\.254\./.test(ip)) return true;
  if (/^f[cd][0-9a-f]{2}:/i.test(ip)) return true; // unique local IPv6
  if (/^fe80:/i.test(ip)) return true; // link-local IPv6
  return false;
};

// ── user agent ────────────────────────────────────────────────────

/**
 * Order matters throughout: Edge claims to be Chrome, Chrome claims to be
 * Safari, and every mobile browser claims to be several things at once. The
 * more specific token has to be tested first.
 */
const BROWSERS = [
  { name: "Edge", re: /Edg(?:e|A|iOS)?\/([\d.]+)/ },
  { name: "Opera", re: /(?:OPR|Opera)\/([\d.]+)/ },
  { name: "Samsung Internet", re: /SamsungBrowser\/([\d.]+)/ },
  { name: "Brave", re: /Brave\/([\d.]+)/ },
  { name: "Vivaldi", re: /Vivaldi\/([\d.]+)/ },
  { name: "Firefox", re: /(?:Firefox|FxiOS)\/([\d.]+)/ },
  { name: "Chrome", re: /(?:Chrome|CriOS)\/([\d.]+)/ },
  { name: "Safari", re: /Version\/([\d.]+).*Safari/ },
];

const OSES = [
  { name: "Android", re: /Android\s([\d.]+)/ },
  { name: "iPadOS", re: /iPad.*?OS\s([\d_]+)/ },
  { name: "iOS", re: /(?:iPhone|iPod).*?OS\s([\d_]+)/ },
  { name: "Windows", re: /Windows NT\s([\d.]+)/, map: {
    "10.0": "10 / 11",
    "6.3": "8.1",
    "6.2": "8",
    "6.1": "7",
  } },
  { name: "macOS", re: /Mac OS X\s([\d_]+)/ },
  { name: "Chrome OS", re: /CrOS\s\S+\s([\d.]+)/ },
  { name: "Linux", re: /(Linux)/ },
];

/** Crawlers and preview bots — worth naming so they are not read as people. */
const BOT_RE =
  /bot|crawler|spider|crawling|slurp|facebookexternalhit|embedly|preview|monitor|curl|wget|python-requests|headless|lighthouse|pingdom|uptime/i;

export const parseUserAgent = (ua) => {
  if (!ua) {
    return { browser: null, os: null, device: "Unknown", isBot: false, raw: null };
  }

  const isBot = BOT_RE.test(ua);

  let browser = null;
  for (const entry of BROWSERS) {
    const match = ua.match(entry.re);
    if (match) {
      // Only the major version. "Chrome 141" is information; the build number
      // is noise in an email.
      browser = `${entry.name} ${match[1].split(".")[0]}`;
      break;
    }
  }

  let os = null;
  for (const entry of OSES) {
    const match = ua.match(entry.re);
    if (match) {
      const version = match[1].replace(/_/g, ".");
      const label = entry.map?.[version] ?? version;
      os = entry.name === "Linux" ? "Linux" : `${entry.name} ${label}`;
      break;
    }
  }

  // Tablets before phones: an iPad's UA contains neither "Mobile" nor a phone
  // token in desktop-request mode, but it does say iPad.
  let device = "Desktop";
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) {
    device = "Tablet";
  } else if (/Mobi|iPhone|iPod|Android|Windows Phone/i.test(ua)) {
    device = "Mobile";
  }
  if (isBot) device = "Bot";

  return { browser, os, device, isBot, raw: ua };
};

// ── geolocation ───────────────────────────────────────────────────

const GEO_ENABLED = process.env.GEOIP_ENABLED !== "false";
// ipwho.is: HTTPS, no key, and a far more forgiving free tier than the
// alternatives — ipapi.co starts returning 429 almost immediately from a
// shared address. Override with GEOIP_URL if you have a paid provider.
const GEO_URL_TEMPLATE = process.env.GEOIP_URL || "https://ipwho.is/{ip}";
// Generous, because this runs after the visit has ended rather than on the
// request path — nobody is waiting on it, and a cold DNS + TLS handshake
// alone can eat two seconds.
const GEO_TIMEOUT_MS = Number(process.env.GEOIP_TIMEOUT_MS) || 5000;
const GEO_CACHE_TTL_MS = Number(process.env.GEOIP_CACHE_TTL_MS) || 6 * 60 * 60 * 1000;

/** Repeat visitors should not cost a lookup each time. */
const geoCache = new Map();

const readCache = (ip) => {
  const hit = geoCache.get(ip);
  if (!hit) return undefined;
  if (Date.now() - hit.at > GEO_CACHE_TTL_MS) {
    geoCache.delete(ip);
    return undefined;
  }
  return hit.value;
};

const writeCache = (ip, value) => {
  // Bounded so a burst of unique IPs cannot grow this without limit.
  if (geoCache.size > 500) geoCache.clear();
  geoCache.set(ip, { value, at: Date.now() });
};

/**
 * Best-effort city/region/country for an IP.
 *
 * Returns null rather than throwing: a notification with no location is worth
 * far more than no notification.
 */
export const lookupGeo = async (ip) => {
  if (!GEO_ENABLED || !ip || isPrivateIp(ip)) return null;

  const cached = readCache(ip);
  if (cached !== undefined) return cached;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);

  try {
    const response = await fetch(
      GEO_URL_TEMPLATE.replace("{ip}", encodeURIComponent(ip)),
      { signal: controller.signal, headers: { accept: "application/json" } },
    );
    if (!response.ok) throw new Error(`geo provider returned ${response.status}`);

    const body = await response.json();
    // Both common providers report failure with a 200 and a flag in the body
    // rather than a status code.
    if (body?.error) throw new Error(body.reason || "geo lookup failed");
    if (body?.success === false) throw new Error(body.message || "geo lookup failed");

    // Read either shape, so swapping providers via GEOIP_URL does not need a
    // code change: ipwho.is nests timezone and org, ipapi.co keeps them flat.
    const geo = {
      city: body.city || null,
      region: body.region || body.region_name || null,
      country: body.country_name || body.country || null,
      countryCode: body.country_code || null,
      postal: body.postal || null,
      timezone: body.timezone?.id || body.timezone || null,
      org: body.connection?.org || body.connection?.isp || body.org || body.asn_org || null,
      latitude: body.latitude ?? null,
      longitude: body.longitude ?? null,
    };
    writeCache(ip, geo);
    return geo;
  } catch (error) {
    console.warn("Geo lookup failed:", error.message);
    // Cache the miss too, so one flaky provider does not mean a 2.5s stall on
    // every subsequent view from the same address.
    writeCache(ip, null);
    return null;
  } finally {
    clearTimeout(timer);
  }
};

// ── formatting ────────────────────────────────────────────────────

/** "Bengaluru, Karnataka, India" from whatever parts came back. */
export const formatPlace = (geo) => {
  if (!geo) return null;
  const parts = [geo.city, geo.region, geo.country].filter(Boolean);
  return parts.length ? [...new Set(parts)].join(", ") : null;
};

/** "4m 12s", "38s", "1h 06m". Empty visits read as "under a second". */
export const formatDuration = (ms) => {
  if (!Number.isFinite(ms) || ms < 0) return "unknown";
  const seconds = Math.round(ms / 1000);
  if (seconds < 1) return "under a second";
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}m ${String(restSeconds).padStart(2, "0")}s`;

  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  return `${hours}h ${String(restMinutes).padStart(2, "0")}m`;
};

/**
 * A timestamp in a named timezone, or the server's own if that timezone is
 * not one Node recognises.
 */
export const formatTime = (date, timeZone) => {
  const options = {
    dateStyle: "medium",
    timeStyle: "short",
    ...(timeZone ? { timeZone } : {}),
  };
  try {
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }
};

/**
 * Where the visit came from. A search engine or a social link is the single
 * most useful thing in the whole notification, so it gets named rather than
 * left as a URL.
 */
const REFERRER_NAMES = [
  { re: /google\./i, name: "Google" },
  { re: /bing\./i, name: "Bing" },
  { re: /duckduckgo\./i, name: "DuckDuckGo" },
  { re: /linkedin\./i, name: "LinkedIn" },
  { re: /github\./i, name: "GitHub" },
  { re: /(twitter|x)\.com/i, name: "X / Twitter" },
  { re: /facebook\./i, name: "Facebook" },
  { re: /instagram\./i, name: "Instagram" },
  { re: /reddit\./i, name: "Reddit" },
  { re: /news\.ycombinator/i, name: "Hacker News" },
  { re: /t\.co|lnkd\.in|bit\.ly/i, name: "a shortened link" },
];

export const describeReferrer = (referrer) => {
  if (!referrer) return { label: "Direct or unknown", url: null };
  try {
    const url = new URL(referrer);
    const known = REFERRER_NAMES.find((entry) => entry.re.test(url.hostname));
    return { label: known ? known.name : url.hostname, url: referrer };
  } catch {
    return { label: referrer, url: null };
  }
};

/** UTM parameters, when the link that brought them carried any. */
export const parseCampaign = (referrer, landingUrl) => {
  const source = landingUrl || referrer;
  if (!source) return null;
  try {
    const params = new URL(source, "https://placeholder.local").searchParams;
    const campaign = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "ref"]) {
      const value = params.get(key);
      if (value) campaign[key] = value;
    }
    return Object.keys(campaign).length ? campaign : null;
  } catch {
    return null;
  }
};
