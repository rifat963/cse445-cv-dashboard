import { ExternalLink, FileText } from "lucide-react";

interface PdfViewerProps {
  title: string;
  sourceUrl: string;
}

function getDriveFileId(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ?? parsed.searchParams.get("id");
  } catch {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }
}

export default function PdfViewer({ title, sourceUrl }: PdfViewerProps) {
  const fileId = getDriveFileId(sourceUrl);
  const openUrl = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : sourceUrl;

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
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-co1/25 bg-co1 px-5 py-3 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
        >
          Open PDF
          <ExternalLink size={16} />
        </a>
      </div>

    </section>
  );
}
