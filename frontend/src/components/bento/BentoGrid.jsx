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

/**
 * Sections that have an anchor further down the page, in document order.
 *
 * "work" is not among them: it means the top of the page, and is what the
 * indicator falls back to before anything below has scrolled past the header.
 */
const SECTION_IDS = ["about", "contact"];

/** Clearance for the sticky header when scrolling to an anchor. */
const HEADER_OFFSET = 86;

/** A section becomes current once its top passes this line. */
const ACTIVE_MARKER = HEADER_OFFSET + 40;

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

  /**
   * Which section the reader is in, measured now.
   *
   * Reading two rects on demand rather than trusting values cached from
   * earlier observer callbacks: those go stale the moment anything reflows —
   * a thumbnail finishing, a tile finishing its entrance — and a stale cache
   * is what made the indicator wrong intermittently rather than always.
   */
  const currentSection = useCallback(() => {
    let next = "work";

    SECTION_IDS.forEach((id) => {
      const node = sectionRefs.current[id];
      if (node && node.getBoundingClientRect().top <= ACTIVE_MARKER) next = id;
    });

    // The final section cannot reach the marker on a page that ends just
    // below it, so seeing enough of it counts as having arrived.
    const lastId = SECTION_IDS[SECTION_IDS.length - 1];
    const lastNode = sectionRefs.current[lastId];
    if (lastNode) {
      const rect = lastNode.getBoundingClientRect();
      const onScreen =
        Math.max(0, Math.min(rect.bottom, window.innerHeight)) -
        Math.max(rect.top, 0);
      if (rect.height && onScreen / rect.height >= 0.5) next = lastId;
    }

    return next;
  }, []);

  const syncSection = useCallback(() => {
    if (spyMuted.current) return;
    const next = currentSection();
    setActiveSection((current) => (current === next ? current : next));
  }, [currentSection]);

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
   * Wakes `syncSection` when the page moves.
   *
   * Observers rather than a scroll listener: measuring anchors on every scroll
   * event thrashes layout, and that was the jank in the nav indicator. These
   * fire only when something actually changes.
   */
  useEffect(() => {
    const entries = SECTION_IDS.map((id) => [
      id,
      sectionRefs.current[id],
    ]).filter(([, node]) => node);
    if (!entries.length) return undefined;

    // The observers only say "something moved" — `syncSection` then measures.
    // Thresholds are spread so a section entering, half-showing or filling the
    // viewport all wake it, since each can change the answer.
    const observer = new IntersectionObserver(syncSection, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    entries.forEach(([, node]) => observer.observe(node));

    // A tile growing as its thumbnail arrives moves everything below it, and
    // that reflow does not necessarily cross an observer threshold.
    const resize = new ResizeObserver(syncSection);
    resize.observe(document.body);

    syncSection();

    return () => {
      cancelScroll();
      observer.disconnect();
      resize.disconnect();
    };
    // Anchors only exist once the projects have rendered.
  }, [loaded, visible.length, syncSection]);

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
