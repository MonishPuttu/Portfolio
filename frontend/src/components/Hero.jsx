import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-4 md:pt-40 md:pb-6 overflow-hidden bg-white">
      <div className="flex justify-center px-6 lg:px-8">
        {/* Large watermark-style heading — matches reference exactly */}
        <motion.h1
          className="text-[2.5rem] sm:text-[3.5rem] md:text-[5.5rem] lg:text-[7.5rem] xl:text-[9rem] font-black tracking-tighter leading-[0.85] select-none whitespace-nowrap text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-gray-200">FEATURED PROJECTS</span>
        </motion.h1>
      </div>
    </section>
  );
};

export default Hero;
