import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Detect active section
  useEffect(() => {
    const sections = ["projects", "about"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" },
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  const navItems = [
    { name: "Projects", id: "projects" },
    { name: "About", id: "about" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight">
              <span className="text-primary-600 font-display">
                YOUR NAME
              </span>
            </h1>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, i) => (
              <motion.button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === item.id
                    ? "text-primary-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.2 }}
              >
                {item.name}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-primary-600 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2">
            <motion.button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg bg-gray-100"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`block w-full text-left py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
