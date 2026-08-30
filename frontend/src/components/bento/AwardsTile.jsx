import React from "react";
import Tile, { TileLabel } from "./Tile";
import { AWARDS, AWARD_TONES } from "../../config/profile";

const AwardsTile = ({ delay = 0 }) => (
  <Tile span="col-span-12 lg:col-span-5" delay={delay} className="gap-0">
    <TileLabel>Awards &amp; recognition</TileLabel>

    <div className="mt-3.5">
      {AWARDS.map((award) => (
        <div
          key={award.title}
          className="flex items-center gap-[11px] border-t border-line py-3"
        >
          <span
            aria-hidden="true"
            className={`grid h-[30px] w-[30px] flex-none place-items-center rounded-[9px] text-sm ${AWARD_TONES[award.tone]}`}
          >
            {award.glyph}
          </span>
          <div>
            <b className="block text-[13px] font-semibold">{award.title}</b>
            <span className="text-[11.5px] text-ink-dim">{award.subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  </Tile>
);

export default AwardsTile;
