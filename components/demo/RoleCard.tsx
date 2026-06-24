"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

export interface RoleCardProps {
  /** Icon or emoji to display at the top of the card */
  icon?: string;
  /** Role title */
  title: string;
  /** Short description */
  description: string;
  /** Called when the user clicks "Entrar →" */
  onEnter: () => void;
}

export function RoleCard({ icon, title, description, onEnter }: RoleCardProps) {
  return (
    <article
      className="flex flex-col gap-4 rounded-2xl border p-6 cursor-pointer transition-all duration-150 hover:shadow-md hover:scale-[1.01] focus-within:ring-2"
      style={{
        backgroundColor: "var(--bg)",
        borderColor: "var(--accent-tint)",
      }}
      onClick={onEnter}
    >
      {icon && (
        <span
          className="text-3xl leading-none select-none"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      <div className="flex flex-col gap-1 flex-1">
        <h2
          className="text-lg font-semibold leading-snug"
          style={{ fontFamily: "var(--font-newsreader), serif", color: "var(--fg)" }}
        >
          {title}
        </h2>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--fg)", opacity: 0.7 }}
        >
          {description}
        </p>
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onEnter();
        }}
        aria-label={`Entrar como ${title}`}
        className="self-start"
      >
        Entrar →
      </Button>
    </article>
  );
}
