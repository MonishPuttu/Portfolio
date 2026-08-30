import React from "react";
import Tile, { TileLabel } from "./Tile";
import { EXPERIENCE } from "../../config/profile";

const ExperienceTile = ({ delay = 0 }) => (
  <Tile span="col-span-12 lg:col-span-7" delay={delay}>
    <TileLabel>Experience</TileLabel>

    <div className="mt-3.5">
      {EXPERIENCE.map((item) => (
        <div
          key={item.role}
          className="flex gap-3.5 border-t border-line py-3.5"
        >
          <span className="whitespace-nowrap pt-[3px] text-[11px] font-medium text-ink-dim">
            {item.year}
          </span>
          <div>
            <h3 className="mb-[3px] text-[15px] font-semibold tracking-[-0.015em]">
              {item.role}
            </h3>
            <p className="mb-[7px] text-xs font-medium text-primary-600">
              {item.org}
            </p>
            <p className="text-[12.5px] leading-relaxed text-ink-soft">
              {item.detail}
            </p>
          </div>
        </div>
      ))}
    </div>
  </Tile>
);

export default ExperienceTile;
