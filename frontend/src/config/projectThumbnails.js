const FEATURED_THUMBNAIL_MAP = {
  anitalk: "/thumbnails/anitalk.png",
  renz: "/thumbnails/renz.png",
  drawify: "/thumbnails/drawify.png",
  internhub: "/thumbnails/internhub.png",
  trafficflow: "/thumbnails/trafficflow.png",
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

export const preloadProjectThumbnails = async (projects = []) => {
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
