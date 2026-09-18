"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import AnchorLink from "./AnchorLink";
import Magnetic from "./Magnetic";
import icon from "../../public/brand/mundi-capital-icon.png";

const navLinks = [
  { label: "Sobre", href: "#sobre" as const, index: "01" },
  { label: "Processo", href: "#processo" as const, index: "02" },
  { label: "Soluções", href: "#solucoes" as const, index: "03" },
  { label: "Contato", href: "#contato" as const, index: "04" },
];

const EASE = [0.32, 0, 0.16, 1] as const;

export default function Header() {
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    setCondensed(value > 24);
  });

  // Scroll lock + Escape handling for the mobile overlay.
  useEffect(() => {
    if (!menuOpen) return;
    document.body.dataset.scrollLocked = "true";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      delete document.body.dataset.scrollLocked;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <motion.div
          initial={false}
          animate={{
            backgroundColor: condensed ? "rgba(6,18,26,0.9)" : "rgba(6,18,26,0)",
            borderColor: condensed ? "rgba(238,242,245,0.1)" : "rgba(238,242,245,0)",
          }}
          transition={{ duration: 0.45, ease: EASE }}
          className="border-b backdrop-blur-[14px] backdrop-saturate-150"
        >
          <motion.div
            initial={false}
            animate={{ paddingTop: condensed ? 12 : 22, paddingBottom: condensed ? 12 : 22 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mx-auto flex max-w-[var(--shell)] items-center justify-between px-[var(--gutter)]"
          >
            <Link href="/" className="group flex items-center gap-3" aria-label="Mundi Capital, início">
              <motion.span
                initial={false}
                animate={{ scale: condensed ? 0.82 : 1 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="block origin-left"
              >
                <Image src={icon} alt="" height={38} className="h-[38px] w-auto" priority />
              </motion.span>
              <span className="flex flex-col leading-none">
                <span className="type-data text-[1.0625rem] font-medium tracking-[0.2em] text-white">
                  MUNDI
                </span>
                <motion.span
                  initial={false}
                  animate={{ opacity: condensed ? 0.55 : 0.8, y: condensed ? -1 : 0 }}
                  className="type-data mt-1 text-[0.75rem] tracking-[0.34em] text-navy-100"
                >
                  CAPITAL
                </motion.span>
              </span>
            </Link>

            <nav
              className="hidden items-center md:flex"
              onMouseLeave={() => setHovered(null)}
              aria-label="Navegação principal"
            >
              {navLinks.map((link) => (
                <AnchorLink
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-[1rem] font-medium text-navy-100/86 transition-colors duration-300 hover:text-white"
                >
                  <span
                    className="relative z-10 block"
                    onMouseEnter={() => setHovered(link.href)}
                  >
                    {link.label}
                  </span>
                  {hovered === link.href ? (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-2 bottom-0 h-px bg-brass"
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  ) : null}
                </AnchorLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Magnetic className="hidden sm:block">
                <AnchorLink
                  href="#contato"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-[3px] border border-navy-100/35 px-5 py-2.5 text-[0.9375rem] font-medium text-white transition-colors duration-500 hover:border-brass"
                >
                  <span className="absolute inset-0 -z-10 translate-y-full bg-brass transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.16,1)] group-hover:translate-y-0" />
                  <span className="relative transition-colors duration-500 group-hover:text-ink">
                    Fale conosco
                  </span>
                  <span
                    aria-hidden
                    className="relative h-1 w-1 rounded-full bg-brass transition-colors duration-500 group-hover:bg-ink"
                  />
                </AnchorLink>
              </Magnetic>

              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                className="relative flex h-11 w-11 items-center justify-center md:hidden"
              >
                <span className="relative block h-[11px] w-[22px]">
                  <motion.span
                    animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="absolute inset-x-0 top-0 block h-px bg-white"
                  />
                  <motion.span
                    animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="absolute inset-x-0 bottom-0 block h-px bg-white"
                  />
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-40 bg-ink/98 backdrop-blur-xl md:hidden"
          >
            <motion.nav
              className="flex h-full flex-col justify-center px-[var(--gutter)] pb-24 pt-24"
              aria-label="Navegação principal"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
              }}
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
                  }}
                  className="border-b border-navy-100/18"
                >
                  <AnchorLink
                    href={link.href}
                    className="flex items-baseline gap-4 py-5"
                    onNavigate={() => setMenuOpen(false)}
                  >
                    <span className="type-data text-[0.8125rem] text-brass">{link.index}</span>
                    <span className="type-h3 text-white">{link.label}</span>
                  </AnchorLink>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
