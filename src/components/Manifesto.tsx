"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

const STATEMENT =
  "Somos uma securitizadora dedicada a estruturar operações seguras, transparentes e eficientes entre empresas e o mercado de capitais.";

// Words carried by the accent: the three promises the statement makes.
const ACCENT = new Set(["seguras,", "transparentes", "eficientes"]);

const pillars = [
  {
    index: "01",
    title: "Segurança jurídica",
    body: "Patrimônio separado, lastro verificado e documentação que resiste ao escrutínio de investidores e reguladores.",
  },
  {
    index: "02",
    title: "Transparência",
    body: "Cada operação é desenhada para ser lida: estrutura, fluxo e garantias explícitos do primeiro ao último passo.",
  },
  {
    index: "03",
    title: "Eficiência",
    body: "Modelagem sob medida e execução ágil, para que o capital chegue quando ainda faz diferença.",
  },
];

function Word({
  word,
  progress,
  start,
  end,
  accent,
}: {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
  accent: boolean;
}) {
  const opacity = useTransform(progress, [start, end], [0.28, 1]);
  return (
    <span data-motion-scroll className="inline-block whitespace-nowrap">
      <motion.span
        style={{ opacity }}
        className={accent ? "inline-block text-brass-200" : "inline-block"}
      >
        {word}
      </motion.span>
      <span className="inline-block">&nbsp;</span>
    </span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.82", "end 0.55"],
  });

  const words = STATEMENT.split(" ");
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="sobre"
      className="grain relative scroll-mt-24 bg-ink pt-28 pb-20 md:pt-40 md:pb-24"
      aria-labelledby="sobre-title"
    >
      <div className="mx-auto max-w-[var(--shell)] px-[var(--gutter)]">
        <div className="grid gap-12 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] md:gap-16">
          <div className="md:sticky md:top-32 md:self-start">
            <div className="flex items-center gap-3">
              <span className="type-data text-[0.8125rem] text-brass">01</span>
              <span className="h-px w-8 bg-brass/50" />
            </div>
            <h2 id="sobre-title" className="type-eyebrow mt-4 text-navy-100/78">
              Sobre a Mundi Capital
            </h2>
            {/* Rail drawn as the statement resolves — the section's own progress. */}
            <div aria-hidden data-motion-scroll className="mt-8 hidden h-40 w-px bg-navy-100/18 md:block">
              <motion.div
                style={{ scaleY: railScale }}
                className="h-full w-px origin-top bg-brass"
              />
            </div>
          </div>

          <div ref={ref}>
            <p className="type-statement max-w-[22ch] text-white sm:max-w-[24ch]">
              {words.map((word, index) => {
                const span = 1 / words.length;
                const start = index * span * 0.8;
                return (
                  <Word
                    key={`${word}-${index}`}
                    word={word}
                    progress={scrollYProgress}
                    start={start}
                    end={start + span * 3.2}
                    accent={ACCENT.has(word)}
                  />
                );
              })}
            </p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9, ease: [0.32, 0, 0.16, 1] }}
              data-reveal
              className="type-lead mt-12 max-w-[52ch] text-navy-100/75"
            >
              Estruturação e securitização de recebíveis para empresas que precisam
              transformar crédito em capital de giro com segurança jurídica.
            </motion.p>

            <ul className="mt-20 grid gap-px sm:grid-cols-3">
              {pillars.map((pillar, index) => (
                <motion.li
                  key={pillar.title}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.8, delay: index * 0.09, ease: [0.32, 0, 0.16, 1] }}
                  data-reveal
                  className="group relative border-t border-navy-100/20 pt-6 sm:pr-8"
                >
                  <span className="absolute left-0 top-0 h-px w-0 bg-brass transition-[width] duration-[800ms] ease-[cubic-bezier(0.32,0,0.16,1)] group-hover:w-full" />
                  <span className="type-data text-[0.8125rem] text-brass">{pillar.index}</span>
                  <h3 className="type-h3 mt-3 text-white">{pillar.title}</h3>
                  <p className="mt-3 text-[1rem] leading-relaxed text-navy-100/70">
                    {pillar.body}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
