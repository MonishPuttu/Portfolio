import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { trackPageView } from "./utils/analytics";

import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Achievements from "./components/Achievements";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

/* ── Home page (main scrollable) ─────────────────────── */
const HomePage = () => (
  <>
    <Navbar />
    <Hero />
    <Projects />
    <Footer />
  </>
);

function App() {
  useEffect(() => {
    trackPageView(window.location.pathname);

    const handleRouteChange = () => trackPageView(window.location.pathname);
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900">
        <Loader />

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="page-transition"
          >
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
          </motion.div>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
