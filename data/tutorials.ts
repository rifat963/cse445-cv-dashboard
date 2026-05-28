export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Tutorial {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  difficulty: Difficulty;
  topics: string[];
  tools: string[];
  learningObjectives: string[];
  keyTakeaways: string[];
  exercises: string[];
}

export interface TutorialSeries {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  color: "co2" | "co3" | "co4";
  icon: string;
  estimatedHours: string;
  prerequisites: string[];
  tutorials: Tutorial[];
}

export const tutorialSeries: TutorialSeries[] = [
  // ── Object Detection ──────────────────────────────────────────────────────
  {
    id: "object-detection",
    slug: "object-detection",
    title: "Object Detection",
    subtitle: "From sliding windows to transformer-based detectors",
    description:
      "A structured progression through object detection — from task taxonomy and evaluation metrics, through the R-CNN family, SSD and RetinaNet, YOLO architectures, transformer-based DETR, and finishing with end-to-end training, error analysis, and deployment workflows.",
    color: "co2",
    icon: "Target",
    estimatedHours: "14–18 hrs",
    prerequisites: ["Python & NumPy basics", "CNN fundamentals", "Basic OpenCV"],
    tutorials: [
      {
        id: "od-01",
        slug: "image-classification-vs-detection",
        title: "Image Classification, Localization & Object Detection",
        description:
          "Establish the full task taxonomy — classification, localization, and detection — and survey the benchmark datasets and output formats that underpin every detector covered in this series.",
        duration: "60 min",
        difficulty: "Beginner",
        topics: [
          "Classification vs. localization vs. object detection vs. instance segmentation",
          "Single-label vs. multi-label vs. multi-object output formats",
          "Benchmark datasets: PASCAL VOC, MS-COCO, Open Images",
          "Annotation formats: XML (VOC), JSON (COCO), YOLO txt",
          "Two-stage vs. one-stage detector families: high-level overview",
        ],
        tools: ["Python", "Matplotlib", "NumPy"],
        learningObjectives: [
          "Define and distinguish the four core vision tasks with concrete input/output examples",
          "Explain what multi-object detection requires that single-label classification does not",
          "Describe the COCO annotation format and load ground-truth boxes from a JSON file",
          "Classify well-known models (ResNet, Faster R-CNN, YOLOv8, DETR) into their task category",
        ],
        keyTakeaways: [
          "Detection = classification + localisation for every object in the scene, at arbitrary scale",
          "COCO has 80 object categories, ~118 K training images, and ~5 annotations per image",
          "Two-stage detectors (R-CNN family) propose regions first; one-stage detectors (YOLO, SSD) skip that step",
          "Understanding the task formulation before the architecture is essential — it defines what the head must output",
        ],
        exercises: [
          "Load COCO val2017 annotations and visualise bounding boxes for 5 images with category labels",
          "Count the distribution of objects-per-image in COCO and plot a histogram",
          "Convert 10 COCO annotations from JSON format to YOLO txt format and back",
          "List 3 models for each task level (classification / detection / segmentation) with their publication year",
        ],
      },
      {
        id: "od-02",
        slug: "bounding-boxes-iou-nms-map",
        title: "Bounding Boxes, IoU, NMS & mAP",
        description:
          "Build the complete evaluation toolkit from scratch: box format conversions, IoU computation, Non-Maximum Suppression, Precision-Recall curves, and mean Average Precision.",
        duration: "75 min",
        difficulty: "Beginner",
        topics: [
          "Bounding box representation: (x1, y1, x2, y2) vs. (cx, cy, w, h) vs. normalised",
          "Intersection over Union (IoU): derivation, edge cases, vectorised computation",
          "Confidence thresholding and Non-Maximum Suppression (greedy and Soft-NMS)",
          "Precision, Recall, F1 — definitions and the detection-specific TP/FP/FN rules",
          "Average Precision (AP), mAP@50, mAP@50-95, and COCO area buckets (S/M/L)",
        ],
        tools: ["Python", "NumPy", "Matplotlib"],
        learningObjectives: [
          "Convert between all three bounding box formats without looking up the formulas",
          "Implement vectorised IoU that processes N×M box pairs in a single NumPy call",
          "Write greedy NMS from scratch and explain every hyperparameter",
          "Compute AP for a single class by integrating a Precision-Recall curve, then extend to mAP",
        ],
        keyTakeaways: [
          "IoU ≥ 0.5 is the standard TP threshold in PASCAL VOC; COCO averages over 0.50–0.95",
          "NMS requires two separate thresholds: confidence (pre-filter) and IoU (overlap suppression)",
          "AP is the area under the 11-point interpolated PR curve; mAP averages AP over all classes",
          "APs (small objects, area < 32²) is the hardest COCO metric — most models score under 30",
        ],
        exercises: [
          "Implement `compute_iou(boxesA, boxesB)` with NumPy broadcasting for N×M inputs",
          "Write `nms(boxes, scores, iou_thresh, score_thresh)` and test on 1 000 synthetic boxes",
          "Load COCO val predictions JSON, compute AP for the 'person' class, and plot the PR curve",
          "Compare greedy NMS vs. Soft-NMS on an image with overlapping crowd detections",
        ],
      },
      {
        id: "od-03",
        slug: "sliding-window-selective-search-rcnn",
        title: "Sliding Window, Selective Search & R-CNN",
        description:
          "Trace the path from brute-force sliding window detectors through selective search region proposals to the original R-CNN, and understand the bottlenecks that each approach introduced.",
        duration: "90 min",
        difficulty: "Intermediate",
        topics: [
          "Multi-scale sliding window: image pyramid, stride, aspect ratios",
          "Selective search: colour, texture, size, and fill grouping hierarchies",
          "R-CNN pipeline: selective search → warp → CNN → SVM + box regressor",
          "Feature caching and the 47-second-per-image wall on VGG16",
          "Fast R-CNN: RoI pooling, single-pass shared convolutions, multi-task loss",
        ],
        tools: ["OpenCV", "scikit-learn", "NumPy", "Matplotlib"],
        learningObjectives: [
          "Implement a multi-scale sliding window and measure its computational cost on a 1080p image",
          "Use OpenCV's selective search to generate ~2 000 region proposals for an image",
          "Explain the R-CNN training pipeline: CNN pretraining, SVM fine-tuning, box regression",
          "Describe RoI pooling and explain how it enables a single shared forward pass in Fast R-CNN",
        ],
        keyTakeaways: [
          "Sliding window is O(W × H × scales × aspect_ratios) — infeasible without pruning",
          "Selective search reduces candidates from millions to ~2 000 with high recall (>96% on VOC)",
          "R-CNN's bottleneck: 2 000 forward passes per image, each on a warped 227×227 crop",
          "Fast R-CNN eliminated per-region CNN calls but still depends on CPU selective search at test time",
        ],
        exercises: [
          "Run a sliding window detector with HOG+SVM on INRIA pedestrians and measure FPS",
          "Apply OpenCV selective search to 5 COCO images and visualise the top-200 proposals",
          "Load torchvision Fast R-CNN and compare inference time vs. repeated crop-then-classify",
          "Count the unique bottleneck in each pipeline stage (proposal, feature, classify, regress)",
        ],
      },
      {
        id: "od-04",
        slug: "faster-rcnn-architecture",
        title: "Faster R-CNN: Region Proposal Network",
        description:
          "Dissect the Faster R-CNN architecture: how the RPN shares backbone features, generates anchors, scores objectness, regresses box deltas, and feeds proposals into the detection head.",
        duration: "120 min",
        difficulty: "Intermediate",
        topics: [
          "Region Proposal Network (RPN): 3×3 sliding window, k anchor boxes per location",
          "Anchor design: scales × aspect ratios, total anchor count across the feature map",
          "RPN training: binary objectness loss (BCE) + smooth-L1 regression loss",
          "RoI pooling and RoI Align: bilinear interpolation for sub-pixel accuracy",
          "Feature Pyramid Network (FPN): lateral connections for multi-scale proposal assignment",
        ],
        tools: ["PyTorch", "torchvision", "Matplotlib"],
        learningObjectives: [
          "Explain the RPN's dual role: objectness classifier and box delta regressor for each anchor",
          "Calculate the total number of anchors generated by an RPN over a 38×50 feature map",
          "Compare RoI Pooling and RoI Align and explain when misalignment matters",
          "Trace a full Faster R-CNN forward pass: image → backbone → RPN → RoI → head → NMS",
        ],
        keyTakeaways: [
          "RPN turns region proposals into a learned, GPU-resident operation — <10 ms vs. 2 s for selective search",
          "Anchors tile every feature map location with k (scale × ratio) prior boxes",
          "RoI Align fixes the quantisation error in RoI Pooling and is essential for Mask R-CNN",
          "FPN creates a feature hierarchy so small objects are detected from high-resolution early maps",
        ],
        exercises: [
          "Load torchvision `fasterrcnn_resnet50_fpn` and run inference on 10 COCO val images",
          "Visualise the top-50 RPN proposals (before NMS) overlaid on a sample image",
          "Compute anchors for a single feature map level (stride=16, 3 scales × 3 ratios) in NumPy",
          "Fine-tune Faster R-CNN on a 200-image custom dataset and report mAP@50 before and after",
        ],
      },
      {
        id: "od-05",
        slug: "ssd-retinanet-focal-loss",
        title: "SSD, RetinaNet & Focal Loss",
        description:
          "Study two one-stage detectors that differ in how they handle class imbalance: SSD with hard negative mining and RetinaNet with focal loss — and understand why focal loss is a more principled solution.",
        duration: "90 min",
        difficulty: "Intermediate",
        topics: [
          "SSD architecture: VGG16 backbone + 6 multi-scale feature layers, ~8 732 default boxes",
          "SSD matching: jaccard overlap ≥ 0.5, hard negative mining at 3:1 ratio",
          "Class-imbalance problem: 99%+ background anchors swamp classification loss",
          "Focal loss: modulating factor (1−pₜ)^γ down-weights easy negatives",
          "RetinaNet: FPN backbone + two-branch head (class + box) with focal loss",
        ],
        tools: ["PyTorch", "torchvision", "Matplotlib"],
        learningObjectives: [
          "Explain how SSD tiles default boxes across 6 feature map scales and count the total",
          "Derive the focal loss formula and explain the effect of γ on easy vs. hard example weighting",
          "Compare SSD and RetinaNet accuracy on small objects and explain the architectural reason",
          "Load torchvision RetinaNet and visualise per-level feature map predictions",
        ],
        keyTakeaways: [
          "SSD300 produces ~8 732 boxes across 6 scales — the minority are foreground, creating extreme imbalance",
          "Hard negative mining is a sampling heuristic; focal loss is a loss reformulation that doesn't require sampling",
          "RetinaNet with ResNet-50-FPN achieves Faster R-CNN accuracy at single-stage speed",
          "γ = 2 in focal loss means a well-classified example (pₜ=0.9) contributes 100× less loss than γ = 0",
        ],
        exercises: [
          "Load pretrained SSD300 and RetinaNet; run both on 10 identical images and compare AP@50",
          "Implement focal loss from scratch and verify it equals CE loss when γ = 0",
          "Plot the focal loss curve for γ ∈ {0, 0.5, 1, 2, 5} to visualise the down-weighting effect",
          "Visualise SSD predictions per feature layer and note which layer detects which object sizes",
        ],
      },
      {
        id: "od-06",
        slug: "yolo-backbone-neck-head",
        title: "YOLO Architecture: Backbone, Neck & Head",
        description:
          "Master the full YOLO design — from the grid-cell prediction of v1 to the CSP backbone, PANet neck, and decoupled detection head of YOLOv8 — and understand every loss component.",
        duration: "120 min",
        difficulty: "Intermediate",
        topics: [
          "YOLOv1: 7×7 grid, B box predictions, C classes per cell, single forward pass",
          "YOLOv3: Darknet-53 backbone, 3 detection scales, anchor clustering with k-means",
          "YOLOv5/v8 backbone: CSP bottleneck blocks and C2f modules",
          "Neck: PANet path aggregation for bottom-up and top-down feature fusion",
          "Decoupled head: separate classification and regression branches; CIoU + BCE losses",
        ],
        tools: ["PyTorch", "Ultralytics YOLOv8", "OpenCV"],
        learningObjectives: [
          "Explain grid-based prediction and the difference between objectness score and class probability",
          "Describe how PANet differs from FPN and why bidirectional feature flow helps",
          "Identify backbone, neck, and head in a YOLOv8 architecture diagram",
          "Run YOLOv8 across model sizes (n/s/m/l/x) and plot the speed–accuracy trade-off",
        ],
        keyTakeaways: [
          "YOLOv1 predicts B boxes and C class scores per cell — 7×7×(B×5+C) output tensor",
          "CSP blocks halve the gradient path, reducing memory and improving training efficiency",
          "PANet aggregates features from all scales bottom-up then top-down — YOLO's multi-scale secret",
          "CIoU loss penalises centre distance and aspect-ratio difference on top of IoU — faster convergence",
        ],
        exercises: [
          "Run YOLOv8n, YOLOv8s, and YOLOv8m on a test video; measure and plot FPS vs. mAP@50",
          "Visualise YOLOv8 feature maps at the three detection scales using hooks",
          "Reimplement the CIoU loss for a single predicted/target pair in PyTorch",
          "Export YOLOv8m to ONNX and benchmark latency with ONNX Runtime vs. native PyTorch",
        ],
      },
      {
        id: "od-07",
        slug: "yolo-custom-dataset-training",
        title: "YOLO Training on a Custom Dataset",
        description:
          "End-to-end workflow: annotate images in YOLO format, configure a training run, monitor loss curves, evaluate with COCO metrics, and tune augmentations for your domain.",
        duration: "150 min",
        difficulty: "Intermediate",
        topics: [
          "Dataset annotation with LabelImg / Roboflow; YOLO label format (class cx cy w h)",
          "data.yaml: paths, nc, class names — the single source of truth for a training run",
          "Transfer learning: freeze backbone layers for the first N epochs on small datasets",
          "Augmentation pipeline: mosaic, mixup, random flip, HSV jitter, copy-paste",
          "Training curves: box loss, cls loss, dfl loss, mAP@50, mAP@50-95",
        ],
        tools: ["Ultralytics YOLOv8", "Roboflow", "TensorBoard", "ONNX Runtime"],
        learningObjectives: [
          "Annotate a custom dataset and export it in YOLO format using LabelImg or Roboflow",
          "Write a valid data.yaml and launch a YOLOv8 training run from the CLI",
          "Interpret the TensorBoard training curves and identify under/overfitting",
          "Tune mosaic probability and freeze epochs and measure the effect on val mAP",
        ],
        keyTakeaways: [
          "Freezing backbone layers for the first 10 epochs prevents early over-writing of ImageNet features",
          "Mosaic augmentation tiles 4 images into one training sample — dramatically improves small-object recall",
          "80–20 train/val split is the minimum; class balance matters more than raw image count",
          "A 50-epoch run on 500 images takes <10 min on a T4 GPU — iterate fast, measure on val",
        ],
        exercises: [
          "Annotate 50 images of a custom object using LabelImg and export to YOLO format",
          "Train YOLOv8s for 50 epochs; plot box loss and mAP@50 curves from `results.csv`",
          "Compare mAP@50 with freeze=10 vs. freeze=0 on the same dataset",
          "Export the trained model to ONNX and run the inference script on 5 held-out test images",
        ],
      },
      {
        id: "od-08",
        slug: "detr-transformer-detection",
        title: "DETR & Transformer-Based Detection",
        description:
          "Understand how DETR replaces anchors, NMS, and RPN with a set-prediction transformer: encoder-decoder architecture, learned object queries, and bipartite Hungarian matching.",
        duration: "90 min",
        difficulty: "Advanced",
        topics: [
          "DETR encoder: CNN backbone → flattened feature map → multi-head self-attention",
          "DETR decoder: N learnable object queries attending to encoder memory via cross-attention",
          "Hungarian matching: bipartite assignment between N predictions and M ground-truth boxes",
          "Set prediction loss: matched classification + L1 + GIoU box losses",
          "Deformable DETR: sparse attention on reference points — 10× faster convergence",
        ],
        tools: ["PyTorch", "Hugging Face Transformers", "Matplotlib"],
        learningObjectives: [
          "Trace a full DETR forward pass: image → ResNet → transformer encoder → decoder → FFN",
          "Explain how Hungarian matching eliminates NMS by treating detection as set prediction",
          "Load `facebook/detr-resnet-50` from Hugging Face and visualise per-query attention maps",
          "Compare DETR vs. Faster R-CNN on the same COCO images for speed and accuracy",
        ],
        keyTakeaways: [
          "DETR outputs exactly N predictions per image; Hungarian matching assigns each to a ground-truth or ∅",
          "Object queries are randomly initialised embeddings that learn to specialise by position/size",
          "DETR requires 500 training epochs to match Faster R-CNN — slow convergence is the main drawback",
          "Deformable DETR fixes slow convergence with multi-scale deformable attention, converging in ~50 epochs",
        ],
        exercises: [
          "Load `facebook/detr-resnet-50` and run detection on 5 COCO val images; visualise boxes + labels",
          "Visualise attention maps for 3 object queries on an image with multiple objects",
          "Implement the bipartite matching cost matrix (class + L1 + GIoU) for a toy 4-box example",
          "Profile DETR encoder vs. decoder FLOPs using `torch.profiler` and compare their share",
        ],
      },
      {
        id: "od-09",
        slug: "evaluation-error-analysis-deployment",
        title: "Evaluation, Error Analysis & Deployment",
        description:
          "Run standardised COCO evaluation, diagnose failure modes with per-category and per-size breakdowns, draw Precision-Recall and F1 curves, and package the model for edge deployment.",
        duration: "90 min",
        difficulty: "Intermediate",
        topics: [
          "COCO API: pycocotools eval, mAP@50, mAP@50-95, APs/APm/APl",
          "Per-category AP breakdown: identifying weak classes",
          "Error analysis taxonomy: missed detections, false positives, localisation errors",
          "Confidence calibration: F1-confidence curve and optimal threshold selection",
          "Deployment pipeline: ONNX export, TensorRT, edge benchmarking on Jetson/RPi",
        ],
        tools: ["pycocotools", "PyTorch", "Matplotlib", "ONNX Runtime"],
        learningObjectives: [
          "Run pycocotools COCO evaluation on a detector results JSON and interpret every metric row",
          "Identify the three weakest-performing categories and hypothesise causes from dataset statistics",
          "Plot the F1-confidence curve and select the operating threshold for a precision-constrained task",
          "Export a model to ONNX and measure end-to-end latency (resize → infer → NMS) on CPU",
        ],
        keyTakeaways: [
          "APs < 30 for most detectors — small objects are consistently the hardest regime",
          "Per-category AP breakdown reveals dataset imbalance, annotation noise, and missing augmentations",
          "Pre/post-processing often exceeds model forward-pass time on CPU — profile the full pipeline",
          "ONNX export decouples the model from PyTorch and unlocks TensorRT, CoreML, and ONNX Runtime",
        ],
        exercises: [
          "Run YOLOv8n, YOLOv8s, and YOLOv8m on COCO val2017 and compare their full eval tables",
          "Find the 5 categories with the lowest AP and visualise 3 failure examples per category",
          "Plot the F1-confidence curve for YOLOv8s and mark the threshold that maximises F1",
          "Export YOLOv8s to ONNX and benchmark latency vs. native PyTorch on both CPU and GPU",
        ],
      },
    ],
  },

  // ── Self-Supervised Learning ──────────────────────────────────────────────
  {
    id: "self-supervised-learning",
    slug: "self-supervised-learning",
    title: "Self-Supervised Learning",
    subtitle: "SSL-guided representation learning for label-efficient object detection",
    description:
      "Bounding-box labels are expensive — SSL lets models learn powerful visual representations from unlabeled images that dramatically improve detection when labels are scarce. This series covers the full pipeline: DINOv3 and I-JEPA feature learning, YOLO and RF-DETR detector fine-tuning, feature distillation, label-efficiency experiments, and research-style error analysis.",
    color: "co3",
    icon: "Brain",
    estimatedHours: "18–24 hrs",
    prerequisites: ["CNN fundamentals", "PyTorch basics", "Object detection basics (bounding boxes, mAP)"],
    tutorials: [
      {
        id: "ssl-01",
        slug: "ssl-object-detection-pipeline",
        title: "SSL-Based Object Detection Pipeline",
        description:
          "Understand how self-supervised learning connects to object detection: SSL improves the backbone, not the detector head, and its strongest benefit is in low-label regimes.",
        duration: "60 min",
        difficulty: "Beginner",
        topics: [
          "SSL vs. supervised vs. semi-supervised detection: what each approach requires",
          "SSL role: backbone/representation learning, not direct box prediction",
          "Dataset structure: unlabeled image pool + labeled detection splits",
          "Label-efficiency splits: 10%, 25%, 50%, 100% of annotation budget",
          "DINOv3 and I-JEPA as representation models, not detectors",
        ],
        tools: ["Python", "NumPy", "Matplotlib", "PyYAML"],
        learningObjectives: [
          "Explain why SSL improves detection mainly in low-label regimes",
          "Describe the two-phase pipeline: unlabeled SSL pretraining → labeled detection fine-tuning",
          "Prepare a dataset folder with unlabeled images and four labeled splits (10/25/50/100%)",
          "Distinguish DINOv3 and I-JEPA from supervised detectors like YOLO and RF-DETR",
        ],
        keyTakeaways: [
          "SSL learns from unlabeled images; object detection still needs bounding boxes for fine-tuning",
          "The SSL benefit shrinks as labeled data grows — largest gain is at 10% labels",
          "DINOv3 and I-JEPA produce improved backbone features, not bounding-box outputs",
          "Label-efficiency splits (10/25/50/100%) are the key experimental variable throughout this series",
        ],
        exercises: [
          "Organize a dataset into unlabeled_images/ and labeled_detection_data/train/valid/test/",
          "Script the label-split creation: sample 10%, 25%, 50%, and 100% of annotations and save each subset",
          "Print a dataset summary: number of unlabeled images, labeled images per split, number of classes",
          "Visualise 5 annotated images from the training set with bounding boxes and class labels",
        ],
      },
      {
        id: "ssl-02",
        slug: "dinov3-dense-visual-representation",
        title: "DINOv3 for Dense Visual Representation",
        description:
          "Use DINOv3 as a frozen teacher to extract dense patch-level features, generate feature similarity maps, and verify that object regions produce coherent representations before any detector training.",
        duration: "90 min",
        difficulty: "Intermediate",
        topics: [
          "DINOv3 architecture: patch tokenisation, ViT backbone, dense feature output",
          "Patch-level feature extraction vs. image-level global pooling",
          "Feature similarity maps: cosine similarity between a query patch and all others",
          "Object-region feature coherence: do object patches cluster in feature space?",
          "Three uses of DINOv3: (1) analysis only, (2) distillation into YOLO, (3) RF-DETR backbone init",
        ],
        tools: ["PyTorch", "timm", "Hugging Face Transformers", "Matplotlib", "NumPy"],
        learningObjectives: [
          "Load a pretrained DINOv3 model and extract patch-level feature tensors",
          "Generate a feature similarity map by computing cosine similarity to a clicked query patch",
          "Visualise a patch feature grid showing per-region representation quality",
          "Explain the three downstream options for DINOv3 features in a detection pipeline",
        ],
        keyTakeaways: [
          "DINOv3 produces high-quality dense patch features without any task-specific supervision",
          "Feature similarity maps reveal whether the model has learned object-aware representations",
          "DINOv3 should be taught as a teacher model — it guides detection, not replaces it",
          "Starting with feature visualisation before distillation builds the right intuition for students",
        ],
        exercises: [
          "Load domain-specific unlabeled images and extract DINOv3 patch features for all of them",
          "Generate a feature_similarity_map.png by selecting a foreground patch as query",
          "Create a patch_feature_grid.png showing 16 patches and their feature magnitudes",
          "Visualise object_region_feature_visualization.png and discuss object vs. background feature contrast",
        ],
      },
      {
        id: "ssl-03",
        slug: "ijepa-context-based-ssl",
        title: "I-JEPA for Context-Based Self-Supervised Learning",
        description:
          "Understand how I-JEPA differs from contrastive learning and masked autoencoders: it predicts target-block representations from context blocks within the same image without pixel reconstruction.",
        duration: "90 min",
        difficulty: "Intermediate",
        topics: [
          "Joint-Embedding Predictive Architecture (JEPA): prediction in representation space",
          "Context blocks (visible) and target blocks (masked) within the same image",
          "Why I-JEPA avoids pixel reconstruction: predicting semantics, not textures",
          "Non-generative SSL: no handcrafted augmentations required",
          "I-JEPA vs. MAE vs. DINO: what each method predicts and what each learns",
        ],
        tools: ["PyTorch", "timm", "Matplotlib", "NumPy"],
        learningObjectives: [
          "Explain the JEPA prediction objective: context encoder → predict masked target representations",
          "Describe why representation-space prediction is semantically richer than pixel reconstruction",
          "Visualise context-target block splits on a real image and identify which blocks are masked",
          "Extract I-JEPA features from pretrained weights and compare them to DINOv3 features",
        ],
        keyTakeaways: [
          "I-JEPA predicts the latent representation of target blocks, not their pixels",
          "No data augmentation engineering needed — the masking strategy provides self-supervision",
          "I-JEPA learns object-aware semantic features that can initialise or guide detector backbones",
          "Direct YOLO integration with I-JEPA requires feature distillation — not a plug-and-play replacement",
        ],
        exercises: [
          "Divide a 224×224 image into a 14×14 grid and visualise a random context-target split",
          "Generate ijepa_masking_strategy.png showing context blocks (visible) vs. target blocks (masked)",
          "Extract I-JEPA features from pretrained weights if available; otherwise simulate with a ViT",
          "Save ijepa_feature_embedding.npy and compute cosine similarity between object and background patches",
        ],
      },
      {
        id: "ssl-04",
        slug: "yolo-detection-heads-ssl-transfer",
        title: "YOLO Generations as Detection Heads for SSL Transfer",
        description:
          "Train YOLOv10, YOLO11, YOLOv12, and YOLO26 on 100% labels as baselines, then evaluate each on reduced label splits to measure the baseline label-efficiency ceiling.",
        duration: "120 min",
        difficulty: "Intermediate",
        topics: [
          "YOLO11: stable Ultralytics baseline — best starting point for classroom teaching",
          "YOLO26: modern edge-optimised Ultralytics model with NMS-free head",
          "YOLOv10: end-to-end NMS-free detection for research comparison",
          "YOLOv12: attention-centric YOLO architecture for CNN-vs-attention comparison",
          "Baseline label-efficiency: train each model on 10%, 25%, 50%, and 100% splits",
        ],
        tools: ["Ultralytics", "PyTorch", "TensorBoard", "Matplotlib", "Pandas"],
        learningObjectives: [
          "Train YOLO11 and YOLO26 on the full labeled dataset and record mAP@50 and mAP@50-95",
          "Run all four YOLO variants on 10%, 25%, and 50% label splits and collect results CSVs",
          "Explain the architectural difference between YOLO11 (CSP neck) and YOLOv12 (attention head)",
          "Plot a grouped bar chart comparing all four models across all four label ratios",
        ],
        keyTakeaways: [
          "YOLO11 is the most stable classroom model: well-documented, fast, and Ultralytics-supported",
          "YOLO26 offers the most modern Ultralytics workflow and is the best choice for edge deployment",
          "YOLOv10 and YOLOv12 are useful for research-level architecture comparison, not primary teaching",
          "mAP drop from 100% to 10% labels quantifies the annotation bottleneck this series aims to close",
        ],
        exercises: [
          "Train YOLO11 and YOLO26 on 100% labels; save yolo11_results.csv and yolo26_results.csv",
          "Train YOLO11 and YOLO26 on 10%, 25%, and 50% splits; record mAP@50 for each",
          "Train YOLOv10 and YOLOv12 on 100% and 10% splits for advanced comparison",
          "Plot yolo_comparison_plot.png: grouped bars with model on x-axis and label ratio as groups",
        ],
      },
      {
        id: "ssl-05",
        slug: "ssl-feature-distillation-yolo",
        title: "SSL Feature Distillation into YOLO",
        description:
          "Connect DINOv3 to YOLO via feature distillation: freeze DINOv3 as a teacher, train the YOLO backbone to align with teacher feature maps, then fine-tune for detection.",
        duration: "120 min",
        difficulty: "Advanced",
        topics: [
          "Teacher-student distillation: frozen DINOv3 teacher, YOLO student backbone",
          "Feature alignment loss: MSE or cosine distance between teacher and student feature maps",
          "Total loss: detection loss + λ × feature distillation loss",
          "Training schedule: Stage 1 feature alignment → Stage 2 detection fine-tuning",
          "Best pairings: DINOv3 + YOLO11 (start), DINOv3 + YOLO26 (modern), I-JEPA + YOLO (advanced)",
        ],
        tools: ["PyTorch", "Ultralytics", "timm", "Matplotlib", "TensorBoard"],
        learningObjectives: [
          "Implement the distillation training loop: extract teacher features, compute alignment loss, backprop",
          "Explain why the teacher (DINOv3) is frozen and only the student (YOLO backbone) is updated",
          "Tune the distillation weight λ and plot the combined loss curve for both stages",
          "Compare ssl_distilled_yolo_results.csv against the vanilla YOLO11 baseline at each label ratio",
        ],
        keyTakeaways: [
          "Feature distillation is the most classroom-friendly way to inject SSL knowledge into YOLO",
          "The two-stage schedule (align first, then detect) prevents the detector loss from dominating",
          "DINOv3 + YOLO11 is the recommended starting point; DINOv3 + YOLO26 is the strongest experiment",
          "I-JEPA distillation into YOLO is a research extension — not required for the core course",
        ],
        exercises: [
          "Implement `distillation_loss(teacher_feat, student_feat)` using cosine distance",
          "Run Stage 1: train YOLO11 backbone to align with frozen DINOv3 features for 20 epochs",
          "Run Stage 2: fine-tune the full YOLO11 model on detection labels for 50 epochs",
          "Plot teacher_feature_map.png, student_feature_map.png, and feature_alignment_loss_curve.png side by side",
        ],
      },
      {
        id: "ssl-06",
        slug: "rf-detr-ssl-representation",
        title: "RF-DETR with SSL Representation Learning",
        description:
          "Train RF-DETR — a transformer detector built on a DINOv2-style ViT backbone and Deformable DETR decoder — across all label splits and compare it against the YOLO baseline branch.",
        duration: "90 min",
        difficulty: "Advanced",
        topics: [
          "RF-DETR architecture: DINO-style ViT backbone + feature projection + Deformable DETR decoder",
          "Object queries: learned slot embeddings attending to encoder memory",
          "RF-DETR vs. YOLO: transformer detection philosophy vs. real-time CNN/attention approach",
          "Training RF-DETR on 10%, 25%, 50%, and 100% label splits",
          "Small-object and occluded-object performance: where RF-DETR differs from YOLO",
        ],
        tools: ["PyTorch", "RF-DETR", "Matplotlib", "pycocotools", "Pandas"],
        learningObjectives: [
          "Explain how RF-DETR uses object queries and bipartite matching instead of NMS",
          "Train RF-DETR on all four label splits and record rf_detr_results.csv",
          "Compare RF-DETR vs. YOLO11 and YOLO26 mAP@50 and mAP@50-95 at each label ratio",
          "Identify scene types (cluttered, occluded, small objects) where RF-DETR outperforms YOLO",
        ],
        keyTakeaways: [
          "RF-DETR is the transformer-branch detector in this series; YOLO models are the real-time branch",
          "RF-DETR already uses a DINOv2-based backbone — it is natively SSL-pretrained",
          "RF-DETR tends to handle occluded and cluttered scenes better than single-stage detectors",
          "YOLO26 is typically faster at inference; RF-DETR may be more accurate on difficult object types",
        ],
        exercises: [
          "Train RF-DETR on 100% labels and visualise rf_detr_prediction_grid.png with box + label overlays",
          "Train RF-DETR on 10%, 25%, and 50% splits; save rf_detr_results.csv for all label ratios",
          "Build rf_detr_vs_yolo_comparison.csv merging all model results into a single table",
          "Find 3 images where RF-DETR correctly detects an object that YOLO26 misses and analyse why",
        ],
      },
      {
        id: "ssl-07",
        slug: "label-efficiency-experiment",
        title: "Label-Efficiency Experiment",
        description:
          "Run the full comparative study: all models, all label splits, all metrics — then reason about when SSL-guided models outperform vanilla baselines and when they do not.",
        duration: "120 min",
        difficulty: "Intermediate",
        topics: [
          "Experimental matrix: 8 models × 4 label ratios = 32 training runs",
          "Metrics: mAP@50, mAP@50-95, precision, recall, F1, inference time, model size",
          "Expected pattern: SSL gain is largest at 10–25% labels, shrinks at 100%",
          "YOLO26 vs. RF-DETR trade-off: edge deployment speed vs. cluttered-scene accuracy",
          "Research insight: SSL does not always win — clean evaluation reveals when and why",
        ],
        tools: ["Ultralytics", "RF-DETR", "pycocotools", "Pandas", "Matplotlib"],
        learningObjectives: [
          "Collate all results CSVs into a single comparison table indexed by model and label ratio",
          "Identify the label ratio at which SSL-guided models first exceed the vanilla YOLO11 baseline",
          "Plot a grouped mAP@50 bar chart and a separate mAP@50-95 chart for the full model set",
          "Write a 200-word discussion of why SSL helps at low labels but less at high labels",
        ],
        keyTakeaways: [
          "SSL-guided models should show the largest mAP improvement at 10% and 25% labeled data",
          "The SSL advantage typically narrows at 100% labels — supervised data can compensate",
          "RF-DETR may outperform YOLO on cluttered scenes regardless of SSL; track this separately",
          "Inference time and model size matter for deployment — always report them alongside mAP",
        ],
        exercises: [
          "Merge all results CSVs into label_efficiency_table.csv with columns: model, label%, mAP50, mAP50-95, precision, recall, F1",
          "Plot a heatmap of mAP@50 values with models on y-axis and label ratios on x-axis",
          "Identify the model with the best mAP@50 at 10% labels and report its inference time",
          "Write a research-style Results paragraph (3–4 sentences) summarising the key finding",
        ],
      },
      {
        id: "ssl-08",
        slug: "dinov3-feature-error-analysis",
        title: "DINOv3 Feature-Based Error Analysis",
        description:
          "Use DINOv3 feature maps to explain detection success and failure: check whether missed objects are represented in SSL feature space even when the detector fails to fire.",
        duration: "90 min",
        difficulty: "Intermediate",
        topics: [
          "Error taxonomy: true positives, false positives, missed detections (false negatives)",
          "DINOv3 feature activation on detected vs. missed objects",
          "Feature similarity maps for failure-case diagnosis",
          "Background similarity: why objects similar to context get missed",
          "YOLO vs. RF-DETR failure overlap: do both models fail on the same instances?",
        ],
        tools: ["PyTorch", "timm", "Matplotlib", "NumPy", "OpenCV"],
        learningObjectives: [
          "Select 5 successful detections and 5 missed detections from val set results",
          "Extract DINOv3 feature maps for each and generate similarity maps centred on the object region",
          "Determine whether missed objects show coherent DINOv3 features despite detector failure",
          "Produce a failure_case_report comparing YOLO and RF-DETR on the same missed instances",
        ],
        keyTakeaways: [
          "If DINOv3 features activate on a missed object, the failure is in the detector head, not the backbone",
          "If DINOv3 features do not activate, the object is visually ambiguous or out of distribution",
          "Background-similar objects (camouflage, low contrast) are consistently hard for both models",
          "Error analysis bridges theory and practice — it tells you what to fix next",
        ],
        exercises: [
          "Generate successful_detection_feature_map.png and missed_detection_feature_map.png for 3 examples each",
          "Generate false_positive_feature_map.png for 2 false-positive detections and inspect the features",
          "Write failure_case_report.md answering: did DINOv3 features activate on the missed object?",
          "Tabulate: out of 10 missed cases, how many had DINOv3 feature activation vs. none?",
        ],
      },
      {
        id: "ssl-09",
        slug: "ijepa-semantic-feature-analysis",
        title: "I-JEPA-Based Semantic Feature Analysis",
        description:
          "Explore whether I-JEPA's context-prediction objective produces object-level semantic grouping by comparing object-region and background-region features, and relate the findings to detector fine-tuning.",
        duration: "90 min",
        difficulty: "Advanced",
        topics: [
          "Context-target block visualisation on detection images",
          "Object vs. background feature comparison: cosine similarity within each region",
          "Semantic grouping: do same-class objects cluster in I-JEPA feature space?",
          "I-JEPA vs. DINOv3 features: which produces tighter object-level clusters?",
          "Implications for detector initialisation and fine-tuning from I-JEPA features",
        ],
        tools: ["PyTorch", "timm", "Matplotlib", "NumPy", "scikit-learn"],
        learningObjectives: [
          "Create context-target block visualisations for 3 detection images with annotated object boxes",
          "Extract object-region features and background-region features separately and compare distributions",
          "Run t-SNE on I-JEPA features coloured by object class and assess clustering quality",
          "Explain the conceptual shift from contrastive SSL to predictive representation learning",
        ],
        keyTakeaways: [
          "I-JEPA features encode object semantics through context prediction, not negative-pair contrast",
          "Object regions typically produce tighter, more discriminative features than background regions",
          "DINOv3 is more directly detection-ready; I-JEPA is more useful for conceptual explanation",
          "For fine-tuning: I-JEPA features may improve detector initialisation but require additional projection",
        ],
        exercises: [
          "Generate ijepa_context_target_example.png for an image with at least 3 annotated objects",
          "Plot object_vs_background_feature_plot.png: violin plots of intra-region cosine similarity",
          "Run t-SNE on features from 5 object categories and save the scatter plot",
          "Write ijepa_detection_discussion.md: 3 bullet points on how I-JEPA differs from DINO for detection",
        ],
      },
      {
        id: "ssl-10",
        slug: "final-comparative-study",
        title: "Final Comparative Study",
        description:
          "Complete a research-style experiment: assemble all results, produce a paper-style results table, analyse label-efficiency gains, and write a structured report on SSL-guided object detection.",
        duration: "150 min",
        difficulty: "Advanced",
        topics: [
          "Full pipeline recap: unlabeled SSL → feature extraction → detection fine-tuning → evaluation",
          "Paper-style results table: all models × all label ratios × all metrics",
          "Qualitative detection grid: correct predictions, missed objects, false positives side by side",
          "Key narrative: when does SSL help, by how much, and at what compute cost?",
          "Recommended notebook series: SSL_OD_01 through SSL_OD_10 deliverables checklist",
        ],
        tools: ["Ultralytics", "RF-DETR", "pycocotools", "Pandas", "Matplotlib", "NumPy"],
        learningObjectives: [
          "Assemble a final results table (label ratio × model × mAP50/mAP50-95/precision/recall/F1)",
          "Produce a qualitative grid of 3×3 detection outputs showing best model, worst model, and SSL-guided model",
          "Write a structured abstract (background, method, results, conclusion) in 200 words",
          "Identify one limitation of the study and propose a concrete future experiment to address it",
        ],
        keyTakeaways: [
          "SSL-guided models consistently outperform vanilla baselines at 10–25% label budgets",
          "RF-DETR and DINOv3-distilled YOLO tend to complement rather than dominate each other",
          "The complete pipeline is: dataset splits → DINOv3/I-JEPA features → YOLO/RF-DETR training → evaluation",
          "Writing research-style results forces students to think critically about what the numbers mean",
        ],
        exercises: [
          "Produce the final label_efficiency_table.csv with all 8 models, 4 label ratios, and 7 metrics",
          "Generate a 3×3 qualitative_detection_grid.png comparing the best YOLO, RF-DETR, and SSL-distilled model",
          "Write a 200-word structured abstract for the study following the IMRaD structure",
          "List 3 limitations (dataset size, compute budget, single domain) and propose a follow-up experiment for each",
        ],
      },
    ],
  },

  // ── Object Tracking ───────────────────────────────────────────────────────
  {
    id: "tracking",
    slug: "tracking",
    title: "Object Tracking",
    subtitle: "Associating identities across frames in real-world video",
    description:
      "From single-object trackers to multi-camera re-identification, this series covers the full tracking stack: motion modelling with Kalman filters, appearance-guided association, state-of-the-art MOT pipelines, and evaluation with standardised benchmarks.",
    color: "co4",
    icon: "Activity",
    estimatedHours: "12–15 hrs",
    prerequisites: ["Optical flow concepts", "Object detection basics", "NumPy & OpenCV"],
    tutorials: [
      {
        id: "tr-01",
        slug: "tracking-fundamentals-and-challenges",
        title: "Tracking Fundamentals & Challenges",
        description:
          "Define the tracking problem formally: single vs. multi-object, online vs. offline, appearance vs. motion cues. Catalogue practical failure modes.",
        duration: "60 min",
        difficulty: "Beginner",
        topics: [
          "SOT vs. MOT: task formulations and evaluation metrics",
          "Online vs. offline tracking trade-offs",
          "Failure modes: occlusion, ID switch, merge/split events, fast motion",
          "Tracking-by-detection paradigm and its assumptions",
          "Datasets: MOT17, MOT20, DanceTrack, BDD100K",
        ],
        tools: ["Python", "OpenCV", "Matplotlib"],
        learningObjectives: [
          "Define tracking formally as a state estimation problem over time",
          "Distinguish single-object tracking from multi-object tracking in terms of input and output",
          "List five common failure modes and the algorithmic cause of each",
          "Explain the tracking-by-detection paradigm and identify its two components",
        ],
        keyTakeaways: [
          "MOT assumes a black-box detector — trackers are evaluated on top of fixed detections",
          "ID switches happen when two tracks are spatially close and the association is ambiguous",
          "Online trackers process one frame at a time; offline trackers can use future frames",
          "DanceTrack is harder than MOT17 because objects look similar and motion is non-linear",
        ],
        exercises: [
          "Download MOT17 and visualise ground-truth tracks frame by frame with colour-coded IDs",
          "Count the number of ID switches in sequence MOT17-02 from the ground-truth file",
          "Write a function that parses a MOT-format results file and groups detections by track ID",
          "Implement a naive tracker (nearest centroid) and observe how quickly it accumulates ID switches",
        ],
      },
      {
        id: "tr-02",
        slug: "optical-flow-motion-prior",
        title: "Optical Flow as a Motion Prior",
        description:
          "Use sparse (Lucas-Kanade) and dense (Farneback) optical flow to propagate bounding boxes between detections and stabilise tracks during brief detector failures.",
        duration: "90 min",
        difficulty: "Beginner",
        topics: [
          "Sparse tracking with pyramidal Lucas-Kanade (good features to track)",
          "Feature point selection inside bounding boxes — region-constrained LK",
          "Dense Farneback flow for region-level motion estimation",
          "Handling boundary and occlusion: flow confidence filtering",
          "Flow + detection fusion: when to trust flow vs. detection",
        ],
        tools: ["OpenCV", "NumPy", "Matplotlib"],
        learningObjectives: [
          "Apply cv2.calcOpticalFlowPyrLK to track corner points inside a bounding box",
          "Estimate per-box motion vectors by aggregating sparse point flow",
          "Propagate bounding boxes using optical flow when the detector fires at low frequency",
          "Identify when optical flow propagation fails and fall back to detection",
        ],
        keyTakeaways: [
          "LK flow requires strong corner features inside the bounding box — thin objects have few",
          "Aggregating per-point flow into a box translation uses the median (robust to outliers)",
          "Dense flow is smoother but 10–100× slower than sparse LK on CPU",
          "Flow-based propagation is most useful at 5–10 Hz detectors in 30 Hz video",
        ],
        exercises: [
          "Track 10 corner points inside a bounding box across 50 frames using LK and visualise trajectories",
          "Estimate box translation from per-point flow using both mean and median — compare stability",
          "Run Farneback dense flow and visualise it as an HSV colour map on a dashcam video",
          "Implement a 'flow bridge': propagate boxes with LK when no detection fires and measure drift",
        ],
      },
      {
        id: "tr-03",
        slug: "kalman-filter-bounding-box",
        title: "Kalman Filter for Bounding Box Tracking",
        description:
          "Implement the full predict–update Kalman cycle for a constant-velocity bounding box state. Tune noise covariances and visualise the uncertainty ellipse during occlusion.",
        duration: "120 min",
        difficulty: "Intermediate",
        topics: [
          "State vector: [cx, cy, w, h, vx, vy, vw, vh] (8-dim)",
          "Constant velocity transition matrix F and process noise Q",
          "Measurement model H and observation noise R",
          "Predict step: x̂ = Fx, P = FPFᵀ + Q",
          "Update step: Kalman gain K, state correction, covariance update",
        ],
        tools: ["NumPy", "FilterPy", "Matplotlib"],
        learningObjectives: [
          "Define the 8-dimensional SORT state vector and explain each component",
          "Implement the predict and update steps of the Kalman filter from the matrix equations",
          "Tune Q and R covariances and observe the effect on the prediction uncertainty ellipse",
          "Simulate a 100-frame trajectory with periodic missing measurements and visualise uncertainty growth",
        ],
        keyTakeaways: [
          "The Kalman filter is optimal (minimum MMSE) for linear Gaussian systems",
          "Process noise Q controls how quickly the model trusts its own motion prediction",
          "Observation noise R controls how much each new detection corrects the state estimate",
          "During occlusion the predict step runs without an update — covariance grows each frame",
        ],
        exercises: [
          "Implement a `BBoxKalmanFilter` class with `predict()` and `update(det)` methods",
          "Simulate a box moving at constant velocity for 100 frames with 10% missing detections",
          "Visualise the 2-σ uncertainty ellipse on the (cx, cy) coordinates over time",
          "Compare FilterPy `KalmanFilter` output to your manual implementation on the same sequence",
        ],
      },
      {
        id: "tr-04",
        slug: "sort-simple-online-tracking",
        title: "SORT: Simple Online and Realtime Tracking",
        description:
          "Build SORT from components: Kalman motion prediction, IoU cost matrix, and the Hungarian algorithm for optimal detection-to-track assignment.",
        duration: "120 min",
        difficulty: "Intermediate",
        topics: [
          "SORT architecture: per-frame predict → match → update loop",
          "IoU-based cost matrix between predicted boxes and new detections",
          "Hungarian algorithm: scipy.optimize.linear_sum_assignment",
          "Track lifecycle: tentative (hits ≥ min_hits) → confirmed → deleted (age > max_age)",
          "SORT limitations: ID switches under occlusion",
        ],
        tools: ["Python", "NumPy", "FilterPy", "scipy", "Matplotlib"],
        learningObjectives: [
          "Build the full SORT pipeline by composing Kalman trackers and the Hungarian solver",
          "Implement the IoU cost matrix computation for all (track, detection) pairs",
          "Tune min_hits and max_age and observe their effect on ID stability vs. ghost tracks",
          "Run SORT on MOT17-02 detections and count MOTA, FP, FN, and ID switches",
        ],
        keyTakeaways: [
          "SORT achieves 59.8 MOTA on MOT17 while running at 260 Hz — speed is its advantage",
          "IoU-only association breaks when two tracks are close and both are plausible matches",
          "max_age controls how long a track survives without a detection (typical: 1–3 frames)",
          "The Hungarian algorithm solves the assignment in O(n³) — fine for <100 tracks per frame",
        ],
        exercises: [
          "Implement SORT from scratch in < 100 lines of Python and verify on a toy 2D sequence",
          "Run SORT on MOT17 detections and report MOTA using py-motmetrics",
          "Sweep max_age (1, 3, 10) and plot MOTA vs. IDF1 trade-off curve",
          "Visualise all ID switches in a 30-second clip with colour-coded track IDs",
        ],
      },
      {
        id: "tr-05",
        slug: "deepsort-appearance-guided",
        title: "DeepSORT: Appearance-Guided Association",
        description:
          "Extend SORT with a learned appearance descriptor. Implement cascaded matching — first by appearance, then by IoU for freshly occluded tracks.",
        duration: "120 min",
        difficulty: "Intermediate",
        topics: [
          "Re-identification feature extraction: cosine embedding from a ResNet",
          "Appearance distance: cosine distance vs. L2 in normalised space",
          "Cascaded matching: prioritise recently seen tracks with appearance, older ones with IoU",
          "Mahalanobis gate: reject detections that are implausible under the Kalman prediction",
          "Track gallery: maintain a rolling set of N appearance embeddings per track",
        ],
        tools: ["PyTorch", "OpenCV", "NumPy", "FilterPy"],
        learningObjectives: [
          "Extract 128-dim cosine embeddings for pedestrian crops using a pretrained ReID network",
          "Implement the cascaded matching strategy and explain why ordering matters",
          "Compute the Mahalanobis distance from a Kalman state to a detection bounding box",
          "Compare DeepSORT IDF1 vs. SORT IDF1 on MOT17 to quantify the ReID benefit",
        ],
        keyTakeaways: [
          "DeepSORT reduces ID switches by 45% relative to SORT on MOT17",
          "Cosine distance is more robust to feature magnitude variation than L2 for ReID",
          "The track gallery stores the last 100 embeddings per track and uses the minimum cosine distance",
          "Mahalanobis gating eliminates geometrically impossible detection-to-track pairs early",
        ],
        exercises: [
          "Crop pedestrian bounding boxes from MOT17 and extract ReID embeddings with a pretrained model",
          "Implement the gallery-based `min_cosine_distance(track_gallery, detection_feat)` function",
          "Run DeepSORT on MOT17-05 and compare IDF1 score to SORT on the same sequence",
          "Ablate the appearance weight: α=0 (SORT), α=0.5, α=1.0 and plot IDF1 change",
        ],
      },
      {
        id: "tr-06",
        slug: "bytetrack-low-confidence-detections",
        title: "ByteTrack: Recovering Low-Confidence Detections",
        description:
          "Understand ByteTrack's two-stage association: match high-confidence detections first, then use low-confidence ones to rescue tracks before deletion.",
        duration: "90 min",
        difficulty: "Advanced",
        topics: [
          "Motivation: low-score detections often overlap real occluded objects",
          "Stage 1: associate high-confidence detections (score > 0.6) with all tracks",
          "Stage 2: associate low-confidence detections (0.1–0.6) with unmatched tracks",
          "Detection score threshold sensitivity: MOTA/HOTA vs. threshold curve",
          "ByteTrack vs. DeepSORT on MOT17 and DanceTrack benchmarks",
        ],
        tools: ["PyTorch", "Ultralytics", "NumPy", "py-motmetrics"],
        learningObjectives: [
          "Explain why discarding low-confidence detections causes unnecessary track deletions",
          "Implement the two-stage matching loop using IoU cost matrices",
          "Run ByteTrack on a MOT17 sequence and compare HOTA vs. DeepSORT",
          "Tune the low-score threshold and observe the precision–recall trade-off",
        ],
        keyTakeaways: [
          "ByteTrack achieves 77.8 HOTA on MOT17 — state-of-the-art without a ReID network",
          "Low-score detections are noise for new track initialisation but useful for track continuation",
          "The two-stage design separates the initialisation problem from the continuation problem",
          "ByteTrack is the default tracker in Ultralytics YOLOv8 — 30 Hz on a single GPU",
        ],
        exercises: [
          "Implement the two-stage ByteTrack matching loop from the pseudo-code in the paper",
          "Run ByteTrack on MOT17-04 and report MOTA, HOTA, and IDF1",
          "Sweep low-score threshold from 0.05 to 0.5 and plot the HOTA curve",
          "Compare ByteTrack vs. SORT on DanceTrack and explain the difference in ID switches",
        ],
      },
      {
        id: "tr-07",
        slug: "transformer-tracking-motr-trackformer",
        title: "Transformer-Based Tracking: MOTR & TrackFormer",
        description:
          "Explore end-to-end multi-object tracking with transformers — no explicit association step needed. Track queries propagate across frames to maintain identity.",
        duration: "90 min",
        difficulty: "Advanced",
        topics: [
          "Track queries as persistent object slots carried across frames",
          "Temporal propagation: track query → cross-attention → update",
          "MOTR: multi-object tracking with transformers and temporal attention",
          "TrackFormer: joint detection and tracking in a single DETR-style forward pass",
          "Comparison: transformer trackers vs. two-step trackers on DanceTrack",
        ],
        tools: ["PyTorch", "Hugging Face Transformers", "Matplotlib"],
        learningObjectives: [
          "Explain how track queries in MOTR carry identity information across time",
          "Describe the difference between a detection query (new object) and a track query (existing object)",
          "Trace a TrackFormer forward pass through both the encoder and the decoder",
          "Compare end-to-end transformer tracking vs. SORT/ByteTrack on DanceTrack metrics",
        ],
        keyTakeaways: [
          "Track queries avoid explicit cost-matrix association entirely — matching is implicit in attention",
          "New object queries are added each frame; matched queries are propagated with their hidden state",
          "Transformer trackers learn to handle occlusion as part of end-to-end training",
          "Current SOTA methods (e.g., MOTRv2) combine transformer tracking with YOLO detections",
        ],
        exercises: [
          "Load a pretrained TrackFormer and run it on a 30-frame MOT17 clip",
          "Visualise the attention weights of two track queries on consecutive frames",
          "Count the number of parameters in the DETR encoder vs. the MOTR temporal extension",
          "Compare TrackFormer vs. ByteTrack ID-switch count on the same 60-second sequence",
        ],
      },
      {
        id: "tr-08",
        slug: "evaluating-multi-object-trackers",
        title: "Evaluating Multi-Object Trackers",
        description:
          "Run py-motmetrics on MOT17. Understand MOTA, MOTP, IDF1, and HOTA — and build intuition for when they agree and when they diverge.",
        duration: "90 min",
        difficulty: "Intermediate",
        topics: [
          "MOTA: FP + FN + ID-switch decomposition (detection-focused)",
          "MOTP: average IoU of matched pairs (localisation quality)",
          "IDF1: identity-centric ratio of correctly identified detections",
          "HOTA: geometric mean of detection accuracy and association accuracy",
          "Per-sequence and per-class metric breakdown with py-motmetrics",
        ],
        tools: ["py-motmetrics", "Pandas", "Matplotlib", "NumPy"],
        learningObjectives: [
          "Compute MOTA by hand for a toy 5-frame, 2-object sequence",
          "Explain why a tracker can have high MOTA but low IDF1",
          "Use py-motmetrics to evaluate a tracker results file against MOT17 ground truth",
          "Interpret the full CLEARMOT + ID metrics table output from py-motmetrics",
        ],
        keyTakeaways: [
          "MOTA heavily penalises FN — a tracker that detects more objects can have high MOTA but many ghosts",
          "IDF1 rewards consistent identity: correctly re-associating after occlusion improves IDF1 but not MOTA",
          "HOTA was proposed in 2020 to balance detection and association — it is now the primary MOT benchmark metric",
          "Per-sequence breakdown reveals whether a tracker fails on crowded vs. sparse scenes",
        ],
        exercises: [
          "Compute MOTA, MOTP, and IDF1 manually for a hand-crafted 10-frame ground truth + result pair",
          "Run py-motmetrics on SORT vs. DeepSORT results on 4 MOT17 sequences",
          "Generate a radar chart comparing MOTA, IDF1, HOTA across SORT, DeepSORT, ByteTrack",
          "Write a function that reads a py-motmetrics summary and flags the worst sequence per metric",
        ],
      },
    ],
  },
];
