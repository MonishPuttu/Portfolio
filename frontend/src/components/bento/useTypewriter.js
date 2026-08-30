import { useEffect, useState } from "react";

/**
 * Cycles through `words`, typing and deleting one character at a time.
 * Respects prefers-reduced-motion by holding the first word instead.
 */
export const useTypewriter = (
  words,
  { typeMs = 62, deleteMs = 32, holdMs = 1700 } = {},
) => {
  const [display, setDisplay] = useState("");
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("typing");

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) {
      setDisplay(words[0]);
      return undefined;
    }

    const word = words[index];
    let timeout;

    if (phase === "typing") {
      if (display.length < word.length) {
        timeout = setTimeout(
          () => setDisplay(word.slice(0, display.length + 1)),
          typeMs,
        );
      } else {
        timeout = setTimeout(() => setPhase("deleting"), holdMs);
      }
    } else if (display.length > 0) {
      timeout = setTimeout(() => setDisplay(display.slice(0, -1)), deleteMs);
    } else {
      setIndex((i) => (i + 1) % words.length);
      setPhase("typing");
    }

    return () => clearTimeout(timeout);
  }, [display, phase, index, words, typeMs, deleteMs, holdMs, reduced]);

  return display;
};

export default useTypewriter;
