import React from "react";
import { FILTERS } from "../../config/projectTags";

const FilterChips = ({ active, onChange, counts }) => (
  <div className="flex flex-wrap items-center gap-[7px] px-4 pb-3 pt-2 sm:px-6 lg:px-[22px]">
    <span className="mr-1 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-ink-dim">
      Filter
    </span>

    {FILTERS.map((filter) => {
      const count = counts?.[filter.id] ?? 0;
      // Never offer a filter that would empty the grid.
      if (filter.id !== "all" && count === 0) return null;

      return (
        <button
          key={filter.id}
          type="button"
          onClick={() => onChange(filter.id)}
          aria-pressed={active === filter.id}
          className={`rounded-full border px-3.5 py-[7px] text-xs font-medium transition-colors ${
            active === filter.id
              ? "border-ink bg-ink text-white"
              : "border-line bg-surface text-ink-soft hover:border-primary-600 hover:text-primary-600"
          }`}
        >
          {filter.label}
          {filter.id !== "all" && (
            <span className="ml-1.5 tabular-nums opacity-60">{count}</span>
          )}
        </button>
      );
    })}
  </div>
);

export default FilterChips;
