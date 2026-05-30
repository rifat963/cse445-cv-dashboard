import LectureBrowser from "./LectureBrowser";

export const metadata = {
  title: "Modules - CSE445",
  description: "9 course modules covering 24 lectures for CSE445 Computer Vision",
};

export default function LecturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Theory sequence</p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--ink)]">Course Modules</h1>
        <p className="text-[var(--muted)] mt-2 max-w-3xl">
          24 lectures organized into 9 thematic modules - from vision foundations through tracking and advanced topics.
        </p>
      </div>
      <LectureBrowser />
    </div>
  );
}
