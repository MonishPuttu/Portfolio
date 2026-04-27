import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ROLES = [
  "Full stack engineer",
  "ML engineer",
  "Open source contributor",
  "Backend systems builder",
];

const CHIPS = [
  "Python",
  "Node.js",
  "React",
  "TensorFlow",
  "Docker",
  "PostgreSQL",
  "Kubernetes",
  "Next.js",
];

const useTypewriter = (
  words,
  typingSpeed = 60,
  pauseMs = 1800,
  deleteSpeed = 35,
) => {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState("typing"); // typing | pausing | deleting

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;

    if (phase === "typing") {
      if (display.length < current.length) {
        timeout = setTimeout(
          () => setDisplay(current.slice(0, display.length + 1)),
          typingSpeed,
        );
      } else {
        timeout = setTimeout(() => setPhase("pausing"), pauseMs);
      }
    } else if (phase === "pausing") {
      setPhase("deleting");
    } else if (phase === "deleting") {
      if (display.length > 0) {
        timeout = setTimeout(
          () => setDisplay(display.slice(0, -1)),
          deleteSpeed,
        );
      } else {
        setWordIdx((i) => (i + 1) % words.length);
        setPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [display, phase, wordIdx, words, typingSpeed, pauseMs, deleteSpeed]);

  return display;
};

const Hero = () => {
  const text = useTypewriter(ROLES);

  return (
    <section className="pt-32 pb-16 px-6 lg:px-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <h1 className="text-3xl md:text-4xl font-medium text-gray-900 tracking-tight min-h-[44px]">
          {text}
        </h1>
        <span className="inline-block w-[2px] h-9 bg-primary-600 rounded-sm animate-pulse" />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CHIPS.map((chip, i) => (
          <motion.span
            key={chip}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.04, duration: 0.3 }}
            className="px-3 py-1.5 rounded-full text-[12px] font-medium bg-primary-50 text-primary-700 border border-primary-200"
          >
            {chip}
          </motion.span>
        ))}
      </div>

      <div className="h-px bg-gray-100 mb-6" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center gap-2.5"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <span className="text-[13px] text-gray-500">
          Open to opportunities — final year BE, shipping ML + full-stack
          projects
        </span>
      </motion.div>
    </section>
  );
};

export default Hero;
