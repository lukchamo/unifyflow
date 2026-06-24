"use client";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import TrustStrip from "@/components/landing/TrustStrip";
import Problem from "@/components/landing/Problem";
import HowItWorks from "@/components/landing/HowItWorks";
import Showcase from "@/components/landing/Showcase";
import MirrorMoment from "@/components/landing/MirrorMoment";
import Differentiator from "@/components/landing/Differentiator";
import Principles from "@/components/landing/Principles";
import Preview from "@/components/landing/Preview";
import Pricing from "@/components/landing/Pricing";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import QuickStartModal from "@/components/landing/QuickStartModal";
import Reveal from "@/components/landing/Reveal";

// Register plugins only in browser (not during SSR / jsdom test runs)
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => setModalOpen(true);

  // Hero entrance on load
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = heroRef.current;
      if (!container) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = container.querySelectorAll<HTMLElement>("[data-hero-enter]");
        gsap.set(targets, { opacity: 0, y: 20 });
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.1,
          clearProps: "transform",
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const targets = container.querySelectorAll<HTMLElement>("[data-hero-enter]");
        gsap.set(targets, { opacity: 1, y: 0, clearProps: "transform" });
      });
    },
    { scope: heroRef, dependencies: [] }
  );

  return (
    <>
      <Nav onOpenModal={handleOpenModal} />
      <main>
        {/* Hero — load entrance (no ScrollTrigger needed) */}
        <div ref={heroRef}>
          <Hero onOpenModal={handleOpenModal} />
        </div>

        {/* TrustStrip */}
        <Reveal>
          <TrustStrip />
        </Reveal>

        {/* Problem — header + cards reveal */}
        <Reveal>
          <Problem />
        </Reveal>

        {/* HowItWorks — header + step cards reveal */}
        <Reveal>
          <HowItWorks />
        </Reveal>

        {/* Showcase — fully animated internally */}
        <Showcase />

        {/* MirrorMoment */}
        <Reveal>
          <MirrorMoment />
        </Reveal>

        {/* Differentiator */}
        <Reveal>
          <Differentiator />
        </Reveal>

        {/* Principles */}
        <Reveal>
          <Principles />
        </Reveal>

        {/* Preview */}
        <Reveal>
          <Preview />
        </Reveal>

        {/* Pricing */}
        <Reveal>
          <Pricing onOpenModal={handleOpenModal} />
        </Reveal>

        {/* FinalCTA */}
        <Reveal>
          <FinalCTA onOpenModal={handleOpenModal} />
        </Reveal>
      </main>
      <Footer />
      <QuickStartModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
