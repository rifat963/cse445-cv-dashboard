import { ExternalLink, FileText, ShieldCheck } from "lucide-react";

interface PdfViewerProps {
  title: string;
  sourceUrl: string;
}

export default function PdfViewer({ title, sourceUrl }: PdfViewerProps) {
  return (
    <section className="rounded-lg border border-co1/25 bg-co1/5 p-5 mb-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-co1/20 bg-[var(--surface)] text-co1 shadow-sm">
            <FileText size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-co1">
              Lecture slides
            </p>
            <h2 className="mt-1 text-base font-semibold text-[var(--ink)]">
              {title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
              The embedded PDF preview is disabled to reduce Vercel bandwidth usage. Open the lecture file directly in
              Google Drive for viewing, downloading, or presenting.
            </p>
          </div>
        </div>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-co1/25 bg-co1 px-5 py-3 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
        >
          Open in Drive
          <ExternalLink size={16} />
        </a>
      </div>

      <div className="mt-5 grid gap-3 text-xs text-[var(--muted)] sm:grid-cols-3">
        <div className="rounded-md border border-co1/15 bg-[var(--surface)] px-3 py-2">
          <p className="font-semibold text-[var(--ink)]">No embedded PDF</p>
          <p className="mt-1">The page no longer streams lecture PDFs inside Vercel.</p>
        </div>
        <div className="rounded-md border border-co1/15 bg-[var(--surface)] px-3 py-2">
          <p className="font-semibold text-[var(--ink)]">Drive handles the file</p>
          <p className="mt-1">Students load the heavy document from Google Drive instead.</p>
        </div>
        <div className="rounded-md border border-co1/15 bg-[var(--surface)] px-3 py-2">
          <p className="flex items-center gap-1.5 font-semibold text-[var(--ink)]">
            <ShieldCheck size={13} className="text-co1" />
            Faster course page
          </p>
          <p className="mt-1">Less page weight and better cache behavior for Vercel.</p>
        </div>
      </div>
    </section>
  );
}
