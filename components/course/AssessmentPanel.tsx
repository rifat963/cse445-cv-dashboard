"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { assessment } from "@/data/assessment";

const COLORS = ["#8b949e", "#636c76", "#14B8A6", "#3B82F6", "#8B5CF6", "#F59E0B"];

export default function AssessmentPanel() {
  const data = assessment.map((a) => ({ name: a.area, value: a.marks }));

  return (
    <section>
      <h2 className="text-xl font-bold text-[var(--ink)] mb-4">Marks Distribution</h2>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
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

          <div className="space-y-2">
            {assessment.map((a, idx) => (
              <div key={a.area} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-sm shrink-0"
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
