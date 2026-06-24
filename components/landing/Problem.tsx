import { PROBLEM } from "@/lib/data/content";

export default function Problem() {
  return (
    <section id="problema" className="py-20 px-4 sm:px-6 bg-background">
      <div className="mx-auto max-w-[1120px]">
        <div className="text-center mb-12">
          <p
            className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--accent)" }}
          >
            {PROBLEM.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-newsreader)] text-3xl sm:text-4xl text-foreground mb-4">
            {PROBLEM.h2}
          </h2>
          <p className="text-foreground/60 max-w-xl mx-auto leading-relaxed">
            {PROBLEM.paragraph}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PROBLEM.cards.map((card) => (
            <div key={card.n} className="rounded-2xl border border-black/8 bg-white p-6">
              <p className="font-[family-name:var(--font-mono)] text-xs text-foreground/30 mb-3">
                {card.n}
              </p>
              <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
