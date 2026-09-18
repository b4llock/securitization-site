"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";
import ProcessDiagram from "./ProcessDiagram";

const EASE = [0.32, 0, 0.16, 1] as const;

const steps = [
  {
    index: "01",
    kicker: "Originação",
    title: "Recebíveis",
    body: "Mapeamos a carteira: contratos, duplicatas e fluxos futuros são analisados quanto a concentração, inadimplência e prazo. O que estava disperso passa a ser mensurável.",
    legend: "carteira analisada",
  },
  {
    index: "02",
    kicker: "Estruturação",
    title: "Arquitetura",
    body: "A operação ganha forma jurídica e financeira: patrimônio separado, definição de lastro, garantias, subordinação e tranches por vencimento. É aqui que o risco é organizado.",
    legend: "tranches definidas",
  },
  {
    index: "03",
    kicker: "Emissão",
    title: "Capital",
    body: "As séries são emitidas e distribuídas ao mercado. O recebível de amanhã vira caixa hoje, com a segurança jurídica que investidores e reguladores exigem.",
    legend: "séries emitidas",
  },
];

/** Writes a scroll-derived readout straight to the DOM, so tracking the
 *  scroll position never triggers a React render. */
function Readout({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  useMotionValueEvent(progress, "change", (value) => {
    const node = ref.current;
    if (node) node.textContent = `${Math.round(Math.min(1, Math.max(0, value)) * 100)}`.padStart(3, "0");
  });
  return (
    <span className="type-data text-[0.8125rem] text-navy-100/65">
      <span ref={ref}>000</span>
      <span aria-hidden>%</span>
    </span>
  );
}

function StaticDiagram({ at, className }: { at: number; className?: string }) {
  const value = useMotionValue(at);
  return <ProcessDiagram progress={value} className={className} />;
}

export default function Process() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = value < 0.32 ? 0 : value < 0.66 ? 1 : 2;
    setActive((current) => (current === next ? current : next));
  });

  const railScale = useTransform(scrollYProgress, [0.04, 0.96], [0, 1]);
  const diagramY = useTransform(scrollYProgress, [0, 1], [28, -28]);
  const step = steps[active];

  return (
    <section
      id="processo"
      className="grain relative scroll-mt-24 bg-ink"
      aria-labelledby="processo-title"
    >
      <span
        aria-hidden
        className="absolute left-[var(--gutter)] top-0 hidden h-32 w-px bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--mc-brass)_60%,transparent),transparent)] lg:block"
      />
      {/* Mobile: a plain stack. Sticky scroll narratives are a desktop
          affordance; on a phone the same three states read better as cards. */}
      <div className="mx-auto max-w-[var(--shell)] px-[var(--gutter)] py-24 lg:hidden">
        <div className="flex items-center gap-3">
          <span className="type-data text-[0.8125rem] text-brass">02</span>
          <span className="h-px w-8 bg-brass/50" />
        </div>
        <h2 id="processo-title-mobile" className="type-eyebrow mt-4 text-navy-100/78">
          Como estruturamos
        </h2>
        <ul className="mt-12 space-y-16">
          {steps.map((item, index) => (
            <motion.li
              key={item.index}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: EASE }}
              data-reveal
            >
              <StaticDiagram at={[0.12, 0.5, 0.92][index]} className="mb-6 w-full" />
              <div className="flex items-baseline gap-3">
                <span className="type-data text-[0.8125rem] text-brass">{item.index}</span>
                <span className="type-eyebrow text-navy-100/70">{item.kicker}</span>
              </div>
              <h3 className="type-h2 mt-3 text-white">{item.title}</h3>
              <p className="mt-4 text-[1.0625rem] leading-relaxed text-navy-100/75">{item.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Desktop: the section is a 320vh track; the viewport inside is pinned
          and everything within it is driven by that track's progress. */}
      <div ref={sectionRef} className="relative hidden h-[320vh] lg:block">
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <div className="mx-auto w-full max-w-[var(--shell)] px-[var(--gutter)]">
            <div className="flex items-end justify-between border-b border-navy-100/20 pb-5">
              <div className="flex items-center gap-3">
                <span className="type-data text-[0.8125rem] text-brass">02</span>
                <span className="h-px w-8 bg-brass/50" />
                <h2 id="processo-title" className="type-eyebrow text-navy-100/78">
                  Como estruturamos
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="type-data text-[0.8125rem] text-navy-100/65">{step.legend}</span>
                <Readout progress={scrollYProgress} />
              </div>
            </div>

            {/* Progress rail shared by the three steps. */}
            <div className="relative mt-px h-px w-full bg-navy-100/20">
              <motion.div
                style={{ scaleX: railScale }}
                className="absolute inset-0 origin-left bg-brass"
              />
              <div className="absolute inset-x-0 -top-1 flex justify-between">
                {steps.map((item, index) => (
                  <span
                    key={item.index}
                    className={`block h-[3px] w-[3px] rounded-[3px] transition-colors duration-500 ${
                      index <= active ? "bg-brass" : "bg-navy-100/35"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-14 grid grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-center gap-16">
              <div className="relative">
                <div className="min-h-[19rem]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step.index}
                      initial={{ opacity: 0, x: 26 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -26 }}
                      transition={{ duration: 0.8, ease: EASE }}
                    >
                      <div className="flex items-center gap-4">
                        <span className="type-numeral text-[4rem] leading-none text-brass-200">
                          {step.index}
                        </span>
                        <span className="type-eyebrow text-navy-100/70">{step.kicker}</span>
                      </div>
                      <h3 className="type-h2 mt-6 text-white">{step.title}</h3>
                      <p className="type-lead mt-6 max-w-[46ch] text-navy-100/75">{step.body}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <ol className="mt-10 flex flex-col gap-px border-t border-navy-100/20">
                  {steps.map((item, index) => (
                    <li
                      key={item.index}
                      aria-current={index === active ? "step" : undefined}
                      className="flex items-center gap-4 border-b border-navy-100/20 py-3"
                    >
                      <span
                        className={`type-data text-[0.8125rem] transition-colors duration-500 ${
                          index === active ? "text-brass" : "text-navy-100/55"
                        }`}
                      >
                        {item.index}
                      </span>
                      <span className="relative h-px flex-1 bg-navy-100/18">
                        <span
                          className={`absolute inset-y-0 left-0 bg-brass transition-[width] duration-[700ms] ease-[cubic-bezier(0.32,0,0.16,1)] ${
                            index < active ? "w-full" : index === active ? "w-1/3" : "w-0"
                          }`}
                        />
                      </span>
                      <span
                        className={`type-data text-[0.8125rem] uppercase tracking-[0.16em] transition-colors duration-500 ${
                          index === active ? "text-white" : "text-navy-100/55"
                        }`}
                      >
                        {item.kicker}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <motion.div data-motion-scroll style={{ y: diagramY }} className="relative">
                <ProcessDiagram
                  progress={scrollYProgress}
                  className="w-full"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
