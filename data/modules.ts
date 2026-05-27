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
  weekRange: string;
  outcomes: string[];
  pythonTools: string[];
}

export const modules: CourseModule[] = [
  {
    id: "M01",
    moduleNo: 1,
    slug: "introduction-to-computer-vision",
    title: "Introduction to Computer Vision",
    shortTitle: "Introduction",
    co: ["CO1"],
    color: "co1",
    description:
      "Introduces the scope and motivation of computer vision, the distinction between image processing and vision, major vision tasks (classification, detection, segmentation, tracking, 3D), and the end-to-end vision system pipeline.",
    lectureNos: [1, 2],
    weekRange: "Week 1",
    outcomes: [
      "Define computer vision and distinguish it from image processing",
      "Enumerate major vision tasks and map them to real-world applications",
      "Trace data flow through a complete vision system pipeline",
    ],
    pythonTools: ["OpenCV", "NumPy", "Matplotlib"],
  },
  {
    id: "M02",
    moduleNo: 2,
    slug: "feature-detection-and-description",
    title: "Feature Detection and Description",
    shortTitle: "Features",
    co: ["CO1", "CO2"],
    color: "co1",
    description:
      "Covers the full spectrum of local feature detection and description: Harris corner detector, FAST, SIFT, SURF, and ORB. Explores what makes a good interest point and how descriptors achieve invariance to rotation, scale, and illumination.",
    lectureNos: [3, 4, 5],
    weekRange: "Weeks 2–3",
    outcomes: [
      "Derive the Harris corner response function from the structure tensor",
      "Explain SIFT scale-space detection and 128-D descriptor construction",
      "Compare Harris, FAST, SIFT, SURF, and ORB on speed and invariance",
      "Select an appropriate detector/descriptor for a given application",
    ],
    pythonTools: ["OpenCV", "NumPy", "Matplotlib"],
  },
  {
    id: "M03",
    moduleNo: 3,
    slug: "camera-models-and-projection-geometry",
    title: "Camera Models and Projection Geometry",
    shortTitle: "Camera Models",
    co: ["CO2"],
    color: "co2",
    description:
      "Builds the geometric foundation of computer vision: the pinhole camera model, intrinsic and extrinsic parameters, coordinate system transformations, homogeneous coordinates, and 2D/3D rigid-body transformations.",
    lectureNos: [6, 7, 8],
    weekRange: "Weeks 3–4",
    outcomes: [
      "Derive the perspective projection equations and camera intrinsic matrix K",
      "Assemble the full projection matrix P = K[R|t]",
      "Represent points and transformations in homogeneous coordinates",
      "Compose and invert 2D/3D rigid-body transformations",
    ],
    pythonTools: ["NumPy", "OpenCV", "Matplotlib"],
  },
  {
    id: "M04",
    moduleNo: 4,
    slug: "feature-matching-and-geometric-verification",
    title: "Feature Matching and Geometric Verification",
    shortTitle: "Matching & RANSAC",
    co: ["CO2"],
    color: "co2",
    description:
      "Covers descriptor matching strategies, distance metrics, Lowe's ratio test, robust outlier rejection with RANSAC, homography estimation, image alignment, panorama stitching, and the fundamentals of camera calibration.",
    lectureNos: [9, 10, 11],
    weekRange: "Weeks 5–6",
    outcomes: [
      "Match SIFT and ORB descriptors using L2/Hamming distance and ratio test",
      "Explain RANSAC and apply it for robust homography estimation",
      "Warp and blend images using estimated homographies for panorama stitching",
      "Outline Zhang's camera calibration procedure and interpret reprojection error",
    ],
    pythonTools: ["OpenCV", "NumPy", "Matplotlib"],
  },
  {
    id: "M05",
    moduleNo: 5,
    slug: "multiple-view-geometry",
    title: "Multiple View Geometry",
    shortTitle: "Multi-View Geometry",
    co: ["CO2"],
    color: "co2",
    description:
      "Develops the two-view geometry framework: epipolar constraints, fundamental and essential matrices, stereo rectification, disparity computation, and depth estimation from stereo and monocular cues.",
    lectureNos: [12, 14, 15],
    weekRange: "Weeks 6–7",
    outcomes: [
      "Derive the epipolar constraint and interpret fundamental matrix F",
      "Decompose essential matrix E into rotation and translation",
      "Compute dense disparity maps using block matching and SGM",
      "Convert disparity to metric depth using the stereo depth formula",
    ],
    pythonTools: ["OpenCV", "NumPy", "SciPy", "Matplotlib"],
  },
  {
    id: "M06",
    moduleNo: 6,
    slug: "motion-analysis",
    title: "Motion Analysis",
    shortTitle: "Motion",
    co: ["CO3"],
    color: "co3",
    description:
      "Analyzes pixel-level motion through the optical flow framework. Covers the brightness constancy assumption, the Lucas-Kanade sparse flow estimator, Horn-Schunck dense flow, Farneback method, and background subtraction techniques for moving object detection.",
    lectureNos: [16, 17],
    weekRange: "Weeks 8–9",
    outcomes: [
      "Derive the optical flow constraint equation from brightness constancy",
      "Apply Lucas-Kanade pyramidal sparse optical flow to track feature points",
      "Compute dense flow fields using Farneback and TV-L1 methods",
      "Segment moving objects from static backgrounds via background subtraction",
    ],
    pythonTools: ["OpenCV", "NumPy", "Matplotlib"],
  },
  {
    id: "M07",
    moduleNo: 7,
    slug: "object-detection-and-recognition",
    title: "Object Detection and Recognition",
    shortTitle: "Detection",
    co: ["CO3"],
    color: "co3",
    description:
      "Covers the classical HOG+SVM pipeline through to modern deep learning detectors. Explains sliding window search, HOG descriptors, SVM classifiers, region proposal networks (Faster R-CNN), and single-stage architectures (YOLO, SSD).",
    lectureNos: [18, 19],
    weekRange: "Weeks 9–10",
    outcomes: [
      "Compute HOG descriptors and train a linear SVM for pedestrian detection",
      "Explain the Faster R-CNN two-stage detection pipeline with RPNs",
      "Describe YOLO's unified grid-based detection approach",
      "Compare architectures on speed–accuracy trade-offs using mAP and FPS",
    ],
    pythonTools: ["OpenCV", "scikit-learn", "PyTorch", "Ultralytics"],
  },
  {
    id: "M09",
    moduleNo: 9,
    slug: "object-tracking",
    title: "Object Tracking",
    shortTitle: "Tracking",
    co: ["CO3"],
    color: "co3",
    description:
      "Covers multi-object tracking in the tracking-by-detection framework. Introduces state space modeling, Kalman filtering for prediction, IoU-based association, and modern trackers including SORT, DeepSORT, and ByteTrack.",
    lectureNos: [20, 21],
    weekRange: "Weeks 10–11",
    outcomes: [
      "Formulate object tracking as a state estimation problem using Kalman filter",
      "Implement IoU-based association and the Hungarian algorithm in SORT",
      "Explain ReID features in DeepSORT for appearance-guided association",
      "Evaluate trackers using MOTA, MOTP, IDF1, and HOTA metrics",
    ],
    pythonTools: ["OpenCV", "PyTorch", "NumPy", "py-motmetrics"],
  },
  {
    id: "M10",
    moduleNo: 10,
    slug: "advances-in-computer-vision",
    title: "Advances in Computer Vision",
    shortTitle: "Advanced Topics",
    co: ["CO3"],
    color: "advanced",
    description:
      "Surveys real-world CV application domains: autonomous driving (AV perception stack, sensor fusion), robotics (visual SLAM, grasping), surveillance analytics (re-ID, anomaly detection), and emerging frontiers (Vision Transformers, NeRF, Gaussian Splatting, SAM, CLIP).",
    lectureNos: [22, 23, 24],
    weekRange: "Weeks 11–12",
    outcomes: [
      "Identify vision tasks in autonomous driving and discuss sensor fusion strategies",
      "Outline visual SLAM concepts used in robot navigation",
      "Survey surveillance analytics challenges including person re-identification",
      "Discuss Vision Transformers, NeRF, Gaussian splatting, and other frontier topics",
    ],
    pythonTools: ["PyTorch", "OpenCV", "Open3D", "Ultralytics"],
  },
];
