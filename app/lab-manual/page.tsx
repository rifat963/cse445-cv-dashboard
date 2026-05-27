import { labs, labModules } from "@/data/labs";
import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Lab Manual – CSE445",
  description: "10 hands-on lab experiments across 3 modules for CSE445 Computer Vision",
};

const moduleColors = [
  { border: "border-co1/30", bg: "bg-co1/5", badge: "bg-co1/10 text-co1 border-co1/20", dot: "bg-co1" },
  { border: "border-co2/30", bg: "bg-co2/5", badge: "bg-co2/10 text-co2 border-co2/20", dot: "bg-co2" },
  { border: "border-co4/30", bg: "bg-co4/5", badge: "bg-co4/10 text-co4 border-co4/20", dot: "bg-co4" },
];

const assessmentSummary = [
  { label: "Lab Modules", value: "3 modules", color: "text-co1" },
  { label: "Lab Experiments", value: "10 sessions", color: "text-co2" },
  { label: "Lab Performance", value: "10 marks", color: "text-co4" },
  { label: "Mini Project", value: "10 marks", color: "text-co3" },
];

export default function LabManualPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FlaskConical size={22} className="text-co4" />
          <h1 className="text-2xl font-bold text-[var(--ink)]">Lab Manual</h1>
        </div>
        <p className="text-[var(--muted)]">
          10 hands-on experiments across 3 progressive modules — from image foundations to deep learning detection and multi-object tracking — using Python and OpenCV.
        </p>
      </div>

      {/* Assessment summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {assessmentSummary.map((item) => (
          <div key={item.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className={`text-sm font-semibold ${item.color}`}>{item.value}</div>
            <div className="text-xs text-[var(--muted)] mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Module cards */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">Lab Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {labModules.map((mod, i) => {
            const colors = moduleColors[i % moduleColors.length];
            const moduleLabs = labs.filter((l) => mod.labIds.includes(l.id));
            return (
              <div key={mod.id} className={cn("rounded-2xl border p-5 space-y-4", colors.border, colors.bg)}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className={cn("text-xs font-mono font-bold px-2 py-0.5 rounded border", colors.badge)}>
                        Module {mod.moduleNo}
                      </span>
                      <span className="text-xs text-[var(--muted)]">{mod.weeks}</span>
                    </div>
                    <h3 className="text-base font-bold text-[var(--ink)] leading-snug">{mod.title}</h3>
                    <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed line-clamp-2">{mod.description}</p>
                  </div>
                  <div className="shrink-0 w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-lg font-bold text-[var(--muted)]">
                    {mod.moduleNo}
                  </div>
                </div>

                <div className="space-y-1.5">
                  {moduleLabs.map((lab) => (
                    <Link key={lab.id} href={`/lab-manual/${lab.slug}`}
                      className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors">
                      <span className={cn("shrink-0 w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center", colors.badge)}>
                        {lab.labNo}
                      </span>
                      <span className="text-xs text-[var(--muted)] group-hover:text-[var(--ink)] transition-colors flex-1 leading-tight truncate">
                        {lab.title}
                      </span>
                      <span className="shrink-0 text-[10px] text-[var(--muted)]">W{lab.week}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All labs flat list */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">All Lab Experiments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {labs.map((lab) => {
            const modIdx = labModules.findIndex((m) => m.id === lab.labModuleId);
            const colors = moduleColors[modIdx % moduleColors.length];
            return (
              <Link key={lab.id} href={`/lab-manual/${lab.slug}`}
                className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 hover:bg-[var(--surface-2)] transition-colors">
                <div className="flex items-start gap-3">
                  <div className={cn("shrink-0 w-9 h-9 rounded-lg flex items-center justify-center border", colors.badge)}>
                    <span className="text-xs font-bold font-mono">L{String(lab.labNo).padStart(2, "0")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] text-[var(--muted)]">Week {lab.week}</span>
                      {lab.co.map((co) => (
                        <span key={co} className="text-[10px] bg-[var(--surface-2)] text-[var(--muted)] px-1 rounded">{co}</span>
                      ))}
                    </div>
                    <p className="text-xs font-semibold text-[var(--ink)] group-hover:text-co4 transition-colors leading-snug line-clamp-2">
                      {lab.title}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
