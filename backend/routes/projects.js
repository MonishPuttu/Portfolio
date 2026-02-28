import express from "express";
import {
  getAllProjects,
  getProjectById,
  incrementProjectViews,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { authenticateAdmin } from "../middleware/auth.js";
import { validateIdParam, validateProject } from "../middleware/validators.js";

const router = express.Router();

// Public routes
router.get("/", getAllProjects);
router.get("/:id", validateIdParam, getProjectById);
router.post("/:id/view", validateIdParam, incrementProjectViews);

// Admin routes (require JWT)
router.post("/", authenticateAdmin, validateProject, createProject);
router.put(
  "/:id",
  authenticateAdmin,
  validateIdParam,
  validateProject,
  updateProject,
);
router.delete("/:id", authenticateAdmin, validateIdParam, deleteProject);

export default router;
