"use client";
import type { CSSProperties, ReactNode } from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const ANIMATION_SPEED = 2.35;

// ── Isometric helpers ────────────────────────────────────────────────────
function isoProject(
  x: number, y: number, z: number,
  cx: number, cy: number, scale: number
): [number, number] {
  const ang = Math.PI / 6;
  return [
    cx + (x - z) * scale * Math.cos(ang),
    cy - y * scale + (x + z) * scale * 0.28,
  ];
}

// ── Stage definitions ────────────────────────────────────────────────────
const STAGES = [
  {
    id: "world",
    label: "World",
    fullLabel: "World Frame",
    color: "#3b82f6",
    subtitle: "3D global coordinates",
    formulaLines: ["P_w = [X  Y  Z  1]ᵀ", "Global reference frame"],
    desc: "A 3D point P_w is expressed in the world coordinate frame — a fixed global reference shared by all objects. Measured in real-world units (e.g. metres).",
    transform: "R, t (extrinsic)  →",
  },
  {
    id: "camera",
    label: "Camera",
    fullLabel: "Camera Frame",
    color: "#10b981",
    subtitle: "Extrinsic [R | t]",
    formulaLines: ["P_c = R · P_w + t", "R ∈ SO(3),  t ∈ ℝ³"],
    desc: "The extrinsic matrix [R|t] is a rigid-body transform that converts world coordinates into the camera's local frame. The camera optical axis points along +Z_c.",
    transform: "÷ Z_c (perspective)  →",
  },
  {
    id: "image",
    label: "Image",
    fullLabel: "Image Plane",
    color: "#f59e0b",
    subtitle: "Perspective divide",
    formulaLines: ["x = X_c / Z_c", "y = Y_c / Z_c"],
    desc: "Dividing by depth Z_c performs perspective projection onto the normalised image plane at z = 1. Points on the same ray through the optical centre map to the same image point.",
    transform: "K (intrinsic)  →",
  },
  {
    id: "pixel",
    label: "Pixel",
    fullLabel: "Pixel Frame",
    color: "#ef4444",
    subtitle: "Intrinsic matrix K",
    formulaLines: ["u = f_x · x + c_x", "v = f_y · y + c_y"],
    desc: "The intrinsic matrix K scales by focal lengths (f_x, f_y) and offsets by the principal point (c_x, c_y) to produce discrete pixel coordinates (u, v) on the image sensor.",
    transform: null,
  },
] as const;

// ── Stage SVG panels ─────────────────────────────────────────────────────

function WorldSVG({ t }: { t: number }) {
  const cx = 150, cy = 110, scale = 38;
  // Animated point path in world coords
  const px = 0.9 + 0.4 * Math.sin(t * 0.8);
  const py = 0.7 + 0.3 * Math.cos(t * 0.6);
  const pz = 0.5 + 0.4 * Math.sin(t * 0.5 + 1);

  const origin = isoProject(0, 0, 0, cx, cy, scale);
  const xTip   = isoProject(2, 0, 0, cx, cy, scale);
  const yTip   = isoProject(0, 2, 0, cx, cy, scale);
  const zTip   = isoProject(0, 0, 2, cx, cy, scale);
  const point  = isoProject(px, py, pz, cx, cy, scale);

  // Grid floor
  const gridLines: [number, number, number, number][] = [];
  for (let i = -1; i <= 3; i++) {
    const a = isoProject(i, 0, -1, cx, cy, scale);
    const b = isoProject(i, 0,  3, cx, cy, scale);
    const c = isoProject(-1, 0, i, cx, cy, scale);
    const d = isoProject( 3, 0, i, cx, cy, scale);
    gridLines.push([a[0], a[1], b[0], b[1]]);
    gridLines.push([c[0], c[1], d[0], d[1]]);
  }

  return (
    <svg viewBox="0 0 300 200" width={300} height={200} style={{ display: "block" }}>
      {/* Grid */}
      {gridLines.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#e5e7eb" strokeWidth={0.6} />
      ))}
      {/* Axes */}
      <line x1={origin[0]} y1={origin[1]} x2={xTip[0]} y2={xTip[1]} stroke="#ef4444" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={origin[0]} y1={origin[1]} x2={yTip[0]} y2={yTip[1]} stroke="#22c55e" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={origin[0]} y1={origin[1]} x2={zTip[0]} y2={zTip[1]} stroke="#3b82f6" strokeWidth={2.5} strokeLinecap="round" />
      <text x={xTip[0] + 5} y={xTip[1] + 4} fontSize={11} fill="#ef4444" fontWeight="bold">X_w</text>
      <text x={yTip[0] + 3} y={yTip[1] - 3} fontSize={11} fill="#22c55e" fontWeight="bold">Y_w</text>
      <text x={zTip[0] - 20} y={zTip[1] + 12} fontSize={11} fill="#3b82f6" fontWeight="bold">Z_w</text>
      {/* Origin dot */}
      <circle cx={origin[0]} cy={origin[1]} r={4} fill="#6b7280" />
      <text x={origin[0] - 10} y={origin[1] + 14} fontSize={10} fill="#6b7280">O_w</text>
      {/* Point P */}
      <line x1={origin[0]} y1={origin[1]} x2={point[0]} y2={point[1]} stroke="#3b82f6" strokeWidth={1} strokeDasharray="3 3" strokeOpacity={0.5} />
      <circle cx={point[0]} cy={point[1]} r={6} fill="#3b82f6" fillOpacity={0.2} stroke="#3b82f6" strokeWidth={2} />
      <circle cx={point[0]} cy={point[1]} r={3} fill="#3b82f6" />
      <text x={point[0] + 9} y={point[1] - 4} fontSize={11} fill="#3b82f6" fontWeight="bold">P_w</text>
    </svg>
  );
}

