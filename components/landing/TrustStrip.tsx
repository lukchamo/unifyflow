import { TRUST_STRIP } from "@/lib/data/content";

export default function TrustStrip() {
  return (
    <div
      className="py-4 border-y border-black/5"
      style={{ backgroundColor: "var(--accent-tint)" }}
    >
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-center text-foreground/60">
          {TRUST_STRIP.items.join(" · ")}
        </p>
      </div>
    </div>
  );
}
