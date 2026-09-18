"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Magnetic from "./Magnetic";
import RevealText from "./RevealText";
import { CONTACT } from "@/lib/contact";

const EASE = [0.32, 0, 0.16, 1] as const;

export default function ClosingCTA() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const echoX = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section
      ref={ref}
      aria-labelledby="cta-title"
      className="grain relative z-20 overflow-hidden border-t-2 border-brass bg-ink"
    >
      {/* An echo of the hero's exit: nine rails resolving into three streams,
          drawn again at the end so the page closes on the image it opened with. */}
      <motion.svg
        aria-hidden
        data-motion-scroll
        style={{ x: echoX }}
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
        fill="none"
      >
        {Array.from({ length: 9 }, (_, i) => {
          const y0 = 30 + i * 30;
          const y1 = [110, 150, 190][Math.floor(i / 3)];
          return (
            <motion.path
              key={i}
              d={`M0 ${y0} C 420 ${y0}, 480 ${y1}, 760 ${y1} L1200 ${y1}`}
              stroke="#b08d4f"
              strokeWidth="1"
              strokeOpacity={0.45}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 2.1, delay: i * 0.09, ease: EASE }}
            />
          );
        })}
      </motion.svg>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,var(--mc-ink)_12%,color-mix(in_oklab,var(--mc-ink)_70%,transparent)_46%,transparent_74%)]"
      />

      <div className="relative mx-auto max-w-[var(--shell)] px-[var(--gutter)] py-28 md:py-40">
        <div className="flex items-center gap-3">
          <span className="type-data text-[0.8125rem] text-brass">04</span>
          <span className="h-px w-8 bg-brass/50" />
          <span className="type-eyebrow text-navy-100/70">Próximo passo</span>
        </div>

        <h2 id="cta-title" className="type-h2 mt-8 max-w-[22ch] text-white">
          <RevealText text="Pronto para estruturar" className="block" />
          <span className="block">
            <RevealText text="sua próxima" delay={0.1} />{" "}
            <RevealText text="operação?" delay={0.24} className="text-brass-200" />
          </span>
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          data-reveal
          className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-6"
        >
          <Magnetic>
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-[3px] bg-navy-100 px-8 py-4 text-[1rem] font-medium text-ink"
            >
              <span className="absolute inset-0 -z-10 translate-y-full bg-brass transition-transform duration-[600ms] ease-[cubic-bezier(0.32,0,0.16,1)] group-hover:translate-y-0" />
              <span className="relative">Fale com nosso time</span>
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="relative h-3 w-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.16,1)] group-hover:translate-x-1"
              >
                <path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </a>
          </Magnetic>

          <a
            href={`mailto:${CONTACT.email}`}
            className="group inline-flex flex-col gap-1 text-navy-100/86 transition-colors duration-300 hover:text-white"
          >
            <span className="type-eyebrow text-navy-100/60">Ou escreva para</span>
            <span className="type-data relative text-[1rem]">
              {CONTACT.email}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brass transition-[width] duration-500 ease-[cubic-bezier(0.32,0,0.16,1)] group-hover:w-full" />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
