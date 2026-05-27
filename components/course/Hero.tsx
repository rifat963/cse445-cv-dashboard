import Link from "next/link";
import { COURSE } from "@/lib/course";
import { BookOpen, FlaskConical, Eye, Award } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--surface)]">
      {/* Decorative SVG background — camera grid + feature points motif */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <rect width="32" height="32" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {/* Optical flow arrows motif */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={`${55 + i * 8}%`} y1="40%"
            x2={`${58 + i * 8}%`} y2="30%"
            stroke="currentColor" strokeWidth="1.5"
          />
        ))}
        {/* Feature point circles */}
        {[60, 65, 70, 75, 68, 72].map((cx, i) => (
          <circle key={i} cx={`${cx}%`} cy={`${35 + (i % 3) * 8}%`} r="3" fill="currentColor" opacity="0.6" />
        ))}
        {/* Epipolar line */}
        <path d="M 55% 60% Q 70% 50% 85% 65%" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col gap-2 mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-co2/10 text-co2 w-fit">
            {COURSE.code} &middot; {COURSE.semester}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--ink)] max-w-2xl leading-tight">
          {COURSE.title}
        </h1>
        <p className="mt-3 text-[var(--muted)] max-w-xl">
          {COURSE.credits} Credits ({COURSE.theoryCredits}T + {COURSE.labCredits}L) &middot; {COURSE.contactHours}
        </p>
        <div className="mt-2 text-sm text-[var(--muted)]">
          <span className="font-medium text-[var(--ink)]">{COURSE.instructor}</span>
          {" "}&middot; {COURSE.designation}
        </div>
        <div className="text-xs text-[var(--muted)] mt-1">{COURSE.department}, {COURSE.university}</div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/lectures" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-co2 text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <BookOpen size={15} /> Browse Lectures
          </Link>
          <Link href="/lab-manual" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-co4/10 text-co4 text-sm font-medium hover:opacity-80 transition-opacity border border-co4/20">
            <FlaskConical size={15} /> Lab Manual
          </Link>
          <Link href="/assessment" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-co3/10 text-co3 text-sm font-medium hover:opacity-80 transition-opacity border border-co3/20">
            <Award size={15} /> Assessment
          </Link>
          <Link href="/resources" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-2)] text-[var(--muted)] text-sm font-medium hover:text-[var(--ink)] transition-colors border border-[var(--border)]">
            <Eye size={15} /> Resources
          </Link>
        </div>
      </div>
    </section>
  );
}
