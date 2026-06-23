"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CELL = 38;
const COLS = 8;
const ROWS = 6;
const W = COLS * CELL;
const H = ROWS * CELL;

type Mode = "harris" | "fast" | "compare";
type EntryType = "info" | "step" | "corner" | "ok" | "done";

interface Pt { id: string; x: number; y: number; strength: number }
interface LogEntry { id: number; text: string; type: EntryType }

// Inner intersections: 7 × 5 = 35 true corners (where 4 cells meet)
const innerPts: Pt[] = [];
for (let r = 1; r < ROWS; r++) {
  for (let c = 1; c < COLS; c++) {
    const d = Math.min(r, ROWS - r, c, COLS - c);
    innerPts.push({ id: `i${r}-${c}`, x: c * CELL, y: r * CELL, strength: 0.55 + d * 0.08 });
  }
}

// Boundary intersections — Harris R-score suppressed, FAST circle-test still fires
const boundaryPts: Pt[] = [
  ...Array.from({ length: COLS - 1 }, (_, i) => ({ id: `bt${i}`, x: (i + 1) * CELL, y: 1, strength: 0.28 })),
  ...Array.from({ length: COLS - 1 }, (_, i) => ({ id: `bb${i}`, x: (i + 1) * CELL, y: H - 1, strength: 0.26 })),
  ...Array.from({ length: ROWS - 1 }, (_, i) => ({ id: `bl${i}`, x: 1, y: (i + 1) * CELL, strength: 0.27 })),
  ...Array.from({ length: ROWS - 1 }, (_, i) => ({ id: `br${i}`, x: W - 1, y: (i + 1) * CELL, strength: 0.25 })),
];

const harrisCorners = innerPts;
const fastCorners = [...innerPts, ...boundaryPts];
const HARRIS_COLOR = "#ef4444";
const FAST_COLOR = "#22c55e";

// Timed log steps for each mode
interface Step { time: number; text: string; type: EntryType }

const HARRIS_STEPS: Step[] = [
  { time: 0,    text: "Loading grayscale image (304×228 px)",        type: "info" },
  { time: 220,  text: "Computing gradients Ix, Iy via Sobel kernel", type: "step" },
  { time: 520,  text: "Building structure tensor M at each pixel",   type: "step" },
  { time: 780,  text: "Evaluating R = det(M) − k·trace²(M)",        type: "step" },
  { time: 1000, text: "Rendering R-score heatmap on image",          type: "info" },
  { time: 1200, text: "35 candidate peaks above threshold",          type: "ok"   },
  { time: 1300, text: "Applying non-maximum suppression (NMS)",      type: "step" },
  { time: 1500, text: "Corner confirmed at (38, 38)",                type: "corner"},
  { time: 1780, text: "Corner confirmed at (190, 38)",               type: "corner"},
  { time: 2100, text: "Corner confirmed at (114, 114)",              type: "corner"},
  { time: 2500, text: "Corner confirmed at (266, 152)",              type: "corner"},
  { time: 3200, text: "✓  35 corners detected — complete",           type: "done" },
];

const FAST_STEPS: Step[] = [
  { time: 0,    text: "Loading grayscale image (304×228 px)",        type: "info"  },
  { time: 80,   text: "No gradient computation needed",              type: "ok"    },
  { time: 140,  text: "Running 16-pixel Bresenham circle test",      type: "step"  },
  { time: 200,  text: "Corner at (38, 38) — circle satisfied",       type: "corner"},
  { time: 350,  text: "Corner at (190, 38)",                         type: "corner"},
  { time: 490,  text: "Corner at (114, 114)",                        type: "corner"},
  { time: 570,  text: "✓  35 inner corners found",                   type: "ok"    },
  { time: 610,  text: "Scanning boundary intersections…",            type: "step"  },
  { time: 650,  text: "Boundary corner at (38, 1)",                  type: "corner"},
  { time: 710,  text: "Boundary corner at (1, 76)",                  type: "corner"},
  { time: 820,  text: "✓  59 corners detected — complete",           type: "done"  },
];

const COMPARE_STEPS: Step[] = [
  { time: 0,    text: "Running Harris + FAST in parallel",           type: "info"  },
  { time: 200,  text: "Harris: computing structure tensor…",         type: "step"  },
  { time: 350,  text: "FAST: 16-pixel circle test running…",         type: "step"  },
  { time: 600,  text: "Harris NMS → 35 inner corners only",         type: "ok"    },
  { time: 800,  text: "FAST → 59 corners (35 inner + 24 boundary)", type: "ok"    },
  { time: 1000, text: "Shared detections: 35 (both agree)",          type: "ok"    },
  { time: 1200, text: "FAST-only boundary extras: 24 points",        type: "corner"},
  { time: 1550, text: "Harris: precise · FAST: fast + broader",      type: "info"  },
];

