import { COURSE } from "@/lib/course";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[var(--muted)]">
        <div>
          <div className="font-semibold text-[var(--ink)] mb-1">{COURSE.code}: {COURSE.title}</div>
          <div>{COURSE.semester} &middot; {COURSE.credits} Credits</div>
          <div>{COURSE.contactHours}</div>
          <div className="mt-1 text-xs">Prerequisite: {COURSE.prerequisite}</div>
        </div>
        <div>
          <div className="font-semibold text-[var(--ink)] mb-1">Instructor</div>
          <div>{COURSE.instructor}</div>
          <div>{COURSE.designation}</div>
          <div>{COURSE.office}</div>
          <a href={`mailto:${COURSE.email}`} className="hover:text-[var(--ink)] transition-colors">
            {COURSE.email}
          </a>
        </div>
        <div>
          <div className="font-semibold text-[var(--ink)] mb-1">{COURSE.department}</div>
          <div>{COURSE.university}</div>
          <div className="mt-2 text-xs">
            Developed by{" "}
            <span className="font-medium text-[var(--ink)]">{COURSE.instructor}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
