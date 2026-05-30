import { labs, labModules } from "@/data/labs";
import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Lab Manual - CSE445",
  description: "10 hands-on lab experiments across 3 modules for CSE445 Computer Vision",
};

const moduleColors = [
  { accent: "border-t-co1", badge: "bg-co1/5 text-co1 border-co1/30" },
  { accent: "border-t-co2", badge: "bg-co2/5 text-co2 border-co2/30" },
  { accent: "border-t-co4", badge: "bg-co4/5 text-co4 border-co4/30" },
];

const assessmentSummary = [
  { label: "Lab Modules", value: "3 modules" },
  { label: "Lab Experiments", value: "10 sessions" },
  { label: "Lab Performance", value: "10 marks" },
  { label: "Mini Project", value: "10 marks" },
];

export default function LabManualPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Practical sequence</p>
        <div className="mt-1 flex items-center gap-2">
          <FlaskConical size={22} className="text-[var(--academic)]" />
          <h1 className="text-2xl font-bold text-[var(--ink)]">Lab Manual</h1>
        </div>
        <p className="mt-2 max-w-3xl text-[var(--muted)]">
          10 hands-on experiments across 3 progressive modules - from image foundations to deep learning detection and multi-object tracking - using Python and OpenCV.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {assessmentSummary.map((item) => (
          <div key={item.label} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="text-sm font-semibold text-[var(--academic)]">{item.value}</div>
            <div className="text-xs text-[var(--muted)] mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      <section>
        <div className="mb-4 border-b border-[var(--border)] pb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Lab structure</p>
          <h2 className="text-lg font-semibold text-[var(--ink)]">Lab Modules</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {labModules.map((mod, i) => {
            const colors = moduleColors[i % moduleColors.length];
            const moduleLabs = labs.filter((l) => mod.labIds.includes(l.id));
            return (
              <div key={mod.id} className={cn("rounded-lg border border-t-4 border-[var(--border)] bg-[var(--surface)] p-5 space-y-4", colors.accent)}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className={cn("text-xs font-mono font-bold px-2 py-0.5 rounded border", colors.badge)}>
                        Module {mod.moduleNo}
                      </span>
                      <span className="text-xs uppercase tracking-wide text-[var(--muted)]">{mod.weeks}</span>
                    </div>
                    <h3 className="text-base font-bold text-[var(--ink)] leading-snug">{mod.title}</h3>
                    <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed line-clamp-3">{mod.description}</p>
                  </div>
                  <div className="shrink-0 border-l border-[var(--border)] pl-3 text-lg font-bold text-[var(--muted)]">
                    {mod.moduleNo}
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-[var(--border)] pt-3">
                  {moduleLabs.map((lab) => (
                    <Link
                      key={lab.id}
                      href={`/lab-manual/${lab.slug}`}
                      className="group flex items-center gap-2.5 rounded-md px-2.5 py-2 bg-[var(--canvas)] border border-[var(--border)] hover:border-[var(--academic)] transition-colors"
                    >
                      <span className={cn("shrink-0 w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center", colors.badge)}>
                        {lab.labNo}
                      </span>
                      <span className="text-xs text-[var(--muted)] group-hover:text-[var(--academic)] transition-colors flex-1 leading-tight truncate">
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
      </section>

      <section>
        <div className="mb-4 border-b border-[var(--border)] pb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Complete list</p>
          <h2 className="text-lg font-semibold text-[var(--ink)]">All Lab Experiments</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {labs.map((lab) => {
            const modIdx = labModules.findIndex((m) => m.id === lab.labModuleId);
            const colors = moduleColors[modIdx % moduleColors.length];
            return (
              <Link
                key={lab.id}
                href={`/lab-manual/${lab.slug}`}
                className="group rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 hover:border-[var(--academic)] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={cn("shrink-0 w-9 h-9 rounded-md flex items-center justify-center border", colors.badge)}>
                    <span className="text-xs font-bold font-mono">L{String(lab.labNo).padStart(2, "0")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] uppercase tracking-wide text-[var(--muted)]">Week {lab.week}</span>
                      {lab.co.map((co) => (
                        <span key={co} className="text-[10px] border border-[var(--border)] bg-[var(--canvas)] text-[var(--muted)] px-1 rounded">{co}</span>
                      ))}
                    </div>
                    <p className="text-xs font-semibold text-[var(--ink)] group-hover:text-[var(--academic)] transition-colors leading-snug line-clamp-2">
                      {lab.title}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
