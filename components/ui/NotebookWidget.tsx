import { ExternalLink, Download, FileCode } from "lucide-react";

interface NotebookWidgetProps {
  title: string;
  kaggleUrl?: string;
  ipynbUrl?: string;
  htmlUrl?: string;
}

export default function NotebookWidget({ title, kaggleUrl, ipynbUrl, htmlUrl }: NotebookWidgetProps) {
  if (!kaggleUrl && !ipynbUrl && !htmlUrl) return null;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-2 mb-2">
        <FileCode size={16} className="text-co4" />
        <h2 className="font-semibold text-[var(--ink)] text-sm">Jupyter Notebook</h2>
      </div>
      <p className="text-xs text-[var(--muted)] mb-3 leading-relaxed">{title}</p>
      <div className="flex gap-2 flex-wrap">
        {kaggleUrl && (
          <a
            href={kaggleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-co4/10 text-co4 border border-co4/20 hover:opacity-80 transition-opacity"
          >
            <ExternalLink size={12} /> Open in Kaggle
          </a>
        )}
        {ipynbUrl && (
          <a
            href={ipynbUrl}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-co2/10 text-co2 border border-co2/20 hover:opacity-80 transition-opacity"
          >
            <Download size={12} /> Download .ipynb
          </a>
        )}
        {htmlUrl && (
          <a
            href={htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--surface-2)] text-[var(--muted)] border border-[var(--border)] hover:text-[var(--ink)] transition-colors"
          >
            <ExternalLink size={12} /> View HTML
          </a>
        )}
      </div>
    </div>
  );
}
