import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Tile from "./Tile";
import {
  projectSwatch,
  projectThumbnail,
  shortTitle,
  subTitle,
} from "../../config/projectTags";

const ProjectTile = ({ project, onOpen, delay = 0 }) => {
  const title = shortTitle(project);
  const line = subTitle(project) || project.description;
  const thumb = projectThumbnail(project);
  const [imageFailed, setImageFailed] = useState(false);

  const showImage = Boolean(thumb) && !imageFailed;

  return (
    <Tile
      span="col-span-12 md:col-span-6 lg:col-span-4"
      interactive
      delay={delay}
      className="group min-h-[184px] justify-between"
    >
      {/* Stretched button, not a button wrapping the card — see
          FeaturedProjectTile: a heading is not valid content inside a button. */}
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-label={`Open ${title}`}
        className="absolute inset-0 z-20 h-full w-full cursor-pointer"
      />

      <span
        aria-hidden="true"
        className="absolute right-4 top-4 z-10 grid h-[26px] w-[26px] translate-y-[-4px] place-items-center rounded-full bg-surface/90 text-ink-soft opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
      >
        <ArrowUpRight size={12} />
      </span>

      {/* The colour always backs the tile, so a missing screenshot degrades to
          a branded swatch rather than an empty grey box. */}
      <div
        className="mb-3.5 h-[92px] w-full overflow-hidden rounded-xl"
        style={{ background: projectSwatch(project) }}
      >
        {showImage && (
          <img
            src={thumb}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
      </div>

      <h3 className="mb-1.5 font-display text-[18px] font-extrabold tracking-[-0.03em]">
        {title}
      </h3>
      <p className="line-clamp-2 text-xs leading-snug text-ink-dim">{line}</p>
    </Tile>
  );
};

export default ProjectTile;
