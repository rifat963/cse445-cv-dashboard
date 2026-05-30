import Link from "next/link";
import { labs, labModules } from "@/data/labs";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

const moduleColors = [
  { badge: "bg-co1/10 text-co1 border-co1/20" },
  { badge: "bg-co2/10 text-co2 border-co2/20" },
  { badge: "bg-co4/10 text-co4 border-co4/20" },
];

export default function LabPreview() {
  const previewLabs = labs.slice(0, 4);

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4 border-b border-[var(--border)] pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Practical sequence</p>
          <h2 className="text-xl font-bold text-[var(--ink)]">Lab Manual</h2>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            {labs.length} experiments / {labModules.length} modules
          </p>
        </div>
        <Link href="/lab-manual" className="text-sm font-semibold text-[var(--academic)] hover:underline shrink-0">
          View all labs
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {previewLabs.map((lab) => {
          const modIdx = labModules.findIndex((m) => m.id === lab.labModuleId);
          const colors = moduleColors[modIdx % moduleColors.length];
          return (
            <Link
              key={lab.id}
              href={`/lab-manual/${lab.slug}`}
              className="group rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors hover:border-[var(--academic)]"
            >
              <div className="flex items-start gap-3">
                <div className={cn("shrink-0 w-9 h-9 rounded-md flex items-center justify-center border", colors.badge)}>
                  <FlaskConical size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wide text-[var(--muted)] mb-0.5">
                    Week {lab.week}
                  </div>
                  <p className="text-xs font-semibold text-[var(--ink)] group-hover:text-[var(--academic)] transition-colors leading-snug line-clamp-2">
                    {lab.title}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
