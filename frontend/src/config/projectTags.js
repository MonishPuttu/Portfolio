import { DEFAULT_PROJECT_THUMBNAIL } from "./projectThumbnails";

/**
 * Presentation helpers for project tiles.
 *
 * The `color` column is populated for every seeded project and was never read
 * by the old UI. It backs each tile, and shows through for any project that
 * has no screenshot yet.
 */

export const projectGradient = (project) => {
  const hex = project?.color || "#5B4BE8";
  return `linear-gradient(140deg, ${hex}2E, ${hex} 62%, ${hex}AA)`;
};

export const projectSwatch = (project) => {
  const hex = project?.color || "#5B4BE8";
  return `linear-gradient(140deg, ${hex}, ${hex}99)`;
};

/**
 * True when the project has a real screenshot rather than the generic
 * placeholder, so a tile can fall back to its colour instead of showing an
 * empty grey card.
 */
export const hasRealThumbnail = (project) => {
  const thumb = project?.thumbnail_url || project?.thumbnailUrl;
  return Boolean(thumb) && thumb !== DEFAULT_PROJECT_THUMBNAIL;
};

export const projectThumbnail = (project) =>
  hasRealThumbnail(project)
    ? project.thumbnail_url || project.thumbnailUrl
    : null;

/** Hidden from the grid — kept in the API for anyone reading it directly. */
export const isListed = (project) => project?.category !== "Other";

/** Display order — most substantial work first. */
const PRIORITY = {
  AniTalk: 1,
  Renz: 2,
  "MLOps": 3,
  "LLM Multi-Agent": 4,
  TrafficFlow: 5,
  Drawify: 6,
  InternHub: 7,
};

export const projectPriority = (title = "") => {
  const match = Object.keys(PRIORITY).find((key) => title.includes(key));
  return match ? PRIORITY[match] : 99;
};

export const sortProjects = (projects = []) =>
  [...projects].sort((a, b) => {
    const delta = projectPriority(a.title) - projectPriority(b.title);
    return delta !== 0 ? delta : (a.title || "").localeCompare(b.title || "");
  });

/** "AniTalk — Voice-Based Agentic AI Platform" → "AniTalk" */
export const shortTitle = (project) =>
  project?.company || (project?.title || "").split("—")[0].trim();

/** The trailing half of the title, used as the tile's one-line descriptor. */
export const subTitle = (project) => {
  const parts = (project?.title || "").split("—");
  return parts.length > 1 ? parts.slice(1).join("—").trim() : "";
};
