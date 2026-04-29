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
  <footer className="relative bg-gray-950 text-white overflow-hidden">
    <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none">
      <div className="animate-marquee whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="inline-block text-[7rem] md:text-[10rem] font-black tracking-tighter text-white/[0.03] leading-none"
          >
            MONISH PUTTU&nbsp;&nbsp;
          </span>
        ))}
      </div>
    </div>

    <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
      <span className="text-[13px] font-medium tracking-[0.06em] text-primary-400">
        MONISH PUTTU
      </span>

      <div className="flex items-center gap-6">
        {SOCIALS.map(({ icon: Icon, href, label }) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            whileHover={{ y: -2 }}
            className="text-gray-500 hover:text-primary-400 transition-colors"
          >
            <Icon size={16} />
          </motion.a>
        ))}
      </div>

      <span className="text-[11px] text-gray-600">
        Built with React + Tailwind
      </span>
    </div>
  </footer>
);

export default Footer;
