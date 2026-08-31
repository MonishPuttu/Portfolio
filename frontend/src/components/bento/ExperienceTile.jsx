import React from "react";
import { GraduationCap } from "lucide-react";
import Tile, { TileLabel } from "./Tile";
import { EDUCATION, EXPERIENCE } from "../../config/profile";

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
            <p className="mb-[7px] text-xs font-medium text-primary-600 dark:text-primary-300">
              {item.org}
            </p>
            <p className="text-[12.5px] leading-relaxed text-ink-soft">
              {item.detail}
            </p>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3.5 border-t border-line pt-3.5">
        <span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-[9px] bg-ground text-ink-soft">
          <GraduationCap size={15} />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold">{EDUCATION.degree}</p>
          <p className="text-[11.5px] text-ink-dim">
            {EDUCATION.school} · {EDUCATION.period} · {EDUCATION.grade}
          </p>
        </div>
      </div>
    </div>
  </Tile>
);

export default ExperienceTile;
