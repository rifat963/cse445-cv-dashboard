import { tutorialSeries } from "@/data/tutorials";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Target, Brain, Activity, Clock, ChevronLeft, ChevronRight,
  CheckCircle2, BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return tutorialSeries.map((s) => ({ seriesSlug: s.slug }));
}

interface PageProps {
  params: Promise<{ seriesSlug: string }>;
}

const seriesIcons: Record<string, React.ElementType> = { Target, Brain, Activity };

const colorConfig = {
  co2: {
    accent:   "text-co2",
    border:   "border-co2/30",
    headerBg: "bg-co2/5",
    badge:    "bg-co2/10 text-co2",
    pill:     "bg-co2/10 text-co2 border-co2/20",
    dot:      "bg-co2",
    numBg:    "bg-co2/10 text-co2",
  },
  co3: {
    accent:   "text-co3",
    border:   "border-co3/30",
    headerBg: "bg-co3/5",
    badge:    "bg-co3/10 text-co3",
    pill:     "bg-co3/10 text-co3 border-co3/20",
    dot:      "bg-co3",
    numBg:    "bg-co3/10 text-co3",
  },
  co4: {
    accent:   "text-co4",
    border:   "border-co4/30",
    headerBg: "bg-co4/5",
    badge:    "bg-co4/10 text-co4",
    pill:     "bg-co4/10 text-co4 border-co4/20",
    dot:      "bg-co4",
    numBg:    "bg-co4/10 text-co4",
  },
} as const;

const difficultyConfig = {
  Beginner:     "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Intermediate: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Advanced:     "bg-rose-500/10 text-rose-600 dark:text-rose-400",
} as const;

export async function generateMetadata({ params }: PageProps) {
  const { seriesSlug } = await params;
  const series = tutorialSeries.find((s) => s.slug === seriesSlug);
  if (!series) return {};
  return {
    title: `${series.title} Tutorial Series – CSE445`,
    description: series.description,
  };
}

export default async function SeriesPage({ params }: PageProps) {
  const { seriesSlug } = await params;
  const seriesIdx = tutorialSeries.findIndex((s) => s.slug === seriesSlug);
  if (seriesIdx === -1) notFound();

  const series  = tutorialSeries[seriesIdx];
  const prevSer = tutorialSeries[seriesIdx - 1] ?? null;
  const nextSer = tutorialSeries[seriesIdx + 1] ?? null;
  const colors  = colorConfig[series.color];
  const Icon    = seriesIcons[series.icon] ?? BookOpen;

  const byDifficulty = {
    Beginner:     series.tutorials.filter((t) => t.difficulty === "Beginner").length,
    Intermediate: series.tutorials.filter((t) => t.difficulty === "Intermediate").length,
    Advanced:     series.tutorials.filter((t) => t.difficulty === "Advanced").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[var(--muted)] mb-4">
        <Link href="/tutorials" className="hover:text-[var(--ink)] transition-colors">Tutorials</Link>
        <span>/</span>
        <span className={cn("font-medium", colors.accent)}>{series.title}</span>
      </div>

      {/* Series header card */}
      <div className={cn("rounded-2xl border p-6 mb-8", colors.border, colors.headerBg)}>
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-2xl", colors.badge)}>
            <Icon size={26} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className={cn("text-2xl font-bold", colors.accent)}>{series.title}</h1>
              <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full border", colors.pill)}>
                {series.tutorials.length} tutorials
              </span>
            </div>
            <p className="text-sm font-semibold text-[var(--muted)] mb-3">{series.subtitle}</p>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-4 max-w-3xl">{series.description}</p>

            {/* Meta row */}
            <div className="flex flex-wrap gap-4 text-xs text-[var(--muted)]">
              <span className="flex items-center gap-1.5">
                <Clock size={12} className={colors.accent} />
                {series.estimatedHours} estimated
              </span>
              {Object.entries(byDifficulty).map(([level, count]) =>
                count > 0 ? (
                  <span key={level} className={cn("px-2 py-0.5 rounded-full font-medium", difficultyConfig[level as keyof typeof difficultyConfig])}>
                    {count} {level}
                  </span>
                ) : null
              )}
            </div>

            <div className="mt-3 flex items-start gap-2">
              <CheckCircle2 size={13} className={cn("mt-0.5 shrink-0", colors.accent)} />
              <p className="text-xs text-[var(--muted)]">
                <span className="font-semibold text-[var(--ink)]">Prerequisites:</span>{" "}
                {series.prerequisites.join(" · ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial list */}
      <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">All Tutorials</h2>
      <div className="space-y-3">
        {series.tutorials.map((tutorial, i) => {
          const diff = difficultyConfig[tutorial.difficulty];
          return (
            <Link
              key={tutorial.id}
              href={`/tutorials/${series.slug}/${tutorial.slug}`}
              className={cn(
                "group flex items-start gap-4 rounded-xl border p-4",
                "bg-[var(--surface)] border-[var(--border)]",
                "hover:bg-[var(--surface-2)] hover:shadow-sm transition-all"
              )}
            >
              {/* Number */}
              <div className={cn(
                "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold border",
                colors.pill
              )}>
                {i + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={cn(
                    "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded",
                    colors.badge
                  )}>
                    {tutorial.id.toUpperCase()}
                  </span>
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", diff)}>
                    {tutorial.difficulty}
                  </span>
                  <span className="text-xs text-[var(--muted)] flex items-center gap-1 ml-auto sm:ml-0">
                    <Clock size={11} /> {tutorial.duration}
                  </span>
                </div>
                <h3 className={cn(
                  "text-sm font-bold text-[var(--ink)] leading-snug mb-1",
                  "group-hover:underline"
                )}>
                  {tutorial.title}
                </h3>
                <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-2">
                  {tutorial.description}
                </p>

                {/* Tools */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tutorial.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono border bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)]"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <ChevronRight size={16} className="shrink-0 text-[var(--muted)] group-hover:text-[var(--ink)] mt-1 transition-colors" />
            </Link>
          );
        })}
      </div>

      {/* Series navigation */}
      <div className="mt-10 flex justify-between gap-4">
        {prevSer ? (
          <Link
            href={`/tutorials/${prevSer.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:block">{prevSer.title}</span>
          </Link>
        ) : (
          <Link
            href="/tutorials"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <ChevronLeft size={16} /> All Series
          </Link>
        )}
        {nextSer ? (
          <Link
            href={`/tutorials/${nextSer.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <span className="hidden sm:block">{nextSer.title}</span>
            <ChevronRight size={16} />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
