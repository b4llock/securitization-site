"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { CONTACT } from "@/lib/contact";

const EASE = [0.32, 0, 0.16, 1] as const;

/**
 * Restrained version of the floating action button: a dark pill that keeps the
 * WhatsApp green as a signal rather than a slab, and unfurls its label on
 * hover. It stays out of the way until the hero has been scrolled past.
 */
export default function WhatsAppButton() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    const next = value > 420;
    setVisible((current) => (current === next ? current : next));
  });

  return (
    <motion.a
      href={CONTACT.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      initial={false}
      animate={visible ? { opacity: 1, y: 0, pointerEvents: "auto" } : { opacity: 0, y: 16, pointerEvents: "none" }}
      transition={{ duration: 0.5, ease: EASE }}
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-0 overflow-hidden rounded-[3px] border border-navy-100/22 bg-ink/85 py-3 pl-3 pr-3 backdrop-blur-md transition-colors duration-500 hover:border-[#25D366]/60"
    >
      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-ink">
        <svg viewBox="0 0 32 32" fill="currentColor" className="h-5 w-5">
          <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.29.638 4.43 1.744 6.256L4 29l7.94-1.708A11.93 11.93 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.75a9.7 9.7 0 0 1-4.947-1.352l-.355-.21-4.71 1.014 1.006-4.59-.232-.373A9.71 9.71 0 0 1 5.25 15c0-5.93 4.824-10.75 10.754-10.75S26.75 9.07 26.75 15 21.934 24.75 16.004 24.75Zm5.34-7.354c-.293-.147-1.732-.855-2-.953-.268-.098-.463-.147-.658.147-.195.293-.756.953-.927 1.148-.171.196-.342.22-.635.073-.293-.146-1.238-.456-2.358-1.454-.872-.777-1.461-1.737-1.632-2.03-.171-.293-.018-.451.128-.597.132-.131.293-.342.44-.513.146-.171.195-.293.293-.489.098-.196.049-.367-.024-.514-.073-.146-.658-1.587-.902-2.174-.238-.571-.48-.494-.658-.503l-.561-.01c-.196 0-.514.073-.783.367-.269.293-1.026 1.003-1.026 2.445s1.051 2.836 1.198 3.032c.146.196 2.07 3.162 5.017 4.434.701.303 1.248.484 1.674.62.703.224 1.343.192 1.849.117.564-.084 1.732-.708 1.976-1.391.244-.684.244-1.27.171-1.392-.073-.122-.268-.196-.561-.342Z" />
        </svg>
      </span>
      <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.32,0,0.16,1)] group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr]">
        <span className="overflow-hidden">
          <span className="type-data block whitespace-nowrap pl-3 pr-1 text-[0.875rem] tracking-[0.1em] text-white">
            Falar no WhatsApp
          </span>
        </span>
      </span>
    </motion.a>
  );
}
