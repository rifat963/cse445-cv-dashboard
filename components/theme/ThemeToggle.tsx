"use client";

import { useEffect } from "react";
import { useDashboard } from "@/store/dashboardStore";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useDashboard();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [darkMode]);

  return (
    <button
      onClick={toggleDarkMode}
      aria-label="Toggle theme"
      className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
    >
      {darkMode ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
