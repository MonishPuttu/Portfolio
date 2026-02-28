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
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// CORS — require FRONTEND_URL in production
const corsOrigin = process.env.FRONTEND_URL;
if (isProduction && !corsOrigin) {
  console.error(
    "⚠️  FRONTEND_URL is not set. CORS will reject all cross-origin requests in production.",
  );
}

app.use(
  cors({
    origin: corsOrigin || "http://localhost:5173",
    credentials: true,
  }),
);

// Limit request body size
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Only log in development
if (!isProduction) {
  app.use(morgan("dev"));
}

// Rate limiting
app.use("/api/", apiLimiter);

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check (minimal info in production)
app.get("/health", async (req, res) => {
  if (isProduction) {
    return res.json({ status: "OK" });
  }
  const dbConnected = await testConnection();
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: dbConnected ? "connected" : "disconnected",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Portfolio API Server",
    version: "1.0.0",
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
