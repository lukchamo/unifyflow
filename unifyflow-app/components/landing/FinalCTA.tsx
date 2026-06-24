"use client";
import { FINAL_CTA } from "@/lib/data/content";

export default function FinalCTA({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <section id="cta" className="py-24 px-4 sm:px-6" style={{ backgroundColor: "#15201C" }}>
      <div className="mx-auto max-w-[1120px] text-center">
        <h2 className="font-[family-name:var(--font-newsreader)] text-3xl sm:text-4xl text-white mb-4">
          {FINAL_CTA.h2}
        </h2>
        <p className="text-white/60 max-w-md mx-auto mb-8 leading-relaxed">
          {FINAL_CTA.paragraph}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onOpenModal}
            className="px-8 py-3 rounded-full bg-white font-semibold text-foreground transition-colors hover:bg-white/90"
          >
            {FINAL_CTA.cta}
          </button>
          <a
            href="#"
            className="px-8 py-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors font-medium"
          >
            {FINAL_CTA.link}
          </a>
        </div>
      </div>
    </section>
  );
}
