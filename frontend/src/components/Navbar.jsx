import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isPortfolioPage = [
    "/",
    "/about",
    "/achievements",
    "/projects",
  ].includes(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Detect active section on the single-scroll portfolio page
  useEffect(() => {
    if (!isPortfolioPage) {
      setActiveSection("");
      return;
    }
    const sections = ["about-content", "achievements-content", "projects"];
    const navOffset = 120;

    const updateActiveSection = () => {
      const scrollMarker = window.scrollY + navOffset;
      let nextActive = sections[0];

      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollMarker) {
          nextActive = id;
        }
      });

      setActiveSection(nextActive);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [isPortfolioPage]);

  const handleNav = (id) => {
    setMobileOpen(false);

    const targetSectionMap = {
      about: "about-content",
      achievements: "achievements-content",
      projects: "projects",
    };

    const targetId = targetSectionMap[id];
    if (!targetId) return;

    const replayScrollSequence = (targetId) => {
      window.scrollTo({ top: 0, behavior: "auto" });

      setTimeout(() => {
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 850);
    };

    if (!isPortfolioPage) {
      navigate("/");
      // Wait for the main page to render, then scroll
      setTimeout(() => replayScrollSequence(targetId), 80);
    } else {
      replayScrollSequence(targetId);
    }
  };

  const handleLogoClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navItems = [
    { name: "About", id: "about" },
    { name: "Achievements", id: "achievements" },
    { name: "Projects", id: "projects" },
  ];

  const isActive = (id) => {
    if (id === "about") return activeSection === "about-content";
    if (id === "achievements") return activeSection === "achievements-content";
    return activeSection === "projects";
  };

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
            onClick={handleLogoClick}
          >
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight">
              <span className="text-primary-600 font-display">
                MONISH PUTTU
              </span>
            </h1>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, i) => (
              <motion.button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative px-1 py-2 text-sm font-medium transition-colors ${
                  isActive(item.id)
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
                {isActive(item.id) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-600 rounded-full"
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
                  onClick={() => handleNav(item.id)}
                  className={`block w-full text-left py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                    isActive(item.id)
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