function CameraSVG({ t }: { t: number }) {
  const cx = 150, cy = 110, scale = 38;
  const origin = isoProject(0, 0, 0, cx, cy, scale);
  const xTip   = isoProject(2, 0, 0, cx, cy, scale);
  const yTip   = isoProject(0, 2, 0, cx, cy, scale);
  const zTip   = isoProject(0, 0, 2.5, cx, cy, scale);

  // Animated point in camera frame
  const px = 0.6 + 0.3 * Math.sin(t * 0.7);
  const py = 0.4 + 0.2 * Math.cos(t * 0.5);
  const pz = 1.8 + 0.3 * Math.sin(t * 0.4);
  const point = isoProject(px, py, pz, cx, cy, scale);

  // Image plane quad
  const planePts = [
    isoProject(-0.7, -0.6, 2.5, cx, cy, scale),
    isoProject( 0.7, -0.6, 2.5, cx, cy, scale),
    isoProject( 0.7,  0.6, 2.5, cx, cy, scale),
    isoProject(-0.7,  0.6, 2.5, cx, cy, scale),
  ];
  const planeStr = planePts.map(p => p.join(",")).join(" ");

  // Ray from origin through point to image plane
  const imgPx = (px / pz) * 2.5;
  const imgPy = (py / pz) * 2.5;
  const imgPt = isoProject(imgPx, imgPy, 2.5, cx, cy, scale);

  return (
    <svg viewBox="0 0 300 200" width={300} height={200} style={{ display: "block" }}>
      {/* Camera axes */}
      <line x1={origin[0]} y1={origin[1]} x2={xTip[0]} y2={xTip[1]} stroke="#ef4444" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={origin[0]} y1={origin[1]} x2={yTip[0]} y2={yTip[1]} stroke="#22c55e" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={origin[0]} y1={origin[1]} x2={zTip[0]} y2={zTip[1]} stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" />
      <text x={xTip[0] + 5} y={xTip[1] + 4} fontSize={11} fill="#ef4444" fontWeight="bold">X_c</text>
      <text x={yTip[0] + 3} y={yTip[1] - 3} fontSize={11} fill="#22c55e" fontWeight="bold">Y_c</text>
      <text x={zTip[0] - 2} y={zTip[1] + 14} fontSize={11} fill="#10b981" fontWeight="bold">Z_c</text>
      {/* Image plane */}
      <polygon points={planeStr} fill="#10b98115" stroke="#10b981" strokeWidth={1.2} strokeDasharray="4 2" />
      {/* Ray */}
      <line x1={origin[0]} y1={origin[1]} x2={point[0]} y2={point[1]} stroke="#10b981" strokeWidth={1} strokeDasharray="3 3" strokeOpacity={0.6} />
      <line x1={point[0]} y1={point[1]} x2={imgPt[0]} y2={imgPt[1]} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 3" strokeOpacity={0.6} />
      {/* Origin camera */}
      <circle cx={origin[0]} cy={origin[1]} r={5} fill="#10b981" />
      <text x={origin[0] - 12} y={origin[1] + 15} fontSize={10} fill="#10b981">O_c</text>
      {/* Point P_c */}
      <circle cx={point[0]} cy={point[1]} r={6} fill="#10b981" fillOpacity={0.2} stroke="#10b981" strokeWidth={2} />
      <circle cx={point[0]} cy={point[1]} r={3} fill="#10b981" />
      <text x={point[0] + 9} y={point[1] - 4} fontSize={11} fill="#10b981" fontWeight="bold">P_c</text>
      {/* Projected point on image plane */}
      <circle cx={imgPt[0]} cy={imgPt[1]} r={4} fill="#f59e0b" />
      <text x={imgPt[0] + 7} y={imgPt[1] - 3} fontSize={10} fill="#f59e0b">p</text>
      {/* Depth label */}
      <text x={zTip[0] - 16} y={zTip[1] + 28} fontSize={9} fill="#6b7280">Z_c = depth</text>
    </svg>
  );
}

