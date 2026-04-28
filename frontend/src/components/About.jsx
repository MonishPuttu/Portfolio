import React from "react";
import { motion } from "framer-motion";

const SKILLS = [
  {
    label: "Machine learning / data science",
    pct: 87,
    color: "bg-primary-500",
  },
  { label: "Backend / systems", pct: 90, color: "bg-violet-500" },
  { label: "DevOps / cloud", pct: 88, color: "bg-fuchsia-500" },
  {
    label: "Data analysis / feature engineering",
    pct: 83,
    color: "bg-purple-500",
  },
];

const TOOLS = [
  "Python",
  "Scikit-learn",
  "TensorFlow",
  "Docker",
  "Kubernetes",
  "Argo CD",
  "Helm",
  "Prometheus",
  "Grafana",
  "Node.js",
  "React",
  "Next.js",
  "PostgreSQL",
  "AWS",
];

const SectionDivider = ({ label }) => (
  <div className="flex items-center gap-4 px-6 lg:px-10 mb-10">
    <div className="flex-1 h-px bg-gray-100" />
    <span className="text-[10px] font-medium tracking-[0.14em] text-gray-400 uppercase">
      {label}
    </span>
    <div className="flex-1 h-px bg-gray-100" />
  </div>
);

const About = ({ embedded = false }) => {
  return (
    <div id="about-content" className="scroll-mt-20">
      <SectionDivider label="About" />

      <section className="px-6 lg:px-10 max-w-6xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — bio */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <p className="text-[14px] text-gray-500 leading-relaxed">
              I'm Monish Puttu — a final year BE student building intelligent,
              data-driven systems at the intersection of software engineering
              and machine learning. Strong foundation in full-stack development
              using Node.js, React, and Next.js, while actively expanding
              expertise in deep learning and real-time data systems.
            </p>
            <p className="text-[14px] text-gray-500 leading-relaxed">
              Particularly interested in applied ML, LLM-based applications, and
              scalable AI systems. Active open source contributor with 480+
              GitHub contributions in the past year across Hermeto, Palisadoes
              Foundation, Talawa, Konflux, and Bowtie.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {TOOLS.map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1 rounded-lg text-[12px] text-gray-500 bg-gray-50 border border-gray-100 hover:border-primary-200 hover:text-primary-600 transition-colors cursor-default"
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-5"
          >
            <p className="text-[11px] font-medium tracking-[0.1em] text-gray-400 uppercase mb-6">
              Skills & expertise
            </p>
            {SKILLS.map((skill, i) => (
              <div key={skill.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[13px] font-medium text-gray-700">
                    {skill.label}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {skill.pct}%
                  </span>
                </div>
                <div className="h-[3px] bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.pct}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      delay: 0.2 + i * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`h-full ${skill.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export { SectionDivider };
export default About;
