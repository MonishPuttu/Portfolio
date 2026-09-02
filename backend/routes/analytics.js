import express from "express";
import {
  trackPageView,
  trackEvent,
  endVisit,
  getAnalyticsStats,
  getPageViewsOverTime,
  getPopularProjects,
} from "../controllers/analyticsController.js";
import { authenticateAdmin } from "../middleware/auth.js";
import { analyticsLimiter } from "../middleware/rateLimiter.js";
import {
  validatePageView,
  validateEvent,
  validateVisitEnd,
  validateDaysQuery,
  validateLimitQuery,
} from "../middleware/validators.js";

const router = express.Router();

// Public routes (tracking) — unauthenticated by nature, so they carry their
// own limiter rather than relying only on the shared one.
router.post("/page-view", analyticsLimiter, validatePageView, trackPageView);
router.post("/event", analyticsLimiter, validateEvent, trackEvent);
// Sent by sendBeacon as the tab closes, which is what makes a visit's
// duration knowable at all.
router.post("/visit-end", analyticsLimiter, validateVisitEnd, endVisit);

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
