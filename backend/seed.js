import { db } from "./db/db.js";
import { projects, achievements } from "./db/schema.js";

const seedProjects = [
  {
    title: "Creating the MVP experience for a new desktop feature",
    company: "Spotify",
    description:
      "Designed and launched a new desktop feature for Spotify, focusing on creating an intuitive MVP experience that enhances user engagement and music discovery.",
    videoUrl: "/videos/spotify.mp4",
    projectUrl: "https://spotify.com",
    color: "#1DB954",
    animationCredit: "Animation by @Mehdi",
    category: "Commercial",
    technologies: ["Figma", "Prototyping", "User Research", "A/B Testing"],
  },
  {
    title: "Improving the workflow of IBM consultants using AI",
    company: "IBM",
    description:
      "Developed an AI-powered workflow system for IBM consultants to streamline their daily operations, reduce manual tasks, and improve decision-making through intelligent automation.",
    videoUrl: "/videos/ibm.mp4",
    projectUrl: "https://ibm.com",
    color: "#0F62FE",
    animationCredit: "Animation by @Harold",
    category: "Commercial",
    technologies: ["AI/ML", "Sketch", "User Testing", "Workflow Design"],
  },
  {
    title:
      "Delivering a system to help clinical scientists interpret genetic test results",
    company: "Genomics England",
    description:
      "Created a comprehensive system for clinical scientists to interpret complex genetic test results, improving accuracy and efficiency in clinical decision-making.",
    videoUrl: "/videos/genomics.mp4",
    projectUrl: "https://genomicsengland.co.uk",
    color: "#00A99D",
    animationCredit: null,
    category: "Healthcare",
    technologies: [
      "Healthcare UX",
      "Data Visualization",
      "Figma",
      "Accessibility",
    ],
  },
  {
    title: "Redesigning the answers page for better clarity",
    company: "Quora",
    description:
      "Redesigned Quora's answers page to improve readability, user engagement, and information hierarchy, resulting in better user experience and increased time on page.",
    videoUrl: "/videos/quora.mp4",
    projectUrl: "https://quora.com",
    color: "#B92B27",
    animationCredit: null,
    category: "Social Media",
    technologies: ["UI Design", "Information Architecture", "Prototyping"],
  },
  {
    title: "A redesigned mobile experience",
    company: "BBC",
    description:
      "Complete mobile app redesign for BBC News, focusing on improved navigation, personalized content delivery, and enhanced multimedia consumption.",
    videoUrl: "/videos/bbc.mp4",
    projectUrl: "https://bbc.com",
    color: "#BB1919",
    animationCredit: null,
    category: "Media",
    technologies: ["Mobile Design", "iOS", "Android", "Responsive Design"],
  },
];

const seedAchievements = [
  {
    title: "Best Portfolio Award 2024",
    description:
      "Won best portfolio design at the International Design Conference for innovative approach to case study presentation",
    icon: "trophy",
    date: new Date("2024-06-15"),
    category: "Awards",
  },
  {
    title: "10K+ Project Views",
    description:
      "Portfolio reached 10,000+ views milestone across all projects, demonstrating strong engagement and reach",
    icon: "eye",
    date: new Date("2024-08-20"),
    category: "Milestone",
  },
  {
    title: "Featured on Awwwards",
    description:
      "Portfolio website featured as Site of the Day on Awwwards for exceptional design and user experience",
    icon: "star",
    date: new Date("2024-09-10"),
    category: "Recognition",
  },
  {
    title: "UX Certification",
    description:
      "Completed Advanced UX Design Certification from Nielsen Norman Group with distinction",
    icon: "certificate",
    date: new Date("2024-03-05"),
    category: "Education",
  },
  {
    title: "50+ Client Projects",
    description:
      "Successfully completed over 50 client projects across various industries including tech, healthcare, and finance",
    icon: "target",
    date: new Date("2024-11-01"),
    category: "Milestone",
  },
  {
    title: "Design System Launch",
    description:
      "Led the creation and launch of a comprehensive design system used by 200+ designers",
    icon: "trending",
    date: new Date("2024-07-22"),
    category: "Achievement",
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
