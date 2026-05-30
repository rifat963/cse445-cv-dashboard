import { tutorialSeries } from "@/data/tutorials";
import { getTutorialLinks, getTutorialInfographic } from "@/lib/notebookLinks";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, Clock, Target, Brain, Activity,
  BookOpen, CheckCircle, Lightbulb, FlaskConical, Wrench, FileCode,
  ExternalLink, Download, ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return tutorialSeries.flatMap((series) =>
    series.tutorials.map((tutorial) => ({
      seriesSlug:   series.slug,
      tutorialSlug: tutorial.slug,
    }))
  );
}

interface PageProps {
  params: Promise<{ seriesSlug: string; tutorialSlug: string }>;
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
    kaggle:   "bg-co4/10 text-co4 border-co4/20 hover:opacity-80",
    ipynb:    "bg-co2/10 text-co2 border-co2/20 hover:opacity-80",
    html:     "bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--ink)]",
  },
  co3: {
    accent:   "text-co3",
    border:   "border-co3/30",
    headerBg: "bg-co3/5",
    badge:    "bg-co3/10 text-co3",
    pill:     "bg-co3/10 text-co3 border-co3/20",
    dot:      "bg-co3",
    kaggle:   "bg-co4/10 text-co4 border-co4/20 hover:opacity-80",
    ipynb:    "bg-co3/10 text-co3 border-co3/20 hover:opacity-80",
    html:     "bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--ink)]",
  },
  co4: {
    accent:   "text-co4",
    border:   "border-co4/30",
    headerBg: "bg-co4/5",
    badge:    "bg-co4/10 text-co4",
    pill:     "bg-co4/10 text-co4 border-co4/20",
    dot:      "bg-co4",
    kaggle:   "bg-co4/10 text-co4 border-co4/20 hover:opacity-80",
    ipynb:    "bg-co4/10 text-co4 border-co4/20 hover:opacity-80",
    html:     "bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--ink)]",
  },
} as const;

const difficultyConfig = {
  Beginner:     "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Intermediate: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Advanced:     "bg-rose-500/10 text-rose-600 dark:text-rose-400",
} as const;

export async function generateMetadata({ params }: PageProps) {
  const { seriesSlug, tutorialSlug } = await params;
  const series   = tutorialSeries.find((s) => s.slug === seriesSlug);
  const tutorial = series?.tutorials.find((t) => t.slug === tutorialSlug);
  if (!series || !tutorial) return {};
  return {
    title: `${tutorial.title} – ${series.title} – CSE445`,
    description: tutorial.description,
  };
}