// Styling per entry type
const entryStyle: Record<EntryType, { dot: string; text: string; icon: string }> = {
  info:   { dot: "bg-[var(--muted)]",  text: "text-[var(--muted)] italic",                   icon: "·" },
  step:   { dot: "bg-blue-400",        text: "text-blue-700 dark:text-blue-300",              icon: "→" },
  corner: { dot: "bg-amber-400",       text: "text-amber-700 dark:text-amber-300 font-mono",  icon: "◎" },
  ok:     { dot: "bg-green-500",       text: "text-green-700 dark:text-green-400 font-medium",icon: "✓" },
  done:   { dot: "bg-green-500",       text: "text-green-700 dark:text-green-400 font-bold",  icon: "✓" },
};

export default function HarrisFastAnimation() {
  const [mode, setMode] = useState<Mode>("harris");
  const [animKey, setAnimKey] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const handleMode = useCallback((m: Mode) => {
    setMode(m);
    setAnimKey((k) => k + 1);
  }, []);

  const replay = useCallback(() => setAnimKey((k) => k + 1), []);

  // Schedule log entries to appear in sync with the animation
  useEffect(() => {
    idRef.current = 0;
    const steps = mode === "harris" ? HARRIS_STEPS : mode === "fast" ? FAST_STEPS : COMPARE_STEPS;
    const resetTimer = setTimeout(() => setLog([]), 0);
    const timers = steps.map(({ time, text, type }) =>
      setTimeout(() => {
        const entry: LogEntry = { id: idRef.current++, text, type };
        setLog((prev) => [...prev, entry]);
      }, time + 1)
    );
    return () => {
      clearTimeout(resetTimer);
      timers.forEach(clearTimeout);
    };
  }, [animKey, mode]);

  // Auto-scroll log to bottom on new entries
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  const checkerSquares = Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => ({ x: c * CELL, y: r * CELL, dark: (r + c) % 2 === 0 }))
  ).flat();

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-[var(--ink)] text-sm mb-0.5">Feature Detection Demo</h2>
          <p className="text-xs text-[var(--muted)]">
            Standard checkerboard — {ROWS - 1}×{COLS - 1} inner intersections
          </p>
        </div>
        <button
          onClick={replay}
          className="text-xs px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors font-medium"
        >
          ↺ Replay
        </button>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1.5 mb-4">
        {(["harris", "fast", "compare"] as Mode[]).map((m) => {
          const active = mode === m;
          const bg = active
            ? m === "harris" ? "bg-red-500 text-white border-red-500"
            : m === "fast"   ? "bg-green-500 text-white border-green-500"
            :                  "bg-co4 text-white border-co4"
            : "bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--ink)]";
          return (
            <button key={m} onClick={() => handleMode(m)}
              className={`px-3 py-1.5 text-xs rounded border font-semibold transition-colors ${bg}`}>
              {m === "harris" ? "Harris Corner" : m === "fast" ? "FAST" : "Compare"}
            </button>
          );
        })}
      </div>

      {/* Main area: SVG left, log right */}
      <div className="flex flex-col md:flex-row gap-3">

        {/* SVG canvas */}
        <div className="rounded-md overflow-hidden border border-[var(--border)] bg-neutral-100 dark:bg-neutral-900 shrink-0">
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: "block" }}>
            <defs>
              {innerPts.map((pt) => (
                <radialGradient key={`grad-${pt.id}`} id={`hg-${pt.id}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#f97316" stopOpacity={pt.strength * 0.9} />
                  <stop offset="60%"  stopColor="#ef4444" stopOpacity={pt.strength * 0.4} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </radialGradient>
              ))}
            </defs>

            {/* Checkerboard */}
            {checkerSquares.map((sq) => (
              <rect key={`sq-${sq.x}-${sq.y}`} x={sq.x} y={sq.y} width={CELL} height={CELL}
                fill={sq.dark ? "#1c1c1c" : "#f0f0f0"} />
            ))}
            <rect x={0} y={0} width={W} height={H} fill="none" stroke="#666" strokeWidth={1.5} />

            {/* Harris response heatmap */}
            {(mode === "harris" || mode === "compare") && (
              <motion.g key={`heatmap-${animKey}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}>
                {innerPts.map((pt) => (
                  <circle key={`hm-${pt.id}`} cx={pt.x} cy={pt.y}
                    r={CELL * 0.55} fill={`url(#hg-${pt.id})`} />
                ))}
              </motion.g>
            )}

            {/* Harris corner markers */}
            {(mode === "harris" || mode === "compare") &&
              harrisCorners.map((pt, i) => (
                <motion.circle key={`hc-${pt.id}-${animKey}`}
                  cx={pt.x} cy={pt.y} r={mode === "compare" ? 5 : 4.5}
                  fill="none" stroke={HARRIS_COLOR} strokeWidth={2}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.9 + i * 0.06, duration: 0.25, type: "spring", stiffness: 500, damping: 18 }} />
              ))}

            {/* FAST inner corner markers */}
            {mode === "fast" &&
              innerPts.map((pt, i) => (
                <motion.circle key={`fi-${pt.id}-${animKey}`}
                  cx={pt.x} cy={pt.y} r={4.5}
                  fill="none" stroke={FAST_COLOR} strokeWidth={2}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.016, duration: 0.15, type: "spring", stiffness: 600, damping: 15 }} />
              ))}

            {/* FAST boundary extras */}
            {(mode === "fast" || mode === "compare") &&
              boundaryPts.map((pt, i) => (
                <motion.circle key={`fb-${pt.id}-${animKey}`}
                  cx={pt.x} cy={pt.y}
                  r={mode === "compare" ? 3.5 : 4}
                  fill="none" stroke={FAST_COLOR}
                  strokeWidth={mode === "compare" ? 1.5 : 2}
                  strokeDasharray={mode === "compare" ? "3 2" : undefined}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: mode === "compare" ? 0.8 : 1 }}
                  transition={{
                    delay: mode === "fast"
                      ? innerPts.length * 0.016 + i * 0.012
                      : 0.3 + i * 0.025,
                    duration: 0.15, type: "spring", stiffness: 600, damping: 15,
                  }} />
              ))}
          </svg>
        </div>

        {/* Live log panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">Live Log</span>
          </div>

          <div
            ref={logRef}
            className="flex-1 overflow-y-auto rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3 space-y-1.5 font-mono"
            style={{ height: H, maxHeight: H }}
          >
            <AnimatePresence initial={false}>
              {log.map((entry) => {
                const s = entryStyle[entry.type];
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-2"
                  >
                    <span className={`text-[10px] mt-0.5 shrink-0 w-3 text-center ${
                      entry.type === "corner" ? (mode === "harris" ? "text-red-500" : "text-green-500") :
                      entry.type === "ok"     ? "text-green-500" :
                      entry.type === "done"   ? "text-green-500" :
                      entry.type === "step"   ? "text-blue-400"  : "text-[var(--muted)]"
                    }`}>
                      {s.icon}
                    </span>
                    <span className={`text-[11px] leading-snug break-words ${s.text}`}>
                      {entry.text}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {log.length === 0 && (
              <p className="text-[11px] text-[var(--muted)] italic">Waiting for algorithm…</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-3 flex flex-wrap gap-3">
        {(mode === "harris" || mode === "compare") && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-red-500 shrink-0" />
            <span className="text-xs font-medium text-red-700 dark:text-red-400">
              Harris — {harrisCorners.length} inner corners
            </span>
          </div>
        )}
        {(mode === "fast" || mode === "compare") && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-green-500 shrink-0" />
            <span className="text-xs font-medium text-green-700 dark:text-green-400">
              FAST — {fastCorners.length} total ({boundaryPts.length} boundary extras)
            </span>
          </div>
        )}
      </div>

      {/* Explanation callout */}
      <div className="mt-3 p-3 rounded-md bg-[var(--surface-2)] border border-[var(--border)]">
        {mode === "harris" && (
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            <span className="font-semibold text-[var(--ink)]">Harris</span> computes the structure tensor at each pixel, then evaluates{" "}
            <code className="font-mono text-[10px] px-1 py-0.5 rounded bg-[var(--border)]">R = det(M) − k·trace²(M)</code>.
            The heatmap shows the response surface; markers appear only after NMS. Boundary intersections produce a weaker R-score and are suppressed.
          </p>
        )}
        {mode === "fast" && (
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            <span className="font-semibold text-[var(--ink)]">FAST</span> tests 16 pixels on a Bresenham circle — no gradients, no floating-point, pure integer comparisons.
            It fires on all {innerPts.length} inner intersections and also on boundary intersections ({boundaryPts.length} extras) where the contrast threshold is still exceeded.
          </p>
        )}
        {mode === "compare" && (
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            <span className="font-semibold text-red-600 dark:text-red-400">Harris</span> (solid red) selects only {harrisCorners.length} inner corners with high R-scores.{" "}
            <span className="font-semibold text-green-600 dark:text-green-400">FAST</span> (dashed green) additionally detects {boundaryPts.length} boundary points that Harris suppresses — trading precision for speed.
          </p>
        )}
      </div>
    </div>
  );
}
