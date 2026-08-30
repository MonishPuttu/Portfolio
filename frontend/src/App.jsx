import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

import Loader from "./components/Loader";
import BentoGrid from "./components/bento/BentoGrid";
import { trackPageView } from "./utils/analytics";

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
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  return (
    <Router>
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
