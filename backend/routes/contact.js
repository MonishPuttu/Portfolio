import express from "express";
import {
  submitContact,
  getAllContacts,
} from "../controllers/contactController.js";
import { contactLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/", contactLimiter, submitContact);
router.get("/", getAllContacts);

export default router;
