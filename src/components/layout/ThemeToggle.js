"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";

const STORAGE_KEY = "billetera-theme";

function resolveTheme(preferred) {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return preferred;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(resolveTheme(preferred));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [hydrated, theme]);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));
  const isDark = theme === "dark";

  if (!hydrated) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 px-3 py-1.5 text-xs font-medium text-slate-400 dark:border-slate-700 dark:text-slate-500">
        Tema
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label="Cambiar tema"
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${isDark ? "bg-sky-400" : "bg-slate-900"}`}
        aria-hidden="true"
      />
      {isDark ? "Modo claro" : "Modo oscuro"}
    </button>
  );
}
