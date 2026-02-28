import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  ExternalLink,
  Activity,
  Users,
  Award,
  Trophy,
  Briefcase,
  Calendar,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Achievements = () => {
  const workExperience = [
    {
      role: "AI & Data Analytics Intern",
      company: "Edunet Foundation",
      period: "Oct 2025 — Nov 2025",
      location: "Remote",
      description:
        "Built an end-to-end traffic flow detection system using computer vision and deep learning. Implemented real-time vehicle detection and traffic density analysis using Python and OpenCV. Designed data pipelines to process live video streams and generate actionable insights. Delivered production-style demos with visual dashboards, model outputs, and technical documentation.",
      current: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-10 md:pt-40 md:pb-16 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-[3.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] font-black tracking-tighter leading-[0.85] select-none">
              <span className="block text-gray-200">ACHIEVEMENTS</span>
            </h1>

            <p className="mt-6 text-base md:text-lg text-gray-500 max-w-2xl">
              Awards, hackathons, open source contributions &amp; experience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Work Experience Timeline */}
      <section className="px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-xl font-bold text-gray-900 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Work Experience
          </motion.h2>

          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-gray-200" />

            <div className="space-y-8">
              {workExperience.map((exp, i) => (
                <motion.div
                  key={i}
                  className="relative pl-12"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.1 }}
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-[10px] top-1.5 w-4 h-4 rounded-full border-[3px] ${
                      exp.current
                        ? "border-primary-500 bg-white"
                        : "border-gray-300 bg-white"
                    }`}
                  />

                  <div className="p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                      <h3 className="text-base font-bold text-gray-900">
                        {exp.role}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        <Calendar className="w-3 h-3" />
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-primary-600 mb-2">
                      {exp.company}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Open Source
          </motion.h2>

          <div className="space-y-4">
            <motion.div
              className="p-8 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                <Activity className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  430+ contributions
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  in the last year across personal projects and open source
                  repositories
                </p>
              </div>
            </motion.div>

            <motion.div
              className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    @PalisadoesFoundation
                  </h3>
                  <p className="text-sm text-gray-500">
                    Organization Contributor
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Active contributor to Talawa — an open source project for
                community organization management. Contributed to both the API
                and Admin repositories.
              </p>
              <a
                href="https://github.com/PalisadoesFoundation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                View Organization
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Awards & Recognitions */}
      <section className="px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Awards &amp; Recognitions
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* GPA Award */}
            <motion.div
              className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.45 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Highest Cumulative GPA
                  </h3>
                  <p className="text-sm text-gray-500">Department Award</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Awarded for achieving the highest cumulative GPA in the
                department, recognizing consistent academic excellence
                throughout the program.
              </p>
            </motion.div>

            {/* SIH 2024 */}
            <motion.div
              className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    SIH Selection — 2024
                  </h3>
                  <p className="text-sm text-gray-500">Smart India Hackathon</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Selected at the inter-college level for Smart India Hackathon
                2024, competing with innovative solutions to real-world problem
                statements.
              </p>
            </motion.div>

            {/* SIH 2025 */}
            <motion.div
              className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    SIH Selection — 2025
                  </h3>
                  <p className="text-sm text-gray-500">Smart India Hackathon</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Selected again at the inter-college level for Smart India
                Hackathon 2025, demonstrating continued excellence in hackathon
                competitions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center p-10 rounded-3xl bg-gray-50 border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Github className="w-8 h-8 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              See more on GitHub
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Check out my repositories, contributions, and open source work
            </p>
            <a
              href="https://github.com/MonishPuttu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <Github className="w-4 h-4" />
              Visit GitHub Profile
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Achievements;