function ImagePlaneSVG({ t }: { t: number }) {
  const cx = 150, cy = 100;
  // Animated normalised image point
  const nx = 0.25 + 0.15 * Math.sin(t * 0.7);
  const ny = 0.18 + 0.12 * Math.cos(t * 0.5);
  const px = cx + nx * 80;
  const py = cy - ny * 80;

  return (
    <svg viewBox="0 0 300 200" width={300} height={200} style={{ display: "block" }}>
      {/* Grid */}
      {[-2,-1,0,1,2].map(i => (
        <line key={`gx${i}`} x1={cx + i * 40} y1={20} x2={cx + i * 40} y2={180} stroke="#e5e7eb" strokeWidth={0.6} />
      ))}
      {[-2,-1,0,1,2].map(i => (
        <line key={`gy${i}`} x1={20} y1={cy + i * 40} x2={280} y2={cy + i * 40} stroke="#e5e7eb" strokeWidth={0.6} />
      ))}
      {/* Axes */}
      <line x1={20} y1={cy} x2={280} y2={cy} stroke="#d1d5db" strokeWidth={1.2} />
      <line x1={cx} y1={180} x2={cx} y2={20} stroke="#d1d5db" strokeWidth={1.2} />
      <polygon points={`280,${cy} 272,${cy-4} 272,${cy+4}`} fill="#d1d5db" />
      <polygon points={`${cx},20 ${cx-4},28 ${cx+4},28`} fill="#d1d5db" />
      <text x={268} y={cy - 8} fontSize={11} fill="#9ca3af">x</text>
      <text x={cx + 6} y={28} fontSize={11} fill="#9ca3af">y</text>
      {/* Origin */}
      <circle cx={cx} cy={cy} r={3.5} fill="#6b7280" />
      <text x={cx + 6} y={cy + 14} fontSize={10} fill="#6b7280">O (0,0)</text>
      {/* Unit circle */}
      <circle cx={cx} cy={cy} r={80} fill="none" stroke="#f59e0b" strokeWidth={1} strokeDasharray="5 3" strokeOpacity={0.4} />
      <text x={cx + 80 + 4} y={cy + 4} fontSize={9} fill="#f59e0b" opacity={0.7}>r=1</text>
      {/* Projected normalised point */}
      <line x1={cx} y1={cy} x2={px} y2={py} stroke="#f59e0b" strokeWidth={1.2} strokeDasharray="3 3" />
      <line x1={px} y1={cy} x2={px} y2={py} stroke="#f59e0b" strokeWidth={1} strokeDasharray="2 2" strokeOpacity={0.5} />
      <line x1={cx} y1={py} x2={px} y2={py} stroke="#f59e0b" strokeWidth={1} strokeDasharray="2 2" strokeOpacity={0.5} />
      <circle cx={px} cy={py} r={6} fill="#f59e0b" fillOpacity={0.2} stroke="#f59e0b" strokeWidth={2} />
      <circle cx={px} cy={py} r={3} fill="#f59e0b" />
      <text x={px + 9} y={py - 4} fontSize={11} fill="#f59e0b" fontWeight="bold">p</text>
      <text x={px + 9} y={py + 10} fontSize={9} fill="#9ca3af">(x, y)</text>
      {/* Coord lines label */}
      <text x={cx + 4} y={py + 4} fontSize={9} fill="#9ca3af">y</text>
      <text x={px + 2} y={cy + 12} fontSize={9} fill="#9ca3af">x</text>
    </svg>
  );
}

