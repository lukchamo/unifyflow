import { HOW } from "@/lib/data/content";

export default function HowItWorks() {
  return (
    <section
      id="como"
      className="py-20 px-4 sm:px-6"
      style={{ backgroundColor: "var(--accent-tint)" }}
    >
      <div className="mx-auto max-w-[1120px]">
        <div className="text-center mb-12">
          <p
            className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--accent)" }}
          >
            {HOW.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-newsreader)] text-3xl sm:text-4xl text-foreground mb-3">
            {HOW.h2}
          </h2>
          <p className="text-foreground/60 max-w-lg mx-auto">{HOW.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW.steps.map((step) => (
            <div key={step.n} className="rounded-2xl bg-white border border-black/8 p-6">
              <div
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold mb-4"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {step.n}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
