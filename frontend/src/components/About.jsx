import React from "react";
import { motion } from "framer-motion";
import { Code2, Rocket, Users, Zap } from "lucide-react";
import Navbar from "./Navbar";
import Contact from "./Contact";
import Footer from "./Footer";

const About = ({ embedded = false }) => {
  const skills = [
    {
      name: "Machine Learning / Data Science",
      level: 87,
      color: "from-primary-500 to-primary-600",
    },
    {
      name: "Backend / Systems",
      level: 90,
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "DevOps / Cloud",
      level: 88,
      color: "from-fuchsia-500 to-fuchsia-600",
    },
    {
      name: "Data Analysis / Feature Engineering",
      level: 83,
      color: "from-violet-500 to-violet-600",
    },
  ];

  const values = [
    {
      icon: Zap,
      title: "Applied AI",
      description:
        "Building intelligent systems that solve real world problems using data and machine learning",
    },
    {
      icon: Rocket,
      title: "Learn by Building",
      description:
        "Exploring machine learning concepts through hands on projects and real deployments",
    },
    {
      icon: Code2,
      title: "Scalable Systems",
      description:
        "Combining machine learning with strong backend systems to build production ready applications",
    },
    {
      icon: Users,
      title: "Open Source and Collaboration",
      description:
        "Contributing to impactful projects and learning through community driven development",
    },
  ];

  const tools = [
    "Python",
    "Scikit learn",
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

  return (
    <div className={embedded ? "bg-white" : "min-h-screen bg-white"}>
      {!embedded && <Navbar />}

      {/* Hero Section */}
      <section className="relative pt-32 pb-10 md:pt-40 md:pb-16 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-[3.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] font-black tracking-tighter leading-[0.85] select-none">
              <span className="block text-gray-200">ABOUT ME</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section
        id="about-content"
        className={`py-10 lg:py-16 px-6 lg:px-8 bg-white ${embedded ? "scroll-mt-28" : "scroll-mt-24"}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
            {/* Left - Story & Skills */}
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 font-display">
                  About Me
                </h3>
                <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    I am Monish Puttu, a final year BE student focused on
                    building intelligent, data driven systems at the
                    intersection of software engineering and machine learning. I
                    have a strong foundation in full stack development using
                    Node.js, React, and Next.js, which I use to design and
                    deploy scalable applications, while actively expanding my
                    expertise in machine learning, deep learning, and real time
                    data systems with a focus on practical implementation and
                    model deployment.
                  </p>
                  <p>
                    I am particularly interested in applied machine learning,
                    large language model based applications, and scalable AI
                    systems. As an active open source contributor, I have worked
                    with organizations like Hermeto, Palisadoes Foundation,
                    Talawa, Konflux, and Bowtie, with 480 plus GitHub
                    contributions in the past year. I believe in learning by
                    building and shipping projects that combine intelligent
                    models with strong engineering.
                  </p>
                </div>
              </motion.div>

              {/* Skills */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h4 className="text-lg font-bold text-gray-900 mb-6">
                  Skills & Expertise
                </h4>
                <div className="space-y-5">
                  {skills.map((skill, i) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-semibold text-gray-800">
                          {skill.name}
                        </span>
                        <span className="text-xs font-medium text-gray-400">
                          {`${skill.level}%`}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{
                            duration: 1.2,
                            delay: 0.4 + i * 0.15,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right - Values & Tools */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h4 className="text-lg font-bold text-gray-900 mb-6">
                  What Drives Me
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {values.map((value, i) => {
                    const Icon = value.icon;
                    return (
                      <motion.div
                        key={value.title}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                        whileHover={{ y: -3 }}
                        className="p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary-200 transition-all duration-300"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center mb-3">
                          <Icon className="w-4 h-4 text-primary-600" />
                        </div>
                        <h5 className="text-sm font-bold text-gray-900 mb-1">
                          {value.title}
                        </h5>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {value.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Tools */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-10"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-5">
                  Tools I Use
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool) => (
                    <motion.span
                      key={tool}
                      whileHover={{ scale: 1.04 }}
                      className="px-3.5 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium border border-transparent hover:border-primary-300 transition-colors cursor-default"
                    >
                      {tool}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {!embedded && <Contact />}
      {!embedded && <Footer />}
    </div>
  );
};

export default About;
