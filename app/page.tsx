import Hero from "@/components/course/Hero";
import QuickStats from "@/components/course/QuickStats";
import CourseOutcomeGrid from "@/components/course/CourseOutcomeGrid";
import AssessmentPanel from "@/components/course/AssessmentPanel";
import TextbookAndTools from "@/components/course/TextbookAndTools";
import LectureBrowser from "./lectures/LectureBrowser";
import LabPreview from "./lab-manual/LabPreview";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
        <QuickStats />
        <CourseOutcomeGrid />
        <LectureBrowser preview />
        <LabPreview />
        <AssessmentPanel />
        <TextbookAndTools />
      </div>
    </div>
  );
}
