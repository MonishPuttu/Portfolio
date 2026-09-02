import React from "react";
import Tile, { TileLabel } from "./Tile";
import { NOW } from "../../config/profile";

const NowTile = ({ delay = 0 }) => (
  <Tile
    span="col-span-12 md:col-span-6 lg:col-span-5"
    delay={delay}
    className="min-h-[125px] justify-between"
  >
    <TileLabel>Currently</TileLabel>

    <dl className="mt-3">
      {NOW.map((row, i) => (
        <div
          key={row.label}
          className={`flex justify-between gap-2.5 py-[5px] text-[12.5px] ${
            i < NOW.length - 1 ? "border-b border-dashed border-line" : ""
          }`}
        >
          <dt className="whitespace-nowrap font-semibold">{row.label}</dt>
          <dd className="m-0 text-right text-ink-dim">{row.value}</dd>
        </div>
      ))}
    </dl>
  </Tile>
);

export default NowTile;
