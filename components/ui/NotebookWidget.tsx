import { ExternalLink, Download, FileCode } from "lucide-react";
import { getDriveDownloadUrl, getDriveFileId } from "@/lib/notebookLinks";

interface NotebookWidgetProps {
  title: string;
  kaggleUrl?: string;
  ipynbUrl?: string;
  htmlUrl?: string;
  htmlFallbackUrl?: string;
}

export default function NotebookWidget({ title, kaggleUrl, ipynbUrl, htmlUrl, htmlFallbackUrl }: NotebookWidgetProps) {
  void htmlUrl;
  void htmlFallbackUrl;

  if (!kaggleUrl && !ipynbUrl) return null;

  const ipynbFileId = ipynbUrl ? getDriveFileId(ipynbUrl) : null;
  const colabUrl = ipynbFileId ? `https://colab.research.google.com/drive/${ipynbFileId}` : null;
  const ipynbDownloadUrl = ipynbUrl ? getDriveDownloadUrl(ipynbUrl) : null;

  return (
    <section className="overflow-hidden rounded-lg border-2 border-co4/30 border-l-4 bg-co4/5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-co4/20 bg-[var(--surface)]/80 px-4 py-4">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-co4">
            <FileCode size={14} />
            Notebook Resources
          </p>
          <h2 className="mt-1 truncate text-base font-bold text-[var(--ink)]">{title}</h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[var(--muted)]">
            Start in Kaggle for the hosted workflow, use Colab for quick experiments, or download the .ipynb for local editing.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {kaggleUrl && (
            <a
              href={kaggleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-co4/30 bg-co4 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-co3/30 bg-co3 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              Open in Colab
              <ExternalLink size={12} />
            </a>
          )}
          {ipynbDownloadUrl && (
            <a
              href={ipynbDownloadUrl}
              className="inline-flex items-center gap-1.5 rounded-lg border border-co2/30 bg-co2 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              Download .ipynb
              <Download size={12} />
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-2 px-4 py-4 text-xs text-[var(--muted)] sm:grid-cols-3">
        <div className="rounded-md border border-co4/20 bg-[var(--surface)] px-3 py-2">
          <span className="font-semibold text-[var(--ink)]">Kaggle:</span> run the prepared notebook online.
        </div>
        <div className="rounded-md border border-co3/20 bg-[var(--surface)] px-3 py-2">
          <span className="font-semibold text-[var(--ink)]">Colab:</span> experiment in your own session.
        </div>
        <div className="rounded-md border border-co2/20 bg-[var(--surface)] px-3 py-2">
          <span className="font-semibold text-[var(--ink)]">IPYNB:</span> download for submission or local work.
        </div>
      </div>
    </section>
  );
}
