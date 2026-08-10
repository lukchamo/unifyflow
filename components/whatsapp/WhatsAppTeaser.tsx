"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { WHATSAPP } from "@/lib/data/content";
import { WhatsAppIcon } from "./WhatsAppIcon";

export interface WhatsAppTeaserProps {
  className?: string;
}

/**
 * WhatsAppTeaser — the "novedad" strip shown *before* the cápsula exists.
 *
 * Announces the channel and asks for nothing: the phone number is a
 * high-friction request and must never stand between the user and their first
 * cápsula. See docs/whatsapp-journey.md.
 */
export function WhatsAppTeaser({ className = "" }: WhatsAppTeaserProps) {
  return (
    <div
      data-testid="whatsapp-teaser"
      className={`rounded-xl border p-3.5 flex items-start gap-3 ${className}`}
      style={{ borderColor: "#D6EBDD", backgroundColor: "#F2FAF5" }}
    >
      <span
        className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
        style={{ backgroundColor: "#E1F4E8" }}
      >
        <WhatsAppIcon size={17} />
      </span>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge tone="success">{WHATSAPP.badge}</Badge>
          <p className="text-[13px] font-semibold" style={{ color: "#1C201E" }}>
            {WHATSAPP.teaser.title}
          </p>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "#4A5C55" }}>
          {WHATSAPP.teaser.paragraph}
        </p>
      </div>
    </div>
  );
}
