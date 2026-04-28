import React from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Activity,
  Award,
  Trophy,
  Calendar,
} from "lucide-react";
import { SectionDivider } from "./About";

const WORK_EXPERIENCE = [
  {
    role: "AI & Data Analytics Intern",
    company: "Edunet Foundation",
    period: "Oct 2025 — Nov 2025",
    location: "Remote",
    current: false,
    description:
      "Built an end-to-end traffic flow detection system using computer vision and deep learning. Implemented real-time vehicle detection and traffic density analysis using Python and OpenCV. Designed data pipelines to process live video streams and generate actionable insights.",
  },
];

const OPEN_SOURCE_ORGS = [
  {
    handle: "@hermetoproject",
    role: "Organization contributor",
    url: "https://github.com/hermetoproject",
    initials: "H",
    color: "bg-primary-50 text-primary-700",
  },
  {
    handle: "@PalisadoesFoundation",
    role: "Talawa API + Admin",
    url: "https://github.com/PalisadoesFoundation",
    initials: "P",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    handle: "@konflux-ci",
    role: "Supply chain & CI repos",
    url: "https://github.com/konflux-ci",
    initials: "K",
    color: "bg-blue-50 text-blue-700",
  },
  {
    handle: "@bowtie-json-schema",
    role: "JSON Schema tooling",
    url: "https://github.com/bowtie-json-schema/bowtie",
    initials: "B",
    color: "bg-amber-50 text-amber-700",
  },
];

const AWARDS = [
  {
    title: "Highest cumulative GPA",
    subtitle: "Department award",
    icon: Award,
    accent: "bg-amber-50 text-amber-600",
  },
  {
    title: "SIH selection — 2024",
    subtitle: "Smart India Hackathon",
    icon: Trophy,
    accent: "bg-primary-50 text-primary-600",
  },
  {
    title: "SIH selection — 2025",
    subtitle: "Smart India Hackathon",
    icon: Trophy,
    accent: "bg-primary-50 text-primary-600",
  },
];

const TimelineItem = ({ exp, isLast }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center flex-shrink-0">
      <div
        className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${
          exp.current ? "bg-primary-500 ring-2 ring-primary-200" : "bg-gray-300"
        }`}
      />
      {!isLast && <div className="w-px flex-1 bg-gray-100 mt-1.5" />}
    </div>

    <div className={`pb-8 flex-1 ${isLast ? "pb-0" : ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
        <h3 className="text-[14px] font-medium text-gray-900">{exp.role}</h3>
        <span className="flex items-center gap-1 text-[11px] text-gray-400">
          <Calendar size={11} />
          {exp.period}
        </span>
      </div>
      <p className="text-[13px] font-medium text-primary-600 mb-1">
        {exp.company}
      </p>
      <p className="text-[12px] text-gray-400 mb-2">{exp.location}</p>
      <p className="text-[13px] text-gray-500 leading-relaxed">
        {exp.description}
      </p>
    </div>
  </div>
);

const OrgCard = ({ org }) => (
  <a
    href={org.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group"
  >
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0 ${org.color}`}
    >
      {org.initials}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[12px] font-medium text-gray-800 truncate">
        {org.handle}
      </p>
      <p className="text-[11px] text-gray-400 truncate">{org.role}</p>
    </div>
    <ExternalLink
      size={12}
      className="text-gray-300 group-hover:text-primary-500 transition-colors flex-shrink-0"
    />
  </a>
);

const AwardCard = ({ award }) => {
  const Icon = award.icon;
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border-l-2 border-primary-300 border-t border-r border-b border-gray-100 bg-white">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${award.accent}`}
      >
        <Icon size={15} />
      </div>
      <div>
        <p className="text-[13px] font-medium text-gray-900">{award.title}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{award.subtitle}</p>
      </div>
    </div>
  );
};

const Achievements = ({ embedded = false }) => {
  return (
    <div id="achievements-content" className="scroll-mt-20">
      <SectionDivider label="Achievements" />

      <section className="px-6 lg:px-10 max-w-6xl mx-auto pb-20 space-y-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-medium tracking-[0.1em] text-gray-400 uppercase mb-6">
            Work experience
          </p>
          <div>
            {WORK_EXPERIENCE.map((exp, i) => (
              <TimelineItem
                key={i}
                exp={exp}
                isLast={i === WORK_EXPERIENCE.length - 1}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <p className="text-[11px] font-medium tracking-[0.1em] text-gray-400 uppercase mb-4">
            Open source
          </p>

          <div className="flex items-center gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Activity size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-medium text-gray-900">480+</p>
              <p className="text-[12px] text-gray-400">
                contributions in the last year across personal and open source
                repos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {OPEN_SOURCE_ORGS.map((org) => (
              <OrgCard key={org.handle} org={org} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-[11px] font-medium tracking-[0.1em] text-gray-400 uppercase mb-4">
            Awards & recognitions
          </p>
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {AWARDS.map((award, i) => (
              <AwardCard key={i} award={award} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-center py-10 rounded-2xl bg-gray-50 border border-gray-100"
        >
          <Github size={24} className="mx-auto mb-3 text-gray-400" />
          <p className="text-[14px] font-medium text-gray-800 mb-1">
            See more on GitHub
          </p>
          <p className="text-[12px] text-gray-400 mb-5 max-w-xs mx-auto">
            Repositories, contributions, and open source work
          </p>
          <a
            href="https://github.com/MonishPuttu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900 text-white text-[13px] font-medium hover:bg-gray-700 transition-colors"
          >
            <Github size={14} />
            Visit GitHub profile
            <ExternalLink size={12} />
          </a>
        </motion.div>
      </section>
    </div>
  );
};

export default Achievements;
