import React from "react";
import { ArrowUpRight } from "lucide-react";
import Tile from "./Tile";
import { projectSwatch, shortTitle, subTitle } from "../../config/projectTags";

const ProjectTile = ({ project, onOpen, delay = 0 }) => {
  const title = shortTitle(project);
  const line = subTitle(project) || project.description;

  return (
    <Tile
      as="button"
      type="button"
      span="col-span-12 md:col-span-6 lg:col-span-4"
      interactive
      delay={delay}
      onClick={() => onOpen(project)}
      className="group min-h-[150px] justify-between"
      aria-label={`Open ${title}`}
    >
      <span
        aria-hidden="true"
        className="absolute right-4 top-4 grid h-[26px] w-[26px] translate-y-[-4px] place-items-center rounded-full bg-ground text-ink-soft opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
      >
        <ArrowUpRight size={12} />
      </span>

      <div
        aria-hidden="true"
        className="mb-3.5 h-14 w-full rounded-xl"
        style={{ background: projectSwatch(project) }}
      />

      <h3 className="mb-1.5 font-display text-[18px] font-extrabold tracking-[-0.03em]">
        {title}
      </h3>
      <p className="line-clamp-2 text-xs leading-snug text-ink-dim">{line}</p>
    </Tile>
  );
};

export default ProjectTile;
