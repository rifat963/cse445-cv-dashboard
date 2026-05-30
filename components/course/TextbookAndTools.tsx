import { textbooks, softwareTools } from "@/data/resources";
import { BookOpen, Wrench } from "lucide-react";

export default function TextbookAndTools() {
  return (
    <section>
      <div className="mb-4 border-b border-[var(--border)] pb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Reference desk</p>
        <h2 className="text-xl font-bold text-[var(--ink)]">Teaching Materials & Tools</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
            <BookOpen size={16} className="text-[var(--academic)]" /> Textbooks
          </h3>
          <ul className="space-y-3">
            {textbooks.map((tb) => (
              <li key={tb.title} className="flex flex-col gap-0.5 border-b border-[var(--border)] pb-3 last:border-b-0 last:pb-0">
                <span className="text-sm font-medium text-[var(--ink)]">{tb.title}</span>
                <span className="text-xs text-[var(--muted)]">{tb.authors} / {tb.edition}</span>
                {tb.note && (
                  <span className="text-xs px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--canvas)] text-[var(--academic)] w-fit">{tb.note}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
            <Wrench size={16} className="text-[var(--academic)]" /> Software & Tools
          </h3>
          <div className="flex flex-wrap gap-2">
            {softwareTools.map((tool) => (
              <span key={tool} className="px-3 py-1 rounded border border-[var(--border)] bg-[var(--canvas)] text-xs font-mono text-[var(--ink)]">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
