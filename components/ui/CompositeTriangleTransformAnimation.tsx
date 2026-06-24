"use client";

import { useEffect, useState } from "react";

type Vec3 = [number, number, number];

interface Point3D {
  id: "A" | "B" | "C";
  value: Vec3;
}

interface FrameState {
  points: Point3D[];
  stage: string;
  stageProgress: number;
  angleDeg: number;
  scale: Vec3;
  description: string;
}

const W = 360;
const H = 280;
const VIEW_SCALE = 44;
const CENTER_X = 168;
const CENTER_Y = 148;

const PIVOT: Vec3 = [1.2, 0.8, 0.5];
const TRIANGLE: Point3D[] = [
  { id: "A", value: [0.35, 0.2, 0.25] },
  { id: "B", value: [2.15, 0.25, 0.6] },
  { id: "C", value: [1.05, 1.9, 0.45] },
];

const BASE_SCALE: Vec3 = [1.35, 0.78, 1.2];

const PROCESS_STEPS = [
  {
    label: "1",
    title: "Move pivot to origin",
    math: "q = v - P",
    detail: "Subtract P from each vertex so rotation and scale happen around the pivot, not the world origin.",
  },
  {
    label: "2",
    title: "Apply local transform",
    math: "r = S R q",
    detail: "Rotate in the local frame, then scale the rotated coordinates. The pivot remains fixed in local space.",
  },
  {
    label: "3",
    title: "Move back to world frame",
    math: "v' = r + P",
    detail: "Add the pivot back so the transformed triangle returns to the original coordinate frame.",
  },
];

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function ease(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function mul(a: Vec3, b: Vec3): Vec3 {
  return [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
}

function scaleVec(a: Vec3, s: number): Vec3 {
  return [a[0] * s, a[1] * s, a[2] * s];
}

function rotateZ(v: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];
}

function rotateX(v: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c];
}

function project(v: Vec3): [number, number] {
  return [
    CENTER_X + (v[0] - v[2] * 0.48) * VIEW_SCALE,
    CENTER_Y - (v[1] + v[2] * 0.36) * VIEW_SCALE,
  ];
}

function format(value: number) {
  return value.toFixed(2);
}

function vecLabel(v: Vec3) {
  return `(${v.map(format).join(", ")})`;
}

function computeFrame(time: number): FrameState {
  const cycle = (time % 8.4) / 8.4;

  let toOrigin = 0;
  let shapeTransform = 0;
  let backToPivot = 0;
  let stage = "1. Translate pivot P to origin";
  let stageProgress = 0;
  let description = PROCESS_STEPS[0].detail;

  if (cycle < 0.28) {
    stageProgress = ease(cycle / 0.28);
    toOrigin = stageProgress;
  } else if (cycle < 0.62) {
    stage = "2. Rotate and scale about origin";
    description = PROCESS_STEPS[1].detail;
    toOrigin = 1;
    stageProgress = ease((cycle - 0.28) / 0.34);
    shapeTransform = stageProgress;
  } else if (cycle < 0.86) {
    stage = "3. Translate result back to pivot P";
    description = PROCESS_STEPS[2].detail;
    toOrigin = 1;
    shapeTransform = 1;
    stageProgress = ease((cycle - 0.62) / 0.24);
    backToPivot = stageProgress;
  } else {
    stage = "4. Composite transform complete";
    description = "The single homogeneous matrix T(P) S R T(-P) now maps each original vertex directly to its final world coordinate.";
    toOrigin = 1;
    shapeTransform = 1;
    backToPivot = 1;
    stageProgress = 1;
  }

  const angle = lerp(0, Math.PI * 0.72, shapeTransform);
  const currentScale: Vec3 = [
    lerp(1, BASE_SCALE[0], shapeTransform),
    lerp(1, BASE_SCALE[1], shapeTransform),
    lerp(1, BASE_SCALE[2], shapeTransform),
  ];

  const points = TRIANGLE.map(({ id, value }) => {
    const local = sub(value, scaleVec(PIVOT, toOrigin));
    const rotated = rotateX(rotateZ(local, angle), angle * 0.35);
    const scaled = mul(rotated, currentScale);
    const translatedBack = add(scaled, scaleVec(PIVOT, backToPivot));
    return { id, value: translatedBack };
  });

  return {
    points,
    stage,
    stageProgress,
    angleDeg: angle * (180 / Math.PI),
    scale: currentScale,
    description,
  };
}

