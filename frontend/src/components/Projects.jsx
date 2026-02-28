import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ref, isInView] = useIntersectionObserver({ threshold: 0.05 });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      setProjects(response.data.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
      // Fallback: use empty array, no crash
    } finally {
      setLoading(false);
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

  // Separate commercial and other projects for different layouts
  const commercialProjects = projects.filter(
    (p) => p.category === "Commercial",
  );
  const otherProjects = projects.filter((p) => p.category !== "Commercial");

  return (
    <section
      id="projects"
      className="py-20 lg:py-28 px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="gradient-text">Featured Projects</span>
          </h2>
          <p className="mt-4 text-base text-gray-500 max-w-xl">
            A collection of commercial projects showcasing innovative solutions
            for leading brands
          </p>
        </motion.div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/9] bg-gray-100 rounded-2xl mb-6" />
                <div className="flex items-start justify-between">
                  <div>
                    <div className="h-3 bg-gray-100 rounded w-20 mb-3" />
                    <div className="h-5 bg-gray-100 rounded w-64" />
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects List - stacked layout like the reference */}
        {!loading && (
          <div className="space-y-20">
            {commercialProjects.map((project, index) => (
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

        {/* Other Projects - side-by-side layout */}
        {!loading && otherProjects.length > 0 && (
          <div className="mt-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-14"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                <span className="gradient-text">Other Projects</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {otherProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onOpenModal={handleOpenModal}
                  layout="card"
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
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
