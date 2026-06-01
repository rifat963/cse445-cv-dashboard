import { ExternalLink, FileText } from "lucide-react";

interface PdfViewerProps {
  title: string;
  sourceUrl: string;
}

function getGoogleDriveFileId(url: string) {
  try {
    const parsed = new URL(url);
    const pathMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
    const queryId = parsed.searchParams.get("id");

    return pathMatch?.[1] ?? queryId;
  } catch {
    return null;
  }
}

function getPdfPreviewUrl(sourceUrl: string) {
  const driveFileId = getGoogleDriveFileId(sourceUrl);

  if (driveFileId) {
    return `https://drive.google.com/file/d/${driveFileId}/preview`;
  }

  return sourceUrl;
}

export default function PdfViewer({ title, sourceUrl }: PdfViewerProps) {
  const previewUrl = getPdfPreviewUrl(sourceUrl);

  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[var(--ink)] flex items-center gap-1.5">
            <FileText size={13} className="text-co1" />
            Lecture PDF
          </p>
          <h2 className="text-sm font-semibold text-[var(--ink)] truncate mt-0.5">
            {title}
          </h2>
        </div>
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-co1/20 bg-co1/10 text-co1 hover:opacity-80 transition-opacity"
        >
          Open in Drive
          <ExternalLink size={13} />
        </a>
      </div>
      <div className="bg-[var(--surface-2)]">
        <iframe
          title={title}
          src={previewUrl}
          loading="lazy"
          className="block h-[70vh] min-h-[480px] w-full border-0"
        />
      </div>
    </section>
  );
}
