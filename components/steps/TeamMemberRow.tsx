"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/Avatar";
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
}

export function TeamMemberRow({ member }: TeamMemberRowProps) {
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
      <MemberStatusPill done={member.done} />
    </div>
  );
}
