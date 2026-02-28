import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Github,
  Linkedin,
  FileText,
  ExternalLink,
} from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const socialLinks = [
    { name: "GitHub", icon: Github, url: "https://github.com/MonishPuttu" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/in/monishputtu" },
  ];

  const contactLinks = [
    { name: "Email", icon: ExternalLink, url: "mailto:monishputtu@gmail.com" },
  ];

  const pageLinks = [
    { name: "Projects", id: "projects", route: false },
    { name: "Achievements", id: "achievements", route: true, path: "/achievements" },
    { name: "About", id: "about", route: true, path: "/about" },
  ];

  const handlePageNav = (link) => {
    if (link.route) {
      navigate(link.path);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!isHome) {
      navigate("/");
      setTimeout(() => {
        document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else {
      document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#1a1f1a] to-[#111411] text-white overflow-hidden">
      {/* Large scrolling text */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none">
        <div className="animate-marquee whitespace-nowrap">
          <span className="inline-block text-[10rem] md:text-[14rem] lg:text-[18rem] font-black tracking-tighter text-primary-500/10 leading-none">
            MONISH PUTTU&nbsp;&nbsp;MONISH PUTTU&nbsp;&nbsp;MONISH
            PUTTU&nbsp;&nbsp;
          </span>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <motion.div
            className="col-span-2 md:col-span-1"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-3 font-display">
              <span className="text-primary-400">MONISH PUTTU</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-[200px]">
              Building full-stack products with modern tech
            </p>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-4">
              Socials
            </h4>
            <ul className="space-y-2.5">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <motion.a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-300 hover:text-primary-400 transition-colors group"
                      whileHover={{ x: 3 }}
                    >
                      <span>{link.name}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-4">
              Contact
            </h4>
            <ul className="space-y-2.5">
              {contactLinks.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-primary-400 transition-colors group"
                    whileHover={{ x: 3 }}
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Pages */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-4">
              Pages
            </h4>
            <ul className="space-y-2.5">
              {pageLinks.map((link) => (
                <li key={link.name}>
                  <motion.button
                    onClick={() => handlePageNav(link)}
                    className="text-sm text-gray-300 hover:text-primary-400 transition-colors"
                    whileHover={{ x: 3 }}
                  >
                    {link.name}
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-6 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-500">
              © {year} Monish Puttu. All rights reserved.
            </p>
            <div className="flex items-center gap-5 text-xs text-gray-500">
              <a
                href="/privacy"
                className="hover:text-primary-400 transition-colors"
              >
                Privacy
              </a>
              <a
                href="/terms"
                className="hover:text-primary-400 transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
