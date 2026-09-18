"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Shared easing for the whole tree.
 *
 * Reduced motion is deliberately NOT handled here. `reducedMotion="user"`
 * strips transforms on the client only, which the server cannot predict, so
 * every scroll-linked element hydrates with a different `transform` than it
 * was rendered with. Instead globals.css neutralises `[data-reveal]` and
 * `[data-motion-scroll]` under `prefers-reduced-motion`, which both sides
 * agree on and which wins over inline styles through `!important`.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig transition={{ duration: 0.85, ease: [0.32, 0, 0.16, 1] }}>
      {children}
    </MotionConfig>
  );
}
