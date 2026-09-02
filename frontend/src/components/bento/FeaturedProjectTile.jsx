import React from "react";
import { Play } from "lucide-react";
import Tile, { TileLabel } from "./Tile";
import { projectGradient, shortTitle } from "../../config/projectTags";
import { DEFAULT_PROJECT_THUMBNAIL } from "../../config/projectThumbnails";

/**
 * The one project that gets a screenshot instead of a swatch. Which project
 * this is comes from the priority order, so it changes with the data rather
 * than being hardcoded in the layout.
 */
const FeaturedProjectTile = ({ project, onOpen, delay = 0, tileRef }) => {
  if (!project) return null;

  const title = shortTitle(project);
  const thumb = project.thumbnail_url || DEFAULT_PROJECT_THUMBNAIL;

  return (
    <Tile
      span="col-span-12 lg:col-span-8 lg:row-span-2"
      tileRef={tileRef}
      interactive
      delay={delay}
      className="group min-h-[296px] !p-0"
    >
      {/* A stretched button rather than a <button> wrapping the whole card:
          headings and paragraphs are not valid inside a button, and making the
          card itself one flattened the h3 out of the document outline. This
          keeps the markup honest and the whole tile clickable. */}
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-label={`Open ${title}`}
        className="absolute inset-0 z-20 h-full w-full cursor-pointer"
      />

      <div
        className="relative flex min-h-[170px] flex-1 items-end p-[22px]"
        style={{ background: projectGradient(project) }}
      >
        <img
          src={thumb}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
        />
        {/* Sits on the artwork, not on a themed surface, so it stays white-on-dark. */}
        <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 pl-1 text-[#131319] transition-transform duration-200 group-hover:scale-110">
          <Play size={17} fill="currentColor" />
        </span>
        <span className="relative text-[9.5px] font-semibold uppercase tracking-[0.16em] text-white/85">
          Featured · video demo
        </span>
      </div>

      <div className="border-t border-line px-5 pb-5 pt-[18px]">
        <h3 className="mb-1.5 font-display text-[23px] font-extrabold tracking-[-0.03em]">
          {title}
        </h3>
        <p className="max-w-[58ch] text-[13px] leading-relaxed text-ink-soft">
          {project.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(project.technologies || []).slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-ground px-2.5 py-1.5 text-[10.5px] font-medium text-ink-soft"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Tile>
  );
};

export default FeaturedProjectTile;
