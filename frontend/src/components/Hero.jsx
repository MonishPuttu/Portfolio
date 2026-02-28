import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-10 md:pt-40 md:pb-16 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Large watermark-style heading — matches reference exactly */}
        <motion.h1
          className="text-[3.5rem] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] xl:text-[11rem] font-black tracking-tighter leading-[0.85] select-none"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="block text-gray-200">COMMERCIAL</span>
          <span className="block text-gray-200">PROJECTS</span>
        </motion.h1>
      </div>
    </section>
  );
};

export default Hero;
