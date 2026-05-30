"use client";

import { assessment, gradingScale } from "@/data/assessment";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Award } from "lucide-react";

const COLORS = ["#8b949e", "#636c76", "#14B8A6", "#3B82F6", "#8B5CF6", "#F59E0B"];

export default function AssessmentPage() {
  const data = assessment.map((a) => ({ name: a.area, value: a.marks }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Award size={22} className="text-co3" />
          <h1 className="text-2xl font-bold text-[var(--ink)]">Assessment Guide</h1>
        </div>
        <p className="text-[var(--muted)]">
          Full marks breakdown, CO mapping, and grading scale for CSE445 Computer Vision.
        </p>
      </div>

      {/* Marks distribution */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">Marks Distribution</h2>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={75} outerRadius={115} paddingAngle={3} dataKey="value">
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
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              {assessment.map((a, idx) => (
                <div key={a.area}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-sm text-[var(--ink)]">{a.area}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {a.co.map((co) => (
                          <span key={co} className="text-[10px] bg-[var(--surface-2)] text-[var(--muted)] px-1.5 py-0.5 rounded font-mono">{co}</span>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-[var(--ink)] w-8 text-right">{a.marks}</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${a.marks}%`, backgroundColor: COLORS[idx % COLORS.length] }} />
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-[var(--border)] flex justify-between">
                <span className="text-sm font-semibold text-[var(--ink)]">Total</span>
                <span className="text-sm font-bold text-[var(--ink)]">
                  {assessment.reduce((s, a) => s + a.marks, 0)} marks
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grading scale */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">Grading Scale</h2>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <div className="grid grid-cols-3 px-4 py-2 bg-[var(--surface-2)] text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
            <span>Percentage Range</span>
            <span className="text-center">Grade</span>
            <span className="text-right">Grade Point</span>
          </div>
          {gradingScale.map((g, i) => (
            <div key={g.grade} className={`grid grid-cols-3 px-4 py-3 text-sm border-t border-[var(--border)] ${i === 0 ? "bg-co1/5" : ""}`}>
              <span className="text-[var(--muted)]">{g.range}</span>
              <span className={`text-center font-bold ${i === 0 ? "text-co1" : "text-[var(--ink)]"}`}>{g.grade}</span>
              <span className="text-right text-[var(--muted)] font-mono">{g.point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Academic code */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--ink)] mb-4">Academic Code of Conduct</h2>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3 text-sm text-[var(--muted)]">
          <p><span className="font-semibold text-[var(--ink)]">Attendance:</span> Minimum 80% class attendance required to sit for the final exam.</p>
          <p><span className="font-semibold text-[var(--ink)]">Plagiarism:</span> Grade will automatically become zero for any plagiarized exam or assignment.</p>
          <p><span className="font-semibold text-[var(--ink)]">Make-up Exams:</span> Normally no make-up exams. In exceptional cases (illness, bereavement, emergency), a written application to the Chairperson through the Course Instructor is required within 48 hours of the missed exam.</p>
          <p><span className="font-semibold text-[var(--ink)]">Final Exam:</span> No makeup for final exam; apply for Incomplete Grade within 48 hours in exceptional cases.</p>
          <p><span className="font-semibold text-[var(--ink)]">Cheating:</span> Zero tolerance. Any form of cheating results in expulsion for several semesters as decided by the Disciplinary Committee.</p>
        </div>
      </section>
    </div>
  );
}