function polygon(points: Point3D[]) {
  return points.map((p) => project(p.value).join(",")).join(" ");
}

function AxisLine({ from, to, color, label }: { from: Vec3; to: Vec3; color: string; label: string }) {
  const [x1, y1] = project(from);
  const [x2, y2] = project(to);

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <text x={x2 + 4} y={y2 + 3} fontSize={10} fontWeight={700} fill={color}>
        {label}
      </text>
    </g>
  );
}

export default function CompositeTriangleTransformAnimation() {
  const [frame, setFrame] = useState<FrameState>(() => computeFrame(0));

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    const loop = (now: number) => {
      const seconds = (now - start) / 1000;
      setFrame(computeFrame(seconds));
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pivot2d = project(PIVOT);
  const origin2d = project([0, 0, 0]);
  const originalPolygon = polygon(TRIANGLE);
  const currentPolygon = polygon(frame.points);

  return (
    <section className="mb-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[var(--ink)]">Composite 3D Transformation Demo</h2>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
            Triangle vertices are transformed around an arbitrary pivot P: translate to origin, rotate and scale, then translate back.
          </p>
        </div>
        <span className="rounded border border-co2/20 bg-co2/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-co2">
          T(P) * S * R * T(-P)
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-md border border-[var(--border)] bg-neutral-100 dark:bg-neutral-900">
          <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full">
            {Array.from({ length: 9 }, (_, i) => {
              const x = (i + 1) * (W / 10);
              return <line key={`gx-${i}`} x1={x} y1={0} x2={x} y2={H} stroke="#d1d5db" strokeWidth={0.4} opacity={0.55} />;
            })}
            {Array.from({ length: 7 }, (_, i) => {
              const y = (i + 1) * (H / 8);
              return <line key={`gy-${i}`} x1={0} y1={y} x2={W} y2={y} stroke="#d1d5db" strokeWidth={0.4} opacity={0.55} />;
            })}

            <AxisLine from={[0, 0, 0]} to={[2.7, 0, 0]} color="#ef4444" label="X" />
            <AxisLine from={[0, 0, 0]} to={[0, 2.3, 0]} color="#22c55e" label="Y" />
            <AxisLine from={[0, 0, 0]} to={[0, 0, 2.2]} color="#3b82f6" label="Z" />

            <line
              x1={origin2d[0]}
              y1={origin2d[1]}
              x2={pivot2d[0]}
              y2={pivot2d[1]}
              stroke="#f59e0b"
              strokeWidth={1.4}
              strokeDasharray="4 4"
              opacity={0.85}
            />

            <polygon points={originalPolygon} fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 4" />
            <polygon points={currentPolygon} fill="rgba(14, 165, 233, 0.18)" stroke="#0ea5e9" strokeWidth={2.5} strokeLinejoin="round" />

            <circle cx={pivot2d[0]} cy={pivot2d[1]} r={4.5} fill="#f59e0b" />
            <text x={pivot2d[0] + 7} y={pivot2d[1] + 4} fontSize={11} fontWeight={700} fill="#f59e0b">
              P
            </text>
            <circle cx={origin2d[0]} cy={origin2d[1]} r={3} fill="#64748b" />
            <text x={origin2d[0] + 6} y={origin2d[1] - 5} fontSize={10} fill="#64748b">
              O
            </text>

            {frame.points.map((point) => {
              const [x, y] = project(point.value);
              const [ox, oy] = project(TRIANGLE.find((p) => p.id === point.id)!.value);
              return (
                <g key={point.id}>
                  <line
                    x1={ox}
                    y1={oy}
                    x2={x}
                    y2={y}
                    stroke="#0ea5e9"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    opacity={0.45}
                  />
                  <circle cx={x} cy={y} r={4.5} fill="#0ea5e9" />
                  <text x={x + 7} y={y + 4} fontSize={11} fontWeight={700} fill="#0ea5e9">
                    {point.id}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">Current stage</p>
            <p className="mt-1 text-sm font-semibold text-[var(--ink)]">{frame.stage}</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{frame.description}</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--border)]">
              <div className="h-full rounded-full bg-co2" style={{ width: `${Math.round(frame.stageProgress * 100)}%` }} />
            </div>
          </div>

          <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">Live parameters</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded bg-[var(--surface-2)] px-2 py-1.5">
                <span className="text-[var(--muted)]">Pivot P</span>
                <p className="font-mono text-[var(--ink)]">{vecLabel(PIVOT)}</p>
              </div>
              <div className="rounded bg-[var(--surface-2)] px-2 py-1.5">
                <span className="text-[var(--muted)]">Angle</span>
                <p className="font-mono text-[var(--ink)]">{format(frame.angleDeg)} deg</p>
              </div>
              <div className="col-span-2 rounded bg-[var(--surface-2)] px-2 py-1.5">
                <span className="text-[var(--muted)]">Scale</span>
                <p className="font-mono text-[var(--ink)]">{vecLabel(frame.scale)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--muted)]">Process</p>
            <div className="mt-2 space-y-2">
              {PROCESS_STEPS.map((step) => (
                <div key={step.label} className="grid grid-cols-[1.75rem_1fr] gap-2 text-xs">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-co2/10 font-bold text-co2">
                    {step.label}
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{step.title}</p>
                    <p className="font-mono text-[11px] text-co2">{step.math}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-md border border-[var(--border)]">
            <table className="w-full border-collapse text-xs">
              <thead className="bg-[var(--surface-2)]">
                <tr>
                  <th className="px-2 py-2 text-left font-semibold text-[var(--muted)]">Point</th>
                  <th className="px-2 py-2 text-right font-semibold text-[var(--muted)]">v - P</th>
                  <th className="px-2 py-2 text-right font-semibold text-[var(--muted)]">x&apos;</th>
                  <th className="px-2 py-2 text-right font-semibold text-[var(--muted)]">y&apos;</th>
                  <th className="px-2 py-2 text-right font-semibold text-[var(--muted)]">z&apos;</th>
                </tr>
              </thead>
              <tbody>
                {frame.points.map((point, index) => {
                  const original = TRIANGLE.find((p) => p.id === point.id)!;
                  const local = sub(original.value, PIVOT);
                  return (
                    <tr key={point.id} className={index % 2 === 0 ? "bg-[var(--surface)]" : "bg-[var(--surface-2)]"}>
                      <td className="px-2 py-2 font-bold text-co2">{point.id}</td>
                      <td className="px-2 py-2 text-right font-mono tabular-nums text-[var(--muted)]">{vecLabel(local)}</td>
                      <td className="px-2 py-2 text-right font-mono tabular-nums text-[var(--ink)]">{format(point.value[0])}</td>
                      <td className="px-2 py-2 text-right font-mono tabular-nums text-[var(--ink)]">{format(point.value[1])}</td>
                      <td className="px-2 py-2 text-right font-mono tabular-nums text-[var(--ink)]">{format(point.value[2])}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3">
            <p className="font-mono text-[11px] leading-relaxed text-[var(--muted)]">
              v&apos; = T(P) S R T(-P) v, where v = (x, y, z, 1). Homogeneous coordinates let translation, rotation, and scale live inside one 4 x 4 matrix chain.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