function PixelSVG({ t }: { t: number }) {
  const fx = 120, fy = 110, pcx = 145, pcy = 100;
  const nx = 0.25 + 0.15 * Math.sin(t * 0.7);
  const ny = 0.18 + 0.12 * Math.cos(t * 0.5);
  const u = pcx + fx * nx;
  const v = pcy - fy * ny;
  const uPx = Math.round(u / 8) * 8;
  const vPx = Math.round(v / 8) * 8;

  // Draw pixel grid
  const cells: { x: number; y: number; active: boolean }[] = [];
  for (let row = 0; row < 22; row++) {
    for (let col = 0; col < 38; col++) {
      const x = col * 8;
      const y = row * 8;
      const active = x === uPx - (uPx % 8) && y === vPx - (vPx % 8);
      cells.push({ x, y, active });
    }
  }

  return (
    <svg viewBox="0 0 300 180" width={300} height={180} style={{ display: "block" }}>
      {/* Pixel grid */}
      {cells.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={8} height={8}
          fill={c.active ? "#ef444430" : "none"}
          stroke="#e5e7eb" strokeWidth={0.4} />
      ))}
      {/* Principal point */}
      <circle cx={pcx} cy={pcy} r={4} fill="none" stroke="#6b7280" strokeWidth={1.5} strokeDasharray="3 2" />
      <text x={pcx + 7} y={pcy + 4} fontSize={9} fill="#6b7280">(c_x, c_y)</text>
      {/* Projected pixel */}
      <rect x={uPx - (uPx % 8)} y={vPx - (vPx % 8)} width={8} height={8} fill="#ef444440" stroke="#ef4444" strokeWidth={1.5} />
      <circle cx={u} cy={v} r={5} fill="#ef4444" fillOpacity={0.25} stroke="#ef4444" strokeWidth={2} />
      <circle cx={u} cy={v} r={2.5} fill="#ef4444" />
      <text x={u + 9} y={v - 4} fontSize={11} fill="#ef4444" fontWeight="bold">p</text>
      <text x={u + 9} y={v + 9} fontSize={9} fill="#9ca3af">(u, v)</text>
      {/* Axis labels */}
      <text x={8} y={172} fontSize={9} fill="#9ca3af">u →</text>
      <text x={2} y={12} fontSize={9} fill="#9ca3af">↓ v</text>
    </svg>
  );
}

