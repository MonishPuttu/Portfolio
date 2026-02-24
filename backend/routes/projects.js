import express from "express";
import {
  getAllProjects,
  getProjectById,
  incrementProjectViews,
  createProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/:id/view", incrementProjectViews);
router.post("/", createProject);

export default router;
