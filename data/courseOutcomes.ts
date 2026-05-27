export interface CourseOutcome {
  id: string;
  title: string;
  description: string;
  po: string;
  domains: string[];
  knowledgeProfile: string;
  color: string;
}

export const courseOutcomes: CourseOutcome[] = [
  {
    id: "CO1",
    title: "Vision Foundations & Pipeline",
    description:
      "Explain and analyze the fundamental concepts of computer vision, including the vision pipeline, image formation, representation, and basic visual structure, and relate these to real-world applications.",
    po: "PO1",
    domains: ["C2", "C3"],
    knowledgeProfile: "K3",
    color: "co1",
  },
  {
    id: "CO2",
    title: "Feature Detection & Geometry",
    description:
      "Apply and analyze classical feature-based and geometry-based techniques—feature detection and description, robust estimation, homography, and camera geometry—to establish correspondences and spatial relationships.",
    po: "PO2",
    domains: ["C4", "C5"],
    knowledgeProfile: "K4",
    color: "co2",
  },
  {
    id: "CO3",
    title: "Motion, 3D Vision & Recognition",
    description:
      "Interpret and evaluate motion analysis, 3D vision, classical object recognition, and learning-based pipelines to understand dynamic scenes and object-level perception in images and videos.",
    po: "PO4",
    domains: ["C4", "C5"],
    knowledgeProfile: "K5",
    color: "co3",
  },
  {
    id: "CO4",
    title: "Vision Systems Design & Lab",
    description:
      "Use computer vision concepts and tools to design, implement, and document complete vision systems for real-world applications through hands-on lab experiments.",
    po: "PO6",
    domains: ["C6", "P2", "P3"],
    knowledgeProfile: "K6",
    color: "co4",
  },
];
