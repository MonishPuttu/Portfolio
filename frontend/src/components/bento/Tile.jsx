import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

/**
 * The grid primitive. Every surface in the bento layout is a Tile — the only
 * things that vary are the column span and whether it is interactive.
 *
 * `span` is a Tailwind class string rather than a number so each caller can
 * express its own responsive behaviour without a lookup table here.
 */
const Tile = ({
  as = "div",
  span = "col-span-12 md:col-span-6",
  interactive = false,
  className,
  children,
  delay = 0,
  // Scroll anchors live on the tiles themselves — a separate anchor element
  // would claim a full grid row and break the column pairing beside it.
  tileRef,
  ...props
}) => {
  const Component = motion[as] || motion.div;

  return (
    <Component
      ref={tileRef}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(
        "tile scroll-mt-24",
        interactive && "tile-interactive",
        span,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export const TileLabel = ({ children, className }) => (
  <span className={clsx("tile-label", className)}>{children}</span>
);

export default Tile;
