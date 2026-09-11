import Image from "next/image";
import Link from "next/link";
import AnchorLink from "./AnchorLink";
import icon from "../../public/brand/mundi-capital-icon.png";

const navLinks = [
  { label: "Sobre", href: "#sobre" },
  { label: "Soluções", href: "#solucoes" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="border-b border-white/10 bg-navy-900/70 backdrop-blur-md supports-[backdrop-filter]:bg-navy-900/55">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image src={icon} alt="" height={36} className="w-auto" priority />
            <span className="text-lg font-semibold tracking-wide text-white">
              MUNDI CAPITAL
            </span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <AnchorLink
                key={link.href}
                href={link.href as `#${string}`}
                className="group relative px-4 py-2 text-sm font-medium text-navy-100/90 transition hover:text-white"
              >
                {link.label}
                <span className="pointer-events-none absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </AnchorLink>
            ))}
          </nav>

          <AnchorLink
            href="#contato"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-navy-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Fale conosco
          </AnchorLink>
        </div>
      </div>
    </header>
  );
}
