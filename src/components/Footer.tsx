import Image from "next/image";
import AnchorLink from "./AnchorLink";
import { CONTACT } from "@/lib/contact";
import icon from "../../public/brand/mundi-capital-icon.png";

const columns = [
  {
    title: "Contato",
    items: [
      { label: CONTACT.email, href: `mailto:${CONTACT.email}` },
      { label: CONTACT.phoneDisplay, href: `tel:${CONTACT.phoneTel}` },
      { label: "WhatsApp", href: CONTACT.whatsappUrl, external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      id="contato"
      className="grain relative scroll-mt-24 overflow-hidden bg-ink text-navy-100/86"
    >
      <div className="mx-auto max-w-[var(--shell)] px-[var(--gutter)] pt-14 pb-10">
        <div className="grid gap-12 border-t border-navy-100/20 pt-12 md:grid-cols-4 md:gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <Image src={icon} alt="" height={32} className="h-8 w-auto" />
              <span className="type-data text-[0.75rem] tracking-[0.28em] text-white">
                MUNDI CAPITAL
              </span>
            </div>
            <address className="mt-8 not-italic text-[1rem] leading-relaxed text-navy-100/75">
              {CONTACT.address.line1}
              <br />
              {CONTACT.address.line2}
            </address>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="type-eyebrow text-navy-100/60">{column.title}</h2>
              <ul className="mt-5 space-y-3">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      {...("external" in item && item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group relative inline-block text-[1rem] text-navy-100/78 transition-colors duration-300 hover:text-white"
                    >
                      {item.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-brass transition-[width] duration-500 ease-[cubic-bezier(0.32,0,0.16,1)] group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="type-eyebrow text-navy-100/60">Empresa</h2>
            <ul className="mt-5 space-y-3">
              {[
                { label: "Sobre", href: "#sobre" as const },
                { label: "Processo", href: "#processo" as const },
                { label: "Soluções", href: "#solucoes" as const },
              ].map((link) => (
                <li key={link.href}>
                  <AnchorLink
                    href={link.href}
                    className="group relative inline-block text-[1rem] text-navy-100/78 transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-brass transition-[width] duration-500 ease-[cubic-bezier(0.32,0,0.16,1)] group-hover:w-full" />
                  </AnchorLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Closing mark, set as live type so it stays sharp at display size. */}
        <div aria-hidden className="mt-20 select-none overflow-hidden md:mt-28">
          <span className="type-data block whitespace-nowrap text-[clamp(1.9rem,11.3vw,10.2rem)] leading-[0.9] tracking-[-0.02em] text-navy-100/[0.09]">
            MUNDI CAPITAL
          </span>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-navy-100/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-data text-[0.8125rem] text-navy-100/60">
            © {new Date().getFullYear()} Mundi Capital. Todos os direitos reservados.
          </p>
          <p className="type-data text-[0.8125rem] text-navy-100/55">
            Recebíveis · Estruturação · Capital
          </p>
        </div>
      </div>
    </footer>
  );
}