// ── Pinhole camera diagram ───────────────────────────────────────────────
function PinholeDiagram({ t }: { t: number }) {
  // Scene points (animated slightly)
  const pts: [number, number][] = [
    [40,  50 + 6 * Math.sin(t * 0.4)],
    [40,  90],
    [40, 130 + 4 * Math.cos(t * 0.35)],
  ];
  const pinhole: [number, number] = [200, 100];
  const imagePlaneX = 310;

  // Project through pinhole onto image plane
  const project = ([sx, sy]: [number, number]): [number, number] => {
    const scale = (imagePlaneX - pinhole[0]) / (pinhole[0] - sx);
    return [imagePlaneX, pinhole[1] + (pinhole[1] - sy) * scale];
  };

  const imgPts = pts.map(project);

  const colors = ["#3b82f6", "#10b981", "#f59e0b"];

  return (
    <svg viewBox="0 0 460 200" width="100%" height={200} style={{ display: "block" }}>
      {/* Background zones */}
      <rect x={0}   y={0} width={170} height={200} fill="#3b82f610" rx={4} />
      <rect x={170} y={0} width={60}  height={200} fill="#10b98110" rx={4} />
      <rect x={290} y={0} width={170} height={200} fill="#ef444410" rx={4} />

      {/* Zone labels */}
      <text x={85}  y={18} textAnchor="middle" fontSize={10} fill="#3b82f6" fontWeight="600">Scene (World)</text>
      <text x={200} y={18} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight="600">Camera</text>
      <text x={375} y={18} textAnchor="middle" fontSize={10} fill="#ef4444" fontWeight="600">Image Sensor</text>

      {/* Optical axis */}
      <line x1={30} y1={100} x2={430} y2={100} stroke="#d1d5db" strokeWidth={1} strokeDasharray="6 4" />
      <text x={430} y={96} fontSize={9} fill="#9ca3af">optical axis</text>

      {/* Image plane (vertical line) */}
      <line x1={imagePlaneX} y1={30} x2={imagePlaneX} y2={170} stroke="#ef4444" strokeWidth={2.5} strokeLinecap="round" />
      <text x={imagePlaneX} y={180} textAnchor="middle" fontSize={10} fill="#ef4444">image plane</text>

      {/* Pinhole */}
      <circle cx={pinhole[0]} cy={pinhole[1]} r={7} fill="white" stroke="#10b981" strokeWidth={2.5} />
      <circle cx={pinhole[0]} cy={pinhole[1]} r={2} fill="#10b981" />
      <text x={pinhole[0]} y={pinhole[1] + 20} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight="600">pinhole</text>
      <text x={pinhole[0]} y={pinhole[1] + 32} textAnchor="middle" fontSize={9} fill="#10b981">(optical centre)</text>

      {/* Scene object (simple box) */}
      <rect x={20} y={44} width={30} height={90} fill="none" stroke="#6b7280" strokeWidth={1.2} strokeDasharray="3 2" rx={2} />

      {/* Rays and scene/image points */}
      {pts.map(([sx, sy], i) => {
        const [ix, iy] = imgPts[i];
        return (
          <g key={i}>
            {/* Ray: scene → pinhole */}
            <line x1={sx} y1={sy} x2={pinhole[0]} y2={pinhole[1]} stroke={colors[i]} strokeWidth={1.2} strokeOpacity={0.6} />
            {/* Ray: pinhole → image */}
            <line x1={pinhole[0]} y1={pinhole[1]} x2={ix} y2={iy} stroke={colors[i]} strokeWidth={1.2} strokeOpacity={0.8} strokeDasharray="4 2" />
            {/* Scene point */}
            <circle cx={sx} cy={sy} r={5} fill={colors[i]} fillOpacity={0.25} stroke={colors[i]} strokeWidth={1.5} />
            <circle cx={sx} cy={sy} r={2.5} fill={colors[i]} />
            {/* Image point */}
            <circle cx={ix} cy={iy} r={4} fill={colors[i]} />
          </g>
        );
      })}

      {/* Focal length annotation */}
      <line x1={pinhole[0]} y1={150} x2={imagePlaneX} y2={150} stroke="#6b7280" strokeWidth={1} markerEnd="url(#arr)" />
      <line x1={imagePlaneX} y1={150} x2={pinhole[0]} y2={150} stroke="#6b7280" strokeWidth={1} />
      <text x={(pinhole[0] + imagePlaneX) / 2} y={164} textAnchor="middle" fontSize={10} fill="#6b7280">f (focal length)</text>

      {/* Labels for scene points */}
      <text x={pts[0][0] - 14} y={pts[0][1] + 4} fontSize={10} fill={colors[0]} fontWeight="bold">P₁</text>
      <text x={pts[1][0] - 14} y={pts[1][1] + 4} fontSize={10} fill={colors[1]} fontWeight="bold">P₂</text>
      <text x={pts[2][0] - 14} y={pts[2][1] + 4} fontSize={10} fill={colors[2]} fontWeight="bold">P₃</text>

      {/* Labels for image points */}
      <text x={imgPts[0][0] + 6} y={imgPts[0][1] + 4} fontSize={10} fill={colors[0]}>p₁</text>
      <text x={imgPts[1][0] + 6} y={imgPts[1][1] + 4} fontSize={10} fill={colors[1]}>p₂</text>
      <text x={imgPts[2][0] + 6} y={imgPts[2][1] + 4} fontSize={10} fill={colors[2]}>p₃</text>

      {/* Inversion note */}
      <text x={380} y={90} fontSize={9} fill="#9ca3af" textAnchor="middle">inverted</text>
      <text x={380} y={102} fontSize={9} fill="#9ca3af" textAnchor="middle">& flipped</text>
    </svg>
  );
}

