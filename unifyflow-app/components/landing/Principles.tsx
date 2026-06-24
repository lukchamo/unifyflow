import { PRINCIPLES } from "@/lib/data/content";

export default function Principles() {
  return (
    <section
      className="py-20 px-4 sm:px-6"
      style={{ backgroundColor: "var(--accent-tint)" }}
    >
      <div className="mx-auto max-w-[1120px]">
        <div className="text-center mb-12">
          <p
            className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--accent)" }}
          >
            {PRINCIPLES.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-newsreader)] text-3xl sm:text-4xl text-foreground">
            {PRINCIPLES.h2}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PRINCIPLES.cards.map((card, i) => (
            <div key={i} className="rounded-2xl bg-white border border-black/8 p-6">
              <div
                className="h-8 w-8 rounded-full mb-4 flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {i + 1}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
