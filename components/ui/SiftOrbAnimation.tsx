"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Scene: two 185×160 building panels separated by a 20px gap
const PW = 185;
const GAP = 20;
const W = PW * 2 + GAP; // 390
const H = 160;
const R2 = PW + GAP;    // x-start of right panel = 205

type Mode = "sift" | "orb" | "compare";
type EntryType = "info" | "step" | "match" | "ok" | "done" | "warn";
interface LogEntry { id: number; text: string; type: EntryType }
interface Step { time: number; text: string; type: EntryType }
interface KP { x: number; y: number; scale: number; angle: number }

// Left panel keypoints — corners of windows and door
const leftKPs: KP[] = [
  { x: 38,  y: 34, scale: 13, angle: 315 }, // Win-L TL
  { x: 85,  y: 34, scale: 13, angle: 225 }, // Win-L TR
  { x: 38,  y: 69, scale: 13, angle: 45  }, // Win-L BL
  { x: 85,  y: 69, scale: 13, angle: 135 }, // Win-L BR
  { x: 101, y: 34, scale: 13, angle: 315 }, // Win-R TL
  { x: 148, y: 34, scale: 13, angle: 225 }, // Win-R TR
  { x: 101, y: 69, scale: 13, angle: 45  }, // Win-R BL
  { x: 148, y: 69, scale: 13, angle: 135 }, // Win-R BR
  { x: 75,  y: 88, scale: 15, angle: 160 }, // Door TL
  { x: 114, y: 88, scale: 15, angle: 20  }, // Door TR
];

// Right panel keypoints — same semantic positions, slightly shifted scene
const rightKPs: KP[] = [
  { x: R2+36,  y: 36, scale: 13, angle: 315 }, // Win-L TL
  { x: R2+82,  y: 36, scale: 13, angle: 225 }, // Win-L TR
  { x: R2+36,  y: 70, scale: 13, angle: 45  }, // Win-L BL
  { x: R2+82,  y: 70, scale: 13, angle: 135 }, // Win-L BR
  { x: R2+99,  y: 36, scale: 13, angle: 315 }, // Win-R TL
  { x: R2+145, y: 36, scale: 13, angle: 225 }, // Win-R TR
  { x: R2+99,  y: 70, scale: 13, angle: 45  }, // Win-R BL
  { x: R2+145, y: 70, scale: 13, angle: 135 }, // Win-R BR
  { x: R2+73,  y: 87, scale: 15, angle: 160 }, // Door TL
  { x: R2+111, y: 87, scale: 15, angle: 20  }, // Door TR
];

// Match index sets
const GOOD_IDX = [0, 1, 2, 3, 4, 5, 6, 7]; // window corners — unambiguous
const BAD_IDX  = [8, 9];                     // door corners — SIFT ratio test rejects

// -------- Log steps --------
const SIFT_STEPS: Step[] = [
  { time: 0,    text: "Loading image pair (185×160 px each)",         type: "info"  },
  { time: 220,  text: "Building Gaussian scale-space pyramid",         type: "step"  },
  { time: 500,  text: "Computing DoG responses across 5 octaves",      type: "step"  },
  { time: 780,  text: "Localising scale-space extrema",                type: "step"  },
  { time: 1050, text: "Assigning dominant orientations",               type: "step"  },
  { time: 1300, text: "10 keypoints detected per image",               type: "ok"    },
  { time: 1600, text: "Computing 128-D gradient histograms",           type: "step"  },
  { time: 1850, text: "BFMatcher (L2): 10 candidate pairs",           type: "match" },
  { time: 2100, text: "Lowe ratio test (threshold 0.75)…",            type: "step"  },
  { time: 2400, text: "⚠  Door corners ambiguous — d1/d2 = 0.81",    type: "warn"  },
  { time: 2650, text: "Rejecting 2 matches (ratio > 0.75)",           type: "warn"  },
  { time: 3000, text: "✓  8 verified matches after ratio test",       type: "done"  },
];