function EquationPanel({
  stageId,
  color,
}: {
  stageId: typeof STAGES[number]["id"];
  color: string;
}) {
  const content: Record<typeof STAGES[number]["id"], ReactNode> = {
    world: (
      <>
        <EquationRow color={color}>
          <Symbol>P_w</Symbol>
          <span>=</span>
          <Vector values={["X_w", "Y_w", "Z_w", "1"]} />
        </EquationRow>
        <EquationNote>Homogeneous 3D point in the fixed world frame.</EquationNote>
      </>
    ),
    camera: (
      <>
        <EquationRow color={color}>
          <Symbol>P_c</Symbol>
          <span>=</span>
          <Symbol>R</Symbol>
          <Symbol>P_w</Symbol>
          <span>+</span>
          <Symbol>t</Symbol>
        </EquationRow>
        <EquationRow color={color} compact>
          <Symbol>[R | t]</Symbol>
          <span>maps world coordinates into the camera frame</span>
        </EquationRow>
      </>
    ),
    image: (
      <>
        <EquationRow color={color}>
          <Symbol>x</Symbol>
          <span>=</span>
          <Fraction top="X_c" bottom="Z_c" color={color} />
          <span className="mx-1 text-[var(--muted)]">and</span>
          <Symbol>y</Symbol>
          <span>=</span>
          <Fraction top="Y_c" bottom="Z_c" color={color} />
        </EquationRow>
        <EquationNote>Depth divides the camera point, creating perspective shrinkage.</EquationNote>
      </>
    ),
    pixel: (
      <>
        <EquationRow color={color}>
          <Symbol>u</Symbol>
          <span>=</span>
          <Symbol>f_x x</Symbol>
          <span>+</span>
          <Symbol>c_x</Symbol>
        </EquationRow>
        <EquationRow color={color}>
          <Symbol>v</Symbol>
          <span>=</span>
          <Symbol>f_y y</Symbol>
          <span>+</span>
          <Symbol>c_y</Symbol>
        </EquationRow>
      </>
    ),
  };

  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm">
      {content[stageId]}
    </div>
  );
}

function EquationRow({
  children,
  color,
  compact = false,
}: {
  children: ReactNode;
  color: string;
  compact?: boolean;
}) {
  return (
    <div
      className={[
        "flex flex-wrap items-center gap-2 font-mono",
        compact ? "mt-2 text-[10px] text-[var(--muted)]" : "text-[13px] text-[var(--ink)]",
      ].join(" ")}
      style={{ "--eq-color": color } as CSSProperties}
    >
      {children}
    </div>
  );
}

function Symbol({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-[color-mix(in_srgb,var(--eq-color)_12%,transparent)] px-1.5 py-0.5 font-bold text-[var(--eq-color)]">
      {children}
    </span>
  );
}

function Vector({ values }: { values: string[] }) {
  return (
    <span className="inline-flex items-stretch overflow-hidden rounded border border-[var(--border)] bg-[var(--surface-2)]">
      <span className="px-1.5 text-lg leading-7 text-[var(--muted)]">[</span>
      <span className="grid grid-cols-4 divide-x divide-[var(--border)]">
        {values.map((value) => (
          <span key={value} className="px-1.5 py-1 text-center text-[10px] font-bold text-[var(--eq-color)]">
            {value}
          </span>
        ))}
      </span>
      <span className="px-1.5 text-lg leading-7 text-[var(--muted)]">]</span>
      <span className="border-l border-[var(--border)] px-1 py-1 text-[10px] font-bold text-[var(--muted)]">T</span>
    </span>
  );
}

function Fraction({ top, bottom, color }: { top: string; bottom: string; color: string }) {
  return (
    <span className="inline-flex min-w-10 flex-col items-center rounded bg-[var(--surface-2)] px-2 py-1 leading-none">
      <span className="border-b border-[var(--border)] px-1 pb-1 font-bold" style={{ color }}>
        {top}
      </span>
      <span className="px-1 pt-1 font-bold" style={{ color }}>
        {bottom}
      </span>
    </span>
  );
}

