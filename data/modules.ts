export interface CourseModule {
  id: string;
  moduleNo: number;
  slug: string;
  title: string;
  shortTitle: string;
  co: string[];
  color: "co1" | "co2" | "co3" | "co4" | "advanced";
  description: string;
  lectureNos: number[];
  outcomes: string[];
  pythonTools: string[];
}

export const modules: CourseModule[] = [
  {
    id: "M01",
    moduleNo: 1,
    slug: "introduction-to-computer-vision-and-vision-pipeline",
    title: "Introduction to Computer Vision and Vision Pipeline",
    shortTitle: "Introduction",
    co: ["CO1"],
    color: "co1",
    description:
      "Introduces the definition and scope of computer vision, the distinction between image processing and CV, major vision tasks, application domains, and the end-to-end vision system pipeline.",
    lectureNos: [1, 2],
    outcomes: [
      "Define computer vision and distinguish it from image processing",
      "Identify major vision tasks and application domains",
      "Trace the stages of an end-to-end vision pipeline",
    ],
    pythonTools: ["OpenCV", "NumPy", "Matplotlib"],
  },
  {
    id: "M02",
    moduleNo: 2,
    slug: "local-feature-descriptors-and-feature-matching-module",
    title: "Local Feature Descriptors and Feature Matching",
    shortTitle: "Features",
    co: ["CO1", "CO2"],
    color: "co1",
    description:
      "Covers corner and interest point detection through Harris, followed by SIFT, HOG, descriptor-space similarity, nearest-neighbor matching, NNDR, geometric verification, SURF, and Shape Context.",
    lectureNos: [3, 4],
    outcomes: [
      "Explain Harris corner detection from local intensity change and the structure tensor",
      "Describe SIFT scale-space keypoint detection and descriptor construction",
      "Explain HOG gradient histograms and block normalization",
      "Apply descriptor matching with L2 distance, cosine similarity, and NNDR",
    ],
    pythonTools: ["OpenCV", "NumPy", "Matplotlib", "scikit-image"],
  },
  {
    id: "M03",
    moduleNo: 3,
    slug: "geometry-for-computer-vision",
    title: "Geometry Foundations and Camera Calibration",
    shortTitle: "Geometry Foundations",
    co: ["CO2"],
    color: "co2",
    description:
      "Builds the foundational geometry sequence: 2D/3D transformations, homogeneous coordinates, coordinate frames, pinhole projection, intrinsic/extrinsic parameters, and camera calibration.",
    lectureNos: [5, 6, 7, 8],
    outcomes: [
      "Represent 2D/3D transformations and coordinate frames mathematically",
      "Explain pinhole projection, calibration, and lens distortion",
      "Assemble and interpret the full camera projection matrix",
      "Evaluate camera calibration quality using reprojection error",
    ],
    pythonTools: ["OpenCV", "NumPy", "Matplotlib"],
  },
  {
    id: "M04",
    moduleNo: 4,
    slug: "geometric-verification-depth-and-motion-analysis",
    title: "Geometric Verification, Depth and Motion Analysis",
    shortTitle: "Depth & Motion",
    co: ["CO2", "CO3"],
    color: "co2",
    description:
      "Continues geometry with homography, RANSAC, epipolar geometry, stereo, triangulation, depth estimation, introductory SfM, and then connects these ideas to optical flow and motion analysis in video.",
    lectureNos: [9, 10, 11, 12, 13, 14],
    outcomes: [
      "Estimate homographies and verify geometry using RANSAC",
      "Apply epipolar geometry, stereo, triangulation, and depth concepts",
      "Outline dense depth and introductory structure-from-motion workflows",
      "Use optical flow and motion cues for video interpretation",
    ],
    pythonTools: ["OpenCV", "NumPy", "Open3D", "Matplotlib"],
  },
  {
    id: "M05",
    moduleNo: 5,
    slug: "object-recognition-detection-and-tracking",
    title: "Object Recognition, Detection and Tracking",
    shortTitle: "Detection & Tracking",
    co: ["CO3"],
    color: "co3",
    description:
      "Covers classical HOG + SVM detection, learning-based vision foundations, Faster R-CNN, YOLO, SSD, and video-level object tracking with SORT, DeepSORT, ByteTrack, and MOT metrics.",
    lectureNos: [15, 16, 17, 18],
    outcomes: [
      "Explain classical and learning-based object detection pipelines",
      "Compare two-stage and one-stage detector architectures",
      "Evaluate detection models with mAP, IoU, FPS, precision, and recall",
      "Explain tracking-by-detection, Kalman filtering, assignment, and MOT metrics",
    ],
    pythonTools: ["OpenCV", "scikit-learn", "PyTorch", "Ultralytics"],
  },
  {
    id: "M06",
    moduleNo: 6,
    slug: "application-oriented-computer-vision-systems",
    title: "Application-Oriented Computer Vision Systems",
    shortTitle: "Applications",
    co: ["CO3", "CO4"],
    color: "advanced",
    description:
      "Surveys application-driven vision systems in agriculture, medical imaging, robotics perception, traffic and surveillance, autonomous driving, responsible deployment, emerging topics, and course-level project integration.",
    lectureNos: [19, 20, 21],
    outcomes: [
      "Identify system requirements across applied CV domains",
      "Discuss deployment and evaluation concerns in real-world settings",
      "Survey emerging research directions and foundation-model trends",
      "Synthesize course concepts through project presentations and review",
    ],
    pythonTools: ["OpenCV", "PyTorch", "Ultralytics", "NumPy", "Hugging Face Transformers"],
  },
];
