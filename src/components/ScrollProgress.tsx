"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * A single hairline spine pinned to the left edge for the whole document.
 * It is the one element shared by every section, so the page reads as one
 * continuous surface rather than a stack of blocks. `mix-blend-difference`
 * keeps it legible as the page moves between the ink and bone planes.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.0008,
  });
  // A short segment that travels, rather than a bar that fills: the rail
  // should register as a position, not as a block of colour.
  const segmentTop = useTransform(progress, (value) => `${value * 86}%`);
  const markerTop = useTransform(progress, (value) => `calc(${value * 86 + 7}% - 3px)`);

  return (
    <div
      aria-hidden
      data-js-only
      className="pointer-events-none fixed left-5 top-28 bottom-24 z-40 hidden w-px mix-blend-difference lg:block xl:left-8"
    >
      <div className="tick-rail absolute inset-0 text-white/55" />
      <motion.div
        className="absolute inset-x-0 h-[14%] bg-white/80"
        style={{ top: segmentTop }}
      />
      <motion.div
        className="absolute -left-[3px] h-[7px] w-[7px] bg-white"
        style={{ top: markerTop }}
      />
    </div>
  );
}
