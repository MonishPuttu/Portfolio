import express from "express";
import {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactController.js";
import { contactLimiter } from "../middleware/rateLimiter.js";
import { authenticateAdmin } from "../middleware/auth.js";
import { validateContact, validateIdParam } from "../middleware/validators.js";

const router = express.Router();

// Public route
router.post("/", contactLimiter, validateContact, submitContact);

// Admin routes (require JWT)
router.get("/", authenticateAdmin, getAllContacts);
router.get("/:id", authenticateAdmin, validateIdParam, getContactById);
router.patch(
  "/:id/status",
  authenticateAdmin,
  validateIdParam,
  updateContactStatus,
);
router.delete("/:id", authenticateAdmin, validateIdParam, deleteContact);

export default router;
