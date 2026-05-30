"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { assessment } from "@/data/assessment";

const COLORS = ["#16324f", "#8a1538", "#0f766e", "#2563eb", "#7c3aed", "#b45309"];

export default function AssessmentPanel() {
  const data = assessment.map((a) => ({ name: a.area, value: a.marks }));

  return (
    <section>
      <div className="mb-4 border-b border-[var(--border)] pb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Assessment structure</p>
        <h2 className="text-xl font-bold text-[var(--ink)]">Marks Distribution</h2>
      </div>
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--ink)",
                  fontSize: 12,
                  borderRadius: 8,
                }}
                formatter={(value) => [`${value} marks`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {assessment.map((a, idx) => (
              <div key={a.area} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-[var(--border)] pb-2 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="text-sm text-[var(--ink)]">{a.area}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${a.marks}%`,
                        backgroundColor: COLORS[idx % COLORS.length],
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-[var(--ink)] w-8 text-right">
                    {a.marks}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
