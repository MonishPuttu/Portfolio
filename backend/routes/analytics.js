import express from "express";
import {
  trackPageView,
  trackEvent,
  getAnalyticsStats,
  getPageViewsOverTime,
  getPopularProjects,
} from "../controllers/analyticsController.js";
import { authenticateAdmin } from "../middleware/auth.js";
import {
  validatePageView,
  validateEvent,
  validateDaysQuery,
  validateLimitQuery,
} from "../middleware/validators.js";

const router = express.Router();

// Public routes (tracking)
router.post("/page-view", validatePageView, trackPageView);
router.post("/event", validateEvent, trackEvent);

// Admin routes (require JWT)
router.get("/stats", authenticateAdmin, getAnalyticsStats);
router.get(
  "/views-over-time",
  authenticateAdmin,
  validateDaysQuery,
  getPageViewsOverTime,
);
router.get(
  "/popular-projects",
  authenticateAdmin,
  validateLimitQuery,
  getPopularProjects,
);

export default router;
