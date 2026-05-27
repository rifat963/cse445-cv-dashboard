import { textbooks, softwareTools } from "@/data/resources";
import { BookOpen, Wrench } from "lucide-react";

export default function TextbookAndTools() {
  return (
    <section>
      <h2 className="text-xl font-bold text-[var(--ink)] mb-4">Teaching Materials & Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Textbooks */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
            <BookOpen size={16} className="text-co2" /> Textbooks
          </h3>
          <ul className="space-y-3">
            {textbooks.map((tb) => (
              <li key={tb.title} className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-[var(--ink)]">{tb.title}</span>
                <span className="text-xs text-[var(--muted)]">{tb.authors} · {tb.edition}</span>
                {tb.note && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-co2/10 text-co2 w-fit">{tb.note}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Software tools */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
            <Wrench size={16} className="text-co4" /> Software & Tools
          </h3>
          <div className="flex flex-wrap gap-2">
            {softwareTools.map((tool) => (
              <span key={tool} className="px-3 py-1 rounded-full text-xs font-mono bg-co4/10 text-co4 border border-co4/20">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
