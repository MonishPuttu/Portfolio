/**
 * Filter tags for the project tiles.
 *
 * These are derived from the `technologies` array the API already returns
 * rather than added as a new column, so the grid works against the current
 * schema with no migration and no re-seed. If a `tags` column is added later,
 * `deriveTags` should prefer it and fall back to this inference.
 */

export const FILTERS = [
  { id: "all", label: "Everything" },
  { id: "ai", label: "AI & ML" },
  { id: "fs", label: "Full-stack" },
  { id: "rt", label: "Real-time" },
  { id: "mob", label: "Mobile" },
];

const TAG_KEYWORDS = {
  ai: [
    "llm",
    "speech-to-text",
    "text-to-speech",
    "opencv",
    "deep learning",
    "computer vision",
    "tensorflow",
    "scikit",
    "pytorch",
  ],
  fs: [
    "next.js",
    "node.js",
    "express",
    "react",
    "postgresql",
    "drizzle",
    "typescript",
    "javascript",
    "vercel",
  ],
  rt: ["websockets", "canvas", "socket.io", "webrtc"],
  mob: ["react native", "expo", "eas"],
};

const normalize = (value = "") => String(value).toLowerCase();

/** Infer filter tags for a project from its technologies. */
export const deriveTags = (project) => {
  if (Array.isArray(project?.tags) && project.tags.length) return project.tags;

  const haystack = [
    ...(project?.technologies || []),
    project?.title,
    project?.company,
  ]
    .map(normalize)
    .join(" ");

  const tags = Object.entries(TAG_KEYWORDS)
    .filter(([, keywords]) => keywords.some((k) => haystack.includes(k)))
    .map(([tag]) => tag);

  // "React Native" contains "react", which would otherwise tag every mobile
  // app as full-stack. Mobile is the more specific claim, so it wins outright.
  if (tags.includes("mob")) return ["mob"];

  return tags.length ? tags : ["fs"];
};

export const matchesFilter = (project, filter) =>
  filter === "all" || deriveTags(project).includes(filter);

/**
 * The `color` column is populated for every seeded project and was never read
 * by the old UI. It drives each tile's swatch here.
 */
export const projectGradient = (project) => {
  const hex = project?.color || "#5B4BE8";
  return `linear-gradient(140deg, ${hex}2E, ${hex} 62%, ${hex}AA)`;
};

export const projectSwatch = (project) => {
  const hex = project?.color || "#5B4BE8";
  return `linear-gradient(140deg, ${hex}, ${hex}99)`;
};

/** Display order for the featured row — most substantial work first. */
const PRIORITY = {
  AniTalk: 1,
  Renz: 2,
  TrafficFlow: 3,
  Drawify: 4,
  InternHub: 5,
  TrackTots: 6,
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
