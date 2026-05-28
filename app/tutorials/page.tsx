import { tutorialSeries } from "@/data/tutorials";
import Link from "next/link";
import { Target, Brain, Activity, Clock, BookOpen, ChevronRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Tutorials – CSE445",
  description: "Hands-on tutorial series for Object Detection, Self-Supervised Learning, and Object Tracking.",
};

const seriesIcons: Record<string, React.ElementType> = { Target, Brain, Activity };

const colorConfig = {
  co2: {
    accent:    "text-co2",
    border:    "border-co2/30",
    headerBg:  "bg-co2/5",
    badge:     "bg-co2/10 text-co2",
    pill:      "bg-co2/10 text-co2 border-co2/20",
    bar:       "bg-co2",
    linkHover: "hover:text-co2",
  },
  co3: {
    accent:    "text-co3",
    border:    "border-co3/30",
    headerBg:  "bg-co3/5",
    badge:     "bg-co3/10 text-co3",
    pill:      "bg-co3/10 text-co3 border-co3/20",
    bar:       "bg-co3",
    linkHover: "hover:text-co3",
  },
  co4: {
    accent:    "text-co4",
    border:    "border-co4/30",
    headerBg:  "bg-co4/5",
    badge:     "bg-co4/10 text-co4",
    pill:      "bg-co4/10 text-co4 border-co4/20",
    bar:       "bg-co4",
    linkHover: "hover:text-co4",
  },
} as const;

export default function TutorialsPage() {
  const totalTutorials = tutorialSeries.reduce((s, ser) => s + ser.tutorials.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)]">Tutorial Series</h1>
        <p className="text-[var(--muted)] mt-1 max-w-2xl">
          Three structured, hands-on series for mastering key Computer Vision topics.
          Each tutorial builds on the last with theory, code, and experiments.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Series",           value: String(tutorialSeries.length), color: "text-co2" },
          { label: "Total Tutorials",  value: String(totalTutorials),        color: "text-co3" },
          { label: "Estimated Hours",  value: "38–49 hrs",                   color: "text-co4" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
            <div className={cn("text-2xl font-bold", color)}>{value}</div>
            <div className="text-xs text-[var(--muted)] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Series cards */}
      <div className="space-y-6">
        {tutorialSeries.map((series) => {
          const colors = colorConfig[series.color];
          const Icon  = seriesIcons[series.icon] ?? BookOpen;

          return (
            <div
              key={series.id}
              className={cn(
                "rounded-2xl border p-6 transition-shadow hover:shadow-sm",
                colors.border,
                colors.headerBg
              )}
            >
              {/* Series header */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", colors.badge)}>
                  <Icon size={22} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className={cn("text-xl font-bold", colors.accent)}>{series.title}</h2>
                    <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full border", colors.pill)}>
                      {series.tutorials.length} tutorials
                    </span>
                    <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                      <Clock size={11} /> {series.estimatedHours}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[var(--muted)] mb-2">{series.subtitle}</p>
                  <p className="text-sm text-[var(--muted)] leading-relaxed max-w-3xl">{series.description}</p>

                  <div className="mt-3 flex items-start gap-2">
                    <CheckCircle2 size={13} className={cn("mt-0.5 shrink-0", colors.accent)} />
                    <p className="text-xs text-[var(--muted)]">
                      <span className="font-semibold text-[var(--ink)]">Prerequisites:</span>{" "}
                      {series.prerequisites.join(" · ")}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/tutorials/${series.slug}`}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors",
                    "bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-2)]",
                    colors.linkHover
                  )}
                >
                  View Series <ChevronRight size={14} />
                </Link>
              </div>

              {/* Tutorial list preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {series.tutorials.map((tutorial, i) => (
                  <Link
                    key={tutorial.id}
                    href={`/tutorials/${series.slug}/${tutorial.slug}`}
                    className={cn(
                      "group flex items-start gap-2.5 rounded-lg px-3 py-2.5",
                      "bg-[var(--surface)] border border-[var(--border)]",
                      "hover:bg-[var(--surface-2)] transition-colors"
                    )}
                  >
                    <span className={cn(
                      "shrink-0 w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center mt-0.5",
                      colors.badge
                    )}>
                      {i + 1}
                    </span>
                    <span className={cn(
                      "text-xs text-[var(--muted)] group-hover:text-[var(--ink)] transition-colors leading-snug line-clamp-2",
                    )}>
                      {tutorial.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