export default async function TutorialDetailPage({ params }: PageProps) {
  const { seriesSlug, tutorialSlug } = await params;

  const series = tutorialSeries.find((s) => s.slug === seriesSlug);
  if (!series) notFound();

  const tutorialIdx = series.tutorials.findIndex((t) => t.slug === tutorialSlug);
  if (tutorialIdx === -1) notFound();

  const tutorial = series.tutorials[tutorialIdx];
  const prev     = tutorialIdx > 0                         ? series.tutorials[tutorialIdx - 1] : null;
  const next     = tutorialIdx < series.tutorials.length - 1 ? series.tutorials[tutorialIdx + 1] : null;

  const colors = colorConfig[series.color];
  const Icon   = seriesIcons[series.icon] ?? BookOpen;
  const diff   = difficultyConfig[tutorial.difficulty];

  const { kaggle: kaggleUrl, ipynb: ipynbUrl, html: htmlUrl } = getTutorialLinks(tutorial.id);
  const infographicUrl = getTutorialInfographic(tutorial.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[var(--muted)] mb-4 flex-wrap">
        <Link href="/tutorials" className="hover:text-[var(--ink)] transition-colors">Tutorials</Link>
        <span>/</span>
        <Link href={`/tutorials/${series.slug}`} className={cn("hover:text-[var(--ink)] transition-colors", colors.accent)}>
          {series.title}
        </Link>
        <span>/</span>
        <span className="text-[var(--ink)] font-medium truncate max-w-[200px]">{tutorial.title}</span>
      </div>

      {/* Prev / Next top */}
      <div className="flex justify-between gap-4 mb-6">
        {prev ? (
          <Link
            href={`/tutorials/${series.slug}/${prev.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:block truncate max-w-[200px]">{prev.title}</span>
          </Link>
        ) : (
          <Link
            href={`/tutorials/${series.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:block">Back to {series.title}</span>
          </Link>
        )}
        {next ? (
          <Link
            href={`/tutorials/${series.slug}/${next.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <span className="hidden sm:block truncate max-w-[200px]">{next.title}</span>
            <ChevronRight size={16} />
          </Link>
        ) : <div />}
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-bold border", colors.pill)}>
            <Icon size={11} /> {tutorial.id.toUpperCase()}
          </span>
          <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full", diff)}>
            {tutorial.difficulty}
          </span>
          <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
            <Clock size={11} /> {tutorial.duration}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-[var(--ink)] leading-tight mb-2">{tutorial.title}</h1>
        <p className="text-sm text-[var(--muted)] leading-relaxed max-w-3xl">{tutorial.description}</p>

        {/* Tools */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tutorial.tools.map((tool) => (
            <span
              key={tool}
              className={cn("px-2.5 py-0.5 rounded-full text-xs font-mono border", colors.pill)}
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <div className="space-y-6">

        {/* Topics covered */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
            <BookOpen size={16} className={colors.accent} /> Topics Covered
          </h2>
          <ul className="space-y-2">
            {tutorial.topics.map((topic, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--muted)]">
                <span className={cn(
                  "shrink-0 w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center mt-0.5",
                  colors.badge
                )}>
                  {i + 1}
                </span>
                {topic}
              </li>
            ))}
          </ul>
        </div>

        {/* Learning objectives + Key takeaways */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-co1" /> Learning Objectives
            </h2>
            <ul className="space-y-2">
              {tutorial.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                  <CheckCircle size={13} className="mt-0.5 shrink-0 text-co1" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          <div className={cn("rounded-xl border p-5", colors.border, colors.headerBg)}>
            <h2 className="font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
              <Lightbulb size={16} className={colors.accent} /> Key Takeaways
            </h2>
            <ul className="space-y-2">
              {tutorial.keyTakeaways.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                  <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full shrink-0", colors.dot)} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Infographic */}
        {infographicUrl ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon size={16} className={colors.accent} />
              <h2 className="font-semibold text-[var(--ink)] text-sm">Tutorial Infographic</h2>
            </div>
            <div className="relative w-full rounded-lg overflow-hidden border border-[var(--border)]">
              <Image
                src={infographicUrl}
                alt={`${tutorial.title} infographic`}
                width={1200}
                height={800}
                className="w-full h-auto object-contain"
                priority={false}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-5 flex items-start gap-3 text-[var(--muted)]">
            <ImageIcon size={18} className="shrink-0 mt-0.5 opacity-40" />
            <p className="text-sm">
              Infographic coming soon. Drop{" "}
              <code className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-2)]">
                {tutorial.id}.png
              </code>{" "}
              (or .jpg / .webp / .svg) into{" "}
              <code className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-2)]">
                public/infographics/tutorials/
              </code>{" "}
              and it will appear here automatically.
            </p>
          </div>
        )}

        {/* Notebook widget */}
        {(kaggleUrl || ipynbUrl || htmlUrl) && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2 mb-2">
              <FileCode size={16} className="text-co4" />
              <h2 className="font-semibold text-[var(--ink)] text-sm">Jupyter Notebook</h2>
            </div>
            <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
              Open the companion notebook in Kaggle, download the .ipynb for local use, or preview the rendered HTML version.
            </p>
            <div className="flex gap-2 flex-wrap">
              {kaggleUrl && (
                <a
                  href={kaggleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-opacity",
                    colors.kaggle
                  )}
                >
                  <ExternalLink size={13} /> Open in Kaggle
                </a>
              )}
              {ipynbUrl && (
                <a
                  href={ipynbUrl}
                  download
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-opacity",
                    colors.ipynb
                  )}
                >
                  <Download size={13} /> Download .ipynb
                </a>
              )}
              {htmlUrl && (
                <a
                  href={htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors",
                    colors.html
                  )}
                >
                  <ExternalLink size={13} /> View HTML
                </a>
              )}
            </div>
          </div>
        )}

        {/* No notebook yet placeholder */}
        {!kaggleUrl && !ipynbUrl && !htmlUrl && (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2 mb-1">
              <FileCode size={16} className="text-[var(--muted)]" />
              <h2 className="font-semibold text-[var(--ink)] text-sm">Jupyter Notebook</h2>
            </div>
            <p className="text-xs text-[var(--muted)]">
              Notebook coming soon. Add links to{" "}
              <code className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-2)]">
                data/tutorial-notebooks.txt
              </code>{" "}
              to enable Kaggle, .ipynb, and HTML download buttons here.
            </p>
          </div>
        )}

        {/* Exercises */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
            <FlaskConical size={16} className="text-co3" /> Hands-On Exercises
          </h2>
          <ol className="space-y-2">
            {tutorial.exercises.map((exercise, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[var(--muted)]">
                <span className="shrink-0 w-6 h-6 rounded-full bg-co3/10 text-co3 flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                {exercise}
              </li>
            ))}
          </ol>
        </div>

        {/* Tools reference */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
            <Wrench size={16} className="text-co2" /> Tools &amp; Libraries
          </h2>
          <div className="flex flex-wrap gap-2">
            {tutorial.tools.map((tool) => (
              <span
                key={tool}
                className={cn("px-3 py-1.5 rounded-full text-sm font-mono border", colors.pill)}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Prev / Next bottom */}
      <div className="mt-10 flex justify-between gap-4">
        {prev ? (
          <Link
            href={`/tutorials/${series.slug}/${prev.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:block truncate max-w-[200px]">{prev.title}</span>
          </Link>
        ) : (
          <Link
            href={`/tutorials/${series.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:block">Back to {series.title}</span>
          </Link>
        )}
        {next ? (
          <Link
            href={`/tutorials/${series.slug}/${next.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            <span className="hidden sm:block truncate max-w-[200px]">{next.title}</span>
            <ChevronRight size={16} />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
