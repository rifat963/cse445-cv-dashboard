import { modules } from "@/data/modules";
import { lectures } from "@/data/lectures";
import { labs } from "@/data/labs";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  FlaskConical,
  Hash,
  FileText,
  ExternalLink,
  Download,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { getLectureLinks, getLectureInfographic } from "@/lib/notebookLinks";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  const moduleSlugs = modules.map((m) => ({ slug: m.slug }));
  const lectureSlugs = lectures.map((l) => ({ slug: l.slug }));
  return [...moduleSlugs, ...lectureSlugs];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

const colorScheme: Record<string, { badge: string; accent: string; bg: string }> = {
  co1: { badge: "bg-co1/10 text-co1 border-co1/20", accent: "text-co1", bg: "bg-co1/5" },
  co2: { badge: "bg-co2/10 text-co2 border-co2/20", accent: "text-co2", bg: "bg-co2/5" },
  co3: { badge: "bg-co3/10 text-co3 border-co3/20", accent: "text-co3", bg: "bg-co3/5" },
  co4: { badge: "bg-co4/10 text-co4 border-co4/20", accent: "text-co4", bg: "bg-co4/5" },
  advanced: { badge: "bg-advanced/10 text-advanced border-advanced/20", accent: "text-advanced", bg: "bg-advanced/5" },
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  // ── Individual lecture page ──────────────────────────────────────────────
  const lectureIdx = lectures.findIndex((l) => l.slug === slug);
  if (lectureIdx !== -1) {
    const lecture = lectures[lectureIdx];
    const mod = modules.find((m) => m.id === lecture.moduleId)!;
    const scheme = colorScheme[lecture.color] ?? colorScheme.co2;
    const prevLecture = lectureIdx > 0 ? lectures[lectureIdx - 1] : null;
    const nextLecture = lectureIdx < lectures.length - 1 ? lectures[lectureIdx + 1] : null;
    const relatedLabs = labs.filter((lab) =>
      lab.linkedLectures.includes(lecture.lectureNo)
    );

    const { slides: slidesUrl, pdf: pdfUrl } = getLectureLinks(lecture.id);
    const infographicUrl = getLectureInfographic(lecture.id);

    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6">
          <Link href="/lectures" className="hover:text-[var(--ink)] transition-colors">Modules</Link>
          <ChevronRight size={14} />
          <Link href={`/lectures/${mod.slug}`} className="hover:text-[var(--ink)] transition-colors">{mod.shortTitle}</Link>
          <ChevronRight size={14} />
          <span className="text-[var(--ink)] font-medium truncate">{lecture.shortTitle}</span>
        </div>

        {/* Prev / Next */}
        <div className="flex justify-between gap-4 mb-6">
          {prevLecture ? (
            <Link href={`/lectures/${prevLecture.slug}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm max-w-[48%]">
              <ChevronLeft size={16} className="shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-[var(--muted)]">Previous</p>
                <p className="truncate">{prevLecture.shortTitle}</p>
              </div>
            </Link>
          ) : <div />}
          {nextLecture ? (
            <Link href={`/lectures/${nextLecture.slug}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm max-w-[48%] ml-auto text-right">
              <div className="min-w-0">
                <p className="text-xs text-[var(--muted)]">Next</p>
                <p className="truncate">{nextLecture.shortTitle}</p>
              </div>
              <ChevronRight size={16} className="shrink-0" />
            </Link>
          ) : <div />}
        </div>

        {/* Header */}
        <div className={cn("rounded-2xl border border-[var(--border)] p-6 mb-8", scheme.bg)}>
          <h1 className="text-2xl font-bold text-[var(--ink)] mb-2">{lecture.title}</h1>
          <p className="text-[var(--muted)] text-sm leading-relaxed mb-5">{lecture.tagline}</p>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold border", scheme.badge)}>
              L{String(lecture.lectureNo).padStart(2, "0")}
            </span>
            {lecture.co.map((co) => (
              <span key={co} className="px-2 py-0.5 rounded text-xs bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]">{co}</span>
            ))}
            <Link href={`/lectures/${mod.slug}`}
              className="px-2 py-0.5 rounded text-xs bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] hover:text-[var(--ink)] transition-colors">
              {mod.id} · {mod.shortTitle}
            </Link>
            <span className={cn("px-2 py-0.5 rounded text-xs font-medium border", scheme.badge)}>{lecture.assessmentArea}</span>
            <span className="text-xs text-[var(--muted)] font-mono sm:ml-auto">{mod.weekRange}</span>
          </div>

          <div className="grid gap-3 md:grid-cols-3 text-xs">
            <div>
              <p className="font-semibold text-[var(--ink)] mb-2 flex items-center gap-1"><Hash size={12} /> Key Terms</p>
              <div className="flex flex-wrap gap-1.5">
                {lecture.keyTerms.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-[var(--ink)] mb-2">Python Tools</p>
              <div className="flex flex-wrap gap-1.5">
                {lecture.pythonTools.map((tool) => (
                  <span key={tool} className="px-2 py-0.5 rounded font-mono bg-co2/10 text-co2">{tool}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-[var(--ink)] mb-2">Textbook Reference</p>
              <div className="flex flex-wrap gap-1.5">
                {lecture.textbooks.map((tb) => (
                  <span key={tb} className="px-2 py-0.5 rounded font-mono bg-co3/10 text-co3">{tb}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Topics + Outcomes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-base font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
              <BookOpen size={16} className={scheme.accent} /> Topics Covered
            </h2>
            <ol className="space-y-2">
              {lecture.subtopics.map((topic, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[var(--muted)] rounded-lg px-3 py-2 bg-[var(--surface)] border border-[var(--border)]">
                  <span className={cn("shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold", scheme.badge)}>{i + 1}</span>
                  {topic}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
              <CheckCircle size={16} className={scheme.accent} /> Learning Outcomes
            </h2>
            <ul className="space-y-2">
              {lecture.outcomes.map((o, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--muted)] rounded-lg px-3 py-2 bg-[var(--surface)] border border-[var(--border)]">
                  <CheckCircle size={14} className={cn("mt-0.5 shrink-0", scheme.accent)} />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Infographic */}
        {infographicUrl ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon size={16} className={scheme.accent} />
              <h2 className="font-semibold text-[var(--ink)] text-sm">Lecture Infographic</h2>
            </div>
            <div className="relative w-full rounded-lg overflow-hidden border border-[var(--border)]">
              <Image
                src={infographicUrl}
                alt={`${lecture.title} infographic`}
                width={1200}
                height={800}
                className="w-full h-auto object-contain"
                priority={false}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-5 flex items-start gap-3 text-[var(--muted)] mb-8">
            <ImageIcon size={18} className="shrink-0 mt-0.5 opacity-40" />
            <p className="text-sm">
              Infographic coming soon. Drop{" "}
              <code className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-2)]">
                {lecture.id}.png
              </code>{" "}
              (or .jpg / .webp / .svg) into{" "}
              <code className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-2)]">
                public/infographics/lectures/
              </code>{" "}
              and it will appear here automatically.
            </p>
          </div>
        )}

        {/* Lecture slides */}
        {(slidesUrl || pdfUrl) ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className={scheme.accent} />
              <h2 className="font-semibold text-[var(--ink)] text-sm">Lecture Slides</h2>
            </div>
            <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
              Open the slide deck in Google Drive or download a local PDF copy.
            </p>
            <div className="flex gap-2 flex-wrap">
              {slidesUrl && (
                <a
                  href={slidesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-opacity hover:opacity-80",
                    scheme.badge
                  )}
                >
                  <ExternalLink size={13} /> View Slides
                </a>
              )}
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--ink)] transition-colors"
                >
                  <Download size={13} /> Download PDF
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-5 flex items-center gap-3 text-[var(--muted)] mb-8">
            <FileText size={18} className="shrink-0 opacity-40" />
            <p className="text-sm">
              Slides coming soon. Add links to{" "}
              <code className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-2)]">
                data/lecture-slides.txt
              </code>{" "}
              to enable View Slides and Download PDF buttons here.
            </p>
          </div>
        )}

        {/* Related Labs */}
        {relatedLabs.length > 0 && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 mb-8">
            <h2 className="font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
              <FlaskConical size={16} className="text-co4" /> Related Lab Experiments
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {relatedLabs.map((lab) => (
                <Link key={lab.id} href={`/lab-manual/${lab.slug}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-2)] hover:bg-co4/10 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm text-[var(--ink)] truncate">{lab.title}</p>
                    <p className="text-xs text-[var(--muted)]">Week {lab.week}</p>
                  </div>
                  <span className="text-xs text-[var(--muted)] font-mono shrink-0 ml-2">{lab.id}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Prev/Next */}
        <div className="flex justify-between gap-4">
          {prevLecture ? (
            <Link href={`/lectures/${prevLecture.slug}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm max-w-[48%]">
              <ChevronLeft size={16} className="shrink-0" />
              <span className="truncate">{prevLecture.shortTitle}</span>
            </Link>
          ) : <div />}
          {nextLecture ? (
            <Link href={`/lectures/${nextLecture.slug}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm max-w-[48%] ml-auto">
              <span className="truncate">{nextLecture.shortTitle}</span>
              <ChevronRight size={16} className="shrink-0" />
            </Link>
          ) : <div />}
        </div>
      </div>
    );
  }

  // ── Module page ──────────────────────────────────────────────────────────
  const modIdx = modules.findIndex((m) => m.slug === slug);
  if (modIdx === -1) notFound();

  const mod = modules[modIdx];
  const scheme = colorScheme[mod.color] ?? colorScheme.co2;
  const moduleLectures = lectures.filter((l) => l.moduleId === mod.id);
  const prevMod = modIdx > 0 ? modules[modIdx - 1] : null;
  const nextMod = modIdx < modules.length - 1 ? modules[modIdx + 1] : null;

  const relatedLabs = labs.filter((lab) =>
    lab.linkedLectures.some((ln) => mod.lectureNos.includes(ln))
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/lectures"
        className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--ink)] mb-6 transition-colors">
        <ChevronLeft size={16} /> Back to Modules
      </Link>

      {/* Module header */}
      <div className={cn("rounded-2xl border border-[var(--border)] p-6 mb-8", scheme.bg)}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold border", scheme.badge)}>
            {mod.id}
          </span>
          {mod.co.map((co) => (
            <span key={co} className="px-2 py-0.5 rounded text-xs bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]">{co}</span>
          ))}
          <span className="text-xs text-[var(--muted)] font-mono ml-auto">{mod.weekRange}</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--ink)] mb-2">{mod.title}</h1>
        <p className="text-[var(--muted)] text-sm leading-relaxed">{mod.description}</p>

        <div className="mt-5 grid sm:grid-cols-2 gap-2">
          {mod.outcomes.map((o, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-[var(--muted)]">
              <CheckCircle size={14} className={cn("mt-0.5 shrink-0", scheme.accent)} />
              {o}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {mod.pythonTools.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded text-xs font-mono bg-co2/10 text-co2">{t}</span>
          ))}
        </div>
      </div>

      {/* Lectures in module */}
      <h2 className="text-lg font-semibold text-[var(--ink)] mb-4 flex items-center gap-2">
        <BookOpen size={18} className={scheme.accent} />
        Lectures in this Module
        <span className="text-sm font-normal text-[var(--muted)]">({moduleLectures.length})</span>
      </h2>

      <div className="space-y-3 mb-10">
        {moduleLectures.map((lecture) => (
          <Link key={lecture.id} href={`/lectures/${lecture.slug}`}
            className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 hover:bg-[var(--surface-2)] transition-colors">
            <span className={cn("shrink-0 px-2 py-0.5 rounded text-xs font-mono font-semibold border", scheme.badge)}>
              L{String(lecture.lectureNo).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--ink)] text-sm truncate">{lecture.title}</p>
              <p className="text-xs text-[var(--muted)] truncate">{lecture.tagline}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {lecture.co.map((co) => (
                <span key={co} className="hidden sm:inline text-xs text-[var(--muted)] bg-[var(--surface-2)] px-2 py-0.5 rounded">{co}</span>
              ))}
              <ChevronRight size={16} className="text-[var(--muted)] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Related Labs */}
      {relatedLabs.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 mb-8">
          <h2 className="font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
            <FlaskConical size={16} className="text-co4" /> Related Lab Experiments
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {relatedLabs.map((lab) => (
              <Link key={lab.id} href={`/lab-manual/${lab.slug}`}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-2)] hover:bg-co4/10 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm text-[var(--ink)] truncate">{lab.title}</p>
                  <p className="text-xs text-[var(--muted)]">Week {lab.week}</p>
                </div>
                <span className="text-xs text-[var(--muted)] font-mono shrink-0 ml-2">{lab.id}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Prev / Next module */}
      <div className="flex justify-between gap-4">
        {prevMod ? (
          <Link href={`/lectures/${prevMod.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm max-w-[48%]">
            <ChevronLeft size={16} className="shrink-0" />
            <span className="truncate">{prevMod.shortTitle}</span>
          </Link>
        ) : <div />}
        {nextMod ? (
          <Link href={`/lectures/${nextMod.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] transition-colors text-sm max-w-[48%] ml-auto">
            <span className="truncate">{nextMod.shortTitle}</span>
            <ChevronRight size={16} className="shrink-0" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
