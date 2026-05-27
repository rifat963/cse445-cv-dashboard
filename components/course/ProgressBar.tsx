import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  color?: string;
}

const barColors: Record<string, string> = {
  co1: "bg-co1",
  co2: "bg-co2",
  co3: "bg-co3",
  co4: "bg-co4",
};

export default function ProgressBar({ value, max, label, color = "co2" }: ProgressBarProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-[var(--ink)] font-medium">{label}</span>
        <span className="text-[var(--muted)]">{value}/{max} ({pct}%)</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", barColors[color] ?? "bg-co2")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
