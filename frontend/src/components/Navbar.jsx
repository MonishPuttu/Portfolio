import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { name: "About", id: "about" },
  { name: "Achievements", id: "achievements" },
  { name: "Projects", id: "projects" },
];

const SECTION_MAP = {
  about: "about-content",
  achievements: "achievements-content",
  projects: "projects-content",
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = ["/", "/about", "/achievements", "/projects"].includes(
    location.pathname,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) {
      setActiveSection("");
      return;
    }
    const ids = Object.values(SECTION_MAP);
    const update = () => {
      const marker = window.scrollY + 130;
      let next = ids[0];
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= marker) next = id;
      });
      setActiveSection(next);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [isHome]);

  const scrollTo = (targetId) => {
    setMobileOpen(false);
    const go = () => {
      window.scrollTo({ top: 0, behavior: "auto" });
      setTimeout(() => {
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    };
    if (!isHome) {
      navigate("/");
      setTimeout(go, 120);
    } else go();
  };

  const handleNav = (id) => scrollTo(SECTION_MAP[id]);

  const handleLogoClick = () => {
    if (location.pathname !== "/") navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isActive = (id) => activeSection === SECTION_MAP[id];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-14">
          <motion.button
            onClick={handleLogoClick}
            whileHover={{ opacity: 0.7 }}
            whileTap={{ scale: 0.97 }}
            className="text-sm font-medium tracking-[0.08em] text-primary-600 uppercase"
          >
            Monish Puttu
          </motion.button>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative px-4 py-2 text-[13px] transition-colors rounded-md ${
                  isActive(item.id)
                    ? "text-primary-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {item.name}
                {isActive(item.id) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-1 left-4 right-4 h-[1.5px] bg-primary-600 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-6 py-3 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`text-left py-2.5 px-3 rounded-lg text-sm transition-colors ${
                    isActive(item.id)
                      ? "text-primary-600 bg-primary-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