const ORB_STEPS: Step[] = [
  { time: 0,    text: "Loading image pair (185×160 px each)",         type: "info"  },
  { time: 80,   text: "No scale-space pyramid needed",                type: "ok"    },
  { time: 140,  text: "Running FAST corner detector (ORB step 1)",    type: "step"  },
  { time: 280,  text: "10 keypoints detected per image",              type: "ok"    },
  { time: 360,  text: "Computing 256-bit rBRIEF descriptor",          type: "step"  },
  { time: 490,  text: "Steering patches by keypoint orientation",     type: "step"  },
  { time: 580,  text: "BFMatcher with Hamming distance",              type: "step"  },
  { time: 650,  text: "Match 1 · Hamming = 18",                      type: "match" },
  { time: 730,  text: "Match 5 · Hamming = 22",                      type: "match" },
  { time: 810,  text: "Match 9 · Hamming = 29",                      type: "match" },
  { time: 900,  text: "✓  10/10 matches (no ratio test applied)",     type: "done"  },
];

const CMP_STEPS: Step[] = [
  { time: 0,    text: "Running SIFT + ORB on both images",            type: "info"  },
  { time: 250,  text: "SIFT: building scale-space pyramid…",          type: "step"  },
  { time: 430,  text: "ORB: FAST detection + rBRIEF…",               type: "step"  },
  { time: 650,  text: "SIFT: 128-D float descriptor (512 B/kp)",     type: "match" },
  { time: 830,  text: "ORB:  256-bit binary descriptor (32 B/kp)",   type: "match" },
  { time: 1000, text: "ORB is 16× more memory-efficient",            type: "ok"    },
  { time: 1200, text: "SIFT: 8 matches after ratio test",            type: "ok"    },
  { time: 1400, text: "ORB: 10 matches (no filtering)",              type: "ok"    },
  { time: 1650, text: "ORB ~10× faster · SIFT more selective",       type: "info"  },
];

const entryStyle: Record<EntryType, { text: string; icon: string }> = {
  info:  { text: "text-[var(--muted)] italic",                             icon: "·"  },
  step:  { text: "text-blue-700 dark:text-blue-300",                       icon: "→"  },
  match: { text: "text-amber-700 dark:text-amber-300 font-mono",           icon: "⇄"  },
  ok:    { text: "text-green-700 dark:text-green-400 font-medium",         icon: "✓"  },
  done:  { text: "text-green-700 dark:text-green-400 font-bold",           icon: "✓"  },
  warn:  { text: "text-red-600 dark:text-red-400 font-medium",             icon: "✕"  },
};

// Helper: orientation line endpoint from center
function orientPt(kp: KP) {
  const rad = (kp.angle * Math.PI) / 180;
  return { ex: kp.x + kp.scale * Math.cos(rad), ey: kp.y + kp.scale * Math.sin(rad) };
}

