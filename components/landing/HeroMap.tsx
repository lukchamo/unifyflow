import { HERO } from "@/lib/data/content";
import { AREA_COLORS } from "@/lib/data/mockData";

function getAreaColor(area: string): string {
  return (AREA_COLORS as Record<string, string>)[area] ?? "#A8773C";
}

export default function HeroMap() {
  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-lg p-5 w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-foreground/60">
          {HERO.heroMap.label}
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          {HERO.heroMap.live}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {HERO.heroMap.nodes.map((node, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg px-3 py-2"
            style={{ backgroundColor: `${getAreaColor(node.area)}18` }}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: getAreaColor(node.area) }}
              />
              <span className="text-sm font-medium text-foreground">{node.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-[family-name:var(--font-mono)]"
                style={{
                  backgroundColor: `${getAreaColor(node.area)}28`,
                  color: getAreaColor(node.area),
                }}
              >
                {node.area}
              </span>
              {"badge" in node && node.badge && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  {node.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
