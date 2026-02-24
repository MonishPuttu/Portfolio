import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { testConnection } from "./db/db.js";

// Routes
import projectRoutes from "./routes/projects.js";
import achievementRoutes from "./routes/achievements.js";
import contactRoutes from "./routes/contact.js";
import analyticsRoutes from "./routes/analytics.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Rate limiting
app.use("/api/", apiLimiter);

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/projects", projectRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check
app.get("/health", async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: dbConnected ? "connected" : "disconnected",
    environment: process.env.NODE_ENV || "development",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Portfolio API Server",
    version: "1.0.0",
    endpoints: {
      projects: "/api/projects",
      achievements: "/api/achievements",
      contact: "/api/contact",
      analytics: "/api/analytics",
      health: "/health",
    },
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const connected = await testConnection();

    if (!connected) {
      console.error(
        "⚠️  Warning: Database connection failed. Server will start but database operations may fail.",
      );
    }

    app.listen(PORT, () => {
      console.log("\n🚀 Server started successfully!");
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(
        `💾 Database: ${connected ? "✅ Connected (Neon + Drizzle)" : "❌ Disconnected"}`,
      );
      console.log(
        `📧 Email: ${process.env.EMAIL_USER ? "✅ Configured" : "⚠️  Not configured"}`,
      );
      console.log("\n📚 Available endpoints:");
      console.log(`   GET  /health`);
      console.log(`   GET  /api/projects`);
      console.log(`   POST /api/projects`);
      console.log(`   GET  /api/achievements`);
      console.log(`   POST /api/contact`);
      console.log(`   POST /api/analytics/page-view`);
      console.log(`   GET  /api/analytics/stats`);
      console.log("\n");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  process.exit(0);
});
