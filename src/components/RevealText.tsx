"use client";

import { motion, type Variants } from "framer-motion";

const EASE = [0.32, 0, 0.16, 1] as const;

/**
 * Masked type reveal. Each unit sits in an overflow-clipped box and rises
 * into place. No blur, no character splitting, no overshoot: at this register
 * the motion should read as the type settling, not as an effect. Reserved for
 * the hero and the section headings.
 *
 * The full string stays in the accessibility tree via `aria-label` while every
 * fragment is hidden, so splitting never reaches a screen reader. `data-reveal`
 * hooks the no-JS and reduced-motion nets in globals.css.
 *
 * Wrap it in whatever tag you need: <h1 className="type-display"><RevealText …/></h1>
 */
export default function RevealText({
  text,
  className,
  split = "word",
  delay = 0,
  stagger,
  duration = 0.95,
  once = true,
  amount = 0.5,
}: {
  text: string;
  className?: string;
  split?: "word" | "char";
  delay?: number;
  stagger?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
}) {
  const step = stagger ?? (split === "char" ? 0.03 : 0.058);

  const container: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: delay, staggerChildren: step } },
  };

  const unit: Variants = {
    hidden: { y: "108%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: { duration, ease: EASE },
    },
  };

  const words = text.split(" ");

  return (
    <motion.span
      aria-label={text}
      data-reveal
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={container}
    >
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} aria-hidden className="inline-block whitespace-nowrap">
          {split === "char" ? (
            Array.from(word).map((character, charIndex) => (
              <span
                key={`${character}-${charIndex}`}
                className="inline-block overflow-hidden pb-[0.3em] -mb-[0.3em] align-bottom"
              >
                <motion.span className="inline-block will-change-transform" variants={unit}>
                  {character}
                </motion.span>
              </span>
            ))
          ) : (
            <span className="inline-block overflow-hidden pb-[0.3em] -mb-[0.3em] align-bottom">
              <motion.span className="inline-block will-change-transform" variants={unit}>
                {word}
              </motion.span>
            </span>
          )}
          {wordIndex < words.length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      ))}
    </motion.span>
  );
}
