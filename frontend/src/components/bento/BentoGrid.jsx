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
import useTheme from "./useTheme";
import { cancelScroll, smoothScrollTo } from "./smoothScroll";

import API_URL from "../../config/api";
import { isListed, sortProjects } from "../../config/projectTags";
import {
  hydrateProjectsWithThumbnails,
  preloadKnownProjectThumbnails,
  preloadProjectThumbnails,
} from "../../config/projectThumbnails";

/** Anchors the nav pill tracks, in document order. */
const SECTION_IDS = ["about", "work", "open-source", "contact"];

/** Clearance for the sticky header when scrolling to an anchor. */
const HEADER_OFFSET = 86;

const BentoGrid = () => {
  const [projects, setProjects] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("work");
  const { isDark, toggle } = useTheme();

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

  const visible = useMemo(
    () => sortProjects(projects.filter(isListed)),
    [projects],
  );

  // The featured tile is whichever project ranks highest; the rest follow as
  // compact tiles, each with its own screenshot.
  const [featured, ...rest] = visible;

  const handleOpen = useCallback((project) => {
    setSelected(project);
    setModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setModalOpen(false);
    setTimeout(() => setSelected(null), 300);
  }, []);

  /**
   * Scrolls by computed offset rather than `scrollIntoView`.
   *
   * Tiles animate in on scroll, and those layout shifts cancel a native smooth
   * scroll partway — which looked like the nav doing nothing at all. Measuring
   * the target once and driving the window keeps it reliable, and lets the
   * sticky header be accounted for explicitly.
   */
  const scrollTo = useCallback((id) => {
    if (id === "top") {
      setActiveSection("work");
      smoothScrollTo(0);
      return;
    }

    const node = sectionRefs.current[id];
    if (!node) return;

    // Scroll before touching state. Setting it first re-renders the grid,
    // which reattaches every anchor ref mid-flight and can interrupt the
    // scroll that was just requested.
    const top =
      node.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    smoothScrollTo(top);
    setActiveSection(id);
  }, []);

  // Track which anchor is in view so the nav pill reflects the real position.
  useEffect(() => {
    const onScroll = () => {
      const marker = window.scrollY + 140;
      let next = "work";
      SECTION_IDS.forEach((id) => {
        const node = sectionRefs.current[id];
        if (!node) return;
        // offsetTop is relative to the offset parent; the grid gives a wrong
        // answer there, so measure against the document like scrollTo does.
        const top = node.getBoundingClientRect().top + window.scrollY;
        if (top <= marker) next = id;
      });
      setActiveSection(next);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelScroll();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-ground">
      <TopBar
        active={activeSection}
        onNavigate={scrollTo}
        isDark={isDark}
        onToggleTheme={toggle}
      />

      <main className="grid grid-cols-12 content-start gap-2.5 px-4 pb-8 pt-1 sm:gap-3 sm:px-6 lg:px-[22px]">
        <IntroTile onSeeWork={() => scrollTo("work")} />
        <MetricTile delay={0.04} />
        <NowTile delay={0.08} />

        <ExperienceTile delay={0.02} tileRef={setSectionRef("about")} />

        {!loaded && (
          <div className="col-span-12 rounded-tile border border-line bg-surface p-8 text-center text-[13px] text-ink-dim">
            Loading projects…
          </div>
        )}

        {loaded && !visible.length && (
          <div className="col-span-12 rounded-tile border border-line bg-surface p-8 text-center text-[13px] text-ink-dim">
            No projects to show yet.
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

        {rest.map((project, i) => (
          <ProjectTile
            key={project.id}
            project={project}
            onOpen={handleOpen}
            delay={Math.min(i * 0.04, 0.2)}
          />
        ))}

        <ToolsTile delay={0.04} />

        <SkillsTile delay={0.02} />
        <OpenSourceTile delay={0.04} tileRef={setSectionRef("open-source")} />
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
