"use client";
import Link from "next/link";
import { NAV } from "@/lib/data/content";

export default function Nav({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/90 border-b border-black/5">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <span
            className="block h-4 w-4 rotate-45 rounded-sm"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <span className="font-[family-name:var(--font-newsreader)] text-lg">
            {NAV.brand}
          </span>
        </Link>
        <ul className="hidden md:flex items-center gap-6 text-sm text-foreground/70">
          {NAV.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-foreground transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={onOpenModal}
          className="text-sm font-medium px-4 py-2 rounded-full text-white transition-colors"
          style={{ backgroundColor: "var(--accent)" }}
        >
          {NAV.cta}
        </button>
      </div>
    </nav>
  );
}
