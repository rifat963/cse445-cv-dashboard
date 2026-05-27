import type { CourseOutcome } from "@/data/courseOutcomes";
import { cn } from "@/lib/utils";

interface OutcomeCardProps {
  outcome: CourseOutcome;
}

const colorMap: Record<string, string> = {
  co1: "border-co1/30 bg-co1/5",
  co2: "border-co2/30 bg-co2/5",
  co3: "border-co3/30 bg-co3/5",
  co4: "border-co4/30 bg-co4/5",
};

const badgeMap: Record<string, string> = {
  co1: "bg-co1/10 text-co1",
  co2: "bg-co2/10 text-co2",
  co3: "bg-co3/10 text-co3",
  co4: "bg-co4/10 text-co4",
};

export default function OutcomeCard({ outcome }: OutcomeCardProps) {
  return (
    <div className={cn(
      "rounded-xl border p-5 flex flex-col gap-3",
      colorMap[outcome.color] || "border-[var(--border)] bg-[var(--surface)]"
    )}>
      <div className="flex items-center gap-2">
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold", badgeMap[outcome.color])}>
          {outcome.id}
        </span>
        <span className="text-xs text-[var(--muted)]">{outcome.po}</span>
      </div>
      <h3 className="font-semibold text-[var(--ink)] text-sm leading-snug">{outcome.title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{outcome.description}</p>
      <div className="flex flex-wrap gap-1.5 mt-auto pt-2 border-t border-[var(--border)]">
        <span className="text-xs text-[var(--muted)]">Domains:</span>
        {outcome.domains.map((d) => (
          <span key={d} className="px-1.5 py-0.5 rounded text-xs bg-[var(--surface-2)] text-[var(--muted)] font-mono">
            {d}
          </span>
        ))}
        <span className="ml-auto text-xs text-[var(--muted)] font-mono">{outcome.knowledgeProfile}</span>
      </div>
    </div>
  );
}
