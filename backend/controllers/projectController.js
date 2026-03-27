import { db } from "../db/db.js";
import { projects } from "../db/schema.js";
import { eq, desc, sql } from "drizzle-orm";
import {
  resolveProjectMedia,
  hydrateProjectMedia,
  deleteProjectMediaFromCloudinary,
} from "../services/cloudinaryService.js";

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

    const hydratedProjects = allProjects.map(hydrateProjectMedia);

    res.json({ success: true, data: hydratedProjects });
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch projects" });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (project.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    res.json({ success: true, data: hydrateProjectMedia(project[0]) });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch project" });
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
      .where(eq(projects.id, id));

    // Get updated view count
    const updated = await db
      .select({ viewCount: projects.viewCount })
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    res.json({
      success: true,
      viewCount: updated[0]?.viewCount || 0,
    });
  } catch (error) {
    console.error("Increment views error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to increment views" });
  }
};

// Create new project
export const createProject = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      videoPublicId,
      cloudinaryVideoPublicId,
      videoUrl,
      thumbnailPublicId,
      cloudinaryThumbnailPublicId,
      thumbnailUrl,
      projectUrl,
      color,
      animationCredit,
      category,
      technologies,
    } = req.body;

    const resolvedMedia = await resolveProjectMedia({
      videoPublicId: cloudinaryVideoPublicId ?? videoPublicId,
      videoUrl,
      thumbnailPublicId: cloudinaryThumbnailPublicId ?? thumbnailPublicId,
      thumbnailUrl,
    });

    const newProject = await db
      .insert(projects)
      .values({
        title,
        company,
        description,
        cloudinaryVideoPublicId: resolvedMedia?.cloudinaryVideoPublicId || null,
        cloudinaryThumbnailPublicId:
          resolvedMedia?.cloudinaryThumbnailPublicId || null,
        videoUrl: resolvedMedia?.videoUrl || null,
        thumbnailUrl: resolvedMedia?.thumbnailUrl || null,
        projectUrl,
        color: color || "#8B5CF6",
        animationCredit,
        category: category || "Commercial",
        technologies,
      })
      .returning();

    res
      .status(201)
      .json({ success: true, data: hydrateProjectMedia(newProject[0]) });
  } catch (error) {
    console.error("Create project error:", error);

    if (error.message?.startsWith("Invalid")) {
      return res.status(400).json({ success: false, error: error.message });
    }

    if (error.message?.includes("Cloudinary is not configured")) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(500).json({ success: false, error: "Failed to create project" });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProject = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (existingProject.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    const currentProject = existingProject[0];

    // Whitelist allowed fields to prevent mass assignment
    const allowedFields = [
      "title",
      "company",
      "description",
      "projectUrl",
      "color",
      "animationCredit",
      "category",
      "technologies",
    ];
    const updateData = { updatedAt: new Date() };
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const shouldUpdateMedia = [
      "videoPublicId",
      "cloudinaryVideoPublicId",
      "videoUrl",
      "thumbnailPublicId",
      "cloudinaryThumbnailPublicId",
      "thumbnailUrl",
    ].some((field) => req.body[field] !== undefined);

    if (shouldUpdateMedia) {
      const hasVideoPublicIdInput =
        req.body.videoPublicId !== undefined ||
        req.body.cloudinaryVideoPublicId !== undefined;
      const hasThumbnailPublicIdInput =
        req.body.thumbnailPublicId !== undefined ||
        req.body.cloudinaryThumbnailPublicId !== undefined;

      const resolvedMedia = await resolveProjectMedia({
        videoPublicId: hasVideoPublicIdInput
          ? (req.body.cloudinaryVideoPublicId ?? req.body.videoPublicId)
          : currentProject.cloudinaryVideoPublicId,
        videoUrl:
          req.body.videoUrl !== undefined
            ? req.body.videoUrl
            : currentProject.videoUrl,
        thumbnailPublicId: hasThumbnailPublicIdInput
          ? (req.body.cloudinaryThumbnailPublicId ?? req.body.thumbnailPublicId)
          : currentProject.cloudinaryThumbnailPublicId,
        thumbnailUrl:
          req.body.thumbnailUrl !== undefined
            ? req.body.thumbnailUrl
            : currentProject.thumbnailUrl,
        projectId: id,
      });

      updateData.cloudinaryVideoPublicId =
        resolvedMedia.cloudinaryVideoPublicId;
      updateData.cloudinaryThumbnailPublicId =
        resolvedMedia.cloudinaryThumbnailPublicId;
      updateData.videoUrl = resolvedMedia.videoUrl;
      updateData.thumbnailUrl = resolvedMedia.thumbnailUrl;
    }

    const updated = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();

    res.json({ success: true, data: hydrateProjectMedia(updated[0]) });
  } catch (error) {
    console.error("Update project error:", error);

    if (error.message?.startsWith("Invalid")) {
      return res.status(400).json({ success: false, error: error.message });
    }

    if (error.message?.includes("Cloudinary is not configured")) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.status(500).json({ success: false, error: "Failed to update project" });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();

    if (deleted.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Project not found" });
    }

    const [deletedProject] = deleted;

    await deleteProjectMediaFromCloudinary({
      videoPublicId: deletedProject.cloudinaryVideoPublicId,
      thumbnailPublicId: deletedProject.cloudinaryThumbnailPublicId,
    });

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ success: false, error: "Failed to delete project" });
  }
};
