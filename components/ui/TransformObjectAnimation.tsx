"use client";
import { useState, useRef, useEffect } from "react";

const W = 320, H = 255;
const CX = 148, CY = 128;

// 3D projection — pixel-space coordinates, camera at z = -DEPTH_3D
const SCALE_3D = 120;
const DEPTH_3D = 80;
const AXIS_LEN  = 35;
const AXIS_COLORS = ["#ef4444", "#22c55e", "#3b82f6"];
const AXIS_LABELS = ["X", "Y", "Z"];
type Vec3 = [number, number, number];
const AXIS_TIPS: Vec3[] = [[AXIS_LEN,0,0],[0,AXIS_LEN,0],[0,0,AXIS_LEN]];

// ── House points (model-space) ────────────────────────────────────────────
const ALL_PTS = [
  { id: "A", x:   0, y: -52, label: true  },
  { id: "B", x: -40, y:  -8, label: true  },
  { id: "C", x:  40, y:  -8, label: true  },
  { id: "D", x:  40, y:  44, label: true  },
  { id: "E", x: -40, y:  44, label: true  },
  { id: "F", x: -13, y:  12, label: false },
  { id: "G", x:  13, y:  12, label: false },
  { id: "H", x:  13, y:  44, label: false },
  { id: "I", x: -13, y:  44, label: false },
  { id: "J", x: -34, y:   0, label: false },
  { id: "K", x: -18, y:   0, label: false },
  { id: "L", x: -18, y:  13, label: false },
  { id: "M", x: -34, y:  13, label: false },
  { id: "N", x:  18, y:   0, label: false },
  { id: "O", x:  34, y:   0, label: false },
  { id: "P", x:  34, y:  13, label: false },
  { id: "Q", x:  18, y:  13, label: false },
];

const HOUSE_IDX   = [0, 2, 3, 4, 1];
const DOOR_IDX    = [5, 6, 7, 8];
const WIN_L_IDX   = [9, 10, 11, 12];
const WIN_R_IDX   = [13, 14, 15, 16];

const HOUSE_EDGES: [number,number][] = [[0,2],[2,3],[3,4],[4,1],[1,0]];
const DOOR_EDGES:  [number,number][] = [[5,6],[6,7],[7,8],[8,5]];
const WIN_L_EDGES: [number,number][] = [[9,10],[10,11],[11,12],[12,9]];
const WIN_R_EDGES: [number,number][] = [[13,14],[14,15],[15,16],[16,13]];

// ── 3D math ───────────────────────────────────────────────────────────────
const Rx = (a: number): number[][] => { const c=Math.cos(a),s=Math.sin(a); return [[1,0,0],[0,c,-s],[0,s,c]]; };
const Ry = (a: number): number[][] => { const c=Math.cos(a),s=Math.sin(a); return [[c,0,s],[0,1,0],[-s,0,c]]; };
const Rz = (a: number): number[][] => { const c=Math.cos(a),s=Math.sin(a); return [[c,-s,0],[s,c,0],[0,0,1]]; };
const mulMV = (m: number[][], v: Vec3): Vec3 => [
  m[0][0]*v[0]+m[0][1]*v[1]+m[0][2]*v[2],
  m[1][0]*v[0]+m[1][1]*v[1]+m[1][2]*v[2],
  m[2][0]*v[0]+m[2][1]*v[1]+m[2][2]*v[2],
];
function perspProj(v: Vec3): [number,number] {
  const z = v[2] + DEPTH_3D;
  return [CX + (v[0]/z)*SCALE_3D, CY + (v[1]/z)*SCALE_3D];
}

// ── 2D modes ──────────────────────────────────────────────────────────────
type Mode2D = "translate"|"rotate"|"scale"|"shear";
const MODES_2D: Mode2D[] = ["translate","rotate","scale","shear"];
interface Def2D { label:string; color:string; apply:(x:number,y:number)=>[number,number]; formula:string[]; desc:string; }

