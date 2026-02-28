import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Trophy, Eye, Star, Award, Target, TrendingUp } from "lucide-react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const iconMap = {
  trophy: Trophy,
  eye: Eye,
  star: Star,
  award: Award,
  certificate: Award,
  target: Target,
  trending: TrendingUp,
};

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ref, isInView] = useIntersectionObserver({ threshold: 0.05 });

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await axios.get(`${API_URL}/achievements`);
        setAchievements(res.data.data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section
      id="achievements"
      className="py-20 lg:py-28 px-6 lg:px-8 bg-gray-50/50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="gradient-text">Achievements</span>
          </h2>
          <p className="mt-4 text-base text-gray-500 max-w-lg mx-auto">
            Milestones and recognitions throughout my journey
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse h-48 bg-gray-100 rounded-2xl"
              />
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {achievements.map((achievement, index) => {
              const Icon = iconMap[achievement.icon] || Award;
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <div className="h-full p-6 rounded-2xl bg-white border border-gray-100 hover:border-primary-300 transition-all duration-300 card-hover">
                    {/* Icon */}
                    <div className="mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      {achievement.category && (
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-600">
                          {achievement.category}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                      {achievement.title}
                    </h3>
                    {achievement.description && (
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                        {achievement.description}
                      </p>
                    )}

                    {/* Date */}
                    {achievement.date && (
                      <p className="mt-4 text-xs text-gray-400">
                        {formatDate(achievement.date)}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty */}
        {!loading && achievements.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-base">
              No achievements yet. Stay tuned!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Achievements;
