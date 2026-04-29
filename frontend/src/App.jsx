import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { trackPageView } from "./utils/analytics";

import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Achievements from "./components/Achievements";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const HomePage = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <About embedded />
      <Achievements embedded />
      <Projects />
      <Contact />
    </main>
    <Footer />
  </>
);

function App() {
  useEffect(() => {
    trackPageView(window.location.pathname);
    const handlePop = () => trackPageView(window.location.pathname);
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
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
            transition={{ duration: 0.35 }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<HomePage />} />
              <Route path="/achievements" element={<HomePage />} />
              <Route path="/projects" element={<HomePage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
