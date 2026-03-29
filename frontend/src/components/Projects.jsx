import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import API_URL from "../config/api";
import { resolveLocalProjectThumbnail } from "../config/projectThumbnails";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ref] = useIntersectionObserver({ threshold: 0.05 });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      const hydratedProjects = (response.data.data || []).map((project) => {
        const localThumbnail = resolveLocalProjectThumbnail(project);
        const fallbackThumbnail = project.thumbnail_url || project.thumbnailUrl;
        const resolvedThumbnail = localThumbnail || fallbackThumbnail || null;

        return {
          ...project,
          thumbnail_url: resolvedThumbnail,
          thumbnailUrl: resolvedThumbnail,
        };
      });

      setProjects(hydratedProjects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
      // Fallback: use empty array, no crash
    } finally {
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

  // Show only featured projects
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

      const priorityDiff = getPriority(a.title) - getPriority(b.title);
      if (priorityDiff !== 0) return priorityDiff;

      // Keep a deterministic order for same-priority items.
      return a.title.localeCompare(b.title);
    });

  return (
    <section id="projects" className="py-20 lg:py-28 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} />

        {/* Projects List - stacked layout like the reference */}
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

        {/* Empty State */}
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

      {/* Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default Projects;
