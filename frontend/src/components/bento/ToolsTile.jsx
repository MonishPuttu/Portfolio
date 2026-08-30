import React from "react";
import Tile, { TileLabel } from "./Tile";
import { TOOLS } from "../../config/profile";

const ToolsTile = ({ delay = 0 }) => (
  <Tile
    span="col-span-12"
    delay={delay}
    className="marquee-host gap-3 overflow-hidden !px-0 !py-4"
  >
    <TileLabel className="px-5">Toolchain</TileLabel>

    {/* Doubled so the -50% translate loops seamlessly. */}
    <div className="mt-3 flex w-max animate-marquee gap-2" aria-hidden="true">
      {[...TOOLS, ...TOOLS].map((tool, i) => (
        <span
          key={`${tool}-${i}`}
          className="whitespace-nowrap rounded-full border border-line bg-surface px-[15px] py-2 text-[12.5px] font-medium text-ink-soft"
        >
          {tool}
        </span>
      ))}
    </div>

    <span className="sr-only">Toolchain: {TOOLS.join(", ")}</span>
  </Tile>
);

export default ToolsTile;
