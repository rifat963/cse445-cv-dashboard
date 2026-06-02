export interface LabExperiment {
  id: string;
  labNo: number;
  week: number;
  slug: string;
  title: string;
  objective: string;
  co: string[];
  linkedLectures: number[];
  software: string[];
  learningObjectives: string[];
  tasks: string[];
  expectedOutputs: string[];
  vivaQuestions: Array<{ q: string; a: string }>;
  labModuleId: string;
}

export interface LabModule {
  id: string;
  moduleNo: number;
  slug: string;
  title: string;
  description: string;
  level: "Core" | "Intermediate" | "Advanced";
  co: string[];
  labIds: string[];
}

export const labModules: LabModule[] = [
  {
    id: "LABM01",
    moduleNo: 1,
    slug: "image-foundations-and-features",
    title: "Image Foundations & Feature Detection",
    description:
      "Set up the Python/OpenCV environment, explore image data structures and basic operations, then implement and compare Harris, FAST, SIFT, and ORB feature detectors.",
    level: "Core",
    co: ["CO1", "CO2", "CO4"],
    labIds: ["LAB01", "LAB02", "LAB03"],
  },
  {
    id: "LABM02",
    moduleNo: 2,
    slug: "geometry-calibration-and-panorama",
    title: "Geometry, Calibration & Panorama",
    description:
      "Apply feature matching, RANSAC-based homography estimation, panorama stitching, camera calibration, stereo vision, and depth map computation.",
    level: "Intermediate",
    co: ["CO2", "CO4"],
    labIds: ["LAB04", "LAB05", "LAB06"],
  },
  {
    id: "LABM03",
    moduleNo: 3,
    slug: "motion-detection-and-tracking",
    title: "Motion Analysis, Detection & Tracking",
    description:
      "Estimate optical flow, build an HOG+SVM pedestrian detector, deploy YOLOv8 for object recognition, and implement multi-object tracking with SORT.",
    level: "Advanced",
    co: ["CO3", "CO4"],
    labIds: ["LAB07", "LAB08", "LAB09", "LAB10"],
  },
];

