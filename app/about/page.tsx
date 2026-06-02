import type { Metadata } from "next";
import {
  BookOpen,
  Building2,
  ExternalLink,
  Globe2,
  GraduationCap,
  Mail,
  MapPin,
} from "lucide-react";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "About - CSE445",
  description:
    "Academic profile of Dr. Mohammad Rifat Ahmmad Rashid, Associate Professor at East West University.",
};

const education = [
  {
    degree: "Ph.D., Computer and Control Engineering",
    institution: "Polytechnic University of Turin, Italy",
    years: "2014-2018",
  },
  {
    degree: "M.Sc., Computer Engineering",
    institution: "University of Pavia, Italy",
    years: "2012-2014",
  },
  {
    degree: "B.Eng., Computer Science and Engineering",
    institution: "Khulna University, Bangladesh",
    years: "2005-2009",
  },
];

const contactLinks = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
  { label: "GitHub", value: "github.com/rifat963", href: profile.github, icon: ExternalLink },
  { label: "Google Scholar", value: "Scholar Profile", href: profile.scholar, icon: GraduationCap },
  { label: "LinkedIn", value: "LinkedIn Profile", href: profile.linkedin, icon: ExternalLink },
  { label: "Personal Website", value: "rifat963.github.io", href: profile.website, icon: Globe2 },
];

const publicationStats = [
  { label: "Journals", value: `${profile.stats.journals}+` },
  { label: "Conferences", value: `${profile.stats.conferences}+` },
  { label: "Book Chapters", value: profile.stats.bookChapters },
  { label: "Funded Projects", value: profile.stats.fundedProjects },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Instructor profile</p>
        <h1 className="mt-1 text-2xl font-bold text-[var(--ink)]">About the Instructor</h1>
        <p className="mt-2 max-w-3xl text-[var(--muted)]">
          Academic background, research interests, and contact information for the CSE445 course instructor.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="space-y-6">
          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="border-b border-[var(--border)] pb-5">
              <h2 className="text-2xl font-bold text-[var(--ink)]">{profile.name}</h2>
              <p className="mt-1 font-medium text-[var(--academic)]">
                {profile.title} · {profile.department}
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--muted)]">
                <MapPin size={15} className="shrink-0" />
                {profile.university}, {profile.location}
              </p>
            </div>

            <div className="space-y-4 pt-5 text-sm leading-7 text-[var(--muted)]">
              <p>
                I am an Associate Professor at the Department of Computer Science and Engineering,
                East West University (EWU), Dhaka. I obtained my Ph.D. in Computer and Control
                Engineering from the Polytechnic University of Turin, Italy (2014-2018), where my
                research focused on knowledge base quality assessment and linked open data profiling.
                Prior to EWU, I held research and academic positions at the University of Liberal Arts
                Bangladesh (2019-2022) and the LINKS Foundation in Turin, Italy (2018-2019), where I
                contributed to EU H2020 projects including BRAIN-IoT and MONSOON.
              </p>
              <p>
                My current research at EWU spans computer vision for precision agriculture in
                Bangladesh, brain-computer interface systems using EEG and graph neural networks,
                knowledge graph-enhanced retrieval-augmented generation (RAG) pipelines, and applied
                machine learning for IoT and smart systems. I currently lead one EWU CRT-funded project
                as Principal Investigator and co-lead three additional CRT projects. My work has been
                published in Elsevier, IEEE, Nature, and IOS Press journals, with 72+ peer-reviewed
                contributions.
              </p>
              <p>
                The <strong className="text-[var(--ink)]">Applied Vision Lab (AVL)</strong> portal exists
                to make my teaching materials openly accessible, share research progress with the
                broader community, and provide structured learning resources for students in computer
                vision and applied AI. I teach Computer Vision (CSE445), Digital Image Processing
                (CSE438), and Statistics for Data Science (AIML505), with interactive dashboards for
                each course.
              </p>
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--ink)]">
              <BookOpen size={18} className="text-[var(--academic)]" />
              Research Interests
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-[var(--border)] bg-[var(--canvas)] px-3 py-1.5 text-xs text-[var(--muted)]"
                >
                  {interest}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--ink)]">
              <GraduationCap size={19} className="text-[var(--academic)]" />
              Education
            </h2>
            <div className="mt-4 divide-y divide-[var(--border)]">
              {education.map((item) => (
                <div key={item.degree} className="grid gap-1 py-4 sm:grid-cols-[92px_1fr] sm:gap-4">
                  <p className="font-mono text-xs text-[var(--muted)]">{item.years}</p>
                  <div>
                    <p className="text-sm font-semibold text-[var(--ink)]">{item.degree}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{item.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--ink)]">Contact &amp; Links</h2>
            <div className="mt-4 space-y-3">
              {contactLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 text-sm"
                  >
                    <Icon size={16} className="mt-0.5 shrink-0 text-[var(--academic)]" />
                    <span className="min-w-0">
                      <span className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                        {link.label}
                      </span>
                      <span className="flex items-center gap-1 break-all text-[var(--ink)] group-hover:text-[var(--academic)]">
                        {link.value}
                        {link.href.startsWith("http") && <ExternalLink size={11} className="shrink-0" />}
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg bg-[var(--academic)] p-5 text-white">
            <h2 className="text-sm font-bold uppercase tracking-wide">Publication Stats</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {publicationStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wide text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[var(--ink)]">
              <Building2 size={16} className="text-[var(--academic)]" />
              Office
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {profile.office}
              <br />
              Department of CSE
              <br />
              East West University
              <br />
              Dhaka 1212, Bangladesh
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
