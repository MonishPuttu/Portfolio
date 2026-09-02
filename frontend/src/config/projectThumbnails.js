/**
 * WebP, capped at 1600px wide. As PNGs these five came to 2.6 MB for artwork
 * that renders at most 92px tall in a project tile, and they were fetched
 * eagerly on mount, which defeated the loading="lazy" on the tiles themselves.
 */
const FEATURED_THUMBNAIL_MAP = {
  anitalk: "/thumbnails/anitalk.webp",
  renz: "/thumbnails/renz.webp",
  drawify: "/thumbnails/drawify.webp",
  internhub: "/thumbnails/internhub.webp",
  trafficflow: "/thumbnails/trafficflow.webp",
};

export const DEFAULT_PROJECT_THUMBNAIL = "/thumbnails/default.svg";

const normalize = (value = "") => String(value).toLowerCase();

export const resolveLocalProjectThumbnail = (project) => {
  if (!project) return null;

  const title = normalize(project.title);
  const company = normalize(project.company);

  const key = Object.keys(FEATURED_THUMBNAIL_MAP).find(
    (name) => title.includes(name) || company.includes(name),
  );

  return key ? FEATURED_THUMBNAIL_MAP[key] : null;
};

export const hydrateProjectsWithThumbnails = (projects = []) => {
  return projects.map((project) => {
    const localThumbnail = resolveLocalProjectThumbnail(project);
    const remoteThumbnail = project.thumbnail_url || project.thumbnailUrl;
    const preferredThumbnail =
      localThumbnail || remoteThumbnail || DEFAULT_PROJECT_THUMBNAIL;

    return {
      ...project,
      thumbnail_url: preferredThumbnail,
      thumbnailUrl: preferredThumbnail,
    };
  });
};

export default FEATURED_THUMBNAIL_MAP;
