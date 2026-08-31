/**
 * Static profile content for the bento grid.
 *
 * Projects come from the API; everything here is content that has no table
 * behind it. Keeping it in one module means a tile is never the place you go
 * to edit a fact. Sourced from the current CV.
 */

export const PROFILE = {
  name: "Monish Puttu",
  short: "monish",
  status: "Open to opportunities",
  headline: {
    lead: "Production systems, shipped",
    accent: "end to end",
    trail: ".",
  },
  summary:
    "Software engineer who builds and ships production systems end to end — from full-stack web platforms to agentic AI integrations and applied machine learning.",
  roles: [
    "Software engineer",
    "Full-stack developer",
    "Applied ML engineer",
    "Open source contributor",
  ],
  email: "monishputtu1780@gmail.com",
  github: "https://github.com/monishputtu",
  linkedin: "https://linkedin.com/in/monish-k-543236251",
  site: "monishputtu.com",
};

export const CONTRIBUTIONS = {
  count: "480+",
  caption: "contributions across personal and open-source repos",
  window: "Open source · 12 months",
  /** Monthly contribution shape — drives the sparkline. */
  trend: [12, 19, 16, 28, 24, 41, 35, 52, 47, 63, 58, 74],
};

export const NOW = [
  { label: "Building", value: "Agentic features at entomo" },
  { label: "Working with", value: "Snowflake Cortex Agents" },
  { label: "Contributing", value: "Konflux · Bowtie" },
];

/**
 * Depth is shown as evidence rather than a self-assessed percentage — the
 * number only sizes the bar, the proof is in the caption.
 */
export const SKILLS = [
  { label: "Full-stack engineering", evidence: "React · Next.js · tRPC", level: 92 },
  { label: "Backend & APIs", evidence: "Node · Express · FastAPI", level: 90 },
  { label: "AI / ML", evidence: "PyTorch · LangGraph · RAG", level: 87 },
  { label: "DevOps & cloud", evidence: "AWS · K8s · ArgoCD", level: 85 },
];

export const TOOLS = [
  "C++",
  "Python",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "FastAPI",
  "tRPC",
  "PyTorch",
  "TensorFlow",
  "OpenCV",
  "LangChain",
  "LangGraph",
  "PostgreSQL",
  "Prisma",
  "Drizzle ORM",
  "AWS",
  "Snowflake",
  "Docker",
  "Kubernetes",
  "ArgoCD",
  "Helm",
  "Nginx",
  "Prometheus",
  "Grafana",
];

export const EXPERIENCE = [
  {
    year: "2026→",
    role: "Software Engineering Intern, Data Engineering",
    org: "entomo (ENTOMOGTDIC Pvt. Ltd.)",
    detail:
      "Integrating Snowflake APIs and Snowflake Cortex Agents to build agentic features in the entomo platform. Deliver proofs of concept validating agentic workflows for stakeholder evaluation, and run database migrations across production systems with minimal downtime.",
  },
  {
    year: "2025",
    role: "AI & Data Analytics Intern",
    org: "Edunet Foundation · Remote",
    detail:
      "Built an end-to-end traffic flow detection system using computer vision and deep learning, applying OpenCV for real-time vehicle detection and density analysis, with pipelines ingesting live video streams for real-time inference.",
  },
  {
    year: "2024→",
    role: "Open-source contributor",
    org: "Supply chain security & package management",
    detail:
      "Designed and extended prefetch backends for package managers focused on reproducible, hermetic builds. Improved CI/CD pipelines with automation and added unit and integration tests across distributed teams.",
  },
];

export const EDUCATION = {
  school: "Meenakshi College of Engineering, Anna University",
  degree: "B.E. Electronics & Communication Engineering",
  period: "2022 — 2026",
  grade: "CGPA 8.76 / 10",
};

/**
 * `handle` is the GitHub org, which also resolves its avatar at
 * https://github.com/{handle}.png — no icon assets to maintain.
 */
export const OPEN_SOURCE_ORGS = [
  {
    name: "Hermeto",
    handle: "hermetoproject",
    role: "Prefetch backends, hermetic builds",
  },
  {
    name: "Talawa",
    handle: "PalisadoesFoundation",
    role: "Talawa API + Admin",
  },
  {
    name: "Konflux",
    handle: "konflux-ci",
    role: "Supply chain & CI",
  },
  {
    name: "Bowtie",
    handle: "bowtie-json-schema",
    role: "JSON Schema tooling",
  },
];

export const AWARDS = [
  {
    title: "Academic Excellence Award",
    subtitle: "Top performer",
    glyph: "★",
    tone: "amber",
  },
  {
    title: "Smart India Hackathon",
    subtitle: "Intra-college selection",
    glyph: "◆",
    tone: "violet",
  },
  {
    title: "CGPA 8.76 / 10",
    subtitle: "B.E. Electronics & Communication",
    glyph: "●",
    tone: "green",
  },
];

export const AWARD_TONES = {
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  violet:
    "bg-primary-100 text-primary-600 dark:bg-primary-400/15 dark:text-primary-300",
  green:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
};
