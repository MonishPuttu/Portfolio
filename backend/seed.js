import { db } from "./db/db.js";
import { projects, achievements } from "./db/schema.js";

const seedProjects = [
  // ── Featured Projects (3) ──────────────────────────────
  {
    title: "AniTalk — Voice-Based Agentic AI Platform",
    company: "AniTalk",
    description:
      "A voice-based agentic platform that lets users interact with custom AI agents through natural voice conversations. Features a unique anime character mode for immersive voice chat, custom agent creation, context-aware dialogue, and payment integration.",
    videoUrl: "/videos/anitalk.mp4",
    thumbnailUrl: null,
    projectUrl: "https://ani-talk-ai.vercel.app/",
    color: "#8B5CF6",
    animationCredit: null,
    category: "Featured",
    technologies: [
      "Next.js",
      "TypeScript",
      "Drizzle ORM",
      "Speech-to-Text",
      "Text-to-Speech",
      "LLM",
      "Polar Payments",
    ],
  },
  {
    title: "DRAWIFY — Real-Time Collaborative Drawing",
    company: "DRAWIFY",
    description:
      "A real-time collaborative drawing application where users can create or join rooms and communicate visually using drawings, shapes, and sketches — all synchronized live across participants. Deployed on AWS EC2 with Docker.",
    videoUrl: "/videos/drawify.mp4",
    thumbnailUrl: null,
    projectUrl: "https://github.com/MonishPuttu/DRAWIFY",
    color: "#3B82F6",
    animationCredit: null,
    category: "Featured",
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "WebSockets",
      "Turborepo",
      "Docker",
      "AWS EC2",
    ],
  },
  {
    title: "Renz — Interactive Full-Stack Playground",
    company: "Renz",
    description:
      "An interactive full-stack playground that lets you build a React frontend and Node.js backend and preview the output instantly in the browser. Iterate on frontend and backend code together with live results.",
    videoUrl: "/videos/renz.mp4",
    thumbnailUrl: null,
    projectUrl: "https://renzai.vercel.app/",
    color: "#10B981",
    animationCredit: null,
    category: "Featured",
    technologies: [
      "Next.js",
      "TypeScript",
      "Node.js",
      "Express",
      "Vercel",
    ],
  },
  // ── Other Projects (hidden by default) ─────────────────
  {
    title: "InternHub — Internship Management Platform",
    company: "InternHub",
    description:
      "A platform for managing internship applications, tracking progress, and connecting students with opportunities.",
    videoUrl: null,
    thumbnailUrl: null,
    projectUrl: "https://github.com/MonishPuttu/InternHub",
    color: "#F59E0B",
    animationCredit: null,
    category: "Other",
    technologies: ["JavaScript", "Node.js", "Express"],
  },
  {
    title: "TrackTots — Child Attendance Tracker",
    company: "TrackTots",
    description:
      "A React Native attendance tracking app that helps parents mark and monitor their child's classes with intuitive mobile-first experience.",
    videoUrl: null,
    thumbnailUrl: null,
    projectUrl: "https://github.com/MonishPuttu/TrackTots",
    color: "#EC4899",
    animationCredit: null,
    category: "Other",
    technologies: ["React Native", "TypeScript", "Expo", "EAS"],
  },
];

const seedAchievements = [
  {
    title: "Pull Shark x2",
    description:
      "Opened pull requests that have been merged — awarded twice.",
    icon: "git-pull-request",
    date: new Date("2025-06-01"),
    category: "GitHub",
  },
  {
    title: "Pair Extraordinaire",
    description:
      "Co-authored commits on a merged pull request.",
    icon: "star",
    date: new Date("2025-08-01"),
    category: "GitHub",
  },
  {
    title: "Quickdraw",
    description:
      "Closed an issue or pull request within 5 minutes of opening.",
    icon: "zap",
    date: new Date("2025-07-01"),
    category: "GitHub",
  },
  {
    title: "YOLO",
    description:
      "Merged a pull request without a code review.",
    icon: "award",
    date: new Date("2025-09-01"),
    category: "GitHub",
  },
];

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Insert projects
    console.log("📦 Inserting projects...");
    const insertedProjects = await db
      .insert(projects)
      .values(seedProjects)
      .returning();
    console.log(`✅ Inserted ${insertedProjects.length} projects`);

    // Insert achievements
    console.log("🏆 Inserting achievements...");
    const insertedAchievements = await db
      .insert(achievements)
      .values(seedAchievements)
      .returning();
    console.log(`✅ Inserted ${insertedAchievements.length} achievements`);

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
