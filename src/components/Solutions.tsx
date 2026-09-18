"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import RevealText from "./RevealText";
import SolutionMark from "./SolutionMark";

const EASE = [0.32, 0, 0.16, 1] as const;

const solutions = [
  {
    title: "Securitização de Recebíveis",
    description:
      "Estruturamos operações que convertem recebíveis em títulos negociáveis, liberando capital de giro para sua empresa.",
    detail: ["Duplicatas e contratos", "Cessão e formalização", "Liberação de caixa"],
  },
  {
    title: "CRI e CRA",
    description:
      "Emissão de Certificados de Recebíveis Imobiliários e do Agronegócio, com estrutura jurídica sólida do início ao fim.",
    detail: ["Lastro imobiliário", "Lastro do agronegócio", "Regime fiduciário"],
  },
  {
    title: "Estruturação de Operações",
    description:
      "Modelagem financeira e jurídica sob medida para cada operação, com foco em segurança e eficiência.",
    detail: ["Modelagem financeira", "Estrutura de garantias", "Documentação da operação"],
  },
] as const;

function SolutionCard({
  solution,
  index,
  dimmed,
  onHoverStart,
  onHoverEnd,
}: {
  solution: (typeof solutions)[number];
  index: number;
  dimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  // Pointer position inside the card, used for both the tilt and the wash.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spotX = useSpring(px, { stiffness: 110, damping: 30, mass: 0.7 });
  const spotY = useSpring(py, { stiffness: 110, damping: 30, mass: 0.7 });

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 110, damping: 24 });
  const rotateY = useSpring(tiltY, { stiffness: 110, damping: 24 });
  // Content sits on its own plane and counter-moves, which is what actually
  // sells the depth — no shadow involved.
  const contentX = useTransform(rotateY, (v) => v * 1.1);
  const contentY = useTransform(rotateX, (v) => v * -1.1);

  function handleMove(event: ReactPointerEvent<HTMLElement>) {
    const node = ref.current;
    if (!node || reduce || event.pointerType !== "mouse") return;
    const rect = node.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    px.set(localX);
    py.set(localY);
    tiltY.set((localX / rect.width - 0.5) * 2.4);
    tiltX.set((localY / rect.height - 0.5) * -2.4);
  }

  function handleLeave() {
    tiltX.set(0);
    tiltY.set(0);
    onHoverEnd();
  }

  return (
    <motion.article
      ref={ref}
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      animate={dimmed ? "dim" : "rest"}
      variants={{
        rest: { opacity: 1 },
        dim: { opacity: 0.55 },
        hover: { opacity: 1 },
      }}
      transition={{ duration: 0.7, ease: EASE }}
      onPointerMove={handleMove}
      onPointerEnter={onHoverStart}
      onPointerLeave={handleLeave}
      tabIndex={0}
      className="group relative isolate flex h-full flex-col overflow-hidden border border-ink/22 p-6 outline-none md:p-8"
      style={{ perspective: 900 }}
    >
      {/* Warm wash that trails the cursor. Transform only. */}
      <motion.span
        aria-hidden
        style={{ x: spotX, y: spotY }}
        variants={{ rest: { opacity: 0 }, dim: { opacity: 0 }, hover: { opacity: 1 } }}
        transition={{ duration: 0.45, ease: EASE }}
        className="pointer-events-none absolute -z-10 -ml-[230px] -mt-[230px] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--mc-brass)_15%,transparent),transparent_58%)]"
      />

      {/* The rule that draws across the top on approach. */}
      <motion.span
        aria-hidden
        variants={{ rest: { scaleX: 0 }, dim: { scaleX: 0 }, hover: { scaleX: 1 } }}
        transition={{ duration: 0.9, ease: EASE }}
        className="absolute inset-x-0 top-0 h-[3px] origin-left bg-brass-700"
      />

      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="flex flex-1 flex-col">
        <motion.div style={{ x: contentX, y: contentY }} className="flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-4">
            <span className="type-numeral text-[1.5rem] leading-none text-brass-700">
              {String(index + 1).padStart(2, "0")}
            </span>
            <motion.span
              aria-hidden
              variants={{ rest: { x: 0, opacity: 0.35 }, dim: { x: 0, opacity: 0.35 }, hover: { x: 4, opacity: 1 } }}
              transition={{ duration: 0.5, ease: EASE }}
              className="text-ink"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
                <path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </motion.span>
          </div>

          <div className="mt-8 md:mt-10">
            <SolutionMark variant={index as 0 | 1 | 2} />
          </div>

          <h3 className="type-h3 mt-7 max-w-[18ch] text-ink">{solution.title}</h3>

          <p className="mt-4 max-w-[38ch] text-[1.0625rem] leading-relaxed text-ink/75">
            {solution.description}
          </p>

          {/* Detail that unfolds on approach; always open on touch devices. */}
          <motion.ul
            variants={{
              rest: { height: 0, opacity: 0 },
              dim: { height: 0, opacity: 0 },
              hover: { height: "auto", opacity: 1 },
            }}
            transition={{ duration: 0.55, ease: EASE }}
            className="hidden overflow-hidden md:block"
          >
            <li className="h-6" aria-hidden />
            {solution.detail.map((item, itemIndex) => (
              <motion.li
                key={item}
                variants={{
                  rest: { opacity: 0, y: 8 },
                  dim: { opacity: 0, y: 8 },
                  hover: { opacity: 1, y: 0, transition: { delay: 0.08 + itemIndex * 0.06 } },
                }}
                className="flex items-center gap-3 border-b border-ink/18 py-2.5 last:border-b-0"
              >
                <span aria-hidden className="h-1 w-1 rounded-full bg-brass-700" />
                <span className="type-data text-[0.8125rem] uppercase tracking-[0.12em] text-ink/70">
                  {item}
                </span>
              </motion.li>
            ))}
          </motion.ul>

          <ul className="mt-6 md:hidden">
            {solution.detail.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 border-b border-ink/18 py-2.5 last:border-b-0"
              >
                <span aria-hidden className="h-1 w-1 rounded-full bg-brass-700" />
                <span className="type-data text-[0.8125rem] uppercase tracking-[0.12em] text-ink/70">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}

export default function Solutions() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="solucoes"
      aria-labelledby="solucoes-title"
      className="relative z-10 scroll-mt-24 border-t-2 border-brass-700 bg-bone text-ink"
    >
      {/* Connector: a hairline that starts in the dark section above and runs
          into this panel, so the plane change reads as one continuous move. */}
      <span
        aria-hidden
        className="absolute -top-24 left-[var(--gutter)] h-24 w-px bg-[linear-gradient(to_bottom,transparent,var(--mc-brass))] opacity-60"
      />

      <div className="mx-auto max-w-[var(--shell)] px-[var(--gutter)] pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="flex items-center gap-3">
          <span className="type-data text-[0.8125rem] text-brass-700">03</span>
          <span className="h-px w-8 bg-brass-700/50" />
          <h2 id="solucoes-title" className="type-eyebrow text-ink/70">
            Soluções
          </h2>
        </div>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end md:gap-16">
          <p className="type-h2 max-w-[20ch] text-ink">
            <RevealText text="Três formas de acessar" className="block" />
            <RevealText text="o mercado de capitais" delay={0.12} className="block" />
          </p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            data-reveal
            className="max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink/72"
          >
            Cada operação é desenhada do zero. O que muda é o lastro, o público
            investidor e a arquitetura de garantias.
          </motion.p>
        </div>

        <div
          className="mt-14 grid gap-6 md:mt-20 md:grid-cols-3 md:gap-5"
          onMouseLeave={() => setHovered(null)}
        >
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              className="h-full"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1, delay: index * 0.12, ease: EASE }}
              data-reveal
            >
              <SolutionCard
                solution={solution}
                index={index}
                dimmed={hovered !== null && hovered !== index}
                onHoverStart={() => setHovered(index)}
                onHoverEnd={() => setHovered(null)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
