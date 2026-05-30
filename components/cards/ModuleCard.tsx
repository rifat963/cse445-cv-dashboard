import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CourseModule } from "@/data/modules";

interface ModuleCardProps {
  module: CourseModule;
  lectureCount: number;
  completedCount: number;
}

const colorScheme: Record<string, { accent: string; badge: string; bar: string }> = {
  co1: { accent: "border-t-co1", badge: "text-co1 border-co1/30 bg-co1/5", bar: "bg-co1" },
  co2: { accent: "border-t-co2", badge: "text-co2 border-co2/30 bg-co2/5", bar: "bg-co2" },
  co3: { accent: "border-t-co3", badge: "text-co3 border-co3/30 bg-co3/5", bar: "bg-co3" },
  co4: { accent: "border-t-co4", badge: "text-co4 border-co4/30 bg-co4/5", bar: "bg-co4" },
  advanced: { accent: "border-t-advanced", badge: "text-advanced border-advanced/30 bg-advanced/5", bar: "bg-advanced" },
};

export default function ModuleCard({ module: mod, lectureCount, completedCount }: ModuleCardProps) {
  const colors = colorScheme[mod.color] ?? colorScheme.co1;
  const pct = lectureCount > 0 ? Math.round((completedCount / lectureCount) * 100) : 0;

  return (
    <Link
      href={`/lectures/${mod.slug}`}
      className={cn(
        "group flex min-h-[210px] flex-col gap-3 rounded-lg border border-t-4 border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--academic)]",
        colors.accent
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className={cn("rounded border px-2 py-0.5 font-mono text-xs font-bold", colors.badge)}>
              {mod.id}
            </span>
            <span className="text-xs uppercase tracking-wide text-[var(--muted)]">{mod.weekRange}</span>
          </div>
          <h3 className="text-sm font-bold leading-snug text-[var(--ink)] group-hover:text-[var(--academic)]">
            {mod.title}
          </h3>
        </div>
        <div className="shrink-0 border-l border-[var(--border)] pl-3 text-right">
          <div className="text-lg font-bold text-[var(--ink)]">{lectureCount}</div>
          <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">lectures</div>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-[var(--muted)] line-clamp-3">{mod.description}</p>

      <div className="mt-auto flex flex-wrap gap-1">
        {mod.co.map((co) => (
          <span key={co} className="rounded border border-[var(--border)] bg-[var(--canvas)] px-1.5 py-0.5 text-[10px] text-[var(--muted)]">
            {co}
          </span>
        ))}
      </div>

      <div className="space-y-1 border-t border-[var(--border)] pt-3">
        <div className="flex justify-between text-xs text-[var(--muted)]">
          <span>{completedCount}/{lectureCount} studied</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
          <div className={cn("h-full rounded-full transition-all", colors.bar)} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </Link>
  );
}
