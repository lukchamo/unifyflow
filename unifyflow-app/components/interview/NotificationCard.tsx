"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

export type NotificationVariant = "verify" | "comment" | "suggestion";

export interface NotificationCardProps {
  variant: NotificationVariant;
  message: React.ReactNode;
  quote?: string;
  meta: string;
  actions: Array<{
    label: string;
    variant?: "primary" | "secondary" | "ghost";
    onClick?: () => void;
  }>;
}

const ICONS: Record<NotificationVariant, string> = {
  verify: "✓",
  comment: "💬",
  suggestion: "✎",
};

const ICON_STYLES: Record<
  NotificationVariant,
  { bg: string; color: string }
> = {
  verify: { bg: "#E7F0ED", color: "var(--accent-dk)" },
  comment: { bg: "#EEF1EF", color: "#5A6B61" },
  suggestion: { bg: "#F4E8CE", color: "#8A6420" },
};

export function NotificationCard({
  variant,
  message,
  quote,
  meta,
  actions,
}: NotificationCardProps) {
  const iconStyle = ICON_STYLES[variant];

  return (
    <div
      className="rounded-xl p-4 mb-3"
      style={{ backgroundColor: "#FAFBFA", border: "1px solid #EEF1EF" }}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
          style={{ backgroundColor: iconStyle.bg, color: iconStyle.color }}
        >
          {ICONS[variant]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: "14px", color: "var(--fg)", lineHeight: 1.5 }}>
            {message}
          </p>

          {quote && (
            <blockquote
              className="mt-2 pl-3 italic"
              style={{
                fontSize: "13px",
                color: "#5A6B61",
                borderLeft: "2px solid #BBC0BC",
              }}
            >
              {quote}
            </blockquote>
          )}

          <p
            className="mt-1.5"
            style={{
              fontSize: "11px",
              color: "#9CA29E",
              fontFamily: "var(--font-mono)",
            }}
          >
            {meta}
          </p>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {actions.map((action) => (
                <Button
                  key={action.label}
                  variant={action.variant ?? "secondary"}
                  size="sm"
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
