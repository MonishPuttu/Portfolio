/**
 * Which project links can actually be shown inside an iframe.
 *
 * There is no way to ask a cross-origin page whether it will render — a frame
 * refused by `X-Frame-Options` or `frame-ancestors` still fires `onLoad`, and
 * its document is unreadable either way. So the decision has to be made from
 * the URL, before the frame is created, and the list below is the set of hosts
 * known to refuse: five of the seven project links point at GitHub, which
 * sends `X-Frame-Options: DENY` and renders as a blank white pane.
 */
const REFUSES_FRAMING = [
  "github.com",
  "gist.github.com",
  "gitlab.com",
  "bitbucket.org",
  "x.com",
  "twitter.com",
  "linkedin.com",
  "facebook.com",
  "instagram.com",
  "reddit.com",
  "notion.so",
  "docs.google.com",
  "drive.google.com",
];

/** True when `url` is a http(s) link to a host that permits framing. */
export const canEmbed = (url) => {
  if (!url) return false;

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  return !REFUSES_FRAMING.some(
    (blocked) => host === blocked || host.endsWith(`.${blocked}`),
  );
};

export default canEmbed;