export const labs: LabExperiment[] = [
  {
    id: "LAB01",
    labNo: 1,
    week: 1,
    labModuleId: "LABM01",
    slug: "image-representation-and-basic-operations",
    title: "Image Representation and Basic Operations",
    objective:
      "Familiarize students with image data structures, color spaces, and fundamental image manipulation using OpenCV and Python.",
    co: ["CO4"],
    linkedLectures: [1, 2],
    software: ["Python", "NumPy", "OpenCV", "Matplotlib"],
    learningObjectives: [
      "Load, display, and save images using OpenCV and Matplotlib",
      "Understand BGR/RGB image array representation with NumPy",
      "Convert between color spaces: BGR, RGB, HSV, Grayscale",
      "Apply pixel-wise brightness, contrast, and gamma corrections",
      "Compute and equalize histograms for contrast enhancement",
    ],
    tasks: [
      "Load a color image and print shape, dtype, and pixel statistics",
      "Convert between BGR → RGB, BGR → HSV, BGR → Grayscale",
      "Apply brightness scaling, contrast adjustment, and gamma correction",
      "Implement image cropping, resizing, and rotation using affine transforms",
      "Compute and plot histogram; apply histogram equalization",
      "Add Gaussian and salt-and-pepper noise; apply denoising filters (Gaussian, median, bilateral)",
    ],
    expectedOutputs: [
      "Side-by-side color space conversion images with annotations",
      "Gamma-corrected images at γ = 0.5, 1.0, 2.0",
      "Histogram before/after equalization plots",
      "Noisy image vs. three denoised versions comparison",
      "Lab report with code, output images, and brief analysis",
    ],
    vivaQuestions: [
      {
        q: "Why does OpenCV read images in BGR order instead of RGB?",
        a: "Historical convention from early OpenCV development using Windows BITMAPINFOHEADER, which stored pixels in BGR order. It has persisted for backward compatibility. Always convert with cv2.cvtColor(img, cv2.COLOR_BGR2RGB) before display with Matplotlib.",
      },
      {
        q: "What is histogram equalization and when is it useful?",
        a: "Histogram equalization redistributes pixel intensity values so the output histogram is approximately uniform, which stretches the dynamic range and improves perceived contrast. It is most useful for images that are globally dark or globally bright but suffers in multi-modal images where it can over-enhance one region.",
      },
      {
        q: "What is the difference between additive Gaussian noise and salt-and-pepper noise?",
        a: "Gaussian noise adds normally distributed random values to every pixel, giving a 'graininess' effect; a Gaussian filter is effective at removing it. Salt-and-pepper noise replaces random pixels with extreme values (0 or 255); a median filter is more appropriate because it is non-linear and preserves edges while removing impulse noise.",
      },
    ],
  },
  {
    id: "LAB02",
    labNo: 2,
    week: 2,
    labModuleId: "LABM01",
    slug: "feature-detection-harris-and-fast",
    title: "Feature Detection: Harris and FAST",
    objective:
      "Implement and evaluate Harris corner detector and FAST, understanding their strengths and computational trade-offs.",
    co: ["CO2", "CO4"],
    linkedLectures: [3],
    software: ["Python", "NumPy", "OpenCV", "Matplotlib"],
    learningObjectives: [
      "Implement Harris corner detection from scratch using the structure tensor",
      "Apply non-maximum suppression to thin detected corners",
      "Use OpenCV's cv2.cornerHarris() and compare with manual implementation",
      "Apply FAST detector and evaluate its speed advantage",
      "Analyze repeatability under geometric transformations",
    ],
    tasks: [
      "Implement Harris corner detection from scratch (structure tensor, Gaussian smoothing, R score)",
      "Apply NMS to thin detected corners and visualize on test images",
      "Use OpenCV cv2.cornerHarris() and compare with manual implementation",
      "Apply cv2.FastFeatureDetector_create() with varying threshold values",
      "Evaluate repeatability by rotating the image (15°, 30°, 45°) and counting matched corners",
      "Generate side-by-side visualizations comparing Harris vs FAST detections",
    ],
    expectedOutputs: [
      "Harris response map and detected corners visualization",
      "Manual vs OpenCV Harris comparison images",
      "FAST detection at different threshold levels",
      "Repeatability vs rotation angle plot for both detectors",
      "Comparative analysis table: speed, repeatability, detection count",
    ],
    vivaQuestions: [
      {
        q: "How does the Harris detector distinguish corners from edges?",
        a: "The Harris detector uses the eigenvalues λ1, λ2 of the structure tensor (second moment matrix). A corner has two large eigenvalues (both λ1 and λ2 large), an edge has one large and one small eigenvalue, and a flat region has both eigenvalues near zero. The Harris response R = det(M) - k·trace(M)² is large positive for corners, large negative for edges, and near zero for flat areas.",
      },
      {
        q: "What is the advantage of FAST over Harris for real-time applications?",
        a: "FAST (Features from Accelerated Segment Test) uses a circular pixel test and can be implemented without any floating-point operations or gradients. It is significantly faster than Harris (by 10–100×) because it uses only integer comparisons on a 16-pixel Bresenham circle. The trade-off is less geometric accuracy and no built-in scale invariance.",
      },
      {
        q: "Why is non-maximum suppression necessary after computing the Harris response?",
        a: "The Harris response function produces large values over an extended region around each corner, not just at a single pixel. Without NMS, multiple adjacent pixels would all be reported as corners. NMS keeps only the local maximum within a neighborhood window, ensuring each physical corner is represented by exactly one detection point.",
      },
    ],
  },
  {
    id: "LAB03",
    labNo: 3,
    week: 3,
    labModuleId: "LABM01",
    slug: "sift-orb-feature-extraction-matching",
    title: "SIFT and ORB Feature Extraction and Matching",
    objective:
      "Extract SIFT and ORB features from image pairs and perform descriptor matching with quality filtering.",
    co: ["CO2", "CO4"],
    linkedLectures: [4, 5],
    software: ["Python", "NumPy", "OpenCV", "Matplotlib"],
    learningObjectives: [
      "Extract SIFT keypoints and 128-D descriptors from image pairs",
      "Apply BFMatcher with L2 norm and Lowe's ratio test",
      "Extract ORB binary descriptors and match with Hamming distance",
      "Quantify and compare SIFT vs ORB on speed and match quality",
    ],
    tasks: [
      "Extract SIFT keypoints and 128-D descriptors from two views of the same scene",
      "Perform BFMatcher matching with L2 norm; apply Lowe's ratio test (threshold 0.75)",
      "Extract ORB keypoints and 256-bit binary descriptors; match with Hamming distance",
      "Visualize top-50 matches for both SIFT and ORB",
      "Quantify: number of keypoints, matched pairs, and inlier rate after ratio test",
      "Compare SIFT vs ORB on speed (time it) and match quality for illumination-changed pairs",
    ],
    expectedOutputs: [
      "SIFT and ORB keypoint visualizations on both input images",
      "Top-50 match visualizations for SIFT and ORB",
      "Speed comparison table (ms per image)",
      "Match quality comparison: number of matches, inlier percentage",
      "Analysis of performance under illumination change",
    ],
    vivaQuestions: [
      {
        q: "Why does SIFT use a 128-dimensional descriptor while ORB uses only 256 bits?",
        a: "SIFT uses a gradient orientation histogram over 4×4 cells with 8 orientation bins, giving 4×4×8 = 128 float values, which provides rich discriminative power. ORB uses rBRIEF: 256 steered binary tests between pixel pairs, storing results as a binary string. The binary descriptor is approximately 8× smaller in memory and can be matched with Hamming distance (a single XOR + popcount), making it far faster while maintaining competitive matching performance.",
      },
      {
        q: "What is Lowe's ratio test and why does it improve matching quality?",
        a: "For each query descriptor, Lowe's ratio test finds the two nearest neighbors (distances d1 and d2). A match is accepted only if d1/d2 < 0.75, meaning the closest match is significantly better than the second-closest. If two descriptors are similar to the query, the match is ambiguous and likely a false positive. The ratio test eliminates these ambiguous matches, dramatically reducing the false-positive rate at the cost of a slightly lower true-positive rate.",
      },
      {
        q: "When should you prefer ORB over SIFT for a practical application?",
        a: "Prefer ORB when real-time performance is required (e.g., mobile AR, drone navigation), when memory is constrained, or when the application can tolerate somewhat lower matching accuracy. SIFT is preferred for applications requiring high matching accuracy with significant scale or illumination changes (e.g., image retrieval, 3D reconstruction from diverse viewpoints). Note that SIFT is patented (though freed in 2020), while ORB is open-source from its inception.",
      },
    ],
  },
  {
    id: "LAB04",
    labNo: 4,
    week: 4,
    labModuleId: "LABM02",
    slug: "camera-calibration-zhang-method",
    title: "Camera Calibration with Zhang's Method",
    objective:
      "Calibrate a camera using checkerboard images to recover intrinsic parameters and distortion coefficients.",
    co: ["CO2", "CO4"],
    linkedLectures: [6, 7, 11],
    software: ["Python", "NumPy", "OpenCV", "Matplotlib"],
    learningObjectives: [
      "Detect checkerboard corners and refine to sub-pixel accuracy",
      "Accumulate 3D object and 2D image point correspondences across multiple views",
      "Run cv2.calibrateCamera() to recover K and distortion coefficients",
      "Undistort images and evaluate reprojection error",
    ],
    tasks: [
      "Load 15 checkerboard images (9×6 inner corners) from the provided dataset",
      "Detect corners with cv2.findChessboardCorners(); refine with cv2.cornerSubPix()",
      "Accumulate object points (3D) and image points (2D) across all images",
      "Run cv2.calibrateCamera() to recover K and distortion coefficients",
      "Undistort one test image using cv2.undistort() and compare with original",
      "Report mean reprojection error and discuss which images had the highest error",
    ],
    expectedOutputs: [
      "Checkerboard corner detection visualizations for 5 sample images",
      "Calibration results: K matrix, distortion coefficients (k1, k2, p1, p2, k3)",
      "Original vs. undistorted image comparison",
      "Per-image reprojection error bar chart",
      "Calibration report with analysis of error sources",
    ],
    vivaQuestions: [
      {
        q: "Why do we need multiple views of the calibration pattern for Zhang's method?",
        a: "A single planar checkerboard view provides constraints from only one plane, which leaves the calibration matrix K under-constrained (requires at least 3 parameters to be solved). With multiple views at different orientations and distances, each view provides 2n point correspondences (n = number of corners), and the variation in viewpoint provides independent constraints. Zhang's method requires at least 3 non-coplanar views to uniquely solve for all 5 intrinsic parameters.",
      },
      {
        q: "What is reprojection error and what value indicates a good calibration?",
        a: "Reprojection error is the RMS pixel distance between the detected 2D checkerboard corners and the 3D corners projected back to the image plane using the calibrated camera parameters. A mean reprojection error below 1.0 pixel is generally considered a good calibration for most applications; below 0.5 pixels is excellent. Higher errors indicate poor corner detection, out-of-focus images, or calibration pattern manufacturing defects.",
      },
      {
        q: "What is radial distortion and how does OpenCV model it?",
        a: "Radial distortion causes straight lines to appear curved, either bowing outward (barrel distortion, k1 < 0) or inward (pincushion distortion, k1 > 0). OpenCV models it as r_distorted = r(1 + k1·r² + k2·r⁴ + k3·r⁶) where r is the radial distance from the principal point. The parameters k1, k2, k3 are estimated during calibration. Wide-angle and fisheye lenses typically have large k1 values.",
      },
    ],
  },
  {
    id: "LAB05",
    labNo: 5,
    week: 5,
    labModuleId: "LABM02",
    slug: "homography-panorama-stitching",
    title: "Homography and Panorama Stitching",
    objective:
      "Estimate homography using RANSAC and build a panoramic image by warping and blending two or more views.",
    co: ["CO2", "CO4"],
    linkedLectures: [9, 10, 11],
    software: ["Python", "NumPy", "OpenCV", "Matplotlib"],
    learningObjectives: [
      "Extract and match ORB features between overlapping image pairs",
      "Estimate homography H robustly using RANSAC",
      "Warp one image to the other's plane using perspective transform",
      "Blend warped images with alpha blending in the overlap region",
    ],
    tasks: [
      "Load two overlapping images (>30% overlap)",
      "Extract ORB features and match with BFMatcher + ratio test",
      "Estimate homography H using cv2.findHomography() with RANSAC",
      "Warp one image onto the other's plane with cv2.warpPerspective()",
      "Implement simple alpha blending in the overlap region",
      "Extend to three-image panorama (optional challenge)",
    ],
    expectedOutputs: [
      "Inlier matches visualization after RANSAC filtering",
      "Warped image overlaid on the reference image",
      "Final stitched panorama with alpha-blended transitions",
      "Inlier count and RANSAC reprojection error report",
      "Analysis of blending artifacts and their causes",
    ],
    vivaQuestions: [
      {
        q: "What conditions must be satisfied for a homography to accurately model the transformation between two images?",
        a: "A homography H accurately models the transformation when either (1) both images show the same planar surface (e.g., a wall, floor pattern), or (2) both images are taken from the same camera position with only rotation (pure rotation, no translation). If the scene has significant depth variation and the cameras have a non-zero baseline, parallax causes different parts of the scene to have different relative motions, violating the single-homography model.",
      },
      {
        q: "How does RANSAC determine the number of iterations needed?",
        a: "The required number of iterations N is derived from N = log(1 - confidence) / log(1 - p^n), where confidence is the desired probability of finding a good sample (typically 0.99), p is the estimated inlier fraction, and n is the minimum sample size (4 for homography). If 50% of matches are inliers (p=0.5) at 99% confidence, N ≈ 37 iterations. RANSAC can also terminate early when a sufficient number of inliers is found.",
      },
      {
        q: "Why is simple alpha blending insufficient for high-quality panoramas, and what are better alternatives?",
        a: "Simple alpha blending can show visible seams when the images have different exposures, white balance, or color casts, because the blend is just a linear interpolation that does not equalize these differences. Better alternatives include: multi-band blending (blends low frequencies over a wider region and high frequencies over a narrow region using image pyramids), Poisson blending (gradient-domain method that minimizes visible discontinuities), and exposure compensation (corrects brightness/color before blending).",
      },
    ],
  },
  {
    id: "LAB06",
    labNo: 6,
    week: 7,
    labModuleId: "LABM02",
    slug: "stereo-vision-depth-estimation",
    title: "Stereo Vision and Depth Estimation",
    objective:
      "Compute dense disparity maps from stereo image pairs and convert to metric depth using calibration parameters.",
    co: ["CO2", "CO4"],
    linkedLectures: [14, 15],
    software: ["Python", "NumPy", "OpenCV", "Matplotlib", "Open3D"],
    learningObjectives: [
      "Load rectified stereo pairs and understand stereo geometry",
      "Compute disparity using StereoBM and StereoSGBM algorithms",
      "Convert disparity to metric depth using z = fB/d formula",
      "Evaluate depth maps against ground truth using standard metrics",
    ],
    tasks: [
      "Load a rectified stereo pair (left and right) with known intrinsics and baseline",
      "Compute disparity using StereoBM with varying block sizes",
      "Compute disparity using StereoSGBM and compare quality with BM",
      "Convert disparity map to metric depth using d = fB/disparity formula",
      "Evaluate against ground truth disparity using Bad-1px and EPE metrics",
      "Visualize 3D point cloud using Open3D (optional)",
    ],
    expectedOutputs: [
      "Left/right image pair side-by-side visualization",
      "Disparity maps from StereoBM and StereoSGBM for comparison",
      "Color-mapped metric depth image",
      "Quantitative evaluation table: Bad-1px and EPE metrics",
      "3D point cloud visualization (optional Open3D output)",
    ],
    vivaQuestions: [
      {
        q: "What is the stereo depth formula and what parameters does it depend on?",
        a: "The stereo depth formula is Z = (f × B) / d, where Z is the metric depth, f is the focal length in pixels, B is the baseline (distance between camera centers) in metric units, and d is the disparity in pixels. Depth is inversely proportional to disparity: objects close to the cameras have large disparity, while distant objects have small disparity. The minimum detectable distance is limited by maximum disparity, and the maximum range is limited by minimum disparity (1 pixel gives the farthest reliable depth).",
      },
      {
        q: "Why must stereo images be rectified before computing disparity?",
        a: "Stereo rectification transforms both images so that corresponding points lie on the same horizontal scanline. This reduces the 2D correspondence search to a 1D search along each row, dramatically reducing computation. Without rectification, a brute-force search would need to check every pixel in the second image for each pixel in the first, making real-time disparity computation infeasible. Rectification also simplifies the disparity-to-depth conversion to the simple Z = fB/d formula.",
      },
      {
        q: "What are the main failure modes of block matching stereo algorithms?",
        a: "Block matching fails in: (1) Textureless regions — uniform areas like walls or sky have many pixels with similar appearance, making matching ambiguous; (2) Occlusions — regions visible in one camera but not the other have no valid match; (3) Near-specular surfaces — reflections change appearance with viewpoint; (4) Thin structures — objects thinner than the block size (e.g., poles, wires) are poorly reconstructed. SGBM mitigates some of these by enforcing spatial smoothness of disparity across the image.",
      },
    ],
  },
  {
    id: "LAB07",
    labNo: 7,
    week: 8,
    labModuleId: "LABM03",
    slug: "optical-flow-estimation",
    title: "Optical Flow Estimation",
    objective:
      "Implement sparse optical flow with Lucas-Kanade and dense optical flow with Farneback, and analyze motion in video.",
    co: ["CO3", "CO4"],
    linkedLectures: [16, 17],
    software: ["Python", "NumPy", "OpenCV", "Matplotlib"],
    learningObjectives: [
      "Apply Lucas-Kanade sparse flow to track Shi-Tomasi corners across frames",
      "Visualize sparse flow trajectories overlaid on video frames",
      "Compute Farneback dense optical flow and visualize as HSV color map",
      "Segment moving objects using flow magnitude thresholding",
    ],
    tasks: [
      "Load a video; extract consecutive frame pairs",
      "Apply Lucas-Kanade sparse flow: detect Shi-Tomasi corners, track with cv2.calcOpticalFlowPyrLK()",
      "Visualize tracked points with trajectory lines overlaid on frames",
      "Apply Farneback dense optical flow: cv2.calcOpticalFlowFarneback()",
      "Compute flow magnitude and direction; visualize as HSV color map",
      "Segment moving objects from static background using flow magnitude threshold",
      "Compute average flow magnitude per frame and plot the motion energy curve",
    ],
    expectedOutputs: [
      "Sparse flow video frames with tracked point trajectories",
      "Dense flow HSV color-map visualization (hue = direction, value = magnitude)",
      "Moving object masks from flow thresholding",
      "Motion energy curve plot over time",
      "Comparative analysis: sparse vs. dense flow trade-offs",
    ],
    vivaQuestions: [
      {
        q: "What is the brightness constancy assumption and when does it fail?",
        a: "The brightness constancy assumption states that the intensity of a point in the scene remains constant between consecutive frames: I(x,y,t) = I(x+u, y+v, t+Δt). It fails when there is illumination change (e.g., moving light sources, camera exposure changes), specular reflections that change with viewpoint, or motion blur that causes temporal averaging of intensities. Most real video scenes violate brightness constancy to some degree, which is why robust optical flow methods use additional constraints like spatial smoothness.",
      },
      {
        q: "How does pyramidal Lucas-Kanade handle large displacements?",
        a: "Standard Lucas-Kanade assumes the flow (u,v) is small enough that a first-order Taylor expansion of the brightness constancy equation is valid. For large displacements (many pixels), this approximation breaks down. Pyramidal LK builds a Gaussian image pyramid, estimates coarse flow at the coarsest level where large displacements become small relative to the image size, then refines at each level. This allows tracking across motions of many pixels while maintaining the small-displacement assumption at each pyramid level.",
      },
      {
        q: "What is the difference between sparse and dense optical flow, and when would you choose each?",
        a: "Sparse optical flow (Lucas-Kanade) computes flow only at selected feature points (e.g., corners), making it fast and suitable for real-time tracking of specific objects. Dense optical flow (Farneback, Horn-Schunck) computes a flow vector at every pixel, providing a complete motion field for the whole frame. Choose sparse flow for tracking specific targets, camera pose estimation from feature correspondences, or when computational resources are limited. Choose dense flow for motion segmentation, action recognition, video stabilization, or any application requiring per-pixel motion information.",
      },
    ],
  },
  {
    id: "LAB08",
    labNo: 8,
    week: 10,
    labModuleId: "LABM03",
    slug: "object-detection-hog-svm",
    title: "Object Detection with HOG+SVM",
    objective:
      "Build a pedestrian detector using Histogram of Oriented Gradients features and a Support Vector Machine classifier.",
    co: ["CO3", "CO4"],
    linkedLectures: [18],
    software: ["Python", "NumPy", "OpenCV", "scikit-learn", "Matplotlib"],
    learningObjectives: [
      "Compute HOG descriptors for pedestrian and background patches",
      "Train a linear SVM with scikit-learn and evaluate training accuracy",
      "Implement sliding window + image pyramid for multi-scale detection",
      "Apply NMS and evaluate with precision/recall metrics",
    ],
    tasks: [
      "Load positive (pedestrian) and negative (background) patches; resize to 64×128",
      "Compute HOG descriptors using cv2.HOGDescriptor() with default parameters",
      "Train a linear SVM with scikit-learn; report training accuracy",
      "Implement sliding window + image pyramid for multi-scale detection",
      "Apply NMS with IoU threshold 0.5",
      "Evaluate on test set: precision, recall, F1-score, plot PR curve",
      "Compare with OpenCV's built-in HOG person detector",
    ],
    expectedOutputs: [
      "HOG descriptor visualization on sample patches",
      "Training and test accuracy report with confusion matrix",
      "Detection results on 5 test images with bounding boxes",
      "Precision-Recall curve",
      "Comparison table: custom SVM vs. OpenCV built-in HOG detector",
    ],
    vivaQuestions: [
      {
        q: "How does HOG capture shape information and why is it effective for pedestrian detection?",
        a: "HOG divides the image into small cells (e.g., 8×8 pixels) and computes a gradient orientation histogram in each cell. These histograms are grouped into overlapping blocks and normalized to reduce illumination effects. The resulting descriptor captures the local gradient structure (edges and their orientations) while being robust to small geometric deformations. Pedestrians have a characteristic gradient pattern (vertical silhouette, head, torso, legs) that HOG reliably captures across a wide range of poses and lighting conditions.",
      },
      {
        q: "Why is an image pyramid needed for multi-scale object detection?",
        a: "Objects appear at different sizes in images depending on their distance from the camera. A fixed sliding window of 64×128 can only detect pedestrians at one scale. By resizing the image to multiple scales (e.g., downsample by factor 1.05 repeatedly), the same fixed window effectively searches for pedestrians at all distances. At each scale, the window slides across the resized image, giving multi-scale coverage. Modern CNN detectors replace this with built-in multi-scale anchors or feature pyramid networks.",
      },
      {
        q: "What is Non-Maximum Suppression (NMS) and why is it necessary?",
        a: "When a detector finds an object, multiple overlapping windows often all fire positive detections because the object is present in all of them. NMS removes redundant detections by keeping only the highest-scoring bounding box among a group of highly overlapping boxes (IoU > threshold). The algorithm sorts detections by score, then iteratively keeps the top-scoring box and removes any other box whose IoU with it exceeds the threshold. Without NMS, a single pedestrian would produce dozens of duplicate detections.",
      },
    ],
  },
  {
    id: "LAB09",
    labNo: 9,
    week: 11,
    labModuleId: "LABM03",
    slug: "object-recognition-yolov8",
    title: "Object Recognition with YOLOv8",
    objective:
      "Deploy a pre-trained YOLOv8 model for real-time object detection and analyze performance across diverse scenes.",
    co: ["CO3", "CO4"],
    linkedLectures: [19],
    software: ["Python", "NumPy", "OpenCV", "Ultralytics", "PyTorch", "Matplotlib"],
    learningObjectives: [
      "Install and use the Ultralytics YOLOv8 API for inference",
      "Evaluate mAP on a COCO subset and measure inference speed",
      "Process video frame-by-frame and overlay detection results",
      "Analyze the speed–accuracy trade-off between YOLOv8n and YOLOv8m",
    ],
    tasks: [
      "Install Ultralytics; load YOLOv8n (nano) and YOLOv8m (medium) models",
      "Run inference on 10 diverse COCO images; visualize bounding boxes and class labels",
      "Measure inference time for both models; compute FPS",
      "Evaluate mAP@0.5 on a 100-image COCO subset using model.val()",
      "Process a custom video frame-by-frame; overlay detections and save output",
      "Experiment with confidence thresholds (0.25, 0.5, 0.75) and observe PR trade-off",
    ],
    expectedOutputs: [
      "Detection output images with bounding boxes, class labels, and confidence scores",
      "Speed benchmark table: YOLOv8n vs. YOLOv8m (FPS, inference time)",
      "mAP@0.5 results for both model variants",
      "Annotated output video file",
      "Precision-Recall trade-off plot at different confidence thresholds",
    ],
    vivaQuestions: [
      {
        q: "How does YOLO differ from two-stage detectors like Faster R-CNN?",
        a: "Two-stage detectors (Faster R-CNN) first generate region proposals via an RPN, then classify each proposal in a second stage. This provides high accuracy but is slower due to the two sequential passes. YOLO is a single-stage detector that divides the image into a grid and predicts bounding boxes + class probabilities for each grid cell in a single forward pass through the network. This makes YOLO significantly faster (real-time capable on a GPU) at the cost of slightly lower accuracy, especially for small objects.",
      },
      {
        q: "What is mAP@0.5 and what does it measure?",
        a: "mAP@0.5 (mean Average Precision at IoU threshold 0.5) is the primary COCO detection metric. For each object class, average precision (AP) is the area under the precision-recall curve where true positives are defined as predicted boxes with IoU ≥ 0.5 with a ground truth box. mAP averages this AP across all 80 COCO classes. A higher mAP@0.5 indicates the model correctly localizes and classifies more objects; mAP@0.5:0.95 (averaged over IoU thresholds 0.5 to 0.95 in steps of 0.05) is a stricter metric that requires more precise localization.",
      },
      {
        q: "What is the effect of changing the confidence threshold in a YOLO detector?",
        a: "The confidence threshold is applied to the product of objectness score and class probability. Lowering the threshold includes more low-confidence detections, which increases recall (more true positives are detected) but decreases precision (more false positives appear). Raising the threshold does the opposite: precision increases but recall drops as marginal detections are filtered out. The optimal threshold depends on the application: a safety system might use a low threshold to maximize recall, while a counting application might use a higher threshold to minimize false alarms.",
      },
    ],
  },
  {
    id: "LAB10",
    labNo: 10,
    week: 13,
    labModuleId: "LABM03",
    slug: "multi-object-tracking-sort-deepsort",
    title: "Multi-Object Tracking with SORT/DeepSORT",
    objective:
      "Implement multi-object tracking by integrating a YOLO detector with SORT and visualize tracking results.",
    co: ["CO3", "CO4"],
    linkedLectures: [20, 21],
    software: ["Python", "NumPy", "OpenCV", "Ultralytics", "PyTorch", "py-motmetrics"],
    learningObjectives: [
      "Integrate a YOLO detector with the SORT tracker in a frame-by-frame pipeline",
      "Visualize tracks with persistent colored bounding boxes and track IDs",
      "Evaluate tracking performance using MOTA and MOTP metrics",
      "Analyze the effect of IoU threshold on ID switch rate",
    ],
    tasks: [
      "Set up SORT: clone the repository and install dependencies",
      "Run YOLOv8 frame-by-frame on a MOT17 sequence; collect [x1,y1,x2,y2,conf] detections",
      "Pass detections to SORT; retrieve track IDs and bounding boxes per frame",
      "Visualize tracks: draw colored bounding boxes with persistent track IDs",
      "Measure MOTA and MOTP using py-motmetrics on GT annotations",
      "Vary IoU threshold (0.1, 0.3, 0.5) and observe effect on ID switches",
      "Optional: replace SORT with DeepSORT and compare MOTA improvement",
    ],
    expectedOutputs: [
      "Tracked video output with colored bounding boxes and persistent IDs",
      "MOTA / MOTP results table",
      "ID-switch count vs. IoU threshold bar chart",
      "Qualitative analysis of tracking failures (occlusion, fast motion, similar appearance)",
      "Optional: SORT vs. DeepSORT MOTA comparison",
    ],
    vivaQuestions: [
      {
        q: "What is the difference between SORT and DeepSORT?",
        a: "SORT (Simple Online and Realtime Tracking) uses Kalman filtering for motion prediction and IoU-based association via the Hungarian algorithm. It is very fast but relies solely on bounding box geometry, so it frequently loses track when objects have similar positions or are occluded. DeepSORT extends SORT by adding a deep appearance descriptor (ReID feature vector) that captures object appearance. The association is a weighted combination of Mahalanobis distance (motion) and cosine distance (appearance), enabling the tracker to recover after occlusions based on re-identification rather than just position.",
      },
      {
        q: "What is MOTA and how is it computed?",
        a: "MOTA (Multiple Object Tracking Accuracy) is the primary MOT metric, combining three error types: MOTA = 1 - (FN + FP + IDSW) / GT, where FN is false negatives (missed detections), FP is false positives (spurious detections), IDSW is identity switches (track ID changes), and GT is the total number of ground truth objects across all frames. A perfect tracker with no misses, no false alarms, and no ID switches achieves MOTA = 1.0 (100%). MOTA can be negative if errors exceed the number of ground truth instances.",
      },
      {
        q: "Why does a lower IoU threshold for track association lead to more ID switches?",
        a: "A lower IoU threshold means that even a low overlap between predicted and detected boxes constitutes a valid match. While this increases the overall matching rate (fewer missed matches), it also allows incorrect associations between nearby objects, especially when they are close together or partially occluded. These incorrect associations cause identity switches (a track ID is incorrectly transferred from one object to another). Higher IoU thresholds are more discriminative but reject valid matches when detections are slightly displaced, leading to track fragmentations instead.",
      },
    ],
  },
];

export const labNotebooksFile = "lab-notebooks.txt";
