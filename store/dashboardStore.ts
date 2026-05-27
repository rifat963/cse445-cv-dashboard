"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DashboardState {
  studiedLectures: string[];
  completedLabs: string[];
  darkMode: boolean;
  toggleStudiedLecture: (slug: string) => void;
  toggleCompletedLab: (slug: string) => void;
  toggleDarkMode: () => void;
}

export const useDashboard = create<DashboardState>()(
  persist(
    (set) => ({
      studiedLectures: [],
      completedLabs: [],
      darkMode: true,
      toggleStudiedLecture: (slug) =>
        set((s) => ({
          studiedLectures: s.studiedLectures.includes(slug)
            ? s.studiedLectures.filter((x) => x !== slug)
            : [...s.studiedLectures, slug],
        })),
      toggleCompletedLab: (slug) =>
        set((s) => ({
          completedLabs: s.completedLabs.includes(slug)
            ? s.completedLabs.filter((x) => x !== slug)
            : [...s.completedLabs, slug],
        })),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    { name: "cse445-dashboard" }
  )
);
