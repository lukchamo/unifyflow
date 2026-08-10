"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { WHATSAPP } from "@/lib/data/content";
import { buildIntervieweeOptInUrl } from "@/lib/services/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export interface WhatsAppIntervieweeCardProps {
  /** Invitation token of the cápsula, carried into the WhatsApp message. */
  slug: string;
  name?: string;
  className?: string;
}

/**
 * WhatsAppIntervieweeCard — escape hatch for the person being interviewed:
 * answer over WhatsApp instead of the web, with voice notes.
 *
 * No number is collected here. The invitee writes to us from their own device,
 * so their message *is* the opt-in; the terms are linked for transparency.
 */
export function WhatsAppIntervieweeCard({
  slug,
  name,
  className = "",
}: WhatsAppIntervieweeCardProps) {
  const href = buildIntervieweeOptInUrl(slug, name);

  return (
    <div
      data-testid="whatsapp-interviewee"
      className={`rounded-xl border p-4 flex flex-col gap-3 ${className}`}
      style={{ borderColor: "#D6EBDD", backgroundColor: "#F2FAF5" }}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <WhatsAppIcon size={18} />
        <Badge tone="success">{WHATSAPP.badge}</Badge>
        <p className="text-[13px] font-semibold" style={{ color: "#1C201E" }}>
          {WHATSAPP.interviewee.title}
        </p>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: "#4A5C55" }}>
        {WHATSAPP.interviewee.paragraph}
      </p>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-semibold rounded-full transition-all hover:brightness-95"
        style={{ backgroundColor: "#25D366", color: "#0B2E1C" }}
      >
        <WhatsAppIcon size={16} color="#0B2E1C" />
        {WHATSAPP.interviewee.button}
      </a>

      <p className="text-[11px] leading-relaxed" style={{ color: "#6B7B75" }}>
        {WHATSAPP.interviewee.micro}{" "}
        <Link
          href={WHATSAPP.termsHref}
          target="_blank"
          className="underline"
          style={{ color: "#1F5B39" }}
        >
          {WHATSAPP.optIn.consentLinkLabel}
        </Link>
        .
      </p>
    </div>
  );
}
