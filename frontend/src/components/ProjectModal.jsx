import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Eye,
  ArrowLeft,
  Loader as LoaderIcon,
} from "lucide-react";
import { useAnalytics } from "../utils/analytics";
import { canEmbed } from "../config/embeddable";

/** How long to wait for a frame before offering the link instead. */
const IFRAME_TIMEOUT_MS = 8000;

const ProjectModal = ({ project, isOpen, onClose }) => {
  const { trackProject } = useAnalytics();
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeStalled, setIframeStalled] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const videoRef = useRef(null);

  const projectId = project?.id;

  /**
   * The API is inconsistent about casing: rows come back from Drizzle in
   * camelCase, and only the media fields get snake_case aliases added on top.
   * So `video_url` exists but `projectUrl` and `viewCount` never do in snake
   * case. Reading the snake_case spelling silently found nothing, which is why
   * the modal never offered a link to the live site or the repository. Accept
   * either spelling and use these locals throughout.
   */
  const projectUrl = project?.project_url ?? project?.projectUrl ?? null;
  const videoUrl = project?.video_url ?? project?.videoUrl ?? null;
  const thumbnailUrl = project?.thumbnail_url ?? project?.thumbnailUrl ?? null;
  const viewCount = project?.view_count ?? project?.viewCount ?? 0;

  /**
   * What the body of the modal shows.
   *
   * The demo wins when there is one: the tile advertises "video demo", and a
   * Cloudinary video always plays, where a third-party site may or may not
   * agree to be framed. The live preview is for projects that have no demo and
   * link somewhere that actually permits framing — a repository link renders as
   * a blank white pane, so it stays a link in the header instead.
   */
  const mode = useMemo(() => {
    if (videoUrl) return "video";
    if (canEmbed(projectUrl)) return "iframe";
    return "detail";
  }, [videoUrl, projectUrl]);

  // Keyed on the id rather than the project object, and safe to depend on
  // trackProject now that useAnalytics memoizes it: it used to hand back a new
  // function every render, so this effect re-fired and posted the view twice
  // per open.
  useEffect(() => {
    // The title rides along so the visit notification can name the project
    // rather than report an id nobody can look up from an inbox.
    if (isOpen && projectId) trackProject(projectId, project?.title);
  }, [isOpen, projectId, project?.title, trackProject]);

  useEffect(() => {
    if (!isOpen) {
      setShowIframe(false);
      setIframeLoading(true);
      setIframeStalled(false);
      return undefined;
    }

    document.body.style.overflow = "hidden";
    // Small delay for smooth modal entrance before loading iframe
    const t = setTimeout(() => setShowIframe(true), 400);

    return () => {
      clearTimeout(t);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // A refused or dead frame never fires onLoad, so the spinner would sit on
  // "Loading website..." forever. Give up after a bounded wait and offer the
  // link.
  useEffect(() => {
    if (!showIframe || mode !== "iframe" || !iframeLoading) return undefined;

    const t = setTimeout(() => setIframeStalled(true), IFRAME_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [showIframe, mode, iframeLoading]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || mode !== "video") return;

    const playTimer = setTimeout(() => {
      const video = videoRef.current;
      if (!video) return;

      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    }, 100);

    return () => clearTimeout(playTimer);
  }, [isOpen, mode]);

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
                {viewCount > 0 && (
                  <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100">
                    <Eye className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs font-medium text-gray-600">
                      {viewCount}
                    </span>
                  </div>
                )}

                {/* External link */}
                {projectUrl && (
                  <motion.a
                    href={projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    aria-label={`Open ${project.title} in a new tab`}
                    title="Open in a new tab"
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
              {mode === "iframe" && showIframe ? (
                <>
                  {iframeLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 px-6 text-center">
                      {iframeStalled ? (
                        <>
                          <p className="text-sm font-medium text-gray-600">
                            This site is taking too long to load here.
                          </p>
                          <a
                            href={projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white"
                          >
                            Open it in a new tab
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </>
                      ) : (
                        <>
                          <LoaderIcon className="w-6 h-6 text-primary-500 animate-spin mb-3" />
                          <p className="text-xs text-gray-400">
                            Loading website...
                          </p>
                        </>
                      )}
                    </div>
                  )}
                  <iframe
                    src={projectUrl}
                    title={`${project.title} preview`}
                    className="w-full h-full border-0"
                    // allow-same-origin is relative to the framed site, not to
                    // this page — without it the embedded app cannot reach its
                    // own storage and errors out on load.
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    loading="lazy"
                    onLoad={() => setIframeLoading(false)}
                  />
                </>
              ) : (
                /* Details, with the demo up top when there is one. */
                <div className="max-w-4xl mx-auto p-6 md:p-10 overflow-y-auto h-full">
                  <div className="space-y-8">
                    {/* Demo first — it is what the tile promised. */}
                    {videoUrl && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          Demo
                        </h3>
                        <div className="aspect-video rounded-xl overflow-hidden bg-gray-900">
                          <video
                            ref={videoRef}
                            src={videoUrl}
                            controls
                            autoPlay
                            loop
                            playsInline
                            preload="metadata"
                            className="w-full h-full"
                            poster={thumbnailUrl}
                          />
                        </div>
                      </div>
                    )}

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
