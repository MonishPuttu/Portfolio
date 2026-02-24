import { db } from "../db/db.js";
import { projects } from "../db/schema.js";
import { eq, desc, sql } from "drizzle-orm";

// Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const { category } = req.query;

    let allProjects;

    if (category) {
      allProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.category, category))
        .orderBy(desc(projects.createdAt));
    } else {
      allProjects = await db
        .select()
        .from(projects)
        .orderBy(desc(projects.createdAt));
    }

    res.json({ success: true, data: allProjects });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .limit(1);

    if (project.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    res.json({ success: true, data: project[0] });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Increment project views
export const incrementProjectViews = async (req, res) => {
  try {
    const { id } = req.params;

    // Increment view count
    await db
      .update(projects)
      .set({
        viewCount: sql`${projects.viewCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, parseInt(id)));

    // Get updated view count
    const updated = await db
      .select({ viewCount: projects.viewCount })
      .from(projects)
      .where(eq(projects.id, parseInt(id)))
      .limit(1);

    res.json({
      success: true,
      viewCount: updated[0]?.viewCount || 0,
    });
  } catch (error) {
    console.error("Increment views error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new project
export const createProject = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      videoUrl,
      thumbnailUrl,
      projectUrl,
      color,
      animationCredit,
      category,
      technologies,
    } = req.body;

    const newProject = await db
      .insert(projects)
      .values({
        title,
        company,
        description,
        videoUrl,
        thumbnailUrl,
        projectUrl,
        color: color || "#8B5CF6",
        animationCredit,
        category: category || "Commercial",
        technologies,
      })
      .returning();

    res.status(201).json({ success: true, data: newProject[0] });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };

    const updated = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    res.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db
      .delete(projects)
      .where(eq(projects.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
