import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

import Loader from "./components/Loader";
import BentoGrid from "./components/bento/BentoGrid";
import { startVisitTracking, trackPageView } from "./utils/analytics";

/**
 * The bento layout is a single surface — every former section is now a tile
 * in one grid, so the router only needs to keep the old deep links alive.
 */
const HomePage = () => <BentoGrid />;

function App() {
  useEffect(() => {
    trackPageView(window.location.pathname);
    const handlePop = () => trackPageView(window.location.pathname);
    window.addEventListener("popstate", handlePop);

    // Tells the server when the visit ends, which is what lets it report how
    // long someone stayed rather than only that they arrived.
    const stopVisitTracking = startVisitTracking();

    return () => {
      window.removeEventListener("popstate", handlePop);
      stopVisitTracking();
    };
  }, []);

  return (
    <Router
      // Opt in to the v7 behaviours now, so the console is clean and the
      // eventual upgrade is a version bump rather than a behaviour change.
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <div className="min-h-screen bg-ground text-ink">
        <Loader />
        <Toaster position="top-center" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<HomePage />} />
            <Route path="/achievements" element={<HomePage />} />
            <Route path="/projects" element={<HomePage />} />
          </Routes>
        </motion.div>
      </div>
    </Router>
  );
}

export default App;
