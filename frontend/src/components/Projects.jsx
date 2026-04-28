import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import ProjectModal from "./ProjectModal";
import { SectionDivider } from "./About";
import API_URL from "../config/api";

const LOCAL_THUMBNAILS = {
  anitalk: "/thumbnails/anitalk.png",
  renz: "/thumbnails/renz.png",
  drawify: "/thumbnails/drawify.png",
  internhub: "/thumbnails/internhub.png",
  trafficflow: "/thumbnails/trafficflow.png",
};
const DEFAULT_THUMB = "/thumbnails/default.svg";

const getLocalThumb = (project) => {
  if (!project) return null;
  const title = (project.title || "").toLowerCase();
  const company = (project.company || "").toLowerCase();
  const key = Object.keys(LOCAL_THUMBNAILS).find(
    (k) => title.includes(k) || company.includes(k),
  );
  return key ? LOCAL_THUMBNAILS[key] : null;
};

const isValidImageUrl = (url) => {
  if (!url || !url.startsWith("http")) return false;
  if (url.includes(".mp4")) return false;
  return true;
};

const CardFull = ({ project, onOpen }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden border border-gray-100 cursor-pointer group"
      style={{ aspectRatio: "16/7" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(project)}
    >
      <img
        src={project.thumbnail_url || DEFAULT_THUMB}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        onError={(e) => {
          e.currentTarget.src = DEFAULT_THUMB;
        }}
      />

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 bottom-0 bg-primary-900/95 backdrop-blur-sm px-6 py-5 flex items-center justify-between"
          >
            <div>
              <p className="text-[15px] font-medium text-white mb-0.5">
                {project.title}
              </p>
              <p className="text-[12px] text-primary-300 mb-3">
                {project.description?.slice(0, 80)}…
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(project.technologies || []).slice(0, 5).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-800 text-primary-200 border border-primary-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 ml-4">
              <ArrowUpRight size={16} className="text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CardHalf = ({ project, onOpen, delay = 0 }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl overflow-hidden border border-gray-100 cursor-pointer group"
      style={{ aspectRatio: "4/3" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(project)}
    >
      <img
        src={project.thumbnail_url || DEFAULT_THUMB}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        onError={(e) => {
          e.currentTarget.src = DEFAULT_THUMB;
        }}
      />

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 bottom-0 bg-primary-900/95 backdrop-blur-sm px-4 py-4 flex items-center justify-between"
          >
            <div>
              <p className="text-[13px] font-medium text-white mb-0.5">
                {project.title}
              </p>
              <p className="text-[11px] text-primary-300 mb-2.5">
                {project.company}
              </p>
              <div className="flex flex-wrap gap-1">
                {(project.technologies || []).slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-800 text-primary-200 border border-primary-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <ArrowUpRight size={18} className="text-white flex-shrink-0 ml-3" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const PRIORITY = {
  Renz: 1,
  AniTalk: 2,
  Drawify: 3,
  TrafficFlow: 4,
  InternHub: 5,
};
const getPriority = (title = "") => {
  const match = Object.keys(PRIORITY).find((k) => title.includes(k));
  return match ? PRIORITY[match] : 999;
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    Object.values(LOCAL_THUMBNAILS).forEach((src) => {
      new Image().src = src;
    });
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/projects`);
      const raw = data.data || [];

      const hydrated = raw.map((p) => {
        const thumb = getLocalThumb(p) || DEFAULT_THUMB;
        return { ...p, thumbnail_url: thumb, thumbnailUrl: thumb };
      });
      setProjects(hydrated);
      setHasLoaded(true);

      raw.forEach((rp) => {
        const url = rp.thumbnailUrl || rp.thumbnail_url;
        if (!isValidImageUrl(url)) return;
        const img = new Image();
        img.onload = () =>
          setProjects((prev) =>
            prev.map((p) =>
              p.id === rp.id
                ? { ...p, thumbnail_url: url, thumbnailUrl: url }
                : p,
            ),
          );
        img.src = url;
      });
    } catch {
      toast.error("Failed to load projects");
      setHasLoaded(true);
    }
  };

  const handleOpen = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const featured = projects
    .filter((p) => p.category === "Featured")
    .sort((a, b) => {
      const d = getPriority(a.title) - getPriority(b.title);
      return d !== 0 ? d : a.title.localeCompare(b.title);
    });

  const heroCards = featured.slice(0, 2);
  const gridCards = featured.slice(2);

  return (
    <div id="projects-content" className="scroll-mt-20">
      <SectionDivider label="Featured Projects" />

      <section className="px-6 lg:px-10 max-w-6xl mx-auto pb-20">
        {featured.length === 0 && hasLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-gray-400 text-sm"
          >
            No featured projects yet.
          </motion.div>
        )}

        <div className="flex flex-col gap-4 mb-4">
          {heroCards.map((p) => (
            <CardFull key={p.id} project={p} onOpen={handleOpen} />
          ))}
        </div>

        {gridCards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gridCards.map((p, i) => (
              <CardHalf
                key={p.id}
                project={p}
                onOpen={handleOpen}
                delay={i * 0.06}
              />
            ))}
          </div>
        )}
      </section>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleClose}
      />
    </div>
  );
};

export default Projects;
