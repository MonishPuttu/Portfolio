import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const ProjectCard = ({ project, index, onOpenModal, layout = 'stacked' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const [ref, isInView] = useIntersectionObserver({ threshold: 0.2 });

  // Auto-play video when in view (lazy)
  useEffect(() => {
    if (!videoRef.current) return;
    if (isInView) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isInView]);

  // Adjust playback on hover
  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.playbackRate = isHovered ? 1 : 0.75;
    }
  }, [isHovered, isPlaying]);

  const handleClick = () => onOpenModal(project);

  // Stacked layout (full-width, like the reference for commercial projects)
  if (layout === 'stacked') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Video */}
        <div
          className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 cursor-pointer video-container shadow-lg hover:shadow-2xl transition-shadow duration-500"
          onClick={handleClick}
        >
          {project.video_url ? (
            <>
              {/* Lazy loading placeholder */}
              {!videoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                  <div className="spinner" />
                </div>
              )}
              <video
                ref={videoRef}
                src={project.video_url}
                loop
                muted
                playsInline
                preload="metadata"
                onLoadedData={() => setVideoLoaded(true)}
                className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                  isHovered ? 'scale-[1.03]' : 'scale-100'
                } ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                poster={project.thumbnail_url}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Play className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-400 text-xs">Preview</p>
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="video-overlay" />

          {/* Animation credit */}
          {project.animation_credit && (
            <div className="absolute bottom-4 right-4 text-[11px] text-white/60 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
              {project.animation_credit}
            </div>
          )}
        </div>

        {/* Info row */}
        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-[0.1em] mb-1.5">
              {project.company}
            </p>
            <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-white leading-snug line-clamp-2">
              {project.description}
            </h3>
          </div>

          <motion.button
            onClick={handleClick}
            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all"
            style={{ backgroundColor: project.color || '#9333ea' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            aria-label={`View ${project.title}`}
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Card layout (side-by-side for "other" projects)
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-gray-50 dark:bg-dark-card rounded-2xl overflow-hidden card-hover cursor-pointer"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Text */}
        <div className="p-6 sm:p-8 sm:w-2/5 flex flex-col justify-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 font-display">
            {project.company}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
            {project.description}
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="self-start w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: project.color || '#9333ea' }}
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </motion.div>
        </div>

        {/* Image/Video */}
        <div className="sm:w-3/5 relative aspect-[4/3] sm:aspect-auto overflow-hidden video-container">
          {project.video_url ? (
            <video
              ref={videoRef}
              src={project.video_url}
              loop
              muted
              playsInline
              preload="metadata"
              onLoadedData={() => setVideoLoaded(true)}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
              poster={project.thumbnail_url}
            />
          ) : project.thumbnail_url ? (
            <img
              src={project.thumbnail_url}
              alt={project.title}
              loading="lazy"
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isHovered ? 'scale-105' : 'scale-100'
              }`}
            />
          ) : (
            <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
              <Play className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