const DEFS_2D: Record<Mode2D,Def2D> = {
  translate: {
    label:"Translate", color:"#3b82f6",
    apply:(x,y)=>[x+48,y+22],
    formula:["x′ = x + tx","y′ = y + ty   (tx = 48,  ty = 22)"],
    desc:"Every vertex shifts by the same vector (tx, ty). The shape, size, and orientation are all preserved — pure displacement, 2 DOF.",
  },
  rotate: {
    label:"Rotate 45°", color:"#f59e0b",
    apply:(x,y)=>{ const a=Math.PI/4; return [x*Math.cos(a)-y*Math.sin(a), x*Math.sin(a)+y*Math.cos(a)]; },
    formula:["x′ = x·cos θ − y·sin θ","y′ = x·sin θ + y·cos θ   (θ = 45°)"],
    desc:"Points orbit the origin. Both x and y mix into x′ and y′ — that cross-mixing is what makes rotation non-trivial and why we need a 2×2 matrix.",
  },
  scale: {
    label:"Scale", color:"#10b981",
    apply:(x,y)=>[x*1.5,y*0.75],
    formula:["x′ = sx · x = 1.5 x","y′ = sy · y = 0.75 y"],
    desc:"x stretched by 1.5× (wider), y squashed to 0.75× (shorter). Non-uniform scale (sx ≠ sy) distorts proportions — the house gets wider and flatter.",
  },
  shear: {
    label:"Shear", color:"#8b5cf6",
    apply:(x,y)=>[x+0.55*y,y],
    formula:["x′ = x + shx · y = x + 0.55 y","y′ = y"],
    desc:"Each row slides right by an amount proportional to its y depth (shx = 0.55). Horizontal lines stay; vertical lines tilt. Area is preserved.",
  },
};

// ── 3D modes ──────────────────────────────────────────────────────────────
type Mode3D = "rotX"|"rotY"|"rotZ"|"scale3d";
const MODES_3D: Mode3D[] = ["rotX","rotY","rotZ","scale3d"];
interface Def3D { label:string; color:string; getMatrix:(t:number)=>number[][]; formula:string[]; desc:string; }

