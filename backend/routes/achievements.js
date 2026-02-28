import express from "express";
import {
  getAllAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../controllers/achievementController.js";
import { authenticateAdmin } from "../middleware/auth.js";
import {
  validateIdParam,
  validateAchievement,
} from "../middleware/validators.js";

const router = express.Router();

// Public routes
router.get("/", getAllAchievements);
router.get("/:id", validateIdParam, getAchievementById);

// Admin routes (require JWT)
router.post("/", authenticateAdmin, validateAchievement, createAchievement);
router.put(
  "/:id",
  authenticateAdmin,
  validateIdParam,
  validateAchievement,
  updateAchievement,
);
router.delete("/:id", authenticateAdmin, validateIdParam, deleteAchievement);

export default router;
