import React from 'react';
import { motion } from 'framer-motion';
import { Code, Palette, Zap, Users, Heart, Sparkles } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const About = () => {
  const [ref, isInView] = useIntersectionObserver({ threshold: 0.1 });

  const skills = [
    { name: 'UX Design', level: 95, color: 'from-primary-500 to-primary-600' },
    { name: 'UI Design', level: 92, color: 'from-purple-500 to-purple-600' },
    { name: 'Prototyping', level: 88, color: 'from-pink-500 to-pink-600' },
    { name: 'User Research', level: 85, color: 'from-blue-500 to-blue-600' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'User-Centered',
      description: 'Every design decision is driven by user needs and insights',
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'Pushing boundaries to create unique digital experiences',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Working closely with teams to bring visions to life',
    },
    {
      icon: Zap,
      title: 'Impact',
      description: 'Creating solutions that make a real difference',
    },
  ];

  return (
    <section id="about" className="py-24 px-6 lg:px-8 bg-light-bg dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                About Me
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column - Story */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Creating Exceptional Digital Experiences
                </h3>
                
                <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p>
                    I'm a UX/UI designer with a passion for crafting intuitive and beautiful digital products. 
                    With over 5 years of experience working with leading brands, I've helped transform complex 
                    challenges into elegant solutions that users love.
                  </p>
                  
                  <p>
                    My approach combines strategic thinking, user research, and creative design to deliver 
                    experiences that not only look great but also drive real business results. I believe in 
                    the power of collaboration and always strive to create work that makes a meaningful impact.
                  </p>

                  <p>
                    When I'm not designing, you'll find me exploring the latest design trends, mentoring 
                    aspiring designers, or working on personal projects that push the boundaries of what's 
                    possible in digital design.
                  </p>
                </div>
              </motion.div>

              {/* Skills */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-8"
              >
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Skills & Expertise
                </h4>
                
                <div className="space-y-5">
                  {skills.map((skill, index) => (
                    <div key={skill.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {skill.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {skill.level}%
                        </span>
                      </div>
                      
                      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : {}}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className={`h-full bg-gradient-to-r ${skill.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Values */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-8">
                  What Drives Me
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {values.map((value, index) => {
                    const Icon = value.icon;
                    
                    return (
                      <motion.div
                        key={value.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="p-6 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all"
                      >
                        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        
                        <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          {value.title}
                        </h5>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {value.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Tools & Technologies */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-12"
              >
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Tools I Use
                </h4>
                
                <div className="flex flex-wrap gap-3">
                  {['Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'After Effects', 'Principle', 'Framer'].map((tool) => (
                    <motion.span
                      key={tool}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-default"
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
