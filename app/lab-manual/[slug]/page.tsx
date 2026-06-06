import { labs, labModules } from "@/data/labs";
import { lectures } from "@/data/lectures";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FlaskConical, CheckCircle, HelpCircle, BookOpen, Monitor, FileCode, ExternalLink, Download, ImageIcon } from "lucide-react";
import { getLabLinks, getLabInfographic } from "@/lib/notebookLinks";
import { cn } from "@/lib/utils";
import InfographicViewer from "@/components/ui/InfographicViewer";

export async function generateStaticParams() {
  return labs.map((l) => ({ slug: l.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LabDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const idx = labs.findIndex((l) => l.slug === slug);
  if (idx === -1) notFound();

  const lab = labs[idx];
  const prev = idx > 0 ? labs[idx - 1] : null;
  const next = idx < labs.length - 1 ? labs[idx + 1] : null;
  const parentModule = labModules.find((m) => m.id === lab.labModuleId);
  const showLabResources = lab.id !== "LAB09";

  const linkedLectureObjects = lab.linkedLectures
    .map((n) => lectures.find((l) => l.lectureNo === n))
    .filter(Boolean);

  const { kaggle: kaggleUrl, ipynb: ipynbUrl, html: htmlUrl } = getLabLinks(lab.id);
  const infographicUrl = getLabInfographic(lab.id);

  const modIdx = labModules.findIndex((m) => m.id === lab.labModuleId);
  const moduleColorBadge = [
    "bg-co1/10 text-co1 border-co1/20",
    "bg-co2/10 text-co2 border-co2/20",
    "bg-co4/10 text-co4 border-co4/20",
  ][modIdx % 3];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-[var(--muted)] mb-4">
        <Link href="/lab-manual" className="hover:text-[var(--ink)] transition-colors">Lab Manual</Link>
        {parentModule && (
          <>
            <span>/</span>
            <span className="text-[var(--muted)]">{parentModule.title}</span>
          </>
        )}
        <span>/</span>
        <span className="text-[var(--ink)] font-medium">{lab.id}</span>
      </div>

      {/* Top Prev/Next */}
      <div className="flex justify-between gap-4 mb-6">
        {prev ? (
          <Link href={`/lab-manual/${prev.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm">
            <ChevronLeft size={16} />
            <span className="hidden sm:block">{prev.id}: {prev.title.substring(0, 30)}…</span>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/lab-manual/${next.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm">
            <span className="hidden sm:block">{next.id}: {next.title.substring(0, 30)}…</span>
            <ChevronRight size={16} />
          </Link>
        ) : <div />}
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-bold border", moduleColorBadge)}>
            <FlaskConical size={11} /> LAB{String(lab.labNo).padStart(2, "0")}
          </span>
          <span className="text-xs bg-[var(--surface-2)] text-[var(--muted)] px-2 py-0.5 rounded">Week {lab.week}</span>
          {lab.co.map((co) => (
            <span key={co} className="text-xs bg-[var(--surface-2)] text-[var(--muted)] px-2 py-0.5 rounded">{co}</span>
          ))}
        </div>
        <h1 className="text-2xl font-bold text-[var(--ink)] leading-tight mb-2">{lab.title}</h1>
        <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{lab.objective}</p>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-[var(--muted)] shrink-0">Software:</span>
            {lab.software.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded text-xs font-mono bg-co2/10 text-co2">{s}</span>
            ))}
          </div>
          {linkedLectureObjects.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-[var(--muted)] shrink-0">Lectures:</span>
              {linkedLectureObjects.map((lec) => lec && (
                <Link key={lec.id} href={`/lectures/${lec.slug}`}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--border)] transition-colors">
                  L{String(lec.lectureNo).padStart(2, "0")}
                </Link>
              ))}
            </div>
          )}
        </div>

        {lab.relatedTutorial && (
          <div className="mt-5 rounded-lg border border-co2/20 bg-co2/5 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                  <BookOpen size={15} className="text-co2" />
                  Related Tutorial
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                  {lab.relatedTutorial.description}
                </p>
              </div>
              <Link
                href={lab.relatedTutorial.href}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-co2/20 bg-co2/10 px-3 py-2 text-xs font-semibold text-co2 transition-opacity hover:opacity-80"
              >
                {lab.relatedTutorial.title}
                <ExternalLink size={13} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Learning Objectives */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
              <BookOpen size={16} className="text-co1" /> Learning Objectives
            </h2>
            <ul className="space-y-2">
              {lab.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                  <CheckCircle size={14} className="mt-0.5 text-co1 shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          {/* Lab Tasks */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
              <Monitor size={16} className="text-co2" /> Lab Tasks
            </h2>
            <ol className="space-y-2">
              {lab.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[var(--muted)]">
                  <span className="shrink-0 w-6 h-6 rounded bg-co2/10 text-co2 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  {task}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Infographic */}
        {showLabResources && (infographicUrl ? (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon size={16} className="text-co1" />
              <h2 className="font-semibold text-[var(--ink)] text-sm">Lab Infographic</h2>
            </div>
            <InfographicViewer
              src={infographicUrl}
              alt={`${lab.title} infographic`}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)] p-5 flex items-start gap-3 text-[var(--muted)]">
            <ImageIcon size={18} className="shrink-0 mt-0.5 opacity-40" />
            <p className="text-sm">
              Infographic coming soon. Drop{" "}
              <code className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-2)]">
                {lab.id}.png
              </code>{" "}
              (or .jpg / .webp / .svg) into{" "}
              <code className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-2)]">
                public/infographics/labs/
              </code>{" "}
              and it will appear here automatically.
            </p>
          </div>
        ))}

        {/* Notebook widget */}
        {showLabResources && ((kaggleUrl || ipynbUrl || htmlUrl) ? (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
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
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border bg-co4/10 text-co4 border-co4/20 hover:opacity-80 transition-opacity"
                >
                  <ExternalLink size={13} /> Open in Kaggle
                </a>
              )}
              {ipynbUrl && (
                <a
                  href={ipynbUrl}
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border bg-co2/10 text-co2 border-co2/20 hover:opacity-80 transition-opacity"
                >
                  <Download size={13} /> Download .ipynb
                </a>
              )}
              {htmlUrl && (
                <a
                  href={htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--ink)] transition-colors"
                >
                  <ExternalLink size={13} /> View HTML
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-2 mb-1">
              <FileCode size={16} className="text-[var(--muted)]" />
              <h2 className="font-semibold text-[var(--ink)] text-sm">Jupyter Notebook</h2>
            </div>
            <p className="text-xs text-[var(--muted)]">
              Notebook coming soon. Add links to{" "}
              <code className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-2)]">
                data/lab-notebooks.txt
              </code>{" "}
              to enable Kaggle, .ipynb, and HTML download buttons here.
            </p>
          </div>
        ))}

        {/* Expected Outputs */}
        {showLabResources && (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="font-semibold text-[var(--ink)] mb-3">Expected Outputs</h2>
            <ul className="space-y-2">
              {lab.expectedOutputs.map((out, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                  <span className="mt-1 w-2 h-2 rounded bg-co4 shrink-0" />
                  {out}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Viva Questions */}
        <div className="rounded-lg border border-co3/20 bg-co3/5 p-5">
          <h2 className="font-semibold text-[var(--ink)] mb-4 flex items-center gap-2">
            <HelpCircle size={16} className="text-co3" /> Viva Questions &amp; Answers
          </h2>
          <div className="space-y-4">
            {lab.vivaQuestions.map((qa, i) => (
              <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 space-y-2">
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 text-xs font-bold bg-co3/15 text-co3 px-1.5 py-0.5 rounded">Q{i + 1}</span>
                  <p className="text-sm font-semibold text-[var(--ink)] leading-snug">{qa.q}</p>
                </div>
                <div className="flex items-start gap-2.5 pl-1">
                  <span className="shrink-0 text-xs font-bold text-co2 px-1.5 py-0.5">A</span>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{qa.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Prev/Next */}
      <div className="mt-8 flex justify-between gap-4">
        {prev ? (
          <Link href={`/lab-manual/${prev.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm">
            <ChevronLeft size={16} />
            <span className="hidden sm:block">{prev.id}: {prev.title.substring(0, 30)}…</span>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/lab-manual/${next.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm">
            <span className="hidden sm:block">{next.id}: {next.title.substring(0, 30)}…</span>
            <ChevronRight size={16} />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
