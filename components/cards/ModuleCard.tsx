import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CourseModule } from "@/data/modules";

interface ModuleCardProps {
  module: CourseModule;
  lectureCount: number;
  completedCount: number;
}

const colorScheme: Record<string, { border: string; bg: string; badge: string; bar: string }> = {
  co1: { border: "border-co1/30", bg: "bg-co1/5", badge: "bg-co1/10 text-co1", bar: "bg-co1" },
  co2: { border: "border-co2/30", bg: "bg-co2/5", badge: "bg-co2/10 text-co2", bar: "bg-co2" },
  co3: { border: "border-co3/30", bg: "bg-co3/5", badge: "bg-co3/10 text-co3", bar: "bg-co3" },
  co4: { border: "border-co4/30", bg: "bg-co4/5", badge: "bg-co4/10 text-co4", bar: "bg-co4" },
  advanced: { border: "border-advanced/30", bg: "bg-advanced/5", badge: "bg-advanced/10 text-advanced", bar: "bg-advanced" },
};

export default function ModuleCard({ module: mod, lectureCount, completedCount }: ModuleCardProps) {
  const colors = colorScheme[mod.color] ?? colorScheme.co1;
  const pct = lectureCount > 0 ? Math.round((completedCount / lectureCount) * 100) : 0;

  return (
    <Link
      href={`/lectures/${mod.slug}`}
      className={cn(
        "group rounded-2xl border p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow",
        colors.border, colors.bg
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-xs font-mono font-bold px-2 py-0.5 rounded", colors.badge)}>
              {mod.id}
            </span>
            <span className="text-xs text-[var(--muted)]">{mod.weekRange}</span>
          </div>
          <h3 className="text-sm font-bold text-[var(--ink)] leading-snug group-hover:underline">
            {mod.title}
          </h3>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-lg font-bold text-[var(--ink)]">{lectureCount}</div>
          <div className="text-xs text-[var(--muted)]">lectures</div>
        </div>
      </div>

      <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-2">{mod.description}</p>

      <div className="flex flex-wrap gap-1">
        {mod.co.map((co) => (
          <span key={co} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]">
            {co}
          </span>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-[var(--muted)]">
          <span>{completedCount}/{lectureCount} studied</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", colors.bar)}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
