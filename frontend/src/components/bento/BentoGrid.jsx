import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";

import TopBar from "./TopBar";
import FilterChips from "./FilterChips";
import IntroTile from "./IntroTile";
import MetricTile from "./MetricTile";
import NowTile from "./NowTile";
import SkillsTile from "./SkillsTile";
import FeaturedProjectTile from "./FeaturedProjectTile";
import ProjectTile from "./ProjectTile";
import OpenSourceTile from "./OpenSourceTile";
import ToolsTile from "./ToolsTile";
import ExperienceTile from "./ExperienceTile";
import AwardsTile from "./AwardsTile";
import ContactTile from "./ContactTile";
import ProjectModal from "../ProjectModal";

import API_URL from "../../config/api";
import { FILTERS, matchesFilter, sortProjects } from "../../config/projectTags";
import {
  hydrateProjectsWithThumbnails,
  preloadKnownProjectThumbnails,
  preloadProjectThumbnails,
} from "../../config/projectThumbnails";

/** Anchors the nav pill tracks, in document order. */
const SECTION_IDS = ["work", "about", "open-source", "contact"];

const BentoGrid = () => {
  const [projects, setProjects] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("work");

  // One stable ref holding the anchor nodes, so the scroll handlers below can
  // depend on it without being rebuilt every render.
  const sectionRefs = useRef({});
  const setSectionRef = useCallback(
    (id) => (node) => {
      sectionRefs.current[id] = node;
    },
    [],
  );

  useEffect(() => {
    preloadKnownProjectThumbnails();

    let cancelled = false;

    const load = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/projects`);
        const raw = data.data || [];
        if (cancelled) return;

        setProjects(hydrateProjectsWithThumbnails(raw));
        await preloadProjectThumbnails(raw);
      } catch {
        if (!cancelled) toast.error("Couldn't load projects.");
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const ordered = useMemo(() => sortProjects(projects), [projects]);

  /** Tag counts drive the chip labels and hide filters that match nothing. */
  const counts = useMemo(() => {
    const result = { all: ordered.length };
    FILTERS.filter((f) => f.id !== "all").forEach((f) => {
      result[f.id] = ordered.filter((p) => matchesFilter(p, f.id)).length;
    });
    return result;
  }, [ordered]);

  const visible = useMemo(
    () => ordered.filter((p) => matchesFilter(p, filter)),
    [ordered, filter],
  );

  // The featured tile is whichever visible project ranks highest, so filtering
  // promotes a new project into the big slot rather than emptying it.
  const [featured, ...rest] = visible;

  const handleOpen = useCallback((project) => {
    setSelected(project);
    setModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setModalOpen(false);
    setTimeout(() => setSelected(null), 300);
  }, []);

  const scrollTo = useCallback((id) => {
    const node = id === "top" ? null : sectionRefs.current[id];
    if (!node) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("work");
      return;
    }
    setActiveSection(id);
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Track which anchor is in view so the nav pill reflects the real position.
  useEffect(() => {
    const onScroll = () => {
      const marker = window.scrollY + 140;
      let next = "work";
      SECTION_IDS.forEach((id) => {
        const node = sectionRefs.current[id];
        if (node && node.offsetTop <= marker) next = id;
      });
      setActiveSection(next);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // SECTION_IDS is a module-level constant list; refs live in a stable ref.
  }, []);

  return (
    <div className="min-h-screen bg-ground">
      <TopBar active={activeSection} onNavigate={scrollTo} />
      <FilterChips active={filter} onChange={setFilter} counts={counts} />

      <main className="grid grid-cols-12 content-start gap-2.5 px-4 pb-8 pt-1 sm:px-6 sm:gap-3 lg:px-[22px]">
        <IntroTile onSeeWork={() => scrollTo("work")} />
        <MetricTile delay={0.04} />
        <NowTile delay={0.08} />

        <SkillsTile delay={0.02} tileRef={setSectionRef("about")} />

        {!loaded && (
          <div className="col-span-12 rounded-tile border border-line bg-surface p-8 text-center text-[13px] text-ink-dim">
            Loading projects…
          </div>
        )}

        {loaded && visible.length === 0 && (
          <div className="col-span-12 rounded-tile border border-line bg-surface p-8 text-center text-[13px] text-ink-dim">
            No projects match that filter yet.
          </div>
        )}

        {featured && (
          <FeaturedProjectTile
            key={featured.id}
            project={featured}
            onOpen={handleOpen}
            tileRef={setSectionRef("work")}
          />
        )}

        <OpenSourceTile delay={0.04} tileRef={setSectionRef("open-source")} />

        {rest.map((project, i) => (
          <ProjectTile
            key={project.id}
            project={project}
            onOpen={handleOpen}
            delay={Math.min(i * 0.04, 0.2)}
          />
        ))}

        <ToolsTile delay={0.04} />
        <ExperienceTile delay={0.02} />
        <AwardsTile delay={0.06} />

        <ContactTile delay={0.02} tileRef={setSectionRef("contact")} />
      </main>

      <footer className="px-4 pb-8 text-center text-[11.5px] text-ink-dim sm:px-6 lg:px-[22px]">
        © {new Date().getFullYear()} Monish Puttu · Built with React, Node and
        PostgreSQL
      </footer>

      {/* ProjectModal runs its own AnimatePresence and no-ops without a project. */}
      <ProjectModal
        project={selected}
        isOpen={modalOpen}
        onClose={handleClose}
      />
    </div>
  );
};

export default BentoGrid;
