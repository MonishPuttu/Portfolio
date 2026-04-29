import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

const SOCIALS = [
  { icon: Github, href: "https://github.com/MonishPuttu", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/monish-k-543236251",
    label: "LinkedIn",
  },
  { icon: Mail, href: "mailto:monishputtu1780@gmail.com", label: "Email" },
];

const Footer = () => (
  <footer className="border-t border-gray-100 bg-white">
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="text-[13px] font-medium tracking-[0.06em] text-primary-600">
        MONISH PUTTU
      </span>

      <div className="flex items-center gap-5">
        {SOCIALS.map(({ icon: Icon, href, label }) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            whileHover={{ y: -2 }}
            className="text-gray-400 hover:text-primary-500 transition-colors"
          >
            <Icon size={16} />
          </motion.a>
        ))}
      </div>

      <span className="text-[11px] text-gray-400">
        © {new Date().getFullYear()} Monish Puttu
      </span>
    </div>
  </footer>
);

export default Footer;
