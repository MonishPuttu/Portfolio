import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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

const useTilt = (strength = 8) => {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - (rect.left + rect.width / 2);
    const my = e.clientY - (rect.top + rect.height / 2);
    setTilt({
      x: -(my / (rect.height / 2)) * strength,
      y: (mx / (rect.width / 2)) * strength,
    });
  };

  const onLeave = () => setTilt({ x: 0, y: 0 });

  return { ref, tilt, onMove, onLeave };
};

const CardFull = ({ project, onOpen }) => {
  const [hovered, setHovered] = useState(false);
  const { ref, tilt, onMove, onLeave } = useTilt(4);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
        borderRadius: "1rem",
      }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        onLeave();
        setHovered(false);
      }}
      onClick={() => onOpen(project)}
      className="cursor-pointer"
    >
      <div
        style={{
          borderRadius: "1rem",
          overflow: "hidden",
          aspectRatio: "16/7",
          position: "relative",
          border: "0.5px solid #e5e7eb",
        }}
      >
        <img
          src={project.thumbnail_url || DEFAULT_THUMB}
          alt={project.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "filter 0.45s ease",
            filter: hovered
              ? "saturate(0.25) brightness(0.65)"
              : "saturate(1) brightness(1)",
          }}
          onError={(e) => {
            e.currentTarget.src = DEFAULT_THUMB;
          }}
        />

        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.88 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              padding: "6px 18px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "0.5px solid rgba(255,255,255,0.22)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            {project.title}
          </span>

          <div
            style={{
              display: "flex",
              gap: "5px",
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: "340px",
            }}
          >
            {(project.technologies || []).slice(0, 5).map((t) => (
              <span
                key={t}
                style={{
                  padding: "2px 10px",
                  borderRadius: "999px",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.65)",
                  background: "rgba(255,255,255,0.08)",
                  border: "0.5px solid rgba(255,255,255,0.14)",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.14)",
              border: "0.5px solid rgba(255,255,255,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowUpRight size={14} color="#fff" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const CardHalf = ({ project, onOpen, delay = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const { ref, tilt, onMove, onLeave } = useTilt(6);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
        borderRadius: "1rem",
      }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        onLeave();
        setHovered(false);
      }}
      onClick={() => onOpen(project)}
      className="cursor-pointer"
    >
      <div
        style={{
          borderRadius: "1rem",
          overflow: "hidden",
          aspectRatio: "4/3",
          position: "relative",
          border: "0.5px solid #e5e7eb",
        }}
      >
        <img
          src={project.thumbnail_url || DEFAULT_THUMB}
          alt={project.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "filter 0.45s ease",
            filter: hovered
              ? "saturate(0.2) brightness(0.6)"
              : "saturate(1) brightness(1)",
          }}
          onError={(e) => {
            e.currentTarget.src = DEFAULT_THUMB;
          }}
        />

        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.85 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              padding: "5px 14px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "0.5px solid rgba(255,255,255,0.22)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {project.title}
          </span>

          <div
            style={{
              display: "flex",
              gap: "4px",
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: "200px",
            }}
          >
            {(project.technologies || []).slice(0, 3).map((t) => (
              <span
                key={t}
                style={{
                  padding: "2px 8px",
                  borderRadius: "999px",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.6)",
                  background: "rgba(255,255,255,0.08)",
                  border: "0.5px solid rgba(255,255,255,0.12)",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              border: "0.5px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowUpRight size={12} color="#fff" />
          </div>
        </motion.div>
      </div>
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

      <section
        className="px-6 lg:px-10 max-w-6xl mx-auto pb-20"
        style={{ perspective: "1400px" }}
      >
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
