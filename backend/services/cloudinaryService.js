import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const parseCloudinaryUrl = (value) => {
  if (!value) return null;

  const match = String(value)
    .trim()
    .match(/^cloudinary:\/\/([^:]+):([^@]+)@([^/?#]+)$/i);

  if (!match) return null;

  const [, apiKey, apiSecret, cloudName] = match;

  return {
    apiKey: decodeURIComponent(apiKey),
    apiSecret: decodeURIComponent(apiSecret),
    cloudName: decodeURIComponent(cloudName),
  };
};

const cloudinaryFromUrl = parseCloudinaryUrl(process.env.CLOUDINARY_URL);
const cloudinaryCloudName =
  cloudinaryFromUrl?.cloudName || process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey =
  cloudinaryFromUrl?.apiKey || process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret =
  cloudinaryFromUrl?.apiSecret || process.env.CLOUDINARY_API_SECRET;
const cloudinaryRootFolder = (
  process.env.CLOUDINARY_ALLOWED_ROOT ||
  process.env.CLOUDINARY_UPLOAD_FOLDER?.split("/")[0] ||
  "portfolio"
)
  .replace(/^\/+|\/+$/g, "")
  .trim();
const shouldVerifyCloudinaryAsset =
  process.env.CLOUDINARY_VERIFY_ASSET_EXISTENCE !== "false";
const fallbackThumbnailUrl =
  process.env.CLOUDINARY_FALLBACK_THUMBNAIL || "/fallback-thumbnail.png";

if (
  cloudinaryFromUrl &&
  process.env.CLOUDINARY_CLOUD_NAME &&
  cloudinaryFromUrl.cloudName !== process.env.CLOUDINARY_CLOUD_NAME
) {
  console.warn(
    "CLOUDINARY_URL cloud name does not match CLOUDINARY_CLOUD_NAME. Using CLOUDINARY_URL value.",
  );
}

export const isCloudinaryConfigured = () =>
  Boolean(cloudinaryCloudName && cloudinaryApiKey && cloudinaryApiSecret);

const canGenerateCloudinaryDeliveryUrls = () => Boolean(cloudinaryCloudName);

if (canGenerateCloudinaryDeliveryUrls()) {
  cloudinary.config({
    cloud_name: cloudinaryCloudName,
    secure: true,
    ...(cloudinaryApiKey ? { api_key: cloudinaryApiKey } : {}),
    ...(cloudinaryApiSecret ? { api_secret: cloudinaryApiSecret } : {}),
  });
}

const normalizeNullableString = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;

  const normalized = String(value).trim();
  return normalized.length > 0 ? normalized : null;
};

const getProjectScopedPrefix = (projectId) =>
  projectId ? `${cloudinaryRootFolder}/${projectId}/` : null;

const validatePublicIdOwnership = (publicId, { projectId } = {}) => {
  if (!publicId) return;

  if (!publicId.startsWith(`${cloudinaryRootFolder}/`)) {
    throw new Error(
      `Invalid public_id. Must start with ${cloudinaryRootFolder}/`,
    );
  }

  const projectScopedPrefix = getProjectScopedPrefix(projectId);
  if (projectScopedPrefix && !publicId.startsWith(projectScopedPrefix)) {
    throw new Error(
      `Invalid public_id. Must start with ${projectScopedPrefix}`,
    );
  }
};

const isCloudinaryHost = (hostname) =>
  hostname === "res.cloudinary.com" || hostname.endsWith(".res.cloudinary.com");

export const isCloudinaryUrl = (value) => {
  if (!value) return false;

  try {
    const parsed = new URL(value);
    return isCloudinaryHost(parsed.hostname);
  } catch {
    return false;
  }
};

export const extractPublicIdFromCloudinaryUrl = (url) => {
  if (!url || !isCloudinaryUrl(url)) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);

    // Expected URL format includes '/<cloud>/.../upload/.../v123/<public_id>.<ext>'
    const uploadIndex = segments.findIndex((segment) => segment === "upload");

    if (uploadIndex === -1) {
      return null;
    }

    const afterUpload = segments.slice(uploadIndex + 1);
    const versionIndex = afterUpload.findIndex((segment) =>
      /^v\d+$/.test(segment),
    );

    if (versionIndex === -1) {
      return null;
    }

    const publicIdParts = afterUpload.slice(versionIndex + 1);

    if (publicIdParts.length === 0) {
      return null;
    }

    const lastSegment = publicIdParts[publicIdParts.length - 1];
    publicIdParts[publicIdParts.length - 1] = lastSegment.replace(
      /\.[^.]+$/,
      "",
    );

    return decodeURIComponent(publicIdParts.join("/"));
  } catch {
    return null;
  }
};

export const buildCloudinaryVideoUrl = (videoPublicId) => {
  if (!videoPublicId || !canGenerateCloudinaryDeliveryUrls()) return null;

  return cloudinary.url(videoPublicId, {
    resource_type: "video",
    secure: true,
    quality: "auto",
    fetch_format: "auto",
  });
};

export const buildCloudinaryThumbnailUrl = (
  thumbnailPublicId,
  fallbackVideoPublicId,
) => {
  if (!canGenerateCloudinaryDeliveryUrls()) return null;

  if (thumbnailPublicId) {
    return cloudinary.url(thumbnailPublicId, {
      resource_type: "image",
      secure: true,
      quality: "auto",
      fetch_format: "auto",
    });
  }

  if (!fallbackVideoPublicId) {
    return null;
  }

  return cloudinary.url(fallbackVideoPublicId, {
    resource_type: "video",
    secure: true,
    format: "jpg",
    transformation: [
      {
        width: 400,
        crop: "scale",
      },
    ],
  });
};

