import { FOOTER } from "@/lib/data/content";

export default function Footer() {
  return (
    <footer className="py-8 px-4 sm:px-6 border-t border-black/8 bg-background">
      <div className="mx-auto max-w-[1120px] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span
            className="block h-4 w-4 rotate-45 rounded-sm"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <span className="font-[family-name:var(--font-newsreader)] text-lg font-semibold text-foreground">
            {FOOTER.brand}
          </span>
          <span className="text-sm text-foreground/40 ml-2">{FOOTER.by}</span>
        </div>
        <p className="text-xs text-foreground/40 font-[family-name:var(--font-mono)]">
          {FOOTER.legal}
        </p>
      </div>
    </footer>
  );
}
