/**
 * Static profile content for the bento grid.
 *
 * Projects still come from the API; everything here is content that has no
 * table behind it. Keeping it in one module means a tile is never the place
 * you go to edit a fact.
 */

export const PROFILE = {
  name: "Monish Puttu",
  short: "monish",
  location: "Bengaluru, IN",
  status: "Open to 2026 roles",
  headline: {
    lead: "Intelligent systems that",
    accent: "survive",
    trail: "production.",
  },
  roles: [
    "Full stack engineer",
    "ML engineer",
    "Open source contributor",
    "Backend systems builder",
  ],
  email: "monishputtu1780@gmail.com",
  github: "https://github.com/MonishPuttu",
  linkedin: "https://linkedin.com/in/monish-k-543236251",
};

export const CONTRIBUTIONS = {
  count: "480+",
  caption: "contributions across personal and open-source repos",
  window: "Open source · 12 months",
  /** Monthly contribution shape — drives the sparkline. */
  trend: [12, 19, 16, 28, 24, 41, 35, 52, 47, 63, 58, 74],
};

export const NOW = [
  { label: "Building", value: "AniTalk — agentic voice" },
  { label: "Contributing", value: "Konflux · Bowtie" },
  { label: "Learning", value: "LLM serving & evals" },
];

/**
 * Depth is shown as evidence rather than a self-assessed percentage — the
 * number is only there to size the bar, the proof is in the caption.
 */
export const SKILLS = [
  { label: "Backend / systems", evidence: "4 shipped APIs", level: 90 },
  { label: "DevOps / cloud", evidence: "K8s · Argo · Helm", level: 88 },
  { label: "Machine learning", evidence: "CV + LLM apps", level: 87 },
  { label: "Data engineering", evidence: "Live video pipelines", level: 83 },
];

export const TOOLS = [
  "Python",
  "Scikit-learn",
  "TensorFlow",
  "OpenCV",
  "Docker",
  "Kubernetes",
  "Argo CD",
  "Helm",
  "Prometheus",
  "Grafana",
  "Node.js",
  "React",
  "Next.js",
  "PostgreSQL",
  "AWS",
];

export const EXPERIENCE = [
  {
    year: "2025",
    role: "AI & Data Analytics Intern",
    org: "Edunet Foundation · Remote",
    detail:
      "End-to-end traffic flow detection on live video — real-time vehicle detection and density analysis in Python and OpenCV, plus the pipelines that turned raw streams into insight.",
  },
  {
    year: "2024→",
    role: "Open-source contributor",
    org: "Hermeto · Palisadoes · Konflux · Bowtie",
    detail:
      "480+ contributions across build tooling, supply-chain CI and community platforms.",
  },
];

export const OPEN_SOURCE_ORGS = [
  { handle: "@hermetoproject", role: "Organization contributor" },
  { handle: "@PalisadoesFoundation", role: "Talawa API + Admin" },
  { handle: "@konflux-ci", role: "Supply chain & CI repos" },
  { handle: "@bowtie-json-schema", role: "JSON Schema tooling" },
];

export const AWARDS = [
  {
    title: "Highest cumulative GPA",
    subtitle: "Department award",
    glyph: "★",
    tone: "amber",
  },
  {
    title: "SIH selection — 2025",
    subtitle: "Smart India Hackathon",
    glyph: "◆",
    tone: "violet",
  },
  {
    title: "SIH selection — 2024",
    subtitle: "Smart India Hackathon",
    glyph: "◆",
    tone: "violet",
  },
  {
    title: "Pull Shark ×2 · Quickdraw · YOLO",
    subtitle: "GitHub achievements",
    glyph: "●",
    tone: "green",
  },
];

export const AWARD_TONES = {
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-primary-100 text-primary-600",
  green: "bg-emerald-50 text-emerald-700",
};
