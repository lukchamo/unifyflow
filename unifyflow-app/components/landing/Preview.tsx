import { PREVIEW } from "@/lib/data/content";

export default function Preview() {
  const { panel } = PREVIEW;
  return (
    <section className="py-20 px-4 sm:px-6 bg-background">
      <div className="mx-auto max-w-[1120px]">
        <div className="text-center mb-12">
          <p
            className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--accent)" }}
          >
            {PREVIEW.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-newsreader)] text-3xl sm:text-4xl text-foreground mb-4">
            {PREVIEW.h2}
          </h2>
          <p className="text-foreground/60 max-w-xl mx-auto leading-relaxed">
            {PREVIEW.paragraph}
          </p>
        </div>

        <div className="rounded-2xl border border-black/8 bg-white shadow-sm overflow-hidden max-w-xl mx-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
            <span className="text-sm font-medium text-foreground">{panel.label}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs font-[family-name:var(--font-mono)] text-foreground/60">
                {panel.count}
              </span>
              <span
                className="font-[family-name:var(--font-newsreader)] text-lg font-medium"
                style={{ color: "var(--accent)" }}
              >
                {panel.hours}
              </span>
              <span className="text-xs text-foreground/40">{panel.hoursSub}</span>
            </div>
          </div>

          <div className="px-6 py-5 border-b border-black/5">
            <div className="flex items-start gap-4">
              <span
                className="font-[family-name:var(--font-mono)] text-2xl font-bold"
                style={{ color: "var(--accent)" }}
              >
                {panel.unlocked.rank}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">
                  {panel.unlocked.title}
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-foreground/60">{panel.unlocked.hours}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    {panel.unlocked.pill}
                  </span>
                </div>
                <p className="text-sm text-foreground/60 leading-relaxed italic">
                  &ldquo;{panel.unlocked.quote}&rdquo;
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 relative">
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3 p-6">
              <span className="text-2xl">🔒</span>
              <p className="font-semibold text-foreground text-sm">{panel.lockedLabel}</p>
              <p className="text-xs text-foreground/60 text-center max-w-xs">
                {panel.lockedText}
              </p>
              <a
                href="#precio"
                className="mt-2 px-5 py-2 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {panel.lockedCta}
              </a>
            </div>
            <div className="opacity-20 space-y-3 py-4">
              <div className="h-4 bg-foreground/20 rounded w-3/4" />
              <div className="h-4 bg-foreground/20 rounded w-1/2" />
              <div className="h-4 bg-foreground/20 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
