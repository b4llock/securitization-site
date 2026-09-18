"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { useMemo } from "react";
import { lerp, mulberry32, smoothstep } from "@/lib/ease";

/* ============================================================================
   The same twenty-four marks, read three ways.

   scattered assets → a four-by-six structure → three emitted series.

   Every position is one derived motion value that eases through two morph
   phases, so the drawing transforms continuously as the section scrolls
   instead of cutting between three illustrations.
   ========================================================================== */

const COUNT = 24;

// Phase windows along the section's scroll progress.
const MORPH_1 = [0.22, 0.42] as const; // scatter → grid
const MORPH_2 = [0.56, 0.76] as const; // grid → series

const GRID_COLS = [150, 253, 356, 459];
const GRID_ROWS = [66, 134, 202, 270, 338, 406];
const SERIES_Y = [92, 226, 360];

type Layout = { ax: number; ay: number; bx: number; by: number; cx: number; cy: number };

function useLayout(): Layout[] {
  return useMemo(() => {
    const rand = mulberry32(7412);

    // Shuffled jittered grid: even coverage, unsorted appearance, and every
    // mark travels a different distance into the structured state.
    const cells = Array.from({ length: COUNT }, (_, i) => i);
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }

    return Array.from({ length: COUNT }, (_, i) => ({
      // Scattered: a real carteira, uneven and unsorted.
      ax: 44 + ((cells[i] % 6) + 0.12 + rand() * 0.76) * (466 / 6),
      ay: 44 + (Math.floor(cells[i] / 6) + 0.12 + rand() * 0.76) * (352 / 4),
      // Structured: four tranches across six maturities.
      bx: GRID_COLS[i % 4],
      by: GRID_ROWS[Math.floor(i / 4)],
      // Emitted: three series of eight, queued to leave.
      cx: 196 + (i % 8) * 40,
      cy: SERIES_Y[Math.floor(i / 8)],
    }));
  }, []);
}

function Mark({ layout, progress }: { layout: Layout; progress: MotionValue<number> }) {
  const structure = useTransform(progress, (v) => smoothstep(MORPH_1[0], MORPH_1[1], v));
  const emission = useTransform(progress, (v) => smoothstep(MORPH_2[0], MORPH_2[1], v));

  const x = useTransform(progress, (v) =>
    lerp(
      lerp(layout.ax, layout.bx, smoothstep(MORPH_1[0], MORPH_1[1], v)),
      layout.cx,
      smoothstep(MORPH_2[0], MORPH_2[1], v),
    ),
  );
  const y = useTransform(progress, (v) =>
    lerp(
      lerp(layout.ay, layout.by, smoothstep(MORPH_1[0], MORPH_1[1], v)),
      layout.cy,
      smoothstep(MORPH_2[0], MORPH_2[1], v),
    ),
  );

  // Round while scattered, square once structured: the silhouette carries the
  // idea, so the change reads without a caption. Cross-faded rather than
  // morphed, which keeps it to opacity only.
  const roundOpacity = useTransform(structure, (v) => 1 - v);
  const squareOpacity = structure;
  const groupOpacity = useTransform(progress, (v) => 0.5 + 0.5 * smoothstep(0.08, 0.46, v));
  const coolFill = useTransform(emission, (v) => (v > 0.5 ? "#b08d4f" : "#9abace"));

  return (
    <motion.g style={{ x, y, opacity: groupOpacity }}>
      <motion.circle r={6.5} style={{ opacity: roundOpacity, fill: coolFill }} />
      <motion.rect
        x={-6}
        y={-6}
        width={12}
        height={12}
        style={{ opacity: squareOpacity, fill: coolFill }}
      />
    </motion.g>
  );
}

export default function ProcessDiagram({
  progress,
  className,
}: {
  progress: MotionValue<number>;
  className?: string;
}) {
  const layout = useLayout();

  const gridOpacity = useTransform(
    progress,
    (v) => smoothstep(0.26, 0.46, v) * (1 - smoothstep(0.58, 0.74, v)),
  );
  const gridDraw = useTransform(progress, (v) => smoothstep(0.26, 0.5, v));
  const seriesDraw = useTransform(progress, (v) => smoothstep(0.6, 0.84, v));
  const seriesOpacity = useTransform(progress, (v) => smoothstep(0.58, 0.72, v));
  const scatterOpacity = useTransform(progress, (v) => 1 - smoothstep(0.18, 0.34, v));

  return (
    <svg
      viewBox="0 0 560 440"
      className={className}
      role="img"
      aria-label="Diagrama: recebíveis dispersos são organizados em tranches e emitidos como séries de títulos."
      fill="none"
    >
      {/* Scattered-state boundary: a loose, open bracket. */}
      <motion.g style={{ opacity: scatterOpacity }} stroke="#9abace" strokeWidth="1">
        <path d="M36 30 L22 30 L22 410 L36 410" strokeOpacity="0.35" />
        <path d="M524 30 L538 30 L538 410 L524 410" strokeOpacity="0.35" />
      </motion.g>

      {/* Structured state: the lattice drawn as the section locks in. */}
      <motion.g style={{ opacity: gridOpacity }} stroke="#9abace" strokeWidth="1">
        {GRID_COLS.map((x) => (
          <motion.line
            key={`c-${x}`}
            x1={x}
            y1={34}
            x2={x}
            y2={438}
            strokeOpacity="0.22"
            style={{ pathLength: gridDraw }}
          />
        ))}
        {GRID_ROWS.map((y) => (
          <motion.line
            key={`r-${y}`}
            x1={116}
            y1={y}
            x2={493}
            y2={y}
            strokeOpacity="0.13"
            style={{ pathLength: gridDraw }}
          />
        ))}
        <motion.rect
          x={116}
          y={34}
          width={377}
          height={404}
          stroke="#b08d4f"
          strokeOpacity="0.4"
          style={{ pathLength: gridDraw }}
        />
      </motion.g>

      {/* Emitted state: three series leaving to the right. */}
      <motion.g style={{ opacity: seriesOpacity }}>
        {SERIES_Y.map((y, i) => (
          <g key={`s-${y}`}>
            <motion.line
              x1={170}
              y1={y}
              x2={540}
              y2={y}
              stroke="#b08d4f"
              strokeWidth="1"
              strokeOpacity="0.42"
              style={{ pathLength: seriesDraw }}
            />
            <motion.line
              x1={170}
              y1={y + 19}
              x2={170 + [300, 240, 190][i]}
              y2={y + 19}
              stroke="#b08d4f"
              strokeWidth="6"
              strokeOpacity="0.3"
              style={{ pathLength: seriesDraw }}
            />
            <motion.path
              d={`M528 ${y - 7} L540 ${y} L528 ${y + 7}`}
              stroke="#b08d4f"
              strokeWidth="1.3"
              strokeOpacity="0.85"
              style={{ pathLength: seriesDraw }}
            />
            <motion.text
              x={170}
              y={y - 16}
              className="type-data"
              fill="#b08d4f"
              fontSize="11"
              letterSpacing="2.4"
              style={{ opacity: seriesDraw }}
            >
              {`SÉRIE ${String(i + 1).padStart(2, "0")}`}
            </motion.text>
          </g>
        ))}
      </motion.g>

      {layout.map((item, index) => (
        <Mark key={index} layout={item} progress={progress} />
      ))}
    </svg>
  );
}
