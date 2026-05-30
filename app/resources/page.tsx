import { textbooks, softwareTools, datasets, onlineTools } from "@/data/resources";
import { BookOpen, Wrench, Database, ExternalLink } from "lucide-react";

export const metadata = {
  title: "Resources – CSE445",
  description: "Textbooks, software tools, datasets, and online resources for CSE445 Computer Vision",
};

export default function ResourcesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-[var(--ink)]">Resources</h1>
        <p className="text-[var(--muted)] mt-1">
          Textbooks, software tools, and datasets for CSE445 Computer Vision.
        </p>
      </div>

      {/* Textbooks */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-co2" /> Textbooks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {textbooks.map((tb) => (
            <div key={tb.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col gap-2">
              <h3 className="font-semibold text-[var(--ink)] text-sm leading-snug">{tb.title}</h3>
              <p className="text-xs text-[var(--muted)]">{tb.authors}</p>
              <p className="text-xs text-[var(--muted)]">{tb.edition}</p>
              {tb.note && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-co2/10 text-co2 w-fit">{tb.note}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Software tools */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-4 flex items-center gap-2">
          <Wrench size={18} className="text-co4" /> Software & Tools
        </h2>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex flex-wrap gap-2">
            {softwareTools.map((tool) => (
              <span key={tool} className="px-3 py-1.5 rounded-full text-sm font-mono bg-co4/10 text-co4 border border-co4/20">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Datasets */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-4 flex items-center gap-2">
          <Database size={18} className="text-co3" /> Key Datasets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {datasets.map((ds) => (
            <div key={ds.name} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <h3 className="font-semibold text-[var(--ink)] text-sm mb-1">{ds.name}</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">{ds.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Online tools */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-4 flex items-center gap-2">
          <ExternalLink size={18} className="text-co1" /> Online Platforms
        </h2>
        <div className="flex flex-wrap gap-3">
          {onlineTools.map((tool) => (
            <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] transition-colors">
              <ExternalLink size={13} />
              {tool.name}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
