import express from "express";
import {
  trackPageView,
  trackEvent,
  getAnalyticsStats,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.post("/page-view", trackPageView);
router.post("/event", trackEvent);
router.get("/stats", getAnalyticsStats);

export default router;