// -------- Building panel SVG elements --------
function BuildingPanel({ xOff }: { xOff: number }) {
  const o = xOff;
  return (
    <g>
      {/* sky */}
      <rect x={o} y={0} width={PW} height={H} fill="#c7d2fe" />
      {/* ground */}
      <rect x={o} y={128} width={PW} height={H - 128} fill="#6b7280" />
      {/* building body */}
      <rect x={o + 22} y={18} width={141} height={113} fill="#78716c" rx={1} />
      {/* Window L glass */}
      <rect x={o + 36} y={32} width={51} height={39} fill="#bfdbfe" />
      {/* Window L frame */}
      <rect x={o + 36} y={32} width={51} height={39} fill="none" stroke="#1e3a8a" strokeWidth={2} />
      {/* Window L crossbar H */}
      <line x1={o + 36} y1={o === 0 ? 51.5 : 51.5} x2={o + 87} y2={51.5} stroke="#1e3a8a" strokeWidth={1.5} />
      {/* Window L crossbar V */}
      <line x1={o + 61.5} y1={32} x2={o + 61.5} y2={71} stroke="#1e3a8a" strokeWidth={1.5} />
      {/* Window R glass */}
      <rect x={o + 99} y={32} width={51} height={39} fill="#bfdbfe" />
      {/* Window R frame */}
      <rect x={o + 99} y={32} width={51} height={39} fill="none" stroke="#1e3a8a" strokeWidth={2} />
      {/* Window R crossbar H */}
      <line x1={o + 99} y1={51.5} x2={o + 150} y2={51.5} stroke="#1e3a8a" strokeWidth={1.5} />
      {/* Window R crossbar V */}
      <line x1={o + 124.5} y1={32} x2={o + 124.5} y2={71} stroke="#1e3a8a" strokeWidth={1.5} />
      {/* Door */}
      <rect x={o + 73} y={86} width={41} height={42} fill="#1c1917" rx={1} />
      {/* Door handle */}
      <circle cx={o + 109} cy={H - 27} r={2.5} fill="#9ca3af" />
      {/* Panel border */}
      <rect x={o} y={0} width={PW} height={H} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
      {/* Label */}
      <text x={o + 6} y={13} fontSize={9} fill="#475569" fontFamily="monospace">
        {xOff === 0 ? "Image A" : "Image B"}
      </text>
    </g>
  );
}

