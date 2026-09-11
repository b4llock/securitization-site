import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import WhatsAppButton from "@/components/WhatsAppButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Mundi Capital",
  description:
    "Mundi Capital é uma securitizadora especializada em estruturar operações que transformam recebíveis em soluções de crédito e investimento.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Without JS, the scroll-reveal in Reveal.tsx never fires (whileInView
            needs the IntersectionObserver + React to run) — force content visible. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
