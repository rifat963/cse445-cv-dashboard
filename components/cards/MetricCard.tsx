import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: number | string;
  sub: string;
  icon: ReactNode;
  color: string;
}

const colorMap: Record<string, string> = {
  co1: "text-co1 bg-co1/10 border-co1/20",
  co2: "text-co2 bg-co2/10 border-co2/20",
  co3: "text-co3 bg-co3/10 border-co3/20",
  co4: "text-co4 bg-co4/10 border-co4/20",
};

export default function MetricCard({ title, value, sub, icon, color }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col gap-3">
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border", colorMap[color] || colorMap.co1)}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-[var(--ink)]">{value}</div>
        <div className="text-sm font-medium text-[var(--ink)]">{title}</div>
        <div className="text-xs text-[var(--muted)] mt-0.5">{sub}</div>
      </div>
    </div>
  );
}