export default function SiftOrbAnimation() {
  const [mode, setMode] = useState<Mode>("sift");
  const [animKey, setAnimKey] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const handleMode = useCallback((m: Mode) => { setMode(m); setAnimKey((k) => k + 1); }, []);
  const replay = useCallback(() => setAnimKey((k) => k + 1), []);

  useEffect(() => {
    setLog([]);
    idRef.current = 0;
    const steps = mode === "sift" ? SIFT_STEPS : mode === "orb" ? ORB_STEPS : CMP_STEPS;
    const timers = steps.map(({ time, text, type }) =>
      setTimeout(() => {
        setLog((prev) => [...prev, { id: idRef.current++, text, type }]);
      }, time)
    );
    return () => timers.forEach(clearTimeout);
  }, [animKey, mode]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  // Animation timing helpers
  const kpDelay = (i: number) =>
    mode === "sift" ? 1.1 + i * 0.08
    : mode === "orb" ? 0.28 + i * 0.04
    : 0.5 + i * 0.05;

  const matchDelay = (i: number) =>
    mode === "sift" ? 1.85 + i * 0.07
    : mode === "orb" ? 0.6 + i * 0.04
    : 1.0 + i * 0.06;

  const badMatchDelay = (i: number) => 2.3 + i * 0.1;

  // What to show
  const showSift = mode === "sift" || mode === "compare";
  const showOrb  = mode === "orb"  || mode === "compare";

  const SIFT_COLOR  = "#ef4444";
  const ORB_COLOR   = "#3b82f6";
  const MATCH_GOOD  = "#22c55e";
  const MATCH_BAD   = "#ef4444";
  const MATCH_ORB   = "#60a5fa";

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-[var(--ink)] text-sm mb-0.5">Feature Extraction &amp; Matching Demo</h2>
          <p className="text-xs text-[var(--muted)]">Synthetic building scene — 10 keypoints per image</p>
        </div>
        <button onClick={replay}
          className="text-xs px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors font-medium">
          ↺ Replay
        </button>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1.5 mb-4">
        {(["sift", "orb", "compare"] as Mode[]).map((m) => {
          const active = mode === m;
          const bg = active
            ? m === "sift"    ? "bg-red-500 text-white border-red-500"
            : m === "orb"     ? "bg-blue-500 text-white border-blue-500"
            :                   "bg-co4 text-white border-co4"
            : "bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--ink)]";
          return (
            <button key={m} onClick={() => handleMode(m)}
              className={`px-3 py-1.5 text-xs rounded border font-semibold transition-colors ${bg}`}>
              {m === "sift" ? "SIFT" : m === "orb" ? "ORB" : "Compare"}
            </button>
          );
        })}
      </div>

      {/* Main layout: SVG + Log */}
      <div className="flex flex-col lg:flex-row gap-3">

        {/* SVG canvas */}
        <div className="rounded-md overflow-hidden border border-[var(--border)] shrink-0" style={{ maxWidth: W }}>
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ display: "block" }}>

            {/* Building scenes */}
            <BuildingPanel xOff={0} />
            <BuildingPanel xOff={R2} />

            {/* Gap label */}
            <text x={PW + GAP / 2} y={H / 2 - 4} textAnchor="middle" fontSize={7}
              fill="#94a3b8" fontFamily="monospace" transform={`rotate(-90,${PW + GAP / 2},${H / 2})`}>
              matching
            </text>

            {/* ── SIFT good match lines ── */}
            {showSift && GOOD_IDX.map((i) => {
              const l = leftKPs[i]; const r = rightKPs[i];
              return (
                <motion.path key={`sg-${i}-${animKey}`}
                  d={`M ${l.x} ${l.y} L ${r.x} ${r.y}`}
                  stroke={MATCH_GOOD} strokeWidth={1.4} fill="none" opacity={0.85}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                  transition={{ delay: matchDelay(i), duration: 0.35, ease: "easeOut" }}
                />
              );
            })}

            {/* ── SIFT bad match lines (briefly visible → fade) ── */}
            {mode === "sift" && BAD_IDX.map((i, bi) => {
              const l = leftKPs[i]; const r = rightKPs[i];
              return (
                <motion.path key={`sb-${i}-${animKey}`}
                  d={`M ${l.x} ${l.y} L ${r.x} ${r.y}`}
                  stroke={MATCH_BAD} strokeWidth={1.2} strokeDasharray="4 3" fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.9, 0.9, 0] }}
                  transition={{ delay: badMatchDelay(bi), duration: 0.8,
                    times: [0, 0.3, 0.7, 1], ease: "easeInOut" }}
                />
              );
            })}

            {/* ── ORB match lines ── */}
            {showOrb && [...GOOD_IDX, ...BAD_IDX].map((i) => {
              const l = leftKPs[i]; const r = rightKPs[i];
              return (
                <motion.path key={`om-${i}-${animKey}`}
                  d={`M ${l.x} ${l.y} L ${r.x} ${r.y}`}
                  stroke={MATCH_ORB}
                  strokeWidth={mode === "compare" ? 1 : 1.4}
                  strokeDasharray={mode === "compare" ? "5 3" : undefined}
                  fill="none" opacity={mode === "compare" ? 0.6 : 0.85}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: mode === "compare" ? 0.6 : 0.85 }}
                  transition={{ delay: matchDelay(i), duration: 0.2, ease: "easeOut" }}
                />
              );
            })}

            {/* ── SIFT keypoint markers (circles + orientation arrow) ── */}
            {showSift && [leftKPs, rightKPs].map((set, si) =>
              set.map((kp, i) => {
                const { ex, ey } = orientPt(kp);
                return (
                  <motion.g key={`sk-${si}-${i}-${animKey}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ originX: kp.x, originY: kp.y }}
                    transition={{ delay: kpDelay(i), duration: 0.3, type: "spring", stiffness: 400, damping: 16 }}>
                    {/* scale ring */}
                    <circle cx={kp.x} cy={kp.y} r={kp.scale}
                      fill="none" stroke={SIFT_COLOR} strokeWidth={1.5} opacity={0.85} />
                    {/* center dot */}
                    <circle cx={kp.x} cy={kp.y} r={2}
                      fill={SIFT_COLOR} opacity={0.9} />
                    {/* orientation arrow */}
                    <line x1={kp.x} y1={kp.y} x2={ex} y2={ey}
                      stroke={SIFT_COLOR} strokeWidth={1.5} opacity={0.8}
                      markerEnd="url(#arrowSift)" />
                  </motion.g>
                );
              })
            )}

            {/* ── ORB keypoint markers (diamond = rotated square) ── */}
            {showOrb && [leftKPs, rightKPs].map((set, si) =>
              set.map((kp, i) => {
                const s = 5; // half-size
                const pts = `${kp.x},${kp.y - s} ${kp.x + s},${kp.y} ${kp.x},${kp.y + s} ${kp.x - s},${kp.y}`;
                return (
                  <motion.polygon key={`ok-${si}-${i}-${animKey}`}
                    points={pts}
                    fill="none" stroke={ORB_COLOR} strokeWidth={1.8}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ originX: kp.x, originY: kp.y }}
                    transition={{ delay: kpDelay(i), duration: 0.18, type: "spring", stiffness: 600, damping: 14 }}
                  />
                );
              })
            )}

            {/* Arrow marker for SIFT orientation */}
            <defs>
              <marker id="arrowSift" markerWidth="4" markerHeight="4"
                refX="3" refY="2" orient="auto">
                <path d="M0,0 L4,2 L0,4 Z" fill={SIFT_COLOR} opacity={0.8} />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Live log */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">Live Log</span>
          </div>
          <div ref={logRef}
            className="flex-1 overflow-y-auto rounded-md border border-[var(--border)] bg-[var(--surface-2)] p-3 space-y-1.5 font-mono"
            style={{ height: H, maxHeight: H }}>
            <AnimatePresence initial={false}>
              {log.map((entry) => {
                const s = entryStyle[entry.type];
                const iconColor =
                  entry.type === "done" || entry.type === "ok" ? "text-green-500"
                  : entry.type === "warn" ? "text-red-500"
                  : entry.type === "match" ? "text-amber-500"
                  : entry.type === "step" ? "text-blue-400"
                  : "text-[var(--muted)]";
                return (
                  <motion.div key={entry.id}
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-2">
                    <span className={`text-[10px] mt-0.5 shrink-0 w-3 text-center ${iconColor}`}>
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
        {(mode === "sift" || mode === "compare") && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-red-500 shrink-0" />
            <span className="text-xs font-medium text-red-700 dark:text-red-400">
              SIFT — 8/10 matches · 128-D float · L2 norm
            </span>
          </div>
        )}
        {(mode === "orb" || mode === "compare") && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-blue-500 shrink-0" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
              ORB — 10/10 matches · 256-bit binary · Hamming
            </span>
          </div>
        )}
      </div>

      {/* Explanation callout */}
      <div className="mt-3 p-3 rounded-md bg-[var(--surface-2)] border border-[var(--border)]">
        {mode === "sift" && (
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            <span className="font-semibold text-[var(--ink)]">SIFT</span> builds a DoG scale-space pyramid, localises keypoints, assigns orientations, then computes a{" "}
            <code className="font-mono text-[10px] px-1 py-0.5 rounded bg-[var(--border)]">128-D</code>{" "}
            gradient histogram descriptor. <strong>Lowe's ratio test</strong> (d₁/d₂ &lt; 0.75) rejects the 2 door-corner matches because both door corners produce similar descriptors — only the 8 geometrically distinct window corners survive.
          </p>
        )}
        {mode === "orb" && (
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            <span className="font-semibold text-[var(--ink)]">ORB</span> runs FAST for detection then computes a steered{" "}
            <code className="font-mono text-[10px] px-1 py-0.5 rounded bg-[var(--border)]">256-bit rBRIEF</code>{" "}
            binary descriptor. Matching uses <strong>Hamming distance</strong> (XOR + popcount — no multiply, no sqrt).
            No ratio test is applied, so all 10 matches are returned — faster but includes the ambiguous door corners.
          </p>
        )}
        {mode === "compare" && (
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            <span className="font-semibold text-red-600 dark:text-red-400">SIFT</span> circles show detected scale; orientation arrows show dominant gradient.{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">ORB</span> diamonds show no scale (binary detector). SIFT keeps 8 high-quality matches; ORB keeps all 10 — 16× smaller descriptor, ~10× faster, at the cost of some match quality.
          </p>
        )}
      </div>
    </div>
  );
}
