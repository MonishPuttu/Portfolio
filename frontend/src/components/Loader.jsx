import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Loader = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 200);

    const timer = setTimeout(() => setLoading(false), 2500);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
        >
          {/* Three animated bars - matching screenshot */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <div className="flex items-end justify-center gap-[6px] h-16">
              {[0, 0.15, 0.3].map((delay, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: ["24px", "48px", "24px"],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay,
                  }}
                  className="w-[10px] rounded-full bg-gradient-to-t from-primary-700 to-primary-400"
                />
              ))}
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 h-[2px] bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-500 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-[11px] font-medium tracking-[0.2em] uppercase text-gray-400"
          >
            Loading
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
