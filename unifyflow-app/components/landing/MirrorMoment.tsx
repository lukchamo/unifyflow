import { MIRROR } from "@/lib/data/content";

export default function MirrorMoment() {
  const parts = MIRROR.paragraph.split(MIRROR.emphasis);
  return (
    <section
      className="py-20 px-4 sm:px-6"
      style={{ backgroundColor: "var(--accent-tint)" }}
    >
      <div className="mx-auto max-w-[1120px] flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1">
          <p
            className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--accent)" }}
          >
            {MIRROR.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-newsreader)] text-3xl sm:text-4xl text-foreground mb-5">
            {MIRROR.h2}
          </h2>
          <p className="text-foreground/60 leading-relaxed mb-6">
            {parts[0]}
            <em className="text-foreground/80 not-italic font-medium">{MIRROR.emphasis}</em>
            {parts[1]}
          </p>
          <ul className="space-y-3">
            {MIRROR.checks.map((c, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span
                  className="h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center text-white text-xs mt-0.5"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  ✓
                </span>
                <span className="text-foreground/70">
                  <strong className="text-foreground font-semibold">{c.bold}</strong>
                  {c.rest}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="flex-1 rounded-2xl p-8 text-white"
          style={{ backgroundColor: "#15201C" }}
        >
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-white/50 mb-6">
            {MIRROR.card.label}
          </p>
          <p className="font-[family-name:var(--font-newsreader)] text-5xl text-white mb-1">
            {MIRROR.card.big}
          </p>
          <p className="text-white/60 text-sm mb-8 max-w-xs leading-relaxed">
            {MIRROR.card.sub}
          </p>
          <div className="space-y-4">
            {MIRROR.card.metrics.map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-t border-white/10 pt-4"
              >
                <span className="text-sm text-white/60">{m.label}</span>
                <span className="font-semibold text-white">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
