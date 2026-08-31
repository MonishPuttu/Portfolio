/** @type {import('tailwindcss').Config} */

/**
 * Surface colours are CSS custom properties so light and dark share one set of
 * utility classes — `bg-surface` and `text-ink` mean "the right thing for the
 * current theme" rather than a fixed hex. Channels are space-separated RGB so
 * Tailwind's opacity modifiers (`bg-ground/60`) still work.
 */
const themed = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ground: themed("ground"),
        surface: themed("surface"),
        line: themed("line"),
        /** The dark hero tile. Stays distinct from the ground in both themes. */
        hero: themed("hero"),
        /** Text that sits on top of an `ink` fill. */
        onInk: themed("on-ink"),
        /** Track behind a filled progress bar. */
        track: themed("track"),
        ink: {
          DEFAULT: themed("ink"),
          soft: themed("ink-soft"),
          dim: themed("ink-dim"),
        },
        primary: {
          50: "#F4F2FE",
          100: "#ECEAFD",
          200: "#D8D3FB",
          300: "#B9AFF7",
          400: "#8E80FF",
          500: "#6D5BF0",
          600: "#5B4BE8",
          700: "#4839C4",
          800: "#3A2E9C",
          900: "#2E257A",
          950: "#1C1650",
        },
        // Reserved for availability + the single primary action. Nothing else.
        spark: "#CBF23E",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Bricolage Grotesque'", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        tile: "20px",
      },
      transitionTimingFunction: {
        tile: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      animation: {
        marquee: "marquee 36s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
