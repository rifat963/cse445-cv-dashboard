import type { CourseOutcome } from "@/data/courseOutcomes";
import { cn } from "@/lib/utils";

interface OutcomeCardProps {
  outcome: CourseOutcome;
}

const colorMap: Record<string, string> = {
  co1: "border-l-co1",
  co2: "border-l-co2",
  co3: "border-l-co3",
  co4: "border-l-co4",
};

const badgeMap: Record<string, string> = {
  co1: "text-co1 border-co1/30 bg-co1/5",
  co2: "text-co2 border-co2/30 bg-co2/5",
  co3: "text-co3 border-co3/30 bg-co3/5",
  co4: "text-co4 border-co4/30 bg-co4/5",
};

export default function OutcomeCard({ outcome }: OutcomeCardProps) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-lg border border-l-4 border-[var(--border)] bg-[var(--surface)] p-5", colorMap[outcome.color])}>
      <div className="flex items-center justify-between gap-3">
        <span className={cn("rounded border px-2.5 py-0.5 text-xs font-bold", badgeMap[outcome.color])}>
          {outcome.id}
        </span>
        <span className="text-xs uppercase tracking-wide text-[var(--muted)]">{outcome.po}</span>
      </div>
      <h3 className="text-sm font-bold leading-snug text-[var(--ink)]">{outcome.title}</h3>
      <p className="text-sm leading-relaxed text-[var(--muted)]">{outcome.description}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 border-t border-[var(--border)] pt-3">
        <span className="text-xs font-semibold text-[var(--ink)]">Domains</span>
        {outcome.domains.map((d) => (
          <span key={d} className="rounded border border-[var(--border)] bg-[var(--canvas)] px-1.5 py-0.5 font-mono text-xs text-[var(--muted)]">
            {d}
          </span>
        ))}
        <span className="ml-auto font-mono text-xs text-[var(--muted)]">{outcome.knowledgeProfile}</span>
      </div>
    </div>
  );
}
