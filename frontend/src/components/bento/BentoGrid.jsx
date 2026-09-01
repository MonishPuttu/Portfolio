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
import { measureAnchors, sectionAt } from "./sectionSpy";

import API_URL from "../../config/api";
import { isListed, sortProjects } from "../../config/projectTags";
import {
  hydrateProjectsWithThumbnails,
  preloadKnownProjectThumbnails,
  preloadProjectThumbnails,
} from "../../config/projectThumbnails";

/**
 * Sections that have an anchor further down the page, in document order.
 *
 * "work" is not among them: it means the top of the page, and is what the
 * indicator falls back to before anything below has scrolled past the header.
 */
const SECTION_IDS = ["about", "contact"];

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
   * While a nav scroll is in flight the reader has already told us where they
   * are going, so the spy must not drag the pill through every section on the
   * way past. Suppressing it is what stops the indicator stuttering.
   */
  const spyMuted = useRef(false);

  /** Anchor geometry, refreshed only when the layout can actually change. */
  const metrics = useRef(null);

  const remeasure = useCallback(() => {
    metrics.current = measureAnchors(sectionRefs.current, SECTION_IDS);
  }, []);

  const syncSection = useCallback(() => {
    if (spyMuted.current || !metrics.current) return;
    const next = sectionAt(window.scrollY, metrics.current);
    setActiveSection((current) => (current === next ? current : next));
  }, []);

  /**
   * Scrolls by computed offset rather than `scrollIntoView`.
   *
   * Tiles animate in on scroll, and those layout shifts cancel a native smooth
   * scroll partway — which looked like the nav doing nothing at all. Measuring
   * the target once and driving the window keeps it reliable, and lets the
   * sticky header be accounted for explicitly.
   */
  const scrollTo = useCallback(
    (id) => {
      // The indicator belongs to the click until the page stops moving. Ending
      // the mute on arrival rather than on a timer is what stops it flipping
      // back: a timer can expire while the scroll is still running, or before
      // a late reflow settles.
      spyMuted.current = true;
      const release = () => {
        spyMuted.current = false;
        syncSection();
      };

      // Work is the top of the page — the intro and the featured project are
      // the first thing there, so there is nothing to scroll past.
      if (id === "top" || id === "work") {
        setActiveSection("work");
        smoothScrollTo(0, release);
        return;
      }

      const node = sectionRefs.current[id];
      if (!node) {
        spyMuted.current = false;
        return;
      }

      // Scroll before touching state. Setting it first re-renders the grid,
      // which reattaches every anchor ref mid-flight and can interrupt the
      // scroll that was just requested.
      const top =
        node.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      smoothScrollTo(top, release);
      setActiveSection(id);
    },
    [syncSection],
  );

  /**
   * Keeps the indicator honest.
   *
   * A plain scroll listener, not an IntersectionObserver. Observer thresholds
   * are about how much of an element is visible, while the rule is about where
   * its top sits — so the observer stayed silent through changes that flip the
   * answer. Scrolling up from the bottom took About from fully visible to 82%,
   * crossing no threshold, and the indicator stuck on About all the way to the
   * top.
   *
   * The cost this was avoiding is gone anyway: geometry is measured once here
   * and on layout changes, so the scroll handler is arithmetic with no layout
   * reads, and it only touches state when the answer actually differs.
   */
  useEffect(() => {
    remeasure();
    syncSection();

    const onScroll = () => syncSection();
    const onResize = () => {
      remeasure();
      syncSection();
    };

    // A tile growing as its thumbnail arrives moves every anchor below it.
    const content = new ResizeObserver(onResize);
    content.observe(document.body);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelScroll();
      content.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
    // Anchors only exist once the projects have rendered.
  }, [loaded, visible.length, remeasure, syncSection]);

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
        <OpenSourceTile delay={0.04} />
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
