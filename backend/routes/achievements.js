import express from "express";
import {
  getAllAchievements,
  createAchievement,
} from "../controllers/achievementController.js";

const router = express.Router();

router.get("/", getAllAchievements);
router.post("/", createAchievement);

export default router;
