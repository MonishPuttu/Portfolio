import React from "react";
import { motion } from "framer-motion";
import {
  Youtube,
  Twitter,
  Linkedin,
  FileText,
  ExternalLink,
} from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  const socialLinks = [
    { name: "Youtube", icon: Youtube, url: "https://youtube.com" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com" },
  ];

  const contactLinks = [
    { name: "Resume", icon: FileText, url: "/resume.pdf" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com" },
    { name: "Behance", icon: ExternalLink, url: "https://behance.net" },
  ];

  const pageLinks = [
    { name: "Projects", id: "projects" },
    { name: "About", id: "about" },
  ];

  const scrollTo = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="relative bg-gradient-to-b from-[#1a1f1a] to-[#111411] text-white overflow-hidden">
      {/* Large scrolling text */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none">
        <div className="animate-marquee whitespace-nowrap">
          <span className="inline-block text-[10rem] md:text-[14rem] lg:text-[18rem] font-black tracking-tighter text-primary-500/10 leading-none">
            YOUR NAME&nbsp;&nbsp;YOUR NAME&nbsp;&nbsp;YOUR NAME&nbsp;&nbsp;YOUR
            NAME&nbsp;&nbsp;
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
              <span className="text-primary-400">YOUR NAME</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-[200px]">
              Crafting exceptional digital experiences
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
                    onClick={() => scrollTo(link.id)}
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
              © {year} Your Name. All rights reserved.
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
