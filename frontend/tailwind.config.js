/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Bento palette — dove ground so white tiles read as objects.
        ground: "#E9E9EF",
        surface: "#FFFFFF",
        line: "#E1E1E9",
        ink: {
          DEFAULT: "#191922",
          soft: "#4E4F5E",
          dim: "#83849A",
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
