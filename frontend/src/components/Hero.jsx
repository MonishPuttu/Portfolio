import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-[#0a0a0a] dark:to-[#0f0f0f] -z-10" />

      {/* Subtle animated blobs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary-500/[0.04] dark:bg-primary-500/[0.06] rounded-full blur-[100px]"
        animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary-600/[0.03] dark:bg-primary-600/[0.05] rounded-full blur-[100px]"
        animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
        {/* Large watermark-style heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h1
            className="text-[3.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] xl:text-[10rem] font-black tracking-tighter leading-[0.85] select-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block text-gray-100 dark:text-gray-800/80">
              COMMERCIAL
            </span>
            <span className="block text-gray-100 dark:text-gray-800/80">
              PROJECTS
            </span>
          </motion.h1>

          <motion.p
            className="mt-8 text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Creating exceptional digital experiences for leading brands
            worldwide
          </motion.p>

          {/* CTA */}
          <motion.button
            onClick={scrollToProjects}
            className="mt-10 inline-flex items-center gap-2 px-7 py-3.5 bg-primary-600 text-white rounded-full font-semibold text-[15px] hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 group"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            View Projects
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown className="w-4 h-4" />
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <div className="w-5 h-8 border-2 border-gray-300 dark:border-gray-700 rounded-full flex items-start justify-center p-1.5">
            <motion.div
              className="w-1 h-1 bg-primary-500 rounded-full"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
