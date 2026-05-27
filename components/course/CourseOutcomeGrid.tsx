import OutcomeCard from "@/components/cards/OutcomeCard";
import { courseOutcomes } from "@/data/courseOutcomes";

export default function CourseOutcomeGrid() {
  return (
    <section>
      <h2 className="text-xl font-bold text-[var(--ink)] mb-4">Course Outcomes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courseOutcomes.map((co) => (
          <OutcomeCard key={co.id} outcome={co} />
        ))}
      </div>
    </section>
  );
}
