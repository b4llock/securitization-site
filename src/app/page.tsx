import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import AnchorLink from "@/components/AnchorLink";
import { CONTACT } from "@/lib/contact";
import worldNetwork from "../../public/images/world-network.png";

const solutions = [
  {
    title: "Securitização de Recebíveis",
    description:
      "Estruturamos operações que convertem recebíveis em títulos negociáveis, liberando capital de giro para sua empresa.",
  },
  {
    title: "CRI e CRA",
    description:
      "Emissão de Certificados de Recebíveis Imobiliários e do Agronegócio, com estrutura jurídica sólida do início ao fim.",
  },
  {
    title: "Estruturação de Operações",
    description:
      "Modelagem financeira e jurídica sob medida para cada operação, com foco em segurança e eficiência.",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-navy-900 text-white">
          <Image
            src={worldNetwork}
            alt=""
            aria-hidden
            fill
            priority
            className="pointer-events-none object-cover opacity-35 mix-blend-screen"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-navy-700/50 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/70 to-navy-900/40"
          />

          <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-36">
            <Reveal>
              <h1 className="max-w-2xl font-[family-name:var(--font-display)] text-5xl font-medium leading-[1.1] md:text-6xl">
                Transformamos recebíveis em{" "}
                <span className="italic text-navy-100">capital</span> com
                segurança e eficiência
              </h1>
              <p className="mt-6 max-w-xl text-lg text-navy-100/80">
                A Mundi Capital estrutura operações de securitização que dão às
                empresas acesso a crédito com solidez jurídica e agilidade.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <AnchorLink
                  href="#solucoes"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy-900 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
                >
                  Conheça nossas soluções
                </AnchorLink>
                <AnchorLink
                  href="#contato"
                  className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/5"
                >
                  Fale conosco
                </AnchorLink>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="sobre" className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <Reveal>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-700">
                Sobre a Mundi Capital
              </h2>
              <p className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-2xl leading-snug text-navy-900 md:text-3xl">
                Somos uma securitizadora dedicada a estruturar operações
                seguras, transparentes e eficientes entre empresas e o
                mercado de capitais.
              </p>
            </Reveal>
          </div>
        </section>

        <section id="solucoes" className="bg-navy-100">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <Reveal>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-700">
                Soluções
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {solutions.map((solution, index) => (
                <Reveal key={solution.title} delay={index * 0.1}>
                  <div className="group h-full rounded-2xl bg-white p-8 shadow-sm ring-1 ring-navy-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10">
                    <div className="h-1 w-10 rounded-full bg-navy-800 transition-all duration-300 group-hover:w-16" />
                    <h3 className="mt-6 text-lg font-semibold text-navy-900">
                      {solution.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-navy-900/70">
                      {solution.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-navy-900 text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-navy-700/40 blur-3xl"
          />
          <div className="relative mx-auto max-w-6xl px-6 py-16 text-center">
            <Reveal>
              <h2 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
                Pronto para estruturar sua próxima operação?
              </h2>
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy-900 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
              >
                Fale com nosso time
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
