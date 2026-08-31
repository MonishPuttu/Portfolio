/**
 * Scrolls the window to `top`, calling `onDone` when it has actually arrived.
 *
 * Deliberately does not use `window.scrollTo({ behavior: "smooth" })`: some
 * engines ignore it outright (the same request with `behavior: "auto"` works
 * on the very next line), which made the nav look completely dead. Driving the
 * tween ourselves works everywhere and lets a new target interrupt an
 * in-flight scroll cleanly.
 *
 * `onDone` matters as much as the motion: callers need to know when the page
 * has settled, rather than guessing with a timer that can expire mid-scroll.
 */

/**
 * A fixed duration makes speed depend on distance: the same 520ms covering
 * 331px and 1011px reads as two different scrolls, and the long one whooshes.
 * Pacing by distance keeps the travel speed roughly constant, with a floor so
 * short hops are not a snap and a ceiling so long ones do not drag.
 */
const PIXELS_PER_MS = 1.6;
const MIN_DURATION_MS = 340;
const MAX_DURATION_MS = 820;

const durationFor = (distance) =>
  Math.min(
    MAX_DURATION_MS,
    Math.max(MIN_DURATION_MS, Math.abs(distance) / PIXELS_PER_MS),
  );

let frame = null;
let guard = null;
let pendingDone = null;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Stops any scroll in flight. The pending `onDone` is dropped, not called. */
export const cancelScroll = () => {
  if (frame !== null) {
    cancelAnimationFrame(frame);
    frame = null;
  }
  if (guard !== null) {
    clearTimeout(guard);
    guard = null;
  }
  pendingDone = null;
};

export const smoothScrollTo = (top, onDone) => {
  const target = Math.max(0, top);
  cancelScroll();

  const from = window.scrollY;
  const distance = target - from;
  const duration = durationFor(distance);

  const finish = () => {
    frame = null;
    if (guard !== null) {
      clearTimeout(guard);
      guard = null;
    }
    const done = pendingDone;
    pendingDone = null;
    done?.();
  };

  // Nothing to animate, no one asking for animation, or nobody watching:
  // a hidden document parks requestAnimationFrame, so a tween started there
  // would simply never arrive.
  if (prefersReducedMotion() || document.hidden || Math.abs(distance) < 2) {
    window.scrollTo({ top: target, behavior: "auto" });
    onDone?.();
    return;
  }

  pendingDone = onDone;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    // easeOutCubic — quick departure, gentle arrival.
    const eased = 1 - Math.pow(1 - progress, 3);
    window.scrollTo({ top: from + distance * eased, behavior: "auto" });

    if (progress < 1) {
      frame = requestAnimationFrame(step);
    } else {
      finish();
    }
  };

  // If frames stop coming — the tab is backgrounded mid-scroll — land on the
  // target anyway rather than stranding the reader halfway.
  guard = setTimeout(() => {
    if (frame === null) return;
    cancelAnimationFrame(frame);
    window.scrollTo({ top: target, behavior: "auto" });
    finish();
  }, duration + 300);

  frame = requestAnimationFrame(step);
};

export default smoothScrollTo;
