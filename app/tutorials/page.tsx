import { tutorialSeries } from "@/data/tutorials";
import Link from "next/link";
import { Activity, BookOpen, Brain, CheckCircle2, ChevronRight, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Tutorials - CSE445",
  description: "Hands-on tutorial series for Object Detection, Self-Supervised Learning, and Object Tracking.",
};

const seriesIcons: Record<string, React.ElementType> = { Target, Brain, Activity };

const colorConfig = {
  co2: { accent: "border-t-co2", badge: "bg-co2/5 text-co2 border-co2/30", text: "text-co2" },
  co3: { accent: "border-t-co3", badge: "bg-co3/5 text-co3 border-co3/30", text: "text-co3" },
  co4: { accent: "border-t-co4", badge: "bg-co4/5 text-co4 border-co4/30", text: "text-co4" },
} as const;

export default function TutorialsPage() {
  const totalTutorials = tutorialSeries.reduce((s, ser) => s + ser.tutorials.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Guided practice</p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--ink)]">Tutorial Series</h1>
        <p className="text-[var(--muted)] mt-2 max-w-3xl">
          Three structured, hands-on series for mastering key Computer Vision topics. Each tutorial builds on the last with theory, code, and experiments.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Series", value: String(tutorialSeries.length) },
          { label: "Total Tutorials", value: String(totalTutorials) },
          { label: "Estimated Hours", value: "38-49 hrs" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
            <div className="text-2xl font-bold text-[var(--academic)]">{value}</div>
            <div className="text-xs text-[var(--muted)] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <section>
        <div className="mb-4 border-b border-[var(--border)] pb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Learning tracks</p>
          <h2 className="text-lg font-semibold text-[var(--ink)]">All Tutorial Series</h2>
        </div>
        <div className="space-y-6">
          {tutorialSeries.map((series) => {
            const colors = colorConfig[series.color];
            const Icon = seriesIcons[series.icon] ?? BookOpen;

            return (
              <div key={series.id} className={cn("rounded-lg border border-t-4 border-[var(--border)] bg-[var(--surface)] p-6", colors.accent)}>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
                  <div className={cn("w-12 h-12 rounded-md flex items-center justify-center shrink-0 border", colors.badge)}>
                    <Icon size={22} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-[var(--ink)]">{series.title}</h2>
                      <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded border", colors.badge)}>
                        {series.tutorials.length} tutorials
                      </span>
                      <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                        <Clock size={11} /> {series.estimatedHours}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[var(--muted)] mb-2">{series.subtitle}</p>
                    <p className="text-sm text-[var(--muted)] leading-relaxed max-w-3xl">{series.description}</p>

                    <div className="mt-3 flex items-start gap-2">
                      <CheckCircle2 size={13} className={cn("mt-0.5 shrink-0", colors.text)} />
                      <p className="text-xs text-[var(--muted)]">
                        <span className="font-semibold text-[var(--ink)]">Prerequisites:</span>{" "}
                        {series.prerequisites.join(" / ")}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/tutorials/${series.slug}`}
                    className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-[var(--border)] bg-[var(--canvas)] text-sm font-semibold text-[var(--muted)] hover:text-[var(--academic)] hover:border-[var(--academic)] transition-colors"
                  >
                    View Series <ChevronRight size={14} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {series.tutorials.map((tutorial, i) => (
                    <Link
                      key={tutorial.id}
                      href={`/tutorials/${series.slug}/${tutorial.slug}`}
                      className="group flex items-start gap-2.5 rounded-md px-3 py-2.5 bg-[var(--canvas)] border border-[var(--border)] hover:border-[var(--academic)] transition-colors"
                    >
                      <span className={cn("shrink-0 w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center mt-0.5", colors.badge)}>
                        {i + 1}
                      </span>
                      <span className="text-xs text-[var(--muted)] group-hover:text-[var(--academic)] transition-colors leading-snug line-clamp-2">
                        {tutorial.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
