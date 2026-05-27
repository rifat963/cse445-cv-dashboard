import MetricCard from "@/components/cards/MetricCard";
import { COURSE } from "@/lib/course";
import { BookOpen, FlaskConical, Target, Award } from "lucide-react";

export default function QuickStats() {
  const stats = [
    {
      title: "Lectures",
      value: COURSE.totalLectures,
      sub: "Theory topics covered",
      icon: <BookOpen size={20} />,
      color: "co2",
    },
    {
      title: "Lab Experiments",
      value: COURSE.totalLabWeeks,
      sub: "Hands-on lab sessions",
      icon: <FlaskConical size={20} />,
      color: "co4",
    },
    {
      title: "Course Outcomes",
      value: COURSE.totalCOs,
      sub: "Learning objectives",
      icon: <Target size={20} />,
      color: "co1",
    },
    {
      title: "Total Marks",
      value: COURSE.totalMarks,
      sub: "Theory + Lab + Project",
      icon: <Award size={20} />,
      color: "co3",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <MetricCard key={s.title} {...s} />
      ))}
    </div>
  );
}
