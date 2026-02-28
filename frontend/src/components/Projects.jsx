import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import API_URL from "../config/api";

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

  // Show only featured projects
  const featuredProjects = (projects || []).filter(
    (p) => p.category === "Featured",
  );

  return (
    <section id="projects" className="py-20 lg:py-28 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div ref={ref} />

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
        {!loading && featuredProjects.length === 0 && (
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
