import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";

const readStored = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const systemPrefersDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches;

/**
 * Light/dark theme with three states: an explicit choice wins, otherwise the
 * OS preference decides and keeps deciding if it changes mid-session.
 *
 * The `dark` class is put on <html> by an inline script in index.html before
 * first paint; this hook only keeps it in sync afterwards.
 */
export const useTheme = () => {
  const [theme, setTheme] = useState(() =>
    readStored() || (systemPrefersDark() ? "dark" : "light"),
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Follow the OS while the visitor hasn't expressed a preference.
  useEffect(() => {
    if (readStored()) return undefined;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setTheme(e.matches ? "dark" : "light");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* private mode — the choice just won't persist */
      }
      return next;
    });
  }, []);

  return { theme, toggle, isDark: theme === "dark" };
};

export default useTheme;
