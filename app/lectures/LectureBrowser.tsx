"use client";

import Link from "next/link";
import { useDashboard } from "@/store/dashboardStore";
import { modules } from "@/data/modules";
import { lectures } from "@/data/lectures";
import ModuleCard from "@/components/cards/ModuleCard";

interface LectureBrowserProps {
  preview?: boolean;
}

export default function LectureBrowser({ preview = false }: LectureBrowserProps) {
  const { studiedLectures } = useDashboard();

  const displayModules = preview ? modules.slice(0, 3) : modules;

  return (
    <section>
      {preview && (
        <div className="mb-4 flex items-end justify-between gap-4 border-b border-[var(--border)] pb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Theory sequence</p>
            <h2 className="text-xl font-bold text-[var(--ink)]">Course Modules</h2>
          </div>
          <Link href="/lectures" className="text-sm font-semibold text-[var(--academic)] hover:underline shrink-0">
            View all modules
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayModules.map((mod) => {
          const moduleLectures = lectures.filter((l) => l.moduleId === mod.id);
          const completedCount = moduleLectures.filter((l) =>
            studiedLectures.includes(l.slug)
          ).length;

          return (
            <ModuleCard
              key={mod.id}
              module={mod}
              lectureCount={moduleLectures.length}
              completedCount={completedCount}
            />
          );
        })}
      </div>
    </section>
  );
}
