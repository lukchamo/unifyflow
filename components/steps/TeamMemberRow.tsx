"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/Avatar";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { buildCapsuleShareUrl } from "@/lib/services/whatsapp";
import type { Member } from "@/lib/schemas";

interface MemberStatusPillProps {
  done: boolean;
}

function MemberStatusPill({ done }: MemberStatusPillProps) {
  if (done) {
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono tracking-wide whitespace-nowrap"
        style={{
          backgroundColor: "var(--accent-tint)",
          color: "var(--accent-dk)",
        }}
      >
        Entrevista lista
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono tracking-wide whitespace-nowrap"
      style={{
        backgroundColor: "#F1F3F2",
        color: "#9CA29E",
      }}
    >
      Pendiente
    </span>
  );
}

export interface TeamMemberRowProps {
  member: Member;
  /** Cápsula link; enables the WhatsApp nudge for members still pending. */
  capsuleLink?: string;
  company?: string;
}

export function TeamMemberRow({
  member,
  capsuleLink,
  company,
}: TeamMemberRowProps) {
  return (
    <div
      data-testid="member-row"
      className="flex items-center gap-3 py-2.5"
    >
      <Avatar name={member.nombre} size="sm" />
      <div className="flex-1 min-w-0">
        <p
          className="truncate font-medium"
          style={{ fontSize: "13.5px", lineHeight: "1.3" }}
        >
          {member.nombre}
        </p>
        <p
          className="truncate"
          style={{ fontSize: "11px", color: "#9CA29E", lineHeight: "1.3" }}
        >
          {member.cargo} · {member.area}
        </p>
      </div>
      {/* Nudge the ones still pending, where the reminder actually lands. */}
      {!member.done && capsuleLink && (
        <a
          href={buildCapsuleShareUrl({ link: capsuleLink, company })}
          target="_blank"
          rel="noopener noreferrer"
          title={`Recordar a ${member.nombre} por WhatsApp`}
          aria-label={`Recordar a ${member.nombre} por WhatsApp`}
          className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 transition-colors hover:brightness-95"
          style={{ backgroundColor: "#F2FAF5" }}
        >
          <WhatsAppIcon size={14} />
        </a>
      )}

      <MemberStatusPill done={member.done} />
    </div>
  );
}
