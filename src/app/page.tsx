import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Process from "@/components/Process";
import Solutions from "@/components/Solutions";
import ClosingCTA from "@/components/ClosingCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      {/* The page is written as one continuous surface: ink carries the hero,
          the manifesto and the process; the bone panel lifts over it for the
          solutions; ink returns for the close. Each boundary overlaps rather
          than abuts, so no section reads as a separate block. */}
      <main className="flex-1">
        <Hero />
        <Manifesto />
        <Process />
        <Solutions />
        <ClosingCTA />
      </main>

      <Footer />
    </>
  );
}
