import { body, param, query, validationResult } from "express-validator";

const cloudinaryRootFolder = (
  process.env.CLOUDINARY_ALLOWED_ROOT ||
  process.env.CLOUDINARY_UPLOAD_FOLDER?.split("/")[0] ||
  "portfolio"
)
  .replace(/^\/+|\/+$/g, "")
  .trim();

const isCloudinaryHost = (urlString) => {
  try {
    const parsed = new URL(urlString);
    return (
      parsed.hostname === "res.cloudinary.com" ||
      parsed.hostname.endsWith(".res.cloudinary.com")
    );
  } catch {
    return false;
  }
};

const isAllowedCloudinaryPublicId = (publicId) => {
  if (!publicId) return true;
  const normalized = String(publicId).trim();
  if (!normalized) return true;

  return normalized.startsWith(`${cloudinaryRootFolder}/`);
};

/**
 * Handle validation errors — returns 400 with details.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

/**
 * Validate that :id param is a positive integer.
 */
export const validateIdParam = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID must be a positive integer")
    .toInt(),
  handleValidationErrors,
];

/**
 * Validate contact form submission.
 */
export const validateContact = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 255 })
    .withMessage("Name must be under 255 characters")
    .escape(),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage("Email must be under 255 characters"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 5000 })
    .withMessage("Message must be under 5000 characters"),
  handleValidationErrors,
];

/**
 * Validate project creation / update.
 */
export const validateProject = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be under 255 characters"),
  body("company")
    .trim()
    .notEmpty()
    .withMessage("Company is required")
    .isLength({ max: 255 })
    .withMessage("Company must be under 255 characters"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("videoPublicId")
    .optional({ values: "null" })
    .isLength({ max: 255 })
    .withMessage("videoPublicId must be under 255 characters")
    .custom((value) => isAllowedCloudinaryPublicId(value))
    .withMessage(`videoPublicId must start with ${cloudinaryRootFolder}/`),
  body("cloudinaryVideoPublicId")
    .optional({ values: "null" })
    .isLength({ max: 255 })
    .withMessage("cloudinaryVideoPublicId must be under 255 characters")
    .custom((value) => isAllowedCloudinaryPublicId(value))
    .withMessage(
      `cloudinaryVideoPublicId must start with ${cloudinaryRootFolder}/`,
    ),
  body("thumbnailPublicId")
    .optional({ values: "null" })
    .isLength({ max: 255 })
    .withMessage("thumbnailPublicId must be under 255 characters")
    .custom((value) => isAllowedCloudinaryPublicId(value))
    .withMessage(`thumbnailPublicId must start with ${cloudinaryRootFolder}/`),
  body("cloudinaryThumbnailPublicId")
    .optional({ values: "null" })
    .isLength({ max: 255 })
    .withMessage("cloudinaryThumbnailPublicId must be under 255 characters")
    .custom((value) => isAllowedCloudinaryPublicId(value))
    .withMessage(
      `cloudinaryThumbnailPublicId must start with ${cloudinaryRootFolder}/`,
    ),
  body("videoUrl")
    .optional({ values: "null" })
    .isURL()
    .withMessage("Video URL must be a valid URL")
    .custom((value) => !value || isCloudinaryHost(value))
    .withMessage("Video URL must be a Cloudinary URL")
    .isLength({ max: 500 })
    .withMessage("Video URL must be under 500 characters"),
  body("thumbnailUrl")
    .optional({ values: "null" })
    .isURL()
    .withMessage("Thumbnail URL must be a valid URL")
    .custom((value) => !value || isCloudinaryHost(value))
    .withMessage("Thumbnail URL must be a Cloudinary URL")
    .isLength({ max: 500 })
    .withMessage("Thumbnail URL must be under 500 characters"),
  body("projectUrl")
    .optional({ values: "null" })
    .isURL()
    .withMessage("Project URL must be a valid URL"),
  body("color")
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Color must be a valid hex color"),
  body("animationCredit")
    .optional({ values: "null" })
    .isLength({ max: 255 })
    .withMessage("Animation credit must be under 255 characters"),
  body("category")
    .optional()
    .isIn(["Featured", "Commercial", "Other"])
    .withMessage("Category must be Featured, Commercial, or Other"),
  body("technologies")
    .optional()
    .isArray()
    .withMessage("Technologies must be an array"),
  handleValidationErrors,
];

/**
 * Validate achievement creation / update.
 */
export const validateAchievement = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be under 255 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description must be under 2000 characters"),
  body("icon")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Icon must be under 100 characters"),
  body("date")
    .optional({ values: "null" })
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  body("category")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Category must be under 100 characters"),
  handleValidationErrors,
];

/**
 * Validate analytics page view tracking.
 */
export const validatePageView = [
  body("page_url")
    .trim()
    .notEmpty()
    .withMessage("page_url is required")
    .isLength({ max: 500 })
    .withMessage("page_url must be under 500 characters"),
  body("visitor_id")
    .optional()
    .isLength({ max: 255 })
    .withMessage("visitor_id must be under 255 characters"),
  handleValidationErrors,
];

/**
 * Validate analytics event tracking.
 */
export const validateEvent = [
  body("event_type")
    .trim()
    .notEmpty()
    .withMessage("event_type is required")
    .isLength({ max: 100 })
    .withMessage("event_type must be under 100 characters"),
  body("event_data")
    .optional()
    .isObject()
    .withMessage("event_data must be an object"),
  handleValidationErrors,
];

/**
 * Validate query parameters for analytics.
 */
export const validateDaysQuery = [
  query("days")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("days must be between 1 and 365")
    .toInt(),
  handleValidationErrors,
];

export const validateLimitQuery = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("limit must be between 1 and 50")
    .toInt(),
  handleValidationErrors,
];