function EquationNote({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-[10px] leading-relaxed text-[var(--muted)]">{children}</p>;
}

function MatrixBlock({
  title,
  rows,
  color,
  note,
}: {
  title: string;
  rows: string[][];
  color: string;
  note?: string;
}) {
  return (
    <div>
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">{title}</p>
      <div className="inline-flex max-w-full flex-col gap-0.5 overflow-x-auto font-mono text-xs">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="select-none text-lg leading-none text-[var(--muted)]">
              [
            </span>
            <div className="flex gap-1 rounded bg-[var(--surface-2)] px-1.5 py-0.5">
              {row.map((cell, j) => (
                <span
                  key={j}
                  className="min-w-[24px] text-center text-[10px]"
                  style={{
                    color: cell === "0" || cell === "1" ? "var(--muted)" : color,
                    fontWeight: cell === "0" || cell === "1" ? 400 : 700,
                  }}
                >
                  {cell}
                </span>
              ))}
            </div>
            <span className="select-none text-lg leading-none text-[var(--muted)]">]</span>
          </div>
        ))}
      </div>
      {note && <p className="mt-1.5 text-[10px] text-[var(--muted)]">{note}</p>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function PinholeCameraAnimation() {
  const [playing, setPlaying]         = useState(true);
  const [t, setT]                     = useState(0);
  const rafRef                        = useRef<number>(0);
  const lastRef                       = useRef<number | null>(null);

  // Animate time
  useEffect(() => {
    if (!playing) { cancelAnimationFrame(rafRef.current); lastRef.current = null; return; }
    const loop = (now: number) => {
      if (lastRef.current !== null) setT(prev => prev + ((now - lastRef.current!) / 1000) * ANIMATION_SPEED);
      lastRef.current = now;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  const K_MATRIX = [
    ["f_x", "0",   "c_x"],
    ["0",   "f_y", "c_y"],
    ["0",   "0",   "1"  ],
  ];

  const EXTRINSIC = [
    ["R₁₁", "R₁₂", "R₁₃", "t_x"],
    ["R₂₁", "R₂₂", "R₂₃", "t_y"],
    ["R₃₁", "R₃₂", "R₃₃", "t_z"],
    ["0",   "0",   "0",   "1"  ],
  ];

  const FULL_PIPELINE = [
    ["f_x", "0",   "c_x", "0"],
    ["0",   "f_y", "c_y", "0"],
    ["0",   "0",   "1",   "0"],
  ];

  const renderStageSVG = useCallback((index: number) => {
    switch (index) {
      case 0: return <WorldSVG t={t} />;
      case 1: return <CameraSVG t={t} />;
      case 2: return <ImagePlaneSVG t={t} />;
      case 3: return <PixelSVG t={t} />;
      default: return null;
    }
  }, [t]);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 mb-8">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="font-semibold text-[var(--ink)] text-sm mb-0.5">
            Camera Projection Pipeline
          </h2>
          <p className="text-xs text-[var(--muted)]">
            World &gt; Camera &gt; Image &gt; Pixel frame - all four coordinate transformations at once
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPlaying(p => !p)}
            className="text-xs px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors font-medium"
          >
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
        </div>
      </div>

      {/* Four projection stages */}
      <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {STAGES.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: index * 0.04 }}
            className="min-w-0 rounded-lg border border-[var(--border)] bg-[var(--canvas)]"
          >
            <div className="border-b border-[var(--border)] p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
                  style={{ backgroundColor: stage.color }}
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-[var(--ink)]">{stage.fullLabel}</h3>
                  <p className="truncate text-[10px] text-[var(--muted)]">{stage.subtitle}</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-[var(--muted)]">{stage.desc}</p>
            </div>

            <div className="border-b border-[var(--border)] bg-neutral-50 p-2 dark:bg-neutral-900 [&>svg]:h-auto [&>svg]:w-full">
              {renderStageSVG(index)}
            </div>

            <div className="space-y-3 p-3">
              <div>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">Formula</p>
                <EquationPanel stageId={stage.id} color={stage.color} />
              </div>

              {index < STAGES.length - 1 && (
                <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-[10px] font-semibold text-[var(--muted)]">
                  Next: {stage.transform}
                </div>
              )}

              {index === 1 && (
                <MatrixBlock title="Extrinsic [R | t]" rows={EXTRINSIC} color={stage.color} />
              )}
              {index === 2 && (
                <MatrixBlock title="Projection P = K [R | t]" rows={FULL_PIPELINE} color={stage.color} note="p~ = P * P~_w" />
              )}
              {index === 3 && (
                <MatrixBlock title="Intrinsic K" rows={K_MATRIX} color={stage.color} />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pinhole camera model diagram */}
      <div className="rounded-md border border-[var(--border)] bg-neutral-50 dark:bg-neutral-900 p-3">
        <p className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-widest mb-3">
          Pinhole Camera Model — Ray Projection
        </p>
        <PinholeDiagram t={t} />
        <p className="text-xs text-[var(--muted)] mt-2 leading-relaxed">
          Each scene point P projects through the optical centre onto the image plane. The projection is perspective: a ray from P through the pinhole hits the image plane at p = (f·X_c/Z_c, f·Y_c/Z_c). The image is inverted and depth information is lost.
        </p>
      </div>
    </div>
  );
}
