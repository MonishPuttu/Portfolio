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

/** How long a nav scroll owns the indicator before the spy takes over again. */
const SCROLL_SETTLE_MS = 700;

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
  const spyMutedUntil = useRef(0);

  /** A hairline at the very end of the document, so "scrolled to the bottom"
   *  is an observable event rather than something to poll for. */
  const pageEndRef = useRef(null);

  /**
   * Scrolls by computed offset rather than `scrollIntoView`.
   *
   * Tiles animate in on scroll, and those layout shifts cancel a native smooth
   * scroll partway — which looked like the nav doing nothing at all. Measuring
   * the target once and driving the window keeps it reliable, and lets the
   * sticky header be accounted for explicitly.
   */
  const scrollTo = useCallback((id) => {
    spyMutedUntil.current = Date.now() + SCROLL_SETTLE_MS;

    // Work is the top of the page — the intro and the featured project are
    // the first thing there, so there is nothing to scroll past.
    if (id === "top" || id === "work") {
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

  /**
   * Tracks which section the reader is in.
   *
   * An IntersectionObserver rather than a scroll listener: measuring anchors
   * on every scroll event thrashes layout, and that was the jank in the nav
   * indicator. This only wakes up when a section actually crosses the marker.
   */
  useEffect(() => {
    const entries = SECTION_IDS.map((id) => [
      id,
      sectionRefs.current[id],
    ]).filter(([, node]) => node);
    if (!entries.length) return undefined;

    const endMarker = pageEndRef.current;
    const tops = new Map();
    let atPageEnd = false;

    const resolve = () => {
      if (Date.now() < spyMutedUntil.current) return;

      // The last section whose top has crossed the marker wins; before any
      // has, we are still at the top and Work is current.
      let next = "work";
      SECTION_IDS.forEach((id) => {
        const top = tops.get(id);
        if (top !== undefined && top <= ACTIVE_MARKER) next = id;
      });

      // The final section never reaches the top of a page that ends just
      // below it, so hitting the bottom counts as arriving.
      if (atPageEnd) next = SECTION_IDS[SECTION_IDS.length - 1];

      setActiveSection((current) => (current === next ? current : next));
    };

    // Shifting the root's top edge to the marker makes the observer report
    // exactly the crossings that change the answer, and nothing else.
    const observer = new IntersectionObserver(
      (records) => {
        records.forEach((record) => {
          if (record.target === endMarker) {
            atPageEnd = record.isIntersecting;
            return;
          }
          const id = entries.find(([, node]) => node === record.target)?.[0];
          if (id) tops.set(id, record.boundingClientRect.top);
        });
        resolve();
      },
      { rootMargin: `-${ACTIVE_MARKER}px 0px 0px 0px`, threshold: 0 },
    );

    entries.forEach(([, node]) => observer.observe(node));
    if (endMarker) observer.observe(endMarker);

    return () => {
      cancelScroll();
      observer.disconnect();
    };
    // Anchors only exist once the projects have rendered.
  }, [loaded, visible.length]);

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

      <div ref={pageEndRef} aria-hidden="true" className="h-px" />

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
