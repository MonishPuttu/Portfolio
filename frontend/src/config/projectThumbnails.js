const FEATURED_THUMBNAIL_MAP = {
  anitalk: "/thumbnails/anitalk.png",
  renz: "/thumbnails/renz.png",
  drawify: "/thumbnails/drawify.png",
  internhub: "/thumbnails/internhub.png",
  trafficflow: "/thumbnails/trafficflow.png",
};

export const DEFAULT_PROJECT_THUMBNAIL = "/thumbnails/default.svg";

const normalize = (value = "") => String(value).toLowerCase();

const preloadImage = (src) =>
  new Promise((resolve) => {
    if (!src) {
      resolve(false);
      return;
    }

    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });

export const getKnownProjectThumbnails = () => [
  ...Object.values(FEATURED_THUMBNAIL_MAP),
  DEFAULT_PROJECT_THUMBNAIL,
];

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

export const preloadProjectThumbnails = async (projects = []) => {
  const hydratedProjects = hydrateProjectsWithThumbnails(projects);

  const uniqueThumbnailUrls = [
    ...new Set(
      hydratedProjects
        .map((project) => project.thumbnail_url || project.thumbnailUrl)
        .filter(Boolean),
    ),
  ];

  await Promise.all(uniqueThumbnailUrls.map((url) => preloadImage(url)));

  return hydratedProjects;
};

export const preloadKnownProjectThumbnails = async () => {
  await Promise.all(
    getKnownProjectThumbnails().map((url) => preloadImage(url)),
  );
};

export default FEATURED_THUMBNAIL_MAP;
