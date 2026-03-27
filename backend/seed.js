import { db } from "./db/db.js";
import { projects, achievements } from "./db/schema.js";

const seedProjects = [
  // ── Featured Projects (5) ──────────────────────────────
  {
    title: "AniTalk — Voice-Based Agentic AI Platform",
    company: "AniTalk",
    description:
      "A voice-based agentic platform that lets users interact with custom AI agents through natural voice conversations. Features a unique anime character mode for immersive voice chat, custom agent creation, context-aware dialogue, and payment integration.",
    cloudinaryVideoPublicId: "AniTalk_sd0hc2.mp4",
    cloudinaryThumbnailPublicId: null,
    videoUrl:
      "https://res.cloudinary.com/dyypcsoow/video/upload/v1774601594/AniTalk_sd0hc2.mp4",
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
    title: "Renz — Interactive Full-Stack Playground",
    company: "Renz",
    description:
      "An interactive full-stack playground that lets you build a React frontend and Node.js backend and preview the output instantly in the browser. Iterate on frontend and backend code together with live results.",
    cloudinaryVideoPublicId: "Renz_rljjog.mp4",
    cloudinaryThumbnailPublicId: null,
    videoUrl:
      "https://res.cloudinary.com/dyypcsoow/video/upload/v1774601595/Renz_rljjog.mp4",
    thumbnailUrl: null,
    projectUrl: "https://renzai.vercel.app/",
    color: "#10B981",
    animationCredit: null,
    category: "Featured",
    technologies: ["Next.js", "TypeScript", "Node.js", "Express", "Vercel"],
  },
  {
    title: "Drawify — Collaborative Drawing Platform",
    company: "Drawify",
    description:
      "A collaborative drawing platform for creating and sharing sketches in real-time, with an intuitive canvas and smooth interaction workflows.",
    cloudinaryVideoPublicId: "Drawify_y4pce0.mp4",
    cloudinaryThumbnailPublicId: null,
    videoUrl:
      "https://res.cloudinary.com/dyypcsoow/video/upload/v1774601603/Drawify_y4pce0.mp4",
    thumbnailUrl: null,
    projectUrl: "https://github.com/MonishPuttu/DRAWIFY",
    color: "#06B6D4",
    animationCredit: null,
    category: "Featured",
    technologies: ["JavaScript", "Node.js", "WebSockets", "Canvas"],
  },
  {
    title: "InternHub — Internship Management Platform",
    company: "InternHub",
    description:
      "A platform for managing internship applications, tracking progress, and connecting students with opportunities.",
    cloudinaryVideoPublicId: "internhub_inhdei.mp4",
    cloudinaryThumbnailPublicId: null,
    videoUrl:
      "https://res.cloudinary.com/dyypcsoow/video/upload/v1774610628/internhub_inhdei.mp4",
    thumbnailUrl: null,
    projectUrl: "https://github.com/MonishPuttu/InternHub",
    color: "#F59E0B",
    animationCredit: null,
    category: "Featured",
    technologies: ["JavaScript", "Node.js", "Express"],
  },
  {
    title: "TrafficFlow — Traffic Flow Detection System",
    company: "TrafficFlow",
    description:
      "A computer vision system for traffic flow detection and density analysis from video streams, built to provide clear and actionable traffic insights.",
    cloudinaryVideoPublicId: "TrafficFlow_etigxb.mp4",
    cloudinaryThumbnailPublicId: null,
    videoUrl:
      "https://res.cloudinary.com/dyypcsoow/video/upload/v1774617296/TrafficFlow_etigxb.mp4",
    thumbnailUrl: null,
    projectUrl: "https://github.com/MonishPuttu/Traffic_flow_detection",
    color: "#EF4444",
    animationCredit: null,
    category: "Featured",
    technologies: ["Python", "OpenCV", "Deep Learning", "Computer Vision"],
  },
  // ── Other Projects (hidden by default) ─────────────────
  {
    title: "TrackTots — Child Attendance Tracker",
    company: "TrackTots",
    description:
      "A React Native attendance tracking app that helps parents mark and monitor their child's classes with intuitive mobile-first experience.",
    cloudinaryVideoPublicId: null,
    cloudinaryThumbnailPublicId: null,
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
    description: "Opened pull requests that have been merged — awarded twice.",
    icon: "git-pull-request",
    date: new Date("2025-06-01"),
    category: "GitHub",
  },
  {
    title: "Pair Extraordinaire",
    description: "Co-authored commits on a merged pull request.",
    icon: "star",
    date: new Date("2025-08-01"),
    category: "GitHub",
  },
  {
    title: "Quickdraw",
    description: "Closed an issue or pull request within 5 minutes of opening.",
    icon: "zap",
    date: new Date("2025-07-01"),
    category: "GitHub",
  },
  {
    title: "YOLO",
    description: "Merged a pull request without a code review.",
    icon: "award",
    date: new Date("2025-09-01"),
    category: "GitHub",
  },
];

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Clean up existing data
    console.log("🧹 Clearing existing data...");
    await db.delete(achievements);
    await db.delete(projects);
    console.log("✅ Existing data cleared");

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
