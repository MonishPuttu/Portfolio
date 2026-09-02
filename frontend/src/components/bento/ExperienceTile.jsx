import React from "react";
import { GraduationCap } from "lucide-react";
import Tile, { TileLabel } from "./Tile";
import { EDUCATION, EXPERIENCE } from "../../config/profile";

/**
 * Sits beside the featured project and spans both of its rows, so the tall
 * narrow column reads as a single timeline.
 */
const ExperienceTile = ({ delay = 0, tileRef }) => (
  <Tile
    span="col-span-12 lg:col-span-4 lg:row-span-2"
    delay={delay}
    tileRef={tileRef}
    className="gap-0"
  >
    <TileLabel flush>Experience</TileLabel>

    <div className="mt-3">
      {EXPERIENCE.map((item) => (
        <div key={item.role} className="border-t border-line py-3">
          <span className="text-[11px] font-medium text-ink-dim">
            {item.year}
          </span>
          <h3 className="mb-[3px] mt-1 text-[14px] font-semibold leading-snug tracking-[-0.015em]">
            {item.role}
          </h3>
          <p className="mb-[6px] text-[11.5px] font-medium text-primary-600 dark:text-primary-300">
            {item.org}
          </p>
          <p className="text-[12px] leading-relaxed text-ink-soft">
            {item.detail}
          </p>
        </div>
      ))}

      <div className="flex items-start gap-3 border-t border-line pt-3">
        <span className="mt-[2px] grid h-[30px] w-[30px] flex-none place-items-center rounded-[9px] bg-ground text-ink-soft">
          <GraduationCap size={15} />
        </span>
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold leading-snug">
            {EDUCATION.degree}
          </p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-ink-dim">
            {EDUCATION.school}
            <br />
            {EDUCATION.period} · {EDUCATION.grade}
          </p>
        </div>
      </div>
    </div>
  </Tile>
);

export default ExperienceTile;
