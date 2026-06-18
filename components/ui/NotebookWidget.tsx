import { ExternalLink, Download, FileCode, BookOpen } from "lucide-react";
import { getDriveDownloadUrl, getDriveFileId, getDriveHtmlViewerPath } from "@/lib/notebookLinks";
import HtmlNotebookViewer from "@/components/ui/HtmlNotebookViewer";

interface NotebookWidgetProps {
  title: string;
  kaggleUrl?: string;
  ipynbUrl?: string;
  htmlUrl?: string;
  htmlFallbackUrl?: string;
}

export default function NotebookWidget({ title, kaggleUrl, ipynbUrl, htmlUrl, htmlFallbackUrl }: NotebookWidgetProps) {
  if (!kaggleUrl && !ipynbUrl && !htmlUrl) return null;

  const ipynbFileId = ipynbUrl ? getDriveFileId(ipynbUrl) : null;
  const colabUrl = ipynbFileId ? `https://colab.research.google.com/drive/${ipynbFileId}` : null;
  const ipynbDownloadUrl = ipynbUrl ? getDriveDownloadUrl(ipynbUrl) : null;
  const htmlPreviewUrl = htmlUrl ? getDriveHtmlViewerPath(htmlUrl, htmlFallbackUrl) : null;

  return (
    <section className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-[var(--ink)]">
            <FileCode size={13} className="text-co4" />
            Jupyter Notebook
          </p>
          <h2 className="mt-0.5 truncate text-sm font-semibold text-[var(--ink)]">{title}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {kaggleUrl && (
            <a
              href={kaggleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-co4/20 bg-co4/10 px-3 py-1.5 text-xs font-medium text-co4 transition-opacity hover:opacity-80"
            >
              Open in Kaggle
              <ExternalLink size={12} />
            </a>
          )}
          {colabUrl && (
            <a
              href={colabUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-co3/20 bg-co3/10 px-3 py-1.5 text-xs font-medium text-co3 transition-opacity hover:opacity-80"
            >
              Open in Colab
              <ExternalLink size={12} />
            </a>
          )}
          {ipynbDownloadUrl && (
            <a
              href={ipynbDownloadUrl}
              className="inline-flex items-center gap-1.5 rounded-lg border border-co2/20 bg-co2/10 px-3 py-1.5 text-xs font-medium text-co2 transition-opacity hover:opacity-80"
            >
              Download .ipynb
              <Download size={12} />
            </a>
          )}
          {htmlPreviewUrl && (
            <a
              href={htmlPreviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
            >
              View HTML
              <BookOpen size={12} />
            </a>
          )}
        </div>
      </div>

      {htmlPreviewUrl ? (
        <div className="bg-[var(--surface-2)] p-4">
          <HtmlNotebookViewer title={title} previewUrl={htmlPreviewUrl} sourceUrl={htmlUrl} />
        </div>
      ) : (
        <div className="px-4 py-4 text-xs text-[var(--muted)]">
          Use the buttons above to open or download this notebook.
        </div>
      )}
    </section>
  );
}
