import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
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

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ref] = useIntersectionObserver({ threshold: 0.05 });

  useEffect(() => {
    Object.values(LOCAL_THUMBNAILS).forEach((src) => {
      new Image().src = src;
    });
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      const rawProjects = response.data.data || [];

      const withLocalThumbnails = rawProjects.map((p) => {
        const thumb = getLocalThumb(p) || DEFAULT_THUMB;
        return { ...p, thumbnail_url: thumb, thumbnailUrl: thumb };
      });
      setProjects(withLocalThumbnails);
      setHasLoaded(true);

      rawProjects.forEach((rawProject) => {
        const cloudinaryThumb =
          rawProject.thumbnailUrl || rawProject.thumbnail_url;

        if (!isValidImageUrl(cloudinaryThumb)) return;

        const img = new Image();
        img.onload = () => {
          setProjects((prev) =>
            prev.map((p) =>
              p.id === rawProject.id
                ? {
                    ...p,
                    thumbnail_url: cloudinaryThumb,
                    thumbnailUrl: cloudinaryThumb,
                  }
                : p,
            ),
          );
        };
        img.src = cloudinaryThumb;
      });
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
      setHasLoaded(true);
    }
  };

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const featuredProjects = (projects || [])
    .filter((p) => p.category === "Featured")
    .sort((a, b) => {
      const priorityMap = {
        Renz: 1,
        AniTalk: 2,
        Drawify: 3,
        TrafficFlow: 4,
        InternHub: 5,
      };
      const getPriority = (title = "") => {
        const match = Object.keys(priorityMap).find((name) =>
          title.includes(name),
        );
        return match ? priorityMap[match] : Number.MAX_SAFE_INTEGER;
      };
      const diff = getPriority(a.title) - getPriority(b.title);
      return diff !== 0 ? diff : a.title.localeCompare(b.title);
    });

  return (
    <section id="projects" className="py-20 lg:py-28 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} />

        {featuredProjects.length > 0 && (
          <div className="space-y-20">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onOpenModal={handleOpenModal}
                layout="stacked"
              />
            ))}
          </div>
        )}

        {hasLoaded && featuredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">📁</span>
            </div>
            <p className="text-gray-400 text-base">
              No projects found. Check back soon!
            </p>
          </motion.div>
        )}
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default Projects;
