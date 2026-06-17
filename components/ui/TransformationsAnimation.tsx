"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

// ── Canvas constants ──────────────────────────────────────────────────────
const W = 320, H = 230;
const CX = 155, CY = 118;
const SCALE_3D = 132;
const DEPTH_3D = 4.5;

// ── 2D Shape: F-shaped polygon ────────────────────────────────────────────
const F_PTS = "-28,-30 28,-30 28,-16 -6,-16 -6,-4 18,-4 18,10 -6,10 -6,30 -28,30";

// ── 3D cube ───────────────────────────────────────────────────────────────
type Vec3 = [number, number, number];

const CUBE_V: Vec3[] = [
  [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
  [-1,-1, 1],[1,-1, 1],[1,1, 1],[-1,1, 1],
];
const CUBE_E: [number,number][] = [
  [0,1],[1,2],[2,3],[3,0],
  [4,5],[5,6],[6,7],[7,4],
  [0,4],[1,5],[2,6],[3,7],
];
const AXIS_PAIRS: [Vec3,Vec3][] = [
  [[0,0,0],[1.5,0,0]],
  [[0,0,0],[0,1.5,0]],
  [[0,0,0],[0,0,1.5]],
];
const AXIS_COLORS = ["#ef4444","#22c55e","#3b82f6"];
const AXIS_LABELS = ["X","Y","Z"];

// ── 3D Math ───────────────────────────────────────────────────────────────
const Rx = (a: number): number[][] => { const c=Math.cos(a),s=Math.sin(a); return [[1,0,0],[0,c,-s],[0,s,c]]; };
const Ry = (a: number): number[][] => { const c=Math.cos(a),s=Math.sin(a); return [[c,0,s],[0,1,0],[-s,0,c]]; };
const Rz = (a: number): number[][] => { const c=Math.cos(a),s=Math.sin(a); return [[c,-s,0],[s,c,0],[0,0,1]]; };

const mulMV = (m: number[][], v: Vec3): Vec3 => [
  m[0][0]*v[0]+m[0][1]*v[1]+m[0][2]*v[2],
  m[1][0]*v[0]+m[1][1]*v[1]+m[1][2]*v[2],
  m[2][0]*v[0]+m[2][1]*v[1]+m[2][2]*v[2],
];

function composeMM(a: number[][], b: number[][]): number[][] {
  return [
    [a[0][0]*b[0][0]+a[0][1]*b[1][0]+a[0][2]*b[2][0], a[0][0]*b[0][1]+a[0][1]*b[1][1]+a[0][2]*b[2][1], a[0][0]*b[0][2]+a[0][1]*b[1][2]+a[0][2]*b[2][2]],
    [a[1][0]*b[0][0]+a[1][1]*b[1][0]+a[1][2]*b[2][0], a[1][0]*b[0][1]+a[1][1]*b[1][1]+a[1][2]*b[2][1], a[1][0]*b[0][2]+a[1][1]*b[1][2]+a[1][2]*b[2][2]],
    [a[2][0]*b[0][0]+a[2][1]*b[1][0]+a[2][2]*b[2][0], a[2][0]*b[0][1]+a[2][1]*b[1][1]+a[2][2]*b[2][1], a[2][0]*b[0][2]+a[2][1]*b[1][2]+a[2][2]*b[2][2]],
  ];
}

// Rodrigues' formula: rotate by theta around unit axis ax
function rodrigues(ax: Vec3, theta: number): number[][] {
  const len = Math.sqrt(ax[0]**2+ax[1]**2+ax[2]**2);
  const [kx,ky,kz] = ax.map(x=>x/len);
  const c=Math.cos(theta), s=Math.sin(theta), t=1-c;
  return [
    [c+kx*kx*t,    kx*ky*t-kz*s,  kx*kz*t+ky*s],
    [ky*kx*t+kz*s, c+ky*ky*t,     ky*kz*t-kx*s],
    [kz*kx*t-ky*s, kz*ky*t+kx*s,  c+kz*kz*t   ],
  ];
}

function perspProj(v: Vec3, cx: number, cy: number, scale: number, depth: number): [number,number] {
  const z = v[2]+depth;
  return [cx+(v[0]/z)*scale, cy+(v[1]/z)*scale];
}

// ── Types ─────────────────────────────────────────────────────────────────
type Tab = "2d" | "3d";
type Mode2D = "translation"|"rotation"|"scale"|"shear"|"rigid"|"affine";
type Mode3D = "rotX"|"rotY"|"rotZ"|"composed"|"rodrigues"|"scale3d"|"se3";

interface Def2D {
  label: string; color: string;
  animate: Record<string,number>; duration: number;
  matrix: string[][]; desc: string;
}
interface Def3D {
  label: string; color: string;
  getMatrix: (t: number) => number[][];
  getOffset?: (t: number) => Vec3;
  axisVec?: Vec3;       // fixed world-frame axis to draw (Rodrigues)
  showAxes?: boolean;   // draw body-frame X/Y/Z axes (default true)
  moveAxes?: boolean;   // translate axis origin with offset (SE3)
  matrix: string[][];
  cellClass?: string;   // override per-cell CSS classes
  desc: string;
}
interface Line3D {
  x1: number; y1: number; x2: number; y2: number;
  color: string; width: number; opacity: number;
  label?: string; labelX?: number; labelY?: number;
}

// ── 2D Mode definitions ───────────────────────────────────────────────────
const MODES_2D: Record<Mode2D, Def2D> = {
  translation: {
    label:"Translation", color:"#3b82f6",
    animate:{x:60,y:-38}, duration:1.2,
    matrix:[["1","0","tx"],["0","1","ty"],["0","0","1"]],
    desc:"Adds (tx, ty) to every point — pure displacement, no distortion. 2 DOF.",
  },
  rotation: {
    label:"Rotation", color:"#f59e0b",
    animate:{rotate:52}, duration:1.5,
    matrix:[["cos θ","−sin θ","0"],["sin θ","cos θ","0"],["0","0","1"]],
    desc:"Rotates every point around the origin by angle θ. Preserves all distances and angles.",
  },
  scale: {
    label:"Scale", color:"#10b981",
    animate:{scaleX:1.7,scaleY:0.55}, duration:1.3,
    matrix:[["sx","0","0"],["0","sy","0"],["0","0","1"]],
    desc:"Multiplies x by sx and y by sy. Anisotropic when sx ≠ sy — proportions change.",
  },
  shear: {
    label:"Shear", color:"#8b5cf6",
    animate:{skewX:26}, duration:1.2,
    matrix:[["1","shx","0"],["0","1","0"],["0","0","1"]],
    desc:"Slants the shape along x — each row shifts by y·shx. Angles change; area is preserved.",
  },
  rigid: {
    label:"Rigid", color:"#ef4444",
    animate:{x:48,y:-32,rotate:38}, duration:1.6,
    matrix:[["cos θ","−sin θ","tx"],["sin θ","cos θ","ty"],["0","0","1"]],
    desc:"Rotation + translation (Euclidean). All distances are preserved — 3 DOF in 2D.",
  },
  affine: {
    label:"Affine", color:"#ec4899",
    animate:{x:22,y:-14,scaleX:1.28,scaleY:0.82,skewX:16}, duration:1.8,
    matrix:[["a","b","tx"],["c","d","ty"],["0","0","1"]],
    desc:"Any linear map + translation — 6 DOF. Parallel lines stay parallel; angles may distort.",
  },
};

// ── 3D Mode definitions ───────────────────────────────────────────────────
const MODES_3D: Record<Mode3D, Def3D> = {
  rotX: {
    label:"Rotate X", color:"#ef4444",
    getMatrix:(t)=>Rx(t),
    matrix:[["1","0","0"],["0","cos θ","−sin θ"],["0","sin θ","cos θ"]],
    desc:"Rotates around the X (red) axis — points spin in the Y-Z plane.",
  },
  rotY: {
    label:"Rotate Y", color:"#22c55e",
    getMatrix:(t)=>Ry(t),
    matrix:[["cos θ","0","sin θ"],["0","1","0"],["−sin θ","0","cos θ"]],
    desc:"Rotates around the Y (green) axis — points spin in the X-Z plane.",
  },
  rotZ: {
    label:"Rotate Z", color:"#3b82f6",
    getMatrix:(t)=>Rz(t),
    matrix:[["cos θ","−sin θ","0"],["sin θ","cos θ","0"],["0","0","1"]],
    desc:"Rotates around the Z (blue) axis — identical to 2D rotation in the X-Y plane.",
  },
  composed: {
    label:"Composed", color:"#f59e0b",
    getMatrix:(t)=>composeMM(Ry(t*0.7),Rx(t*0.5)),
    matrix:[["cα","sα·sβ","sα·cβ"],["0","cβ","−sβ"],["−sα","cα·sβ","cα·cβ"]],
    desc:"Ry(α)·Rx(β) — composing two rotations. Matrix product order matters in 3D!",
  },
  rodrigues: {
    label:"Rodrigues", color:"#a855f7",
    getMatrix:(t)=>rodrigues([1,1,1],t),
    axisVec:[1,1,1],
    matrix:[
      ["c+kx²c'",     "kxky c'−kzsθ",  "kxkz c'+kysθ"],
      ["kxky c'+kzsθ","c+ky²c'",        "kykz c'−kxsθ"],
      ["kxkz c'−kysθ","kykz c'+kxsθ",   "c+kz²c'"     ],
    ],
    cellClass:"min-w-[66px] text-[9px]",
    desc:"Rodrigues: R = I·cosθ + (1−cosθ)kkᵀ + sinθ·[k]×. Rotates by θ around fixed axis k=[1,1,1]/√3 (purple). c=cosθ, sθ=sinθ, c'=1−cosθ.",
  },
  scale3d: {
    label:"Scale & Translate", color:"#10b981",
    getMatrix:(t)=>{
      const sx=1+0.5*Math.sin(t), sy=1-0.35*Math.cos(t*1.3), sz=1+0.4*Math.sin(t*0.7+1);
      return [[sx,0,0],[0,sy,0],[0,0,sz]];
    },
    getOffset:(t)=>[Math.sin(t*0.8)*0.9, Math.cos(t*0.6)*0.5, 0],
    showAxes:false,
    matrix:[["sx","0","0","tx"],["0","sy","0","ty"],["0","0","sz","tz"],["0","0","0","1"]],
    desc:"4×4 homogeneous matrix unifies 3D anisotropic scale (sx,sy,sz) and translation (tx,ty,tz). The cube breathes and drifts around the world-frame origin.",
  },
  se3: {
    label:"SE(3)", color:"#f59e0b",
    getMatrix:(t)=>Ry(t*0.9),
    getOffset:(t)=>[Math.sin(t)*1.2, Math.sin(t*0.5)*0.4, Math.cos(t)*0.9],
    moveAxes:true,
    matrix:[["R₁₁","R₁₂","R₁₃","tx"],["R₂₁","R₂₂","R₂₃","ty"],["R₃₁","R₃₂","R₃₃","tz"],["0","0","0","1"]],
    desc:"SE(3) = SO(3) ⋊ ℝ³ — rigid body motion with 6 DOF. The cube rotates AND orbits the origin. All inter-point distances are preserved throughout.",
  },
};

// ── Component ─────────────────────────────────────────────────────────────
export default function TransformationsAnimation() {
  const [tab,   setTab]   = useState<Tab>("2d");
  const [mode2D,setMode2D]= useState<Mode2D>("translation");
  const [mode3D,setMode3D]= useState<Mode3D>("rotY");
  const [animKey,setAnimKey] = useState(0);
  const [lines3D,setLines3D] = useState<Line3D[]>([]);

  const rafRef     = useRef<number>(0);
  const tRef       = useRef(0);
  const lastNowRef = useRef<number|null>(null);
  const mode3DRef  = useRef<Mode3D>(mode3D);

  useEffect(() => { mode3DRef.current = mode3D; }, [mode3D]);

  const replay      = useCallback(() => setAnimKey(k=>k+1), []);
  const handleMode2D= useCallback((m: Mode2D) => { setMode2D(m); setAnimKey(k=>k+1); }, []);
  const handleMode3D= useCallback((m: Mode3D) => { setMode3D(m); tRef.current=0; lastNowRef.current=null; }, []);
  const handleTab   = useCallback((t: Tab) => { setTab(t); setAnimKey(k=>k+1); tRef.current=0; lastNowRef.current=null; }, []);

  // 3D RAF animation loop
  useEffect(() => {
    if (tab !== "3d") { cancelAnimationFrame(rafRef.current); return; }

    const loop = (now: number) => {
      if (lastNowRef.current !== null)
        tRef.current += ((now - lastNowRef.current) / 1000) * 0.85;
      lastNowRef.current = now;

      const def    = MODES_3D[mode3DRef.current];
      const M      = def.getMatrix(tRef.current);
      const offset: Vec3 = def.getOffset ? def.getOffset(tRef.current) : [0,0,0];
      const newLines: Line3D[] = [];

      // --- Cube vertices (rotate then translate) ---
      const verts3D: Vec3[] = CUBE_V.map(v => {
        const r = mulMV(M, v);
        return [r[0]+offset[0], r[1]+offset[1], r[2]+offset[2]];
      });
      const verts2D = verts3D.map(v => perspProj(v, CX, CY, SCALE_3D, DEPTH_3D));

      CUBE_E.forEach(([i,j]) => {
        const avgZ = (verts3D[i][2]+verts3D[j][2]) / 2;
        const opacity = Math.max(0.15, Math.min(1, (avgZ+3)/5));
        newLines.push({x1:verts2D[i][0],y1:verts2D[i][1],x2:verts2D[j][0],y2:verts2D[j][1],color:"#6b7280",width:1.5,opacity});
      });

      // --- Body-frame coordinate axes ---
      if (def.showAxes !== false) {
        AXIS_PAIRS.forEach(([origin,tip], idx) => {
          const ro = mulMV(M, origin);
          const rt = mulMV(M, tip);
          const off: Vec3 = def.moveAxes ? offset : [0,0,0];
          const o2d = perspProj([ro[0]+off[0],ro[1]+off[1],ro[2]+off[2]], CX,CY,SCALE_3D,DEPTH_3D);
          const t2d = perspProj([rt[0]+off[0],rt[1]+off[1],rt[2]+off[2]], CX,CY,SCALE_3D,DEPTH_3D);
          newLines.push({x1:o2d[0],y1:o2d[1],x2:t2d[0],y2:t2d[1],color:AXIS_COLORS[idx],width:2.5,opacity:1,label:AXIS_LABELS[idx],labelX:t2d[0],labelY:t2d[1]-6});
        });
      }

      // --- Fixed world-frame rotation axis (Rodrigues) ---
      if (def.axisVec) {
        const len = Math.sqrt(def.axisVec[0]**2+def.axisVec[1]**2+def.axisVec[2]**2);
        const kn: Vec3 = [def.axisVec[0]/len, def.axisVec[1]/len, def.axisVec[2]/len];
        const base: Vec3 = [-kn[0]*1.6,-kn[1]*1.6,-kn[2]*1.6];
        const tip2: Vec3 = [ kn[0]*1.6, kn[1]*1.6, kn[2]*1.6];
        const p1 = perspProj(base, CX,CY,SCALE_3D,DEPTH_3D);
        const p2 = perspProj(tip2, CX,CY,SCALE_3D,DEPTH_3D);
        newLines.push({x1:p1[0],y1:p1[1],x2:p2[0],y2:p2[1],color:"#a855f7",width:2.5,opacity:1,label:"k",labelX:p2[0],labelY:p2[1]-6});
      }

      setLines3D(newLines);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tab, mode3D]);

  const def2D = MODES_2D[mode2D];
  const def3D = MODES_3D[mode3D];
  const matrix = tab === "2d" ? def2D.matrix : def3D.matrix;
  const activeColor = tab === "2d" ? def2D.color : def3D.color;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 mb-8">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-[var(--ink)] text-sm mb-0.5">Transformations Interactive Demo</h2>
          <p className="text-xs text-[var(--muted)]">Visualise 2D &amp; 3D coordinate transforms with live matrices</p>
        </div>
        {tab === "2d" && (
          <button onClick={replay} className="text-xs px-3 py-1.5 rounded border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors font-medium">
            ↺ Replay
          </button>
        )}
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1.5 mb-4">
        {(["2d","3d"] as Tab[]).map(t => (
          <button key={t} onClick={() => handleTab(t)}
            className={`px-3 py-1.5 text-xs rounded border font-semibold transition-colors ${tab===t?"bg-co2 text-white border-co2":"bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--ink)]"}`}>
            {t==="2d" ? "2D Transforms" : "3D Transforms"}
          </button>
        ))}
      </div>

      {/* Mode buttons */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(tab==="2d" ? Object.keys(MODES_2D) as Mode2D[] : Object.keys(MODES_3D) as Mode3D[]).map(m => {
          const active = tab==="2d" ? mode2D===m : mode3D===m;
          const color  = tab==="2d" ? MODES_2D[m as Mode2D].color : MODES_3D[m as Mode3D].color;
          const label  = tab==="2d" ? MODES_2D[m as Mode2D].label : MODES_3D[m as Mode3D].label;
          return (
            <button key={m}
              onClick={() => tab==="2d" ? handleMode2D(m as Mode2D) : handleMode3D(m as Mode3D)}
              style={active ? {backgroundColor:color,borderColor:color} : {}}
              className={`px-2.5 py-1 text-xs rounded border font-medium transition-colors ${active?"text-white":"bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--ink)]"}`}>
              {label}
            </button>
          );
        })}
      </div>

      {/* Canvas + Matrix panel */}
      <div className="flex flex-col md:flex-row gap-4">

        {/* SVG canvas */}
        <div className="rounded-md overflow-hidden border border-[var(--border)] bg-neutral-100 dark:bg-neutral-900 shrink-0">
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{display:"block"}}>

            {/* Grid */}
            {Array.from({length:9},(_,i)=>{ const x=Math.round((i+1)*W/10); return <line key={`gx${i}`} x1={x} y1={0} x2={x} y2={H} stroke="#e5e7eb" strokeWidth={0.5} />; })}
            {Array.from({length:7},(_,i)=>{ const y=Math.round((i+1)*H/8); return <line key={`gy${i}`} x1={0} y1={y} x2={W} y2={y} stroke="#e5e7eb" strokeWidth={0.5} />; })}

            {tab === "2d" ? (
              <>
                {/* Coordinate axes */}
                <line x1={18} y1={CY} x2={W-12} y2={CY} stroke="#d1d5db" strokeWidth={1} />
                <line x1={CX} y1={H-12} x2={CX} y2={12} stroke="#d1d5db" strokeWidth={1} />
                <polygon points={`${W-12},${CY} ${W-20},${CY-4} ${W-20},${CY+4}`} fill="#d1d5db" />
                <polygon points={`${CX},12 ${CX-4},20 ${CX+4},20`} fill="#d1d5db" />
                <text x={W-14} y={CY-6} fontSize={10} fill="#9ca3af" textAnchor="middle">x</text>
                <text x={CX+8} y={16} fontSize={10} fill="#9ca3af">y</text>

                {/* Original shape — dashed grey */}
                <polygon points={F_PTS} transform={`translate(${CX},${CY})`}
                  fill="none" stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="4 3" />

                {/* Animated transformed shape */}
                <g transform={`translate(${CX},${CY})`}>
                  <motion.g
                    key={`shape-${mode2D}-${animKey}`}
                    initial={{x:0,y:0,rotate:0,scaleX:1,scaleY:1,skewX:0}}
                    animate={def2D.animate}
                    transition={{duration:def2D.duration,ease:"easeInOut"}}
                    style={{transformOrigin:"0px 0px"}}
                  >
                    <polygon points={F_PTS} fill={`${def2D.color}30`} stroke={def2D.color} strokeWidth={2} strokeLinejoin="round" />
                    <circle cx={0} cy={0} r={3.5} fill={def2D.color} />
                  </motion.g>
                </g>
              </>
            ) : (
              <>
                {/* 3D wireframe + axes */}
                {lines3D.map((l,i) => (
                  <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                    stroke={l.color} strokeWidth={l.width} strokeOpacity={l.opacity} strokeLinecap="round" />
                ))}
                {lines3D.filter(l=>l.label!==undefined).map((l,i) => (
                  <text key={`al${i}`} x={l.labelX} y={l.labelY} textAnchor="middle" fontSize={11} fontWeight="bold" fill={l.color}>
                    {l.label}
                  </text>
                ))}
              </>
            )}
          </svg>
        </div>

        {/* Matrix + Legend */}
        <div className="flex-1 flex flex-col justify-center min-w-0 gap-4">

          {/* Matrix display */}
          <div>
            <p className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-widest mb-2">
              Transformation Matrix
            </p>
            <div className="inline-flex flex-col gap-0.5 font-mono text-xs">
              {matrix.map((row, i) => {
                const cols = row.length;
                const cellCls =
                  tab==="3d" && def3D.cellClass
                    ? def3D.cellClass
                    : cols >= 4
                    ? "min-w-[36px] text-[10px]"
                    : "min-w-[46px] text-[11px]";
                return (
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-lg leading-none text-[var(--muted)] select-none">
                      {i===0?"⎡":i===matrix.length-1?"⎣":"⎢"}
                    </span>
                    <div className="flex gap-1.5 px-2 py-1 rounded bg-[var(--surface-2)]">
                      {row.map((cell,j) => {
                        const isId = cell==="0"||cell==="1";
                        return (
                          <span key={j}
                            style={!isId?{color:activeColor}:{}}
                            className={`text-center ${cellCls} ${isId?"text-[var(--muted)]":"font-bold"}`}>
                            {cell}
                          </span>
                        );
                      })}
                    </div>
                    <span className="text-lg leading-none text-[var(--muted)] select-none">
                      {i===0?"⎤":i===matrix.length-1?"⎦":"⎥"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-1.5">
            {tab === "2d" ? (
              <>
                <div className="flex items-center gap-2">
                  <svg width={20} height={10}><line x1={0} y1={5} x2={20} y2={5} stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="4 3" /></svg>
                  <span className="text-xs text-[var(--muted)]">Original</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width={20} height={10}><line x1={0} y1={5} x2={20} y2={5} stroke={def2D.color} strokeWidth={2} /></svg>
                  <span className="text-xs text-[var(--muted)]">Transformed</span>
                </div>
              </>
            ) : (
              <>
                {def3D.showAxes !== false && AXIS_LABELS.map((lbl,i) => (
                  <div key={lbl} className="flex items-center gap-2">
                    <svg width={20} height={10}><line x1={0} y1={5} x2={20} y2={5} stroke={AXIS_COLORS[i]} strokeWidth={2.5} /></svg>
                    <span className="text-xs text-[var(--muted)]">{lbl} axis</span>
                  </div>
                ))}
                {def3D.axisVec && (
                  <div className="flex items-center gap-2">
                    <svg width={20} height={10}><line x1={0} y1={5} x2={20} y2={5} stroke="#a855f7" strokeWidth={2.5} /></svg>
                    <span className="text-xs text-[var(--muted)]">Rotation axis k</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <svg width={20} height={10}><line x1={0} y1={5} x2={20} y2={5} stroke="#6b7280" strokeWidth={1.5} /></svg>
                  <span className="text-xs text-[var(--muted)]">Cube edges</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-4 p-3 rounded-md bg-[var(--surface-2)] border border-[var(--border)]">
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          <span className="font-semibold text-[var(--ink)]">
            {tab==="2d" ? def2D.label : def3D.label}
          </span>{" — "}
          {tab==="2d" ? def2D.desc : def3D.desc}
        </p>
      </div>
    </div>
  );
}
