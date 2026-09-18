"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

/**
 * Magnetic pull, deliberately understated. A strong pull reads as a portfolio
 * site; at this strength the control simply feels responsive under the hand.
 * Disabled for coarse pointers and reduced motion.
 */
export default function Magnetic({
  children,
  className,
  strength = 0.11,
  innerStrength = 0.045,
  as: Wrapper = "div",
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  innerStrength?: number;
  as?: "div" | "span";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 170, damping: 26, mass: 0.7 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const innerX = useTransform(sx, (v) => v * (innerStrength / strength) * -1);
  const innerY = useTransform(sy, (v) => v * (innerStrength / strength) * -1);

  function handleMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse") return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  const MotionWrapper = Wrapper === "span" ? motion.span : motion.div;

  return (
    <MotionWrapper
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: Wrapper === "span" ? "inline-block" : undefined }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <motion.span className="block" style={{ x: innerX, y: innerY }}>
        {children}
      </motion.span>
    </MotionWrapper>
  );
}
