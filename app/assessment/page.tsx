"use client";

import { assessment, gradingScale } from "@/data/assessment";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Award } from "lucide-react";

const COLORS = ["#16324f", "#8a1538", "#0f766e", "#2563eb", "#7c3aed", "#b45309"];

export default function AssessmentPage() {
  const data = assessment.map((a) => ({ name: a.area, value: a.marks }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Assessment structure</p>
        <div className="mt-1 flex items-center gap-2">
          <Award size={22} className="text-[var(--academic)]" />
          <h1 className="text-2xl font-bold text-[var(--ink)]">Assessment Guide</h1>
        </div>
        <p className="text-[var(--muted)] mt-2 max-w-3xl">
          Full marks breakdown, CO mapping, grading scale, and academic conduct expectations for CSE445 Computer Vision.
        </p>
      </div>

      <section>
        <div className="mb-4 border-b border-[var(--border)] pb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Marks sheet</p>
          <h2 className="text-lg font-semibold text-[var(--ink)]">Marks Distribution</h2>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
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
                <div key={a.area} className="border-b border-[var(--border)] pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1 gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-sm text-[var(--ink)]">{a.area}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {a.co.map((co) => (
                          <span key={co} className="text-[10px] border border-[var(--border)] bg-[var(--canvas)] text-[var(--muted)] px-1.5 py-0.5 rounded font-mono">{co}</span>
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

      <section>
        <div className="mb-4 border-b border-[var(--border)] pb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Grade reference</p>
          <h2 className="text-lg font-semibold text-[var(--ink)]">Grading Scale</h2>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
          <div className="grid grid-cols-3 px-4 py-2 bg-[var(--surface-2)] text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">
            <span>Percentage Range</span>
            <span className="text-center">Grade</span>
            <span className="text-right">Grade Point</span>
          </div>
          {gradingScale.map((g, i) => (
            <div key={g.grade} className={`grid grid-cols-3 px-4 py-3 text-sm border-t border-[var(--border)] ${i === 0 ? "bg-[var(--canvas)]" : ""}`}>
              <span className="text-[var(--muted)]">{g.range}</span>
              <span className={`text-center font-bold ${i === 0 ? "text-[var(--academic)]" : "text-[var(--ink)]"}`}>{g.grade}</span>
              <span className="text-right text-[var(--muted)] font-mono">{g.point}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 border-b border-[var(--border)] pb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Academic policy</p>
          <h2 className="text-lg font-semibold text-[var(--ink)]">Academic Code of Conduct</h2>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3 text-sm text-[var(--muted)]">
          <p><span className="font-semibold text-[var(--ink)]">Attendance:</span> Minimum 80% class attendance required to sit for the final exam.</p>
          <p><span className="font-semibold text-[var(--ink)]">Plagiarism:</span> Grade will automatically become zero for any plagiarized exam or assignment.</p>
          <p><span className="font-semibold text-[var(--ink)]">Make-up Exams:</span> Normally no make-up exams. In exceptional cases, a written application to the Chairperson through the Course Instructor is required within 48 hours of the missed exam.</p>
          <p><span className="font-semibold text-[var(--ink)]">Final Exam:</span> No makeup for final exam; apply for Incomplete Grade within 48 hours in exceptional cases.</p>
          <p><span className="font-semibold text-[var(--ink)]">Cheating:</span> Zero tolerance. Any form of cheating results in expulsion for several semesters as decided by the Disciplinary Committee.</p>
        </div>
      </section>
    </div>
  );
}
