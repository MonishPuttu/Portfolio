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
  {
    title: "MLOps Workflow System — End-to-End ML Pipeline",
    company: "MLOps Workflow System",
    description:
      "A 7-stage MLOps pipeline for pharmaceutical models covering ingestion, feature engineering, training, validation, registry, serving and monitoring — integrating MLflow, FastAPI, Evidently and Streamlit with automated drift detection and retraining.",
    cloudinaryVideoPublicId: null,
    cloudinaryThumbnailPublicId: null,
    videoUrl: null,
    thumbnailUrl: null,
    projectUrl: "https://github.com/monishputtu",
    color: "#0EA5E9",
    animationCredit: null,
    category: "Featured",
    technologies: [
      "Python",
      "Docker",
      "MLflow",
      "FastAPI",
      "Evidently",
      "Streamlit",
    ],
  },
  {
    title: "LLM Multi-Agent System — Prescription Safety",
    company: "LLM Multi-Agent System",
    description:
      "A multi-agent prescription safety system coordinating 5 specialised LangGraph agents that reference RxNorm, OpenFDA and PubMed to flag drug interactions and suggest alternatives.",
    cloudinaryVideoPublicId: null,
    cloudinaryThumbnailPublicId: null,
    videoUrl: null,
    thumbnailUrl: null,
    projectUrl: "https://github.com/monishputtu",
    color: "#8B5CF6",
    animationCredit: null,
    category: "Featured",
    technologies: ["LangChain", "LangGraph", "Python", "RAG"],
  },
];

const seedAchievements = [
  {
    title: "Academic Excellence Award",
    description: "Top performer, B.E. Electronics & Communication Engineering.",
    icon: "award",
    date: new Date("2026-05-01"),
    category: "Academic",
  },
  {
    title: "Smart India Hackathon",
    description: "Intra-college selection.",
    icon: "trophy",
    date: new Date("2025-09-01"),
    category: "Hackathon",
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
