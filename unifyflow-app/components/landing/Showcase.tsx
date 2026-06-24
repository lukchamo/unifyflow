import { SHOWCASE } from "@/lib/data/content";
import { AREA_COLORS } from "@/lib/data/mockData";

function getAreaColor(area: string): string {
  return (AREA_COLORS as Record<string, string>)[area] ?? "#A8773C";
}

export default function Showcase() {
  const { row1, row2, row3 } = SHOWCASE;
  return (
    <section className="py-20 px-4 sm:px-6 bg-background">
      <div className="mx-auto max-w-[1120px]">
        <div className="text-center mb-16">
          <p
            className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--accent)" }}
          >
            {SHOWCASE.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-newsreader)] text-3xl sm:text-4xl text-foreground">
            {SHOWCASE.h2}
          </h2>
        </div>

        {/* Row 1: Chat card + text */}
        <div className="flex flex-col lg:flex-row gap-10 items-center mb-20">
          <div className="flex-1 rounded-2xl border border-black/8 bg-white p-5 shadow-sm max-w-sm w-full">
            <div className="flex justify-between mb-4 text-xs text-foreground/40 font-[family-name:var(--font-mono)]">
              <span>{row1.label}</span>
              <span>{row1.stepper}</span>
            </div>
            <div className="flex flex-col gap-3">
              {row1.bubbles.map((b, i) => (
                <div
                  key={i}
                  className={`flex ${b.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <p
                    className={`text-sm px-4 py-2 rounded-2xl max-w-[80%] leading-relaxed ${
                      b.from === "ia" ? "bg-foreground/5 text-foreground" : "text-white"
                    }`}
                    style={b.from === "user" ? { backgroundColor: "var(--accent)" } : {}}
                  >
                    {b.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 max-w-lg">
            <p
              className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest mb-3"
              style={{ color: "var(--accent)" }}
            >
              {row1.eyebrow}
            </p>
            <h3 className="font-[family-name:var(--font-newsreader)] text-2xl sm:text-3xl text-foreground mb-4">
              {row1.h3}
            </h3>
            <p className="text-foreground/60 leading-relaxed">{row1.text}</p>
          </div>
        </div>

        {/* Row 2: text + map card */}
        <div className="flex flex-col lg:flex-row-reverse gap-10 items-center mb-20">
          <div className="flex-1 rounded-2xl border border-black/8 bg-white p-5 shadow-sm max-w-sm w-full">
            <div className="flex flex-col gap-2">
              {row2.mapNodes.map((node, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg px-3 py-2"
                  style={{ backgroundColor: `${getAreaColor(node.area)}14` }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getAreaColor(node.area) }}
                    />
                    <span className="text-sm font-medium">{node.label}</span>
                  </div>
                  {"badge" in node && node.badge && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      {node.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 max-w-lg">
            <p
              className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest mb-3"
              style={{ color: "var(--accent)" }}
            >
              {row2.eyebrow}
            </p>
            <h3 className="font-[family-name:var(--font-newsreader)] text-2xl sm:text-3xl text-foreground mb-4">
              {row2.h3}
            </h3>
            <p className="text-foreground/60 leading-relaxed">{row2.text}</p>
          </div>
        </div>

        {/* Row 3: card + text */}
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          <div className="flex-1 rounded-2xl border border-black/8 bg-white p-5 shadow-sm max-w-sm w-full space-y-3">
            <p className="text-xs font-[family-name:var(--font-mono)] text-foreground/40 uppercase">
              {row3.label}
            </p>
            <div className="rounded-xl border border-black/8 p-3">
              <p className="font-medium text-sm text-foreground">{row3.item.label}</p>
              <p className="text-xs text-foreground/40 mt-0.5">{row3.item.meta}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-foreground/40">{row3.item.from}</span>
                <span className="text-xs">→</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  {row3.item.to}
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-black/8 p-3">
              <p className="text-xs text-foreground/70">{row3.notif.text}</p>
              <p className="text-xs text-foreground/30 mt-1">{row3.notif.time}</p>
            </div>
          </div>
          <div className="flex-1 max-w-lg">
            <p
              className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest mb-3"
              style={{ color: "var(--accent)" }}
            >
              {row3.eyebrow}
            </p>
            <h3 className="font-[family-name:var(--font-newsreader)] text-2xl sm:text-3xl text-foreground mb-4">
              {row3.h3}
            </h3>
            <p className="text-foreground/60 leading-relaxed">{row3.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
