import React from "react";
import Tile, { TileLabel } from "./Tile";
import { CONTRIBUTIONS } from "../../config/profile";

const W = 104;
const H = 38;

/** Builds the sparkline path from the monthly contribution trend. */
const buildPaths = (values) => {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = W / (values.length - 1);

  const points = values.map((v, i) => {
    const x = i * step;
    const y = H - ((v - min) / range) * (H - 4) - 2;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return {
    line: `M${points.join(" L")}`,
    area: `M${points.join(" L")} L${W},${H} L0,${H} Z`,
  };
};

const MetricTile = ({ delay = 0 }) => {
  const { line, area } = buildPaths(CONTRIBUTIONS.trend);

  return (
    <Tile
      span="col-span-12 md:col-span-6 lg:col-span-5"
      delay={delay}
      className="min-h-[125px] justify-between"
    >
      <TileLabel>{CONTRIBUTIONS.window}</TileLabel>

      <div className="mt-2.5 font-display text-[44px] font-extrabold leading-none tracking-[-0.04em] tabular-nums">
        {CONTRIBUTIONS.count}
      </div>
      <p className="mt-1 max-w-[24ch] text-xs leading-snug text-ink-dim">
        {CONTRIBUTIONS.caption}
      </p>

      <svg
        className="absolute bottom-[18px] right-[18px] h-[38px] w-[104px]"
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden="true"
      >
        <path d={area} fill="rgba(91,75,232,0.12)" />
        <path
          d={line}
          fill="none"
          stroke="#5B4BE8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Tile>
  );
};

export default MetricTile;
