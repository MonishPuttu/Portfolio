const FEATURED_THUMBNAIL_MAP = {
  anitalk: "/thumbnails/anitalk.png",
  renz: "/thumbnails/renz.png",
  drawify: "/thumbnails/drawify.png",
  internhub: "/thumbnails/internhub.png",
  trafficflow: "/thumbnails/trafficflow.png",
};

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

export default FEATURED_THUMBNAIL_MAP;
