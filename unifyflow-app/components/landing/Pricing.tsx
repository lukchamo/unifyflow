import { PRICING } from "@/lib/data/content";

interface PricingProps {
  onOpenModal?: () => void;
}

export default function Pricing({ onOpenModal }: PricingProps = {}) {
  return (
    <section
      id="precio"
      className="py-20 px-4 sm:px-6"
      style={{ backgroundColor: "var(--accent-tint)" }}
    >
      <div className="mx-auto max-w-[1120px]">
        <div className="text-center mb-12">
          <p
            className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--accent)" }}
          >
            {PRICING.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-newsreader)] text-3xl sm:text-4xl text-foreground mb-3">
            {PRICING.h2}
          </h2>
          <p className="text-foreground/60 max-w-lg mx-auto">{PRICING.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
          {PRICING.plans.map((plan, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 flex flex-col gap-4 relative bg-white ${
                plan.highlight ? "border-2 shadow-lg" : "border border-black/8"
              }`}
              style={plan.highlight ? { borderColor: "var(--accent)" } : {}}
            >
              {"badge" in plan && plan.badge && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs text-white px-3 py-1 rounded-full font-medium whitespace-nowrap"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  {plan.badge}
                </span>
              )}
              <div>
                <h3 className="font-semibold text-foreground">{plan.name}</h3>
                <p className="text-xs text-foreground/50 font-[family-name:var(--font-mono)] mt-0.5">
                  {plan.tagline}
                </p>
              </div>
              <div>
                <span className="font-[family-name:var(--font-newsreader)] text-3xl text-foreground">
                  {plan.price}
                </span>
                {"priceSuffix" in plan && plan.priceSuffix && (
                  <span className="text-sm text-foreground/50 ml-1">{plan.priceSuffix}</span>
                )}
              </div>
              {"tiers" in plan && plan.tiers && (
                <ul className="space-y-1">
                  {plan.tiers.map((tier, j) => (
                    <li
                      key={j}
                      className="text-xs text-foreground/60 font-[family-name:var(--font-mono)]"
                    >
                      {tier}
                    </li>
                  ))}
                </ul>
              )}
              <ul className="space-y-2 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-foreground/70">
                    <span
                      className="h-4 w-4 flex-shrink-0 rounded-full text-white text-xs flex items-center justify-center mt-0.5"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              {"note" in plan && plan.note && (
                <p className="text-xs text-foreground/50 leading-relaxed border-t border-black/5 pt-3">
                  {plan.note}
                </p>
              )}
              <button
                className={`w-full py-3 rounded-full text-sm font-medium transition-colors ${
                  plan.highlight
                    ? "text-white"
                    : "border border-black/15 text-foreground/70 hover:border-black/25 hover:text-foreground"
                }`}
                style={plan.highlight ? { backgroundColor: "var(--accent)" } : {}}
                onClick={
                  (plan.highlight || plan.cta === "Empieza gratis") && onOpenModal
                    ? onOpenModal
                    : undefined
                }
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
