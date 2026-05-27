"use client";

import Link from "next/link";
import { useDashboard } from "@/store/dashboardStore";
import { modules } from "@/data/modules";
import { lectures } from "@/data/lectures";
import ModuleCard from "@/components/cards/ModuleCard";
import ProgressBar from "@/components/course/ProgressBar";

interface LectureBrowserProps {
  preview?: boolean;
}

export default function LectureBrowser({ preview = false }: LectureBrowserProps) {
  const { studiedLectures } = useDashboard();

  const displayModules = preview ? modules.slice(0, 3) : modules;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--ink)]">Course Modules</h2>
          {!preview && (
            <p className="text-sm text-[var(--muted)] mt-0.5">
              9 modules · 24 lectures · grouped by topic
            </p>
          )}
        </div>
        {preview && (
          <Link href="/lectures" className="text-sm text-co2 hover:underline shrink-0">
            View all modules →
          </Link>
        )}
      </div>

      {!preview && (
        <div className="mb-6">
          <ProgressBar
            value={studiedLectures.length}
            max={lectures.length}
            label="Overall Study Progress"
            color="co2"
          />
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
