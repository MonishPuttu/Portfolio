import React from "react";
import { motion } from "framer-motion";
import Tile, { TileLabel } from "./Tile";
import { SKILLS } from "../../config/profile";

const SkillsTile = ({ delay = 0, tileRef }) => (
  <Tile
    span="col-span-12 lg:col-span-4"
    delay={delay}
    tileRef={tileRef}
    className="gap-3"
  >
    <TileLabel>Depth</TileLabel>

    <div className="mt-3.5 flex flex-col gap-3">
      {SKILLS.map((skill, i) => (
        <div key={skill.label}>
          <div className="mb-1.5 flex justify-between gap-2 text-xs">
            <span className="font-semibold">{skill.label}</span>
            {/* Evidence, not a self-assessed percentage. */}
            <span className="whitespace-nowrap text-[11px] text-ink-dim">
              {skill.evidence}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-track">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-400"
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              viewport={{ once: true }}
              transition={{
                duration: 1,
                delay: 0.15 + i * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </Tile>
);

export default SkillsTile;
