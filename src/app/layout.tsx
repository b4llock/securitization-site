import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import "./globals.css";

// A superfamily pairing chosen for institutional register and sustained
// reading: the serif carries authority at display size, the grotesque stays
// invisible at text size. Both are variable, so the whole scale costs two files.
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mundi Capital — Securitizadora",
  description:
    "Mundi Capital é uma securitizadora especializada em estruturar operações que transformam recebíveis em soluções de crédito e investimento.",
};

export const viewport = {
  themeColor: "#0b1c28",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${sourceSans.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-navy-100">
        {/* Without JS, the scroll-reveals never fire (whileInView needs the
            IntersectionObserver + React to run) — force content visible. */}
        <noscript>
          <style>{`[data-reveal],[data-reveal] *{opacity:1 !important;transform:none !important;clip-path:none !important;filter:none !important;}[data-js-only]{display:none !important;}`}</style>
        </noscript>
        <MotionProvider>
          <ScrollProgress />
          {children}
          <WhatsAppButton />
        </MotionProvider>
      </body>
    </html>
  );
}
