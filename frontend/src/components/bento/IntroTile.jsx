import React from "react";
import { ArrowDown, FileText } from "lucide-react";
import Tile, { TileLabel } from "./Tile";
import useTypewriter from "./useTypewriter";
import { PROFILE } from "../../config/profile";

const IntroTile = ({ onSeeWork }) => {
  const role = useTypewriter(PROFILE.roles);

  return (
    <Tile
      span="col-span-12 lg:col-span-7 lg:row-span-2"
      className="min-h-[262px] justify-between border-ink bg-ink text-white"
    >
      {/* Ambient orb — the only decorative element on the page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[70px] -top-[70px] h-[250px] w-[250px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, rgba(91,75,232,0.8), rgba(91,75,232,0) 68%)",
        }}
      />

      <TileLabel className="text-white/45">
        {PROFILE.name} — {PROFILE.location}
      </TileLabel>

      <h1 className="mt-[18px] font-display text-[clamp(29px,4.4vw,55px)] font-extrabold leading-[0.98] tracking-[-0.045em] text-balance">
        {PROFILE.headline.lead}{" "}
        <em className="not-italic text-spark">{PROFILE.headline.accent}</em>{" "}
        {PROFILE.headline.trail}
      </h1>

      <p
        className="mt-3.5 flex min-h-[18px] items-center gap-2 text-[12.5px] text-white/60"
        aria-live="polite"
      >
        <span className="font-medium text-white">{role}</span>
        <span
          aria-hidden="true"
          className="inline-block h-3.5 w-[2px] animate-pulse bg-spark"
        />
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSeeWork}
          className="flex items-center gap-2 rounded-full bg-spark px-[19px] py-[11px] text-[12.5px] font-semibold text-ink transition-colors hover:bg-white"
        >
          See the work
          <ArrowDown size={14} />
        </button>
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-white/20 px-[19px] py-[11px] text-[12.5px] font-semibold text-white/90 transition-colors hover:border-white"
        >
          <FileText size={14} />
          GitHub profile
        </a>
      </div>
    </Tile>
  );
};

export default IntroTile;
