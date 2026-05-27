import LectureBrowser from "./LectureBrowser";

export const metadata = {
  title: "Modules – CSE445",
  description: "9 course modules covering 24 lectures for CSE445 Computer Vision",
};

export default function LecturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--ink)]">Course Modules</h1>
        <p className="text-[var(--muted)] mt-1">
          24 lectures organized into 9 thematic modules — from vision foundations through tracking and advanced topics.
        </p>
      </div>
      <LectureBrowser />
    </div>
  );
}
