import LectureBrowser from "./LectureBrowser";

export const metadata = {
  title: "Modules - CSE445",
  description: "6 revised course modules covering 21 content sessions for CSE445 Computer Vision",
};

export default function LecturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Theory sequence</p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--ink)]">Course Modules</h1>
        <p className="text-[var(--muted)] mt-2 max-w-3xl">
          21 content sessions organized into 6 revised modules, numbered continuously from Lecture 1 through Lecture 21.
        </p>
      </div>
      <LectureBrowser />
    </div>
  );
}
