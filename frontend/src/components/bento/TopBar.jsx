import React from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { PROFILE } from "../../config/profile";

const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "open-source", label: "Open source" },
  { id: "contact", label: "Contact" },
];

const TopBar = ({ active, onNavigate, isDark, onToggleTheme }) => (
  <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 bg-ground/85 px-4 py-3.5 backdrop-blur-xl sm:px-6 lg:px-[22px]">
    <button
      type="button"
      onClick={() => onNavigate("top")}
      className="flex items-center gap-2.5 font-display text-[15px] font-extrabold tracking-[-0.03em]"
    >
      <span className="grid h-[26px] w-[26px] place-items-center rounded-[9px] bg-primary-600 text-xs font-extrabold text-white">
        M
      </span>
      {PROFILE.short}
    </button>

    <nav className="order-3 flex w-full gap-0.5 rounded-full border border-line bg-surface p-1 sm:order-none sm:ml-auto sm:w-auto">
      {SECTIONS.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => onNavigate(section.id)}
          className={`relative flex-1 rounded-full px-3 py-[7px] text-[12.5px] font-medium transition-colors sm:flex-none sm:px-[15px] ${
            active === section.id
              ? "text-onInk"
              : "text-ink-soft hover:text-ink"
          }`}
        >
          {active === section.id && (
            <motion.span
              layoutId="bento-nav-pill"
              className="absolute inset-0 rounded-full bg-ink"
              // Gentle enough to stay smooth when the target changes mid-flight;
              // the previous spring was stiff enough to read as a stutter.
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 34,
                mass: 0.7,
              }}
            />
          )}
          <span className="relative">{section.label}</span>
        </button>
      ))}
    </nav>

    <span className="flex items-center gap-[7px] whitespace-nowrap rounded-full border border-line bg-surface px-3.5 py-2 text-[11.5px] font-medium">
      <span
        aria-hidden="true"
        className="h-[7px] w-[7px] rounded-full bg-spark ring-4 ring-spark/30"
      />
      {PROFILE.status}
    </span>

    <button
      type="button"
      onClick={onToggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="grid h-[34px] w-[34px] flex-none place-items-center rounded-full border border-line bg-surface text-ink-soft transition-colors hover:border-primary-600 hover:text-primary-600"
    >
      {isDark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  </header>
);

export default TopBar;
