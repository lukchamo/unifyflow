"use client";
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

export default function LandingPage() {
  const handleOpenModal = () => console.log("open modal");
  return (
    <>
      <Nav onOpenModal={handleOpenModal} />
      <main>
        <Hero onOpenModal={handleOpenModal} />
        <TrustStrip />
        <Problem />
        <HowItWorks />
        <Showcase />
        <MirrorMoment />
        <Differentiator />
        <Principles />
        <Preview />
        <Pricing />
        <FinalCTA onOpenModal={handleOpenModal} />
      </main>
      <Footer />
    </>
  );
}
