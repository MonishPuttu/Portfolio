import { db } from "../db/db.js";
import { achievements } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";

// Get all achievements
export const getAllAchievements = async (req, res) => {
  try {
    const allAchievements = await db
      .select()
      .from(achievements)
      .orderBy(desc(achievements.date));

    res.json({ success: true, data: allAchievements });
  } catch (error) {
    console.error("Get achievements error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get achievement by ID
export const getAchievementById = async (req, res) => {
  try {
    const { id } = req.params;

    const achievement = await db
      .select()
      .from(achievements)
      .where(eq(achievements.id, parseInt(id)))
      .limit(1);

    if (achievement.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Achievement not found" });
    }

    res.json({ success: true, data: achievement[0] });
  } catch (error) {
    console.error("Get achievement error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create achievement
export const createAchievement = async (req, res) => {
  try {
    const { title, description, icon, date, category } = req.body;

    const newAchievement = await db
      .insert(achievements)
      .values({
        title,
        description,
        icon: icon || "award",
        date: date ? new Date(date) : null,
        category,
      })
      .returning();

    res.status(201).json({ success: true, data: newAchievement[0] });
  } catch (error) {
    console.error("Create achievement error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update achievement
export const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await db
      .update(achievements)
      .set(req.body)
      .where(eq(achievements.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Achievement not found" });
    }

    res.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("Update achievement error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete achievement
export const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db
      .delete(achievements)
      .where(eq(achievements.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Achievement not found" });
    }

    res.json({ success: true, message: "Achievement deleted successfully" });
  } catch (error) {
    console.error("Delete achievement error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
