/**
 * Which nav section a scroll position belongs to.
 *
 * Kept as pure arithmetic over pre-measured geometry, for two reasons. The
 * scroll handler then reads no layout at all — it does a couple of
 * comparisons — and the rule itself can be tested exhaustively without a
 * browser, which is the only way to be sure every scroll position resolves
 * sensibly rather than spot-checking a few.
 */

/** A section becomes current once its top passes this line. */
export const ACTIVE_MARKER = 126;

/** Enough of the final section on screen to count as having arrived. */
const ARRIVED_RATIO = 0.5;

/**
 * @param {number} scrollY
 * @param {object} metrics
 * @param {number} metrics.viewportHeight
 * @param {number} metrics.docHeight
 * @param {Array<{id: string, top: number, height: number}>} metrics.anchors
 *        Document-space geometry, in document order.
 * @returns {string} section id, or "work" for the top of the page
 */
export function sectionAt(scrollY, metrics) {
  const { viewportHeight, docHeight, anchors } = metrics || {};
  if (!anchors || !anchors.length) return "work";

  const y = Math.max(0, scrollY);
  const marker = y + ACTIVE_MARKER;
  let current = "work";

  // A section owns the marker only while its own tile spans it.
  //
  // The rule used to be "the last anchor whose top has passed the marker",
  // which is right only when the sections run top to bottom. They do not:
  // About is the experience tile, which sits beside the featured project on
  // desktop and above it on narrower screens — either way it comes *before*
  // the work. A rule that never lets go left the pill reading "About" for the
  // whole run of project tiles, tools, skills and awards.
  //
  // Containment lets go at the bottom of the tile, and everything between two
  // anchored sections falls back to "work" — which is exactly what that stretch
  // of the page is.
  anchors.forEach(({ id, top, height }) => {
    if (marker >= top && marker < top + Math.max(height, 1)) current = id;
  });

  const last = anchors[anchors.length - 1];

  // A final section on a page that ends just below it never reaches the
  // marker, so showing enough of it counts as arriving.
  const topInView = last.top - y;
  const onScreen =
    Math.min(topInView + last.height, viewportHeight) - Math.max(topInView, 0);
  if (last.height > 0 && onScreen / last.height >= ARRIVED_RATIO) {
    current = last.id;
  }

  // And the very bottom always belongs to the final section, whatever its
  // height — otherwise a section taller than the viewport could never win.
  const maxScroll = Math.max(0, docHeight - viewportHeight);
  if (maxScroll > 0 && y >= maxScroll - 2) current = last.id;

  return current;
}

/** Reads the geometry `sectionAt` needs. The only place that touches layout. */
export function measureAnchors(nodesById, order) {
  const anchors = [];
  order.forEach((id) => {
    const node = nodesById[id];
    if (!node) return;
    const rect = node.getBoundingClientRect();
    anchors.push({
      id,
      top: rect.top + window.scrollY,
      height: rect.height,
    });
  });

  return {
    viewportHeight: window.innerHeight,
    docHeight: document.documentElement.scrollHeight,
    anchors,
  };
}

export default sectionAt;
