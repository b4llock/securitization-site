import Image from "next/image";
import AnchorLink from "./AnchorLink";
import { CONTACT } from "@/lib/contact";
import icon from "../../public/brand/mundi-capital-icon.png";

export default function Footer() {
  return (
    <footer id="contato" className="bg-navy-950 text-navy-100/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Image src={icon} alt="" height={28} className="w-auto" />
            <span className="text-sm font-semibold tracking-wide text-white">
              MUNDI CAPITAL
            </span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed">
            Estruturação e securitização de recebíveis para empresas que
            precisam transformar crédito em capital de giro com segurança
            jurídica.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Contato
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="transition hover:text-white"
              >
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={`tel:${CONTACT.phoneTel}`} className="transition hover:text-white">
                {CONTACT.phoneDisplay}
              </a>
            </li>
            <li className="pt-2 leading-relaxed">
              {CONTACT.address.line1}
              <br />
              {CONTACT.address.line2}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Empresa
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <AnchorLink href="#sobre" className="transition hover:text-white">
                Sobre
              </AnchorLink>
            </li>
            <li>
              <AnchorLink href="#solucoes" className="transition hover:text-white">
                Soluções
              </AnchorLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-6 py-6 text-xs text-navy-100/60">
          © {new Date().getFullYear()} Mundi Capital. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
