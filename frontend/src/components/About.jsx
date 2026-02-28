import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Users, Zap } from "lucide-react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const About = () => {
  const [ref, isInView] = useIntersectionObserver({ threshold: 0.05 });

  const skills = [
    { name: "UX Design", level: 95, color: "from-primary-500 to-primary-600" },
    { name: "UI Design", level: 92, color: "from-purple-500 to-purple-600" },
    {
      name: "Prototyping",
      level: 88,
      color: "from-fuchsia-500 to-fuchsia-600",
    },
    {
      name: "User Research",
      level: 85,
      color: "from-violet-500 to-violet-600",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "User-Centered",
      description: "Every design decision is driven by user needs and insights",
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Pushing boundaries to create unique digital experiences",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Working closely with teams to bring visions to life",
    },
    {
      icon: Zap,
      title: "Impact",
      description: "Creating solutions that make a real difference",
    },
  ];

  const tools = [
    "Figma",
    "Sketch",
    "Adobe XD",
    "Photoshop",
    "Illustrator",
    "After Effects",
    "Principle",
    "Framer",
  ];

  return (
    <section
      id="about"
      className="py-20 lg:py-28 px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="gradient-text">About Me</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
            {/* Left - Story & Skills */}
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 font-display">
                  Creating Exceptional Digital Experiences
                </h3>
                <div className="space-y-4 text-[15px] text-gray-600 leading-relaxed">
                  <p>
                    I'm a UX/UI designer with a passion for crafting intuitive
                    and beautiful digital products. With over 5 years of
                    experience working with leading brands, I've helped
                    transform complex challenges into elegant solutions that
                    users love.
                  </p>
                  <p>
                    My approach combines strategic thinking, user research, and
                    creative design to deliver experiences that not only look
                    great but also drive real business results.
                  </p>
                  <p>
                    When I'm not designing, you'll find me exploring the latest
                    design trends, mentoring aspiring designers, or working on
                    personal projects that push the boundaries of what's
                    possible in digital design.
                  </p>
                </div>
              </motion.div>

              {/* Skills */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
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
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : {}}
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
                animate={isInView ? { opacity: 1, x: 0 } : {}}
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
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
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
                animate={isInView ? { opacity: 1, x: 0 } : {}}
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
        </motion.div>
      </div>
    </section>
  );
};

export default About;
