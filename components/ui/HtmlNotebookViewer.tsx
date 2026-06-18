import { AlertCircle, ExternalLink } from "lucide-react";

interface HtmlNotebookViewerProps {
  title: string;
  previewUrl?: string | null;
  sourceUrl?: string | null;
}

export default function HtmlNotebookViewer({ title, previewUrl, sourceUrl }: HtmlNotebookViewerProps) {
  if (!previewUrl) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-2)] px-4 py-5 text-sm text-[var(--muted)]">
        <div className="flex items-start gap-2.5">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-medium text-[var(--ink)]">HTML preview is not available yet.</p>
            <p className="mt-1 text-xs leading-relaxed">
              The notebook can still be opened from Kaggle, Colab, or downloaded as an .ipynb when those links are provided.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-2)]">
      <iframe
        title={`${title} notebook preview`}
        src={previewUrl}
        loading="lazy"
        className="block h-[70vh] min-h-[480px] w-full border-0"
      />
      {sourceUrl && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs text-[var(--muted)]">
          <span>If the embedded preview cannot load, open the HTML file directly.</span>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-[var(--academic)] hover:opacity-80"
          >
            Open HTML
            <ExternalLink size={12} />
          </a>
        </div>
      )}
    </div>
  );
}
