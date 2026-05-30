import Hero from "@/components/course/Hero";
import CourseOutcomeGrid from "@/components/course/CourseOutcomeGrid";
import AssessmentPanel from "@/components/course/AssessmentPanel";
import TextbookAndTools from "@/components/course/TextbookAndTools";
import LectureBrowser from "./lectures/LectureBrowser";
import LabPreview from "./lab-manual/LabPreview";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        <LectureBrowser preview />
        <LabPreview />
        <CourseOutcomeGrid />
        <AssessmentPanel />
        <TextbookAndTools />
      </div>
    </div>
  );
}
