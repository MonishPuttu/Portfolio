import React, { useState } from "react";
import { ExternalLink } from "lucide-react";
import Tile, { TileLabel } from "./Tile";
import { OPEN_SOURCE_ORGS } from "../../config/profile";

const orgUrl = (handle) => `https://github.com/${handle}`;
const avatarUrl = (handle) => `https://github.com/${handle}.png?size=80`;

/**
 * GitHub serves every org's avatar at /{handle}.png, so the icons need no
 * assets in the repo. If one fails to load we fall back to the org's initial
 * rather than leaving a hole in the row.
 */
const OrgIcon = ({ org }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        aria-hidden="true"
        className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-primary-100 text-[12px] font-bold text-primary-600 dark:bg-primary-400/15 dark:text-primary-300"
      >
        {org.name.charAt(0)}
      </span>
    );
  }

  return (
    <img
      src={avatarUrl(org.handle)}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-8 w-8 flex-none rounded-lg bg-ground object-cover"
    />
  );
};

const OpenSourceTile = ({ delay = 0, tileRef }) => (
  <Tile
    span="col-span-12 md:col-span-6 lg:col-span-4"
    delay={delay}
    tileRef={tileRef}
    className="gap-0"
  >
    <TileLabel flush>Open source</TileLabel>

    <div className="mt-3.5 flex flex-col gap-1">
      {OPEN_SOURCE_ORGS.map((org) => (
        <a
          key={org.handle}
          href={orgUrl(org.handle)}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-line hover:bg-ground/60"
        >
          <OrgIcon org={org} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-semibold">{org.name}</p>
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