const buildCloudinaryMediaWithFallback = ({
  videoPublicId,
  thumbnailPublicId,
}) => {
  try {
    return {
      videoUrl: videoPublicId ? buildCloudinaryVideoUrl(videoPublicId) : null,
      thumbnailUrl: videoPublicId
        ? buildCloudinaryThumbnailUrl(thumbnailPublicId, videoPublicId)
        : fallbackThumbnailUrl,
    };
  } catch {
    return {
      videoUrl: null,
      thumbnailUrl: fallbackThumbnailUrl,
    };
  }
};

const validateCloudinaryAssetExists = async (publicId, resourceType) => {
  if (!publicId || !shouldVerifyCloudinaryAsset) return;

  try {
    await cloudinary.api.resource(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    const isNotFound =
      error?.http_code === 404 ||
      String(error?.message || "")
        .toLowerCase()
        .includes("not found");

    if (isNotFound) {
      throw new Error(
        `Invalid ${resourceType} public_id. Asset does not exist in Cloudinary.`,
      );
    }

    throw error;
  }
};

export const resolveProjectMedia = async ({
  videoPublicId,
  videoUrl,
  thumbnailPublicId,
  thumbnailUrl,
  projectId,
}) => {
  const normalizedVideoPublicId = normalizeNullableString(videoPublicId);
  const normalizedVideoUrl = normalizeNullableString(videoUrl);
  const normalizedThumbnailPublicId =
    normalizeNullableString(thumbnailPublicId);
  const normalizedThumbnailUrl = normalizeNullableString(thumbnailUrl);

  if (
    normalizedVideoPublicId === undefined &&
    normalizedVideoUrl === undefined &&
    normalizedThumbnailPublicId === undefined &&
    normalizedThumbnailUrl === undefined
  ) {
    return null;
  }

  let nextVideoPublicId =
    normalizedVideoPublicId !== undefined ? normalizedVideoPublicId : null;

  if (!nextVideoPublicId && normalizedVideoUrl) {
    nextVideoPublicId = extractPublicIdFromCloudinaryUrl(normalizedVideoUrl);
    if (!nextVideoPublicId) {
      throw new Error(
        "Invalid videoUrl. Provide a valid Cloudinary delivery URL or a video public ID.",
      );
    }
  }

  if (!nextVideoPublicId) {
    return {
      cloudinaryVideoPublicId: null,
      cloudinaryThumbnailPublicId: null,
      videoUrl: null,
      thumbnailUrl: null,
    };
  }

  validatePublicIdOwnership(nextVideoPublicId, { projectId });

  let nextThumbnailPublicId =
    normalizedThumbnailPublicId !== undefined
      ? normalizedThumbnailPublicId
      : null;

  if (!nextThumbnailPublicId && normalizedThumbnailUrl) {
    nextThumbnailPublicId = extractPublicIdFromCloudinaryUrl(
      normalizedThumbnailUrl,
    );
    if (!nextThumbnailPublicId) {
      throw new Error(
        "Invalid thumbnailUrl. Provide a valid Cloudinary delivery URL or a thumbnail public ID.",
      );
    }
  }

  if (nextThumbnailPublicId) {
    validatePublicIdOwnership(nextThumbnailPublicId, { projectId });
  }

  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }

  await validateCloudinaryAssetExists(nextVideoPublicId, "video");
  if (nextThumbnailPublicId) {
    await validateCloudinaryAssetExists(nextThumbnailPublicId, "image");
  }

  const generatedMedia = buildCloudinaryMediaWithFallback({
    videoPublicId: nextVideoPublicId,
    thumbnailPublicId: nextThumbnailPublicId,
  });

  return {
    cloudinaryVideoPublicId: nextVideoPublicId,
    cloudinaryThumbnailPublicId: nextThumbnailPublicId,
    videoUrl: generatedMedia.videoUrl,
    thumbnailUrl: generatedMedia.thumbnailUrl,
  };
};

export const hydrateProjectMedia = (project) => {
  if (!project) return project;

  const videoPublicId = project.cloudinaryVideoPublicId;
  const thumbnailPublicId = project.cloudinaryThumbnailPublicId;

  const { videoUrl: generatedVideoUrl, thumbnailUrl: generatedThumbnailUrl } =
    buildCloudinaryMediaWithFallback({
      videoPublicId,
      thumbnailPublicId,
    });

  const resolvedVideoUrl =
    project.videoUrl || (videoPublicId ? generatedVideoUrl : null);

  const resolvedThumbnailUrl =
    project.thumbnailUrl ||
    (videoPublicId ? generatedThumbnailUrl : null) ||
    fallbackThumbnailUrl;

  return {
    ...project,
    videoUrl: resolvedVideoUrl,
    thumbnailUrl: resolvedThumbnailUrl,
    // Backward compatibility for any snake_case consumers
    video_url: resolvedVideoUrl,
    thumbnail_url: resolvedThumbnailUrl,
    cloudinary_video_public_id: videoPublicId,
    cloudinary_thumbnail_public_id: thumbnailPublicId,
  };
};

export const deleteProjectMediaFromCloudinary = async ({
  videoPublicId,
  thumbnailPublicId,
}) => {
  if (!isCloudinaryConfigured()) return;

  const operations = [];

  if (videoPublicId) {
    operations.push(
      cloudinary.uploader.destroy(videoPublicId, {
        resource_type: "video",
        invalidate: true,
      }),
    );
  }

  // Only delete thumbnail if it is explicitly stored as a standalone image.
  if (thumbnailPublicId) {
    operations.push(
      cloudinary.uploader.destroy(thumbnailPublicId, {
        resource_type: "image",
        invalidate: true,
      }),
    );
  }

  if (operations.length === 0) return;

  await Promise.allSettled(operations);
};
