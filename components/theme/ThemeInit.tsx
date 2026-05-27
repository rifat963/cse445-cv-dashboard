"use client";

import { useEffect } from "react";
import { useDashboard } from "@/store/dashboardStore";

export default function ThemeInit() {
  const { darkMode } = useDashboard();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return null;
}
