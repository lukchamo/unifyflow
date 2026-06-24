"use client";
import { HERO } from "@/lib/data/content";
import HeroMap from "./HeroMap";

export default function Hero({ onOpenModal }: { onOpenModal: () => void }) {
  const parts = HERO.paragraph.split(HERO.emphasis);
  return (
    <section className="pt-20 pb-16 px-4 sm:px-6">
      <div className="mx-auto max-w-[1120px] flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 flex flex-col gap-6">
          <span
            className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-[family-name:var(--font-mono)] uppercase tracking-wider"
            style={{
              backgroundColor: "var(--accent-tint)",
              color: "var(--accent-dk)",
            }}
          >
            {HERO.badge}
          </span>
          <h1 className="font-[family-name:var(--font-newsreader)] text-4xl sm:text-5xl lg:text-[54px] leading-tight text-foreground">
            {HERO.h1}
          </h1>
          <p className="text-lg text-foreground/70 leading-relaxed max-w-lg">
            {parts[0]}
            <em>{HERO.emphasis}</em>
            {parts[1]}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenModal}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-white font-medium transition-colors"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {HERO.ctaPrimary}
            </button>
            <a
              href="#como"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-black/15 text-foreground/70 hover:text-foreground hover:border-black/25 transition-colors font-medium"
            >
              {HERO.ctaSecondary}
            </a>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
            {HERO.trust.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i === 0 && (
                  <span className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                )}
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-1 flex justify-center lg:justify-end">
          <HeroMap />
        </div>
      </div>
    </section>
  );
}
