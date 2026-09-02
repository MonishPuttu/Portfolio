import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_M_PATH = "M214 548V226L354 490L554 226V548";

const Loader = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Nothing on this page loads asynchronously behind the loader: the bento
    // grid renders no video until a project modal opens, and the thumbnails
    // are lazy. So this is a short branded wipe, not a wait — it used to gate
    // the page for 1.1s plus a 0.42s fade on machinery that was watching for
    // videos that never existed.
    const HOLD_MS = 620;
    const FADE_MS = 260;

    const step = setInterval(() => {
      setProgress((p) => Math.min(99, p + Math.max(1.5, (99 - p) * 0.18)));
    }, 40);

    const done = setTimeout(() => {
      clearInterval(step);
      setProgress(100);
      setTimeout(() => setLoading(false), FADE_MS);
    }, HOLD_MS);

    return () => {
      clearInterval(step);
      clearTimeout(done);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ground"
        >
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <svg viewBox="0 0 768 768" className="w-56 h-28">
              <path
                d={LOGO_M_PATH}
                fill="none"
                stroke="currentColor"
                strokeWidth="138"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-track"
              />

              <motion.path
                d={LOGO_M_PATH}
                fill="none"
                stroke="currentColor"
                strokeWidth="138"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-600"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: Math.min(progress, 100) / 100 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            </svg>
          </motion.div>

          <div className="w-56 h-[3px] bg-track rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-600 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-xs font-semibold tracking-[0.18em] uppercase text-primary-600 dark:text-primary-300"
          >
            Loading {Math.floor(Math.min(progress, 100))}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
