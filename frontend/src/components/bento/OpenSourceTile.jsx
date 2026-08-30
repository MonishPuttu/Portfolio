import React from "react";
import { ExternalLink } from "lucide-react";
import Tile, { TileLabel } from "./Tile";
import { OPEN_SOURCE_ORGS } from "../../config/profile";

const orgUrl = (handle) => `https://github.com/${handle.replace("@", "")}`;

const OpenSourceTile = ({ delay = 0, tileRef }) => (
  <Tile
    span="col-span-12 lg:col-span-4"
    delay={delay}
    tileRef={tileRef}
    className="gap-0"
  >
    <TileLabel>Open source</TileLabel>

    <div className="mt-3.5 flex flex-col gap-1.5">
      {OPEN_SOURCE_ORGS.map((org) => (
        <a
          key={org.handle}
          href={orgUrl(org.handle)}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-line hover:bg-ground/60"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-semibold">{org.handle}</p>
            <p className="truncate text-[11px] text-ink-dim">{org.role}</p>
          </div>
          <ExternalLink
            size={12}
            className="flex-none text-ink-dim transition-colors group-hover:text-primary-600"
          />
        </a>
      ))}
    </div>
  </Tile>
);

export default OpenSourceTile;
