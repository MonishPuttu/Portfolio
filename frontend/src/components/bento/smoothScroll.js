/**
 * Scrolls the window to `top`.
 *
 * Deliberately does not use `window.scrollTo({ behavior: "smooth" })`: some
 * engines ignore it outright (the same request with `behavior: "auto"` works
 * on the very next line), which made the nav look completely dead. Driving the
 * tween ourselves works everywhere and lets a new target interrupt an
 * in-flight scroll cleanly.
 */

let frame = null;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export const cancelScroll = () => {
  if (frame !== null) {
    cancelAnimationFrame(frame);
    frame = null;
  }
};

export const smoothScrollTo = (top, duration = 520) => {
  const target = Math.max(0, top);
  cancelScroll();

  const from = window.scrollY;
  const distance = target - from;

  // Nothing to animate, no one asking for animation, or nobody watching:
  // a hidden document parks requestAnimationFrame, so a tween started there
  // would simply never arrive.
  if (
    prefersReducedMotion() ||
    document.hidden ||
    Math.abs(distance) < 2
  ) {
    window.scrollTo({ top: target, behavior: "auto" });
    return;
  }

  const start = performance.now();

  const step = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    // easeOutCubic — quick departure, gentle arrival.
    const eased = 1 - Math.pow(1 - progress, 3);
    window.scrollTo({ top: from + distance * eased, behavior: "auto" });

    if (progress < 1) {
      frame = requestAnimationFrame(step);
    } else {
      frame = null;
      clearTimeout(guard);
    }
  };

  // If frames stop coming — the tab is backgrounded mid-scroll — land on the
  // target anyway rather than stranding the reader halfway.
  const guard = setTimeout(() => {
    if (frame === null) return;
    cancelScroll();
    window.scrollTo({ top: target, behavior: "auto" });
  }, duration + 300);

  frame = requestAnimationFrame(step);
};

export default smoothScrollTo;
