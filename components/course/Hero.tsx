import Link from "next/link";
import { COURSE } from "@/lib/course";
import { Award, BookOpen, CalendarDays, Library, Mail } from "lucide-react";

const courseFacts = [
  { label: "Term", value: COURSE.semester },
  { label: "Credits", value: `${COURSE.credits} (${COURSE.theoryCredits}T + ${COURSE.labCredits}L)` },
  { label: "Contact", value: COURSE.contactHours },
  { label: "Prerequisite", value: COURSE.prerequisite },
];

export default function Hero() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div>
            <div className="max-w-3xl">
              <div className="text-sm font-semibold text-[var(--academic)]">{COURSE.code}</div>
              <h1 className="mt-2 text-3xl md:text-5xl font-bold text-[var(--ink)] leading-tight">
                {COURSE.title}
              </h1>
              <p className="mt-4 text-base md:text-lg text-[var(--muted)] leading-relaxed">
                A structured course dashboard for lectures, assessment guidance, and curated resources
                in modern computer vision.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="border-l-2 border-[var(--academic)] pl-3">
                <div className="text-xs uppercase tracking-wide text-[var(--muted)]">Instructor</div>
                <div className="font-semibold text-[var(--ink)]">{COURSE.instructor}</div>
                <div className="text-[var(--muted)]">{COURSE.department}</div>
                <div className="text-[var(--muted)]">{COURSE.university}</div>
                <div className="text-[var(--muted)]">{COURSE.office}</div>
              </div>
              <div className="border-l-2 border-[var(--accent)] pl-3">
                <div className="text-xs uppercase tracking-wide text-[var(--muted)]">Academic Scope</div>
                <div className="font-semibold text-[var(--ink)]">Theory and mini project</div>
                <div className="text-[var(--muted)]">Mapped to course outcomes and assessment areas</div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              <Link href="/lectures" className="inline-flex items-center gap-2 rounded-md bg-[var(--academic)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                <BookOpen size={15} /> Lectures
              </Link>
              <Link href="/assessment" className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--surface-2)]">
                <Award size={15} /> Assessment
              </Link>
              <Link href="/resources" className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--surface-2)]">
                <Library size={15} /> Resources
              </Link>
            </div>
          </div>

          <aside className="rounded-lg border border-[var(--border)] bg-[var(--canvas)] p-5">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
              <CalendarDays size={17} className="text-[var(--academic)]" />
              <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--ink)]">Course Information</h2>
            </div>
            <dl className="divide-y divide-[var(--border)]">
              {courseFacts.map((fact) => (
                <div key={fact.label} className="grid grid-cols-[92px_1fr] gap-3 py-3 text-sm">
                  <dt className="text-[var(--muted)]">{fact.label}</dt>
                  <dd className="font-medium text-[var(--ink)]">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <a href={`mailto:${COURSE.email}`} className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[var(--academic)] hover:underline">
              <Mail size={15} /> {COURSE.email}
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
