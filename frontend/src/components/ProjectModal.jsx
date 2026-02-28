import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Eye,
  ArrowLeft,
  Loader as LoaderIcon,
} from "lucide-react";
import { useAnalytics } from "../utils/analytics";

const ProjectModal = ({ project, isOpen, onClose }) => {
  const { trackProject } = useAnalytics();
  const [iframeLoading, setIframeLoading] = useState(true);
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    if (isOpen && project) {
      trackProject(project.id);
      document.body.style.overflow = "hidden";
      // Small delay for smooth modal entrance before loading iframe
      const t = setTimeout(() => setShowIframe(true), 400);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = "unset";
      setShowIframe(false);
      setIframeLoading(true);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, project, trackProject]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal - full screen iframe experience */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-3 md:inset-4 lg:inset-6 z-50 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <motion.button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </motion.button>

                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-gray-900 truncate">
                    {project.title}
                  </h2>
                  <p className="text-xs text-gray-500 truncate">
                    {project.company}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* View count */}
                {project.view_count > 0 && (
                  <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100">
                    <Eye className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs font-medium text-gray-600">
                      {project.view_count}
                    </span>
                  </div>
                )}

                {/* External link */}
                {project.project_url && (
                  <motion.a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    aria-label="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                  </motion.a>
                )}

                {/* Close */}
                <motion.button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>
            </div>

            {/* Content - iframe or fallback */}
            <div className="flex-1 relative overflow-hidden bg-white">
              {project.project_url && showIframe ? (
                <>
                  {iframeLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
                      <LoaderIcon className="w-6 h-6 text-primary-500 animate-spin mb-3" />
                      <p className="text-xs text-gray-400">
                        Loading website...
                      </p>
                    </div>
                  )}
                  <iframe
                    src={project.project_url}
                    title={`${project.title} preview`}
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-popups allow-forms"
                    loading="lazy"
                    onLoad={() => setIframeLoading(false)}
                  />
                </>
              ) : (
                /* Fallback: show project details + video */
                <div className="max-w-4xl mx-auto p-6 md:p-10 overflow-y-auto h-full">
                  <div className="space-y-8">
                    {/* Description */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        About
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Technologies */}
                    {project.technologies?.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          Technologies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Video */}
                    {project.video_url && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          Demo
                        </h3>
                        <div className="aspect-video rounded-xl overflow-hidden bg-gray-900">
                          <video
                            src={project.video_url}
                            controls
                            loop
                            className="w-full h-full"
                            poster={project.thumbnail_url}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
