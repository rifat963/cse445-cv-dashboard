import OutcomeCard from "@/components/cards/OutcomeCard";
import { courseOutcomes } from "@/data/courseOutcomes";

export default function CourseOutcomeGrid() {
  return (
    <section>
      <div className="mb-4 border-b border-[var(--border)] pb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Outcome mapping</p>
        <h2 className="text-xl font-bold text-[var(--ink)]">Course Outcomes</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courseOutcomes.map((co) => (
          <OutcomeCard key={co.id} outcome={co} />
        ))}
      </div>
    </section>
  );
}
