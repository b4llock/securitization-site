"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import AnchorLink from "./AnchorLink";
import Magnetic from "./Magnetic";
import RevealText from "./RevealText";

// Code-split: the field is ~12kb of canvas logic that no server render needs.
const HeroField = dynamic(() => import("./HeroField"), { ssr: false });

const EASE = [0.32, 0, 0.16, 1] as const;

const stages = [
  {
    index: "01",
    label: "Recebíveis",
    note: "Carteiras dispersas, prazos longos, caixa preso no futuro.",
  },
  {
    index: "02",
    label: "Estruturação",
    note: "Lastro, garantias e patrimônio separado em uma arquitetura própria.",
  },
  {
    index: "03",
    label: "Capital",
    note: "Títulos negociáveis que devolvem liquidez ao presente.",
  },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Three planes moving at three speeds: field slowest, content fastest.
  const fieldY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const fieldScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const fieldOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const stripY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section
      ref={sectionRef}
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink"
    >
      {/* Plane 1 — the field itself */}
      <motion.div
        aria-hidden
        data-motion-scroll
        style={{ y: fieldY, scale: fieldScale, opacity: fieldOpacity }}
        className="absolute inset-0 z-0"
      >
        <HeroField className="absolute inset-0 h-full w-full" />
      </motion.div>

      {/* Plane 2 — legibility scrims. Directional, so the field stays visible
          on the right where the composition resolves into capital. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(98deg,var(--mc-ink)_6%,color-mix(in_oklab,var(--mc-ink)_74%,transparent)_32%,transparent_58%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-64 bg-[linear-gradient(to_top,var(--mc-ink),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--mc-ink)_78%,transparent),transparent)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-ink/35 lg:hidden" />

      {/* Plane 3 — content */}
      <motion.div
        data-motion-scroll
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-[var(--shell)] flex-1 flex-col justify-center px-[var(--gutter)] pt-24 pb-10 md:pt-32 lg:max-w-[calc(var(--shell)+0px)]"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="mb-6 flex items-center gap-3"
          data-reveal
        >
          <span className="h-px w-10 bg-brass" />
          <span className="type-eyebrow text-brass">Securitizadora</span>
          <span aria-hidden className="type-eyebrow hidden text-navy-100/60 sm:inline">
            Jaraguá do Sul / SC
          </span>
        </motion.div>

        <h1 className="type-display max-w-[13ch] text-white lg:max-w-[15ch]">
          <RevealText text="Transformamos recebíveis" delay={0.18} className="block" />
          <span className="block">
            <RevealText text="em" delay={0.36} />{" "}
            <RevealText text="capital" delay={0.46} className="text-brass-200" />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.95, ease: EASE }}
          data-reveal
          className="mt-7 flex items-center gap-4"
        >
          <span aria-hidden className="hidden h-px w-12 bg-brass sm:block" />
          <span className="type-eyebrow text-navy-100/78">com segurança e eficiência</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.08, ease: EASE }}
          data-reveal
          className="type-lead mt-8 max-w-[42ch] text-navy-100/86 lg:max-w-[38ch]"
        >
          A Mundi Capital estrutura operações de securitização que dão às empresas
          acesso a crédito com solidez jurídica e agilidade.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.22, ease: EASE }}
          data-reveal
          className="mt-11 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <AnchorLink
              href="#solucoes"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-[3px] bg-navy-100 px-7 py-4 text-[1rem] font-medium text-ink"
            >
              <span className="absolute inset-0 -z-10 translate-y-full bg-brass transition-transform duration-[600ms] ease-[cubic-bezier(0.32,0,0.16,1)] group-hover:translate-y-0" />
              <span className="relative">Conheça nossas soluções</span>
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="relative h-3 w-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.16,1)] group-hover:translate-x-1"
              >
                <path
                  d="M1 8h13M9 3l5 5-5 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            </AnchorLink>
          </Magnetic>

          <Magnetic>
            <AnchorLink
              href="#contato"
              className="group relative inline-flex items-center gap-3 rounded-[3px] border border-navy-100/35 px-7 py-4 text-[1rem] font-medium text-navy-100 transition-colors duration-500 hover:border-navy-100/60 hover:text-white"
            >
              Fale conosco
            </AnchorLink>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Plane 4 — the legend, set as ruled cells so the hero closes on a
          piece of structure rather than on three floating captions. It names
          the three zones of the composition drawn behind it. */}
      <motion.div
        data-motion-scroll
        style={{ y: stripY }}
        className="relative z-10 mx-auto w-full max-w-[var(--shell)] px-[var(--gutter)] pb-8"
      >
        <div className="grid border-y border-navy-100/20 sm:grid-cols-3">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 1.4 + index * 0.12, ease: EASE }}
              data-reveal
              className="group relative border-navy-100/20 py-3.5 [&:not(:first-child)]:border-t sm:py-5 sm:pr-8 sm:[&:not(:first-child)]:border-t-0 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:pl-6"
            >
              <div className="flex items-baseline gap-3 sm:flex-col sm:gap-1.5 md:flex-row md:gap-3">
                <span className="type-data text-[0.8125rem] text-brass-200">{stage.index}</span>
                <span className="type-eyebrow text-[0.8125rem] text-white">
                  {stage.label}
                </span>
              </div>
              <p className="mt-2.5 hidden max-w-[34ch] text-[0.9375rem] leading-relaxed text-navy-100/70 sm:block">
                {stage.note}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="type-eyebrow text-navy-100/60">Role para explorar</span>
          <div aria-hidden className="relative h-10 w-px overflow-hidden bg-navy-100/20">
            <span
              data-motion-loop
              className="absolute inset-x-0 top-0 block h-4 bg-brass"
              style={{ animation: "mc-scroll-hint 3.4s cubic-bezier(0.4,0,0.2,1) infinite" }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
