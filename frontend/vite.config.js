import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/**
 * A production bundle with no VITE_API_URL is not a working site: every axios
 * call becomes "null/projects", so the projects never load and the contact
 * form never sends. The only symptom used to be a console.error and a toast,
 * long after the build reported success — so the check belongs here, where it
 * can stop the deploy instead of shipping it.
 *
 * Development is exempt: api.js has a localhost fallback there on purpose.
 */
const assertApiUrl = (env) => {
  const raw = (env.VITE_API_URL || "").trim();

  if (!raw) {
    throw new Error(
      "VITE_API_URL is not set.\n" +
        "A production build without it ships a site whose API calls all resolve " +
        "to \"null/...\" — projects never load and the contact form never sends.\n" +
        "Set it to your fully qualified API origin, e.g.\n" +
        "  VITE_API_URL=https://api.example.com/api\n" +
        "in frontend/.env.production, or in the host's environment variables.",
    );
  }

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(
      `VITE_API_URL must be a fully qualified URL in production, got "${raw}".\n` +
        "Example: VITE_API_URL=https://api.example.com/api",
    );
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(
      `VITE_API_URL must use http or https, got "${parsed.protocol}".`,
    );
  }
};

export default defineConfig(({ command, mode }) => {
  if (command === "build" && mode === "production") {
    assertApiUrl(loadEnv(mode, process.cwd(), ""));
  }

  return {
    plugins: [react()],
    server: {
      port: 5173,
    },
    build: {
      outDir: "dist",
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "animation-vendor": ["framer-motion"],
          },
        },
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "framer-motion"],
    },
  };
});
