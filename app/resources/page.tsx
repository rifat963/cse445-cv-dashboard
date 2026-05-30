import { textbooks, softwareTools, datasets, onlineTools } from "@/data/resources";
import { BookOpen, Database, ExternalLink, Wrench } from "lucide-react";

export const metadata = {
  title: "Resources - CSE445",
  description: "Textbooks, software tools, datasets, and online resources for CSE445 Computer Vision",
};

export default function ResourcesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Reference desk</p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--ink)]">Resources</h1>
        <p className="text-[var(--muted)] mt-2 max-w-3xl">
          Textbooks, software tools, datasets, and online platforms for CSE445 Computer Vision.
        </p>
      </div>

      <section>
        <div className="mb-4 border-b border-[var(--border)] pb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Core readings</p>
          <h2 className="text-lg font-semibold text-[var(--ink)] flex items-center gap-2">
            <BookOpen size={18} className="text-[var(--academic)]" /> Textbooks
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {textbooks.map((tb) => (
            <div key={tb.title} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col gap-2">
              <h3 className="font-semibold text-[var(--ink)] text-sm leading-snug">{tb.title}</h3>
              <p className="text-xs text-[var(--muted)]">{tb.authors}</p>
              <p className="text-xs text-[var(--muted)]">{tb.edition}</p>
              {tb.note && (
                <span className="text-xs px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--canvas)] text-[var(--academic)] w-fit">{tb.note}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 border-b border-[var(--border)] pb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Software stack</p>
          <h2 className="text-lg font-semibold text-[var(--ink)] flex items-center gap-2">
            <Wrench size={18} className="text-[var(--academic)]" /> Software & Tools
          </h2>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex flex-wrap gap-2">
            {softwareTools.map((tool) => (
              <span key={tool} className="px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--canvas)] text-sm font-mono text-[var(--ink)]">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 border-b border-[var(--border)] pb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Benchmark context</p>
          <h2 className="text-lg font-semibold text-[var(--ink)] flex items-center gap-2">
            <Database size={18} className="text-[var(--academic)]" /> Key Datasets
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {datasets.map((ds) => (
            <div key={ds.name} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
              <h3 className="font-semibold text-[var(--ink)] text-sm mb-1">{ds.name}</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{ds.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 border-b border-[var(--border)] pb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">External platforms</p>
          <h2 className="text-lg font-semibold text-[var(--ink)] flex items-center gap-2">
            <ExternalLink size={18} className="text-[var(--academic)]" /> Online Platforms
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {onlineTools.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--muted)] hover:text-[var(--academic)] hover:border-[var(--academic)] transition-colors"
            >
              <ExternalLink size={13} />
              {tool.name}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
