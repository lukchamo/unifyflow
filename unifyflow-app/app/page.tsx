"use client";
import { useState } from "react";
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

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => setModalOpen(true);

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
        <Pricing onOpenModal={handleOpenModal} />
        <FinalCTA onOpenModal={handleOpenModal} />
      </main>
      <Footer />
      <QuickStartModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