const DEFS_3D: Record<Mode3D,Def3D> = {
  rotX: {
    label:"Rotate X", color:"#ef4444",
    getMatrix:(t)=>Rx(t),
    formula:["x′ = x","y′ = y·cos θ − z·sin θ","z′ = y·sin θ + z·cos θ"],
    desc:"Rotation about the X-axis (red) tilts the house toward/away from the viewer. y and z coordinates mix while x stays fixed.",
  },
  rotY: {
    label:"Rotate Y", color:"#22c55e",
    getMatrix:(t)=>Ry(t),
    formula:["x′ = x·cos θ + z·sin θ","y′ = y","z′ = −x·sin θ + z·cos θ"],
    desc:"Rotation about the Y-axis (green) spins the house around a vertical axis. x and z mix while y stays fixed — like a rotating display stand.",
  },
  rotZ: {
    label:"Rotate Z", color:"#3b82f6",
    getMatrix:(t)=>Rz(t),
    formula:["x′ = x·cos θ − y·sin θ","y′ = x·sin θ + y·cos θ","z′ = z"],
    desc:"Rotation about the Z-axis (blue) is the familiar 2D rotation extended to 3D. z is preserved throughout — identical to the 2D rotate mode but in 3D space.",
  },
  scale3d: {
    label:"Scale 3D", color:"#d946ef",
    getMatrix:()=>[[1,0,0],[0,1,0],[0,0,1]],
    formula:["x′ = 1.5 x","y′ = 0.75 y","z′ = 2.0 z"],
    desc:"Independent scaling on all three axes. z′ stays 0 for this flat house (all z=0 at rest), showing that sz only matters once a shape has actual depth.",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) { return a + (b-a)*t; }

interface Line3D { x1:number; y1:number; x2:number; y2:number; color:string; width:number; opacity:number; label?:string; labelX?:number; labelY?:number; }

// ── Component ─────────────────────────────────────────────────────────────
export default function TransformObjectAnimation() {
  const [tab,     setTab]     = useState<"2d"|"3d">("2d");
  const [mode2D,  setMode2D]  = useState<Mode2D>("translate");
  const [mode3D,  setMode3D]  = useState<Mode3D>("rotX");
  const [progress, setProgress] = useState(0);
  const [lines3D, setLines3D] = useState<Line3D[]>([]);
  const [verts3D, setVerts3D] = useState<Vec3[]>(ALL_PTS.map(v => [v.x, v.y, 0] as Vec3));

  const rafRef    = useRef<number>(0);
  const tRef      = useRef(0);
  const lastRef   = useRef<number|null>(null);
  const mode3DRef = useRef<Mode3D>(mode3D);
  useEffect(() => { mode3DRef.current = mode3D; }, [mode3D]);

  // 2D ping-pong
  useEffect(() => {
    if (tab !== "2d") { cancelAnimationFrame(rafRef.current); return; }
    tRef.current = 0; lastRef.current = null;
    const loop = (now: number) => {
      if (lastRef.current !== null) tRef.current += (now-lastRef.current)/1000;
      lastRef.current = now;
      setProgress((1-Math.cos(tRef.current*1.1))/2);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tab, mode2D]);

  // 3D continuous rotation
  useEffect(() => {
    if (tab !== "3d") { cancelAnimationFrame(rafRef.current); return; }
    tRef.current = 0; lastRef.current = null;
    const loop = (now: number) => {
      if (lastRef.current !== null) tRef.current += (now-lastRef.current)/1000;
      lastRef.current = now;
      const m = mode3DRef.current;
      const t = tRef.current;

      // Compute current 3D position of every house vertex
      let pts3D: Vec3[];
      if (m === "scale3d") {
        const p = (1-Math.cos(t*1.1))/2;
        pts3D = ALL_PTS.map(v => [lerp(v.x,v.x*1.5,p), lerp(v.y,v.y*0.75,p), 0] as Vec3);
      } else {
        const M = DEFS_3D[m].getMatrix(t*0.85);
        pts3D = ALL_PTS.map(v => mulMV(M, [v.x,v.y,0]));
      }
      setVerts3D(pts3D);

      // Project all vertices to screen
      const pts2D = pts3D.map(v => perspProj(v));

      const newLines: Line3D[] = [];
      const color = DEFS_3D[m].color;
      const depthOp = (z: number) => Math.max(0.15, Math.min(1, 1-z/DEPTH_3D));

      const drawEdges = (edges: [number,number][], c: string, w: number) => {
        for (const [i,j] of edges) {
          const avgZ = (pts3D[i][2]+pts3D[j][2])/2;
          newLines.push({ x1:pts2D[i][0],y1:pts2D[i][1], x2:pts2D[j][0],y2:pts2D[j][1], color:c, width:w, opacity:depthOp(avgZ) });
        }
      };
      drawEdges(HOUSE_EDGES, color, 2);
      drawEdges(DOOR_EDGES,  color, 1);
      drawEdges(WIN_L_EDGES, "#3b82f6", 1);
      drawEdges(WIN_R_EDGES, "#3b82f6", 1);

      // Body-frame XYZ axes (rotate with object; not for scale3d)
      if (m !== "scale3d") {
        const M = DEFS_3D[m].getMatrix(t*0.85);
        AXIS_TIPS.forEach((tip, idx) => {
          const rt  = mulMV(M, tip);
          const o2d = perspProj([0,0,0]);
          const t2d = perspProj(rt);
          newLines.push({ x1:o2d[0],y1:o2d[1], x2:t2d[0],y2:t2d[1], color:AXIS_COLORS[idx], width:2.5, opacity:1, label:AXIS_LABELS[idx], labelX:t2d[0], labelY:t2d[1]-7 });
        });
      }

      setLines3D(newLines);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tab, mode3D]);

  const def2D = DEFS_2D[mode2D];
  const def3D = DEFS_3D[mode3D];
  const activeColor   = tab==="2d" ? def2D.color : def3D.color;
  const activeFormula = tab==="2d" ? def2D.formula : def3D.formula;

  // 2D interpolated points
  const curPts = ALL_PTS.map(v => {
    const [tx,ty] = def2D.apply(v.x,v.y);
    return { ...v, svgX:CX+lerp(v.x,tx,progress), svgY:CY+lerp(v.y,ty,progress), curX:lerp(v.x,tx,progress), curY:lerp(v.y,ty,progress) };
  });

  const polyPts  = (idxs: number[]) => idxs.map(i=>`${curPts[i].svgX},${curPts[i].svgY}`).join(" ");
  const origPoly = (idxs: number[]) => idxs.map(i=>`${CX+ALL_PTS[i].x},${CY+ALL_PTS[i].y}`).join(" ");
  const fmt = (n: number) => n.toFixed(1);

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 mb-8">

      {/* Header */}
      <div className="mb-4">
        <h2 className="font-semibold text-[var(--ink)] text-sm mb-0.5">Object Transformation Walkthrough</h2>
        <p className="text-xs text-[var(--muted)]">A house shape with labeled vertices — watch coordinates update live as each point transforms</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1.5 mb-3">
        {(["2d","3d"] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); tRef.current=0; lastRef.current=null; }}
            className={`px-3 py-1.5 text-xs rounded border font-semibold transition-colors ${
              tab===t
                ? "bg-[var(--ink)] text-[var(--surface)] border-[var(--ink)]"
                : "bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--ink)]"
            }`}>
            {t==="2d" ? "2D Transforms" : "3D Transforms"}
          </button>
        ))}
      </div>

      {/* Mode buttons */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {(tab==="2d" ? MODES_2D : MODES_3D).map(m => {
          const active = tab==="2d" ? mode2D===(m as Mode2D) : mode3D===(m as Mode3D);
          const color  = tab==="2d" ? DEFS_2D[m as Mode2D].color : DEFS_3D[m as Mode3D].color;
          const label  = tab==="2d" ? DEFS_2D[m as Mode2D].label : DEFS_3D[m as Mode3D].label;
          return (
            <button key={m}
              onClick={() => tab==="2d" ? setMode2D(m as Mode2D) : setMode3D(m as Mode3D)}
              style={active ? {backgroundColor:color,borderColor:color} : {}}
              className={`px-2.5 py-1 text-xs rounded border font-medium transition-colors ${
                active ? "text-white" : "bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--ink)]"
              }`}>
              {label}
            </button>
          );
        })}
      </div>

      {/* Canvas + panel */}
      <div className="flex flex-col md:flex-row gap-4">

        {/* SVG canvas */}
        <div className="rounded-md overflow-hidden border border-[var(--border)] bg-neutral-100 dark:bg-neutral-900 shrink-0">
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{display:"block"}}>

            {/* Grid */}
            {Array.from({length:9},(_,i)=>{ const x=Math.round((i+1)*W/10); return <line key={`gx${i}`} x1={x} y1={0} x2={x} y2={H} stroke="#e5e7eb" strokeWidth={0.5}/>; })}
            {Array.from({length:7},(_,i)=>{ const y=Math.round((i+1)*H/8); return <line key={`gy${i}`} x1={0} y1={y} x2={W} y2={y} stroke="#e5e7eb" strokeWidth={0.5}/>; })}

            {tab==="2d" ? (
              <>
                {/* Axes */}
                <line x1={18} y1={CY} x2={W-12} y2={CY} stroke="#d1d5db" strokeWidth={1}/>
                <line x1={CX} y1={H-12} x2={CX} y2={12} stroke="#d1d5db" strokeWidth={1}/>
                <polygon points={`${W-12},${CY} ${W-20},${CY-4} ${W-20},${CY+4}`} fill="#d1d5db"/>
                <polygon points={`${CX},12 ${CX-4},20 ${CX+4},20`} fill="#d1d5db"/>
                <text x={W-10} y={CY-6} fontSize={10} fill="#9ca3af" textAnchor="end">x</text>
                <text x={CX+7} y={16} fontSize={10} fill="#9ca3af">y</text>
                <circle cx={CX} cy={CY} r={2.5} fill="#d1d5db"/>

                {/* Ghost */}
                <polygon points={origPoly(HOUSE_IDX)} fill={`${def2D.color}0d`} stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="5 3"/>
                <polygon points={origPoly(DOOR_IDX)}  fill="none" stroke="#9ca3af" strokeWidth={1} strokeDasharray="4 2"/>
                <polygon points={origPoly(WIN_L_IDX)} fill="none" stroke="#9ca3af" strokeWidth={1} strokeDasharray="4 2"/>
                <polygon points={origPoly(WIN_R_IDX)} fill="none" stroke="#9ca3af" strokeWidth={1} strokeDasharray="4 2"/>

                {/* Animated house */}
                <polygon points={polyPts(HOUSE_IDX)} fill={`${def2D.color}22`} stroke={def2D.color} strokeWidth={2} strokeLinejoin="round"/>
                <polygon points={polyPts(DOOR_IDX)}  fill="#4b556355" stroke={def2D.color} strokeWidth={1} strokeLinejoin="round"/>
                <polygon points={polyPts(WIN_L_IDX)} fill="#bfdbfe55" stroke="#3b82f6" strokeWidth={1} strokeLinejoin="round"/>
                <polygon points={polyPts(WIN_R_IDX)} fill="#bfdbfe55" stroke="#3b82f6" strokeWidth={1} strokeLinejoin="round"/>

                {/* Labeled vertices */}
                {curPts.filter(p=>p.label).map(v=>(
                  <g key={v.id}>
                    <circle cx={v.svgX} cy={v.svgY} r={4} fill={def2D.color}/>
                    <text x={v.svgX+7} y={v.svgY+4} fontSize={11} fontWeight="bold" fill={def2D.color}>{v.id}</text>
                  </g>
                ))}
              </>
            ) : (
              <>
                {/* 3D wireframe + axes */}
                {lines3D.map((l,i)=>(
                  <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                    stroke={l.color} strokeWidth={l.width} strokeOpacity={l.opacity} strokeLinecap="round"/>
                ))}
                {lines3D.filter(l=>l.label!==undefined).map((l,i)=>(
                  <text key={`al${i}`} x={l.labelX} y={l.labelY} textAnchor="middle" fontSize={11} fontWeight="bold" fill={l.color}>{l.label}</text>
                ))}
              </>
            )}
          </svg>
        </div>

        {/* Right panel */}
        <div className="flex-1 min-w-0 flex flex-col gap-3 justify-center">

          {/* Formula */}
          <div>
            <p className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-widest mb-1.5">Formula</p>
            <div className="bg-[var(--surface-2)] rounded-md px-3 py-2 font-mono text-xs leading-relaxed" style={{color:activeColor}}>
              {activeFormula.map((line,i)=><div key={i}>{line}</div>)}
            </div>
          </div>

          {/* Live coordinate table */}
          <div>
            <p className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-widest mb-1.5">Live Coordinates</p>
            <div className="rounded-md overflow-hidden border border-[var(--border)]">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="bg-[var(--surface-2)]">
                    <th className="py-1.5 px-2 text-left text-[var(--muted)] font-semibold">Pt</th>
                    <th className="py-1.5 px-1.5 text-right text-[var(--muted)] font-semibold">x</th>
                    <th className="py-1.5 px-1.5 text-right text-[var(--muted)] font-semibold">y</th>
                    {tab==="3d" && <th className="py-1.5 px-1.5 text-right text-[var(--muted)] font-semibold">z</th>}
                    <th className="py-1.5 px-1 text-center text-[var(--muted)]">→</th>
                    <th className="py-1.5 px-1.5 text-right font-semibold" style={{color:activeColor}}>x′</th>
                    <th className="py-1.5 px-1.5 text-right font-semibold" style={{color:activeColor}}>y′</th>
                    {tab==="3d" && <th className="py-1.5 px-1.5 text-right font-semibold" style={{color:activeColor}}>z′</th>}
                  </tr>
                </thead>
                <tbody>
                  {ALL_PTS.slice(0,5).map((v,i)=>{
                    const c3 = verts3D[i];
                    const c2 = curPts[i];
                    return (
                      <tr key={v.id} className={`border-t border-[var(--border)] ${i%2===0?"bg-[var(--surface)]":"bg-[var(--surface-2)]"}`}>
                        <td className="py-1 px-2 font-bold" style={{color:activeColor}}>{v.id}</td>
                        <td className="py-1 px-1.5 text-right text-[var(--muted)]">{fmt(v.x)}</td>
                        <td className="py-1 px-1.5 text-right text-[var(--muted)]">{fmt(v.y)}</td>
                        {tab==="3d" && <td className="py-1 px-1.5 text-right text-[var(--muted)]">0.0</td>}
                        <td className="py-1 px-1 text-center text-[var(--muted)]">→</td>
                        <td className="py-1 px-1.5 text-right tabular-nums font-semibold" style={{color:activeColor}}>{fmt(tab==="3d" ? c3[0] : c2.curX)}</td>
                        <td className="py-1 px-1.5 text-right tabular-nums font-semibold" style={{color:activeColor}}>{fmt(tab==="3d" ? c3[1] : c2.curY)}</td>
                        {tab==="3d" && <td className="py-1 px-1.5 text-right tabular-nums font-semibold" style={{color:activeColor}}>{fmt(c3[2])}</td>}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-1">
            {tab==="2d" ? (
              <>
                <div className="flex items-center gap-2">
                  <svg width={20} height={10}><line x1={0} y1={5} x2={20} y2={5} stroke="#9ca3af" strokeWidth={1.5} strokeDasharray="5 3"/></svg>
                  <span className="text-xs text-[var(--muted)]">Original position</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width={20} height={10}><line x1={0} y1={5} x2={20} y2={5} stroke={def2D.color} strokeWidth={2}/></svg>
                  <span className="text-xs text-[var(--muted)]">Transformed position</span>
                </div>
              </>
            ) : (
              <>
                {mode3D!=="scale3d" && AXIS_LABELS.map((lbl,i)=>(
                  <div key={lbl} className="flex items-center gap-2">
                    <svg width={20} height={10}><line x1={0} y1={5} x2={20} y2={5} stroke={AXIS_COLORS[i]} strokeWidth={2.5}/></svg>
                    <span className="text-xs text-[var(--muted)]">{lbl} axis</span>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <svg width={20} height={10}><line x1={0} y1={5} x2={20} y2={5} stroke={def3D.color} strokeWidth={2}/></svg>
                  <span className="text-xs text-[var(--muted)]">House edges</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-4 p-3 rounded-md bg-[var(--surface-2)] border border-[var(--border)]">
        <p className="text-xs text-[var(--muted)] leading-relaxed">
          <span className="font-semibold text-[var(--ink)]">{tab==="2d" ? def2D.label : def3D.label}</span>
          {" — "}
          {tab==="2d" ? def2D.desc : def3D.desc}
        </p>
      </div>
    </div>
  );
}
