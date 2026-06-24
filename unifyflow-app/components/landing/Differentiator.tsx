import { DIFFERENTIATOR } from "@/lib/data/content";

export default function Differentiator() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-background">
      <div className="mx-auto max-w-[1120px]">
        <div className="text-center mb-12">
          <p
            className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--accent)" }}
          >
            {DIFFERENTIATOR.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-newsreader)] text-3xl sm:text-4xl text-foreground">
            {DIFFERENTIATOR.h2}
          </h2>
        </div>
        <div className="rounded-2xl border border-black/8 overflow-hidden">
          {DIFFERENTIATOR.rows.map((row, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 px-6 py-5 border-b border-black/5 last:border-0"
              style={
                row.highlight
                  ? { backgroundColor: "var(--accent-tint)" }
                  : { backgroundColor: "white" }
              }
            >
              <div className="sm:w-40 flex-shrink-0">
                <span
                  className="font-semibold text-sm"
                  style={
                    row.highlight
                      ? { color: "var(--accent-dk)" }
                      : { color: "var(--fg)", opacity: 0.6 }
                  }
                >
                  {row.name}
                </span>
              </div>
              <div className="flex-1 text-sm text-foreground/60 leading-relaxed">
                {row.note}
              </div>
              <div className="sm:w-44 sm:text-right flex-shrink-0">
                <span
                  className="inline-flex text-xs px-3 py-1 rounded-full font-[family-name:var(--font-mono)]"
                  style={
                    row.highlight
                      ? { backgroundColor: "var(--accent)", color: "white" }
                      : { backgroundColor: "#0001", color: "var(--fg)", opacity: 0.6 }
                  }
                >
                  {row.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
