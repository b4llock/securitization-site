"use client";

import { motion, type Variants } from "framer-motion";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
};

// Applied to a <g>, so opacity only — pathLength needs a geometry element.
const draw: Variants = {
  rest: { opacity: 0.75 },
  hover: { opacity: 1 },
};

/**
 * Three line-art marks, one per solution. Each animates a single idea on
 * hover: convergence, nesting, and alignment. Driven by the parent card's
 * `rest`/`hover` variants, so no extra listeners.
 */
export default function SolutionMark({ variant }: { variant: 0 | 1 | 2 }) {
  if (variant === 0) {
    // Many marks resolving into one line.
    return (
      <svg viewBox="0 0 72 56" className="h-14 w-[72px] text-ink" aria-hidden>
        <motion.g variants={draw} {...stroke}>
          <motion.line
            x1="4"
            y1="28"
            x2="68"
            y2="28"
            variants={{ rest: { pathLength: 0.35 }, hover: { pathLength: 1 } }}
            transition={{ duration: 0.7, ease: [0.32, 0, 0.16, 1] }}
          />
        </motion.g>
        {[
          [8, 8],
          [20, 46],
          [26, 14],
          [38, 42],
          [14, 34],
          [44, 10],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={i}
            r="2"
            fill="currentColor"
            className="text-ink"
            variants={{
              rest: { cx, cy, opacity: 0.45 },
              hover: { cx: 30 + i * 7, cy: 28, opacity: 1 },
            }}
            transition={{ duration: 0.75, delay: i * 0.035, ease: [0.32, 0, 0.16, 1] }}
          />
        ))}
      </svg>
    );
  }

  if (variant === 1) {
    // Two instruments nesting inside one structure.
    return (
      <svg viewBox="0 0 72 56" className="h-14 w-[72px] text-ink" aria-hidden>
        <motion.rect
          x="6"
          y="10"
          width="40"
          height="36"
          {...stroke}
          variants={{ rest: { x: 6, opacity: 0.5 }, hover: { x: 2, opacity: 1 } }}
          transition={{ duration: 0.6, ease: [0.32, 0, 0.16, 1] }}
        />
        <motion.rect
          x="20"
          y="10"
          width="40"
          height="36"
          {...stroke}
          variants={{ rest: { x: 20, opacity: 0.5 }, hover: { x: 30, opacity: 1 } }}
          transition={{ duration: 0.6, ease: [0.32, 0, 0.16, 1] }}
        />
        <motion.line
          x1="36"
          y1="2"
          x2="36"
          y2="54"
          {...stroke}
          className="text-brass-700"
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.5 }}
        />
      </svg>
    );
  }

  // A structure being squared up.
  return (
    <svg viewBox="0 0 72 56" className="h-14 w-[72px] text-ink" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <motion.line
          key={i}
          x1="6"
          y1={12 + i * 11}
          x2="66"
          y2={12 + i * 11}
          {...stroke}
          variants={{
            rest: { pathLength: [0.5, 0.8, 0.35, 0.65][i], opacity: 0.45 },
            hover: { pathLength: 1, opacity: 1 },
          }}
          transition={{ duration: 0.7, delay: i * 0.06, ease: [0.32, 0, 0.16, 1] }}
        />
      ))}
      <motion.line
        x1="6"
        y1="4"
        x2="6"
        y2="52"
        {...stroke}
        className="text-brass-700"
        variants={{ rest: { opacity: 0.3 }, hover: { opacity: 1 } }}
      />
    </svg>
  );
}
