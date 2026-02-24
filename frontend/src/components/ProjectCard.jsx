import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const ProjectCard = ({ project, index, onOpenModal }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const [ref, isInView] = useIntersectionObserver({ threshold: 0.3 });

  // Auto-play video when in view
  useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        videoRef.current.play().catch((err) => {
          console.log('Video autoplay prevented:', err);
        });
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isInView]);

  // Handle hover play/pause
  useEffect(() => {
    if (videoRef.current && isPlaying) {
      if (isHovered) {
        videoRef.current.playbackRate = 1;
      } else {
        videoRef.current.playbackRate = 0.8;
      }
    }
  }, [isHovered, isPlaying]);

  const handleCardClick = () => {
    onOpenModal(project);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Container */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 cursor-pointer video-container">
        <video
          ref={videoRef}
          src={project.video_url}
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          poster={project.thumbnail_url}
        />

        {/* Overlay */}
        <div className="video-overlay" />

        {/* Play button overlay (shown when not playing) */}
        {!isPlaying && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="w-8 h-8 text-gray-900 ml-1" />
            </div>
          </motion.div>
        )}

        {/* Animation credit (bottom right) */}
        {project.animation_credit && (
          <div className="absolute bottom-4 right-4 text-xs text-white/70 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
            {project.animation_credit}
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="mt-6 flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
            {project.company}
          </h3>
          <p className="text-base md:text-lg font-medium text-gray-900 dark:text-white leading-snug">
            {project.description}
          </p>
        </div>

        {/* Arrow Button */}
        <motion.button
          onClick={handleCardClick}
          className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ backgroundColor: project.color || '#8B5CF6' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`View ${project.title} project`}
        >
          <ArrowRight className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Technologies (optional) */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((tech, idx) => (
            <span
              key={idx}
              className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProjectCard;
