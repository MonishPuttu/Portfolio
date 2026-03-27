import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_M_PATH = "M214 548V226L354 490L554 226V548";

const Loader = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const MIN_LOADER_MS = 4200;
    const VIDEO_WAIT_TIMEOUT_MS = 6000;
    const HOLD_POINTS = [56, 64, 72];
    const holdPoint =
      HOLD_POINTS[Math.floor(Math.random() * HOLD_POINTS.length)];
    let completed = false;
    const startedAt = Date.now();

    const isVideoReady = () => {
      const videos = Array.from(document.querySelectorAll("video[src]"));
      if (videos.length === 0) return false;

      const readyVideos = videos.filter(
        (video) => video.readyState >= 2,
      ).length;
      const targetReady = Math.min(2, videos.length);
      return readyVideos >= targetReady;
    };

    const interval = setInterval(() => {
      setProgress((p) => {
        if (completed) return p;

        const elapsed = Date.now() - startedAt;
        const timeRatio = Math.min(1, elapsed / MIN_LOADER_MS);
        const ready = isVideoReady();

        const videos = Array.from(document.querySelectorAll("video[src]"));
        const readyVideos = videos.filter(
          (video) => video.readyState >= 2,
        ).length;
        const readinessRatio =
          videos.length > 0 ? readyVideos / videos.length : 0;

        const timeCurve = 8 + 68 * (1 - Math.exp(-2.6 * timeRatio));
        const readinessBoost = 18 * (1 - Math.exp(-3.5 * readinessRatio));

        // Until videos are ready, hold around a randomized plateau so each reload feels different.
        const target = ready
          ? Math.min(98.6, timeCurve + readinessBoost)
          : Math.min(holdPoint + 2.4, Math.min(timeCurve, holdPoint));

        const delta = Math.max(0, target - p);
        return Math.min(98.6, p + delta * 0.11 + 0.05);
      });
    }, 120);

    const waitForVideoReadiness = () =>
      new Promise((resolve) => {
        const start = Date.now();
        const check = () => {
          const elapsed = Date.now() - start;

          if (isVideoReady()) {
            resolve();
            return;
          }

          if (elapsed >= VIDEO_WAIT_TIMEOUT_MS) {
            resolve();
            return;
          }

          setTimeout(check, 200);
        };

        check();
      });

    const runLoader = async () => {
      await Promise.all([
        new Promise((resolve) => setTimeout(resolve, MIN_LOADER_MS)),
        waitForVideoReadiness(),
      ]);

      completed = true;
      setProgress(100);
      setTimeout(() => setLoading(false), 420);
    };

    runLoader();

    return () => {
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
                className="text-primary-200"
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

          <div className="w-56 h-[3px] bg-primary-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-600 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-xs font-semibold tracking-[0.18em] uppercase text-primary-700"
          >
            Loading {Math.floor(Math.min(progress, 100))}%
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
