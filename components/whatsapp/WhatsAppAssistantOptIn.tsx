"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { WHATSAPP } from "@/lib/data/content";
import {
  buildAssistantOptInUrl,
  isValidPhone,
  recordWhatsAppConsent,
  type WhatsAppConsent,
  type WhatsAppConsentSource,
} from "@/lib/services/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

export interface WhatsAppAssistantOptInProps {
  /** Cápsula the conversation belongs to, e.g. "unifyflow.eu/e/acme-9f2k". */
  link?: string;
  company?: string;
  source?: WhatsAppConsentSource;
  /** Collapsed behind a disclosure row by default; open it for dedicated views. */
  defaultOpen?: boolean;
  onActivated?: (consent: WhatsAppConsent) => void;
  className?: string;
}

/**
 * WhatsAppAssistantOptIn — the person gives us *their own* number so the Unify
 * assistant can run the interview over WhatsApp (text or voice notes).
 *
 * Consent rules this component enforces:
 *  - the checkbox starts unticked and gates the action (no pre-consent);
 *  - the terms are linked, not buried;
 *  - ticking is only half of it — activation completes when the person sends
 *    the pre-filled authorisation message from their own device.
 */
export function WhatsAppAssistantOptIn({
  link,
  company,
  source = "capsula",
  defaultOpen = false,
  onActivated,
  className = "",
}: WhatsAppAssistantOptInProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [phone, setPhone] = React.useState("");
  const [accepted, setAccepted] = React.useState(false);
  const [error, setError] = React.useState<"phone" | "consent" | null>(null);
  const [activated, setActivated] = React.useState(false);

  const phoneId = React.useId();
  const consentId = React.useId();

  const ready = isValidPhone(phone) && accepted;

  function handleActivate() {
    if (!isValidPhone(phone)) {
      setError("phone");
      return;
    }
    if (!accepted) {
      setError("consent");
      return;
    }
    setError(null);

    const consent = recordWhatsAppConsent({ phone, source, link });
    const url = buildAssistantOptInUrl({ phone, link, company });

    // Hand off to WhatsApp so the person can send the authorisation message.
    if (typeof window !== "undefined") {
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (!opened) window.location.href = url;
    }

    setActivated(true);
    onActivated?.(consent);
  }

  if (!open) {
    return (
      <button
        type="button"
        data-testid="whatsapp-optin-disclosure"
        onClick={() => setOpen(true)}
        className={`w-full rounded-xl border p-3 flex items-center gap-3 text-left transition-colors hover:brightness-[0.98] ${className}`}
        style={{ borderColor: "#D6EBDD", backgroundColor: "#F2FAF5" }}
      >
        <WhatsAppIcon size={18} />
        <span className="flex-1 flex flex-col gap-0.5">
          <span className="flex items-center gap-2">
            <Badge tone="success">{WHATSAPP.badge}</Badge>
            <span className="text-[13px] font-semibold" style={{ color: "#1C201E" }}>
              {WHATSAPP.optIn.title}
            </span>
          </span>
          <span className="text-xs" style={{ color: "#4A5C55" }}>
            Responde con notas de voz, sin entrar a la web.
          </span>
        </span>
        <span aria-hidden="true" style={{ color: "#4A5C55" }}>
          +
        </span>
      </button>
    );
  }

  return (
    <div
      data-testid="whatsapp-optin"
      className={`rounded-xl border p-4 flex flex-col gap-3 ${className}`}
      style={{ borderColor: "#D6EBDD", backgroundColor: "#F2FAF5" }}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <WhatsAppIcon size={18} />
        <Badge tone="success">{WHATSAPP.badge}</Badge>
        <p className="text-[13px] font-semibold" style={{ color: "#1C201E" }}>
          {WHATSAPP.optIn.title}
        </p>
      </div>

      <p className="text-xs leading-relaxed" style={{ color: "#4A5C55" }}>
        {WHATSAPP.optIn.paragraph}
      </p>

      <ul className="flex flex-col gap-1.5">
        {WHATSAPP.optIn.bullets.map((bullet) => (
          <li
            key={bullet}
            className="text-xs flex items-start gap-2 leading-relaxed"
            style={{ color: "#4A5C55" }}
          >
            <span
              className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: "#25D366" }}
              aria-hidden="true"
            />
            {bullet}
          </li>
        ))}
      </ul>

      {activated ? (
        <p
          data-testid="whatsapp-optin-confirm"
          className="text-xs leading-relaxed rounded-lg px-3 py-2"
          style={{ backgroundColor: "#E1F4E8", color: "#1F5B39" }}
        >
          {WHATSAPP.optIn.confirmMicro}
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={phoneId}
              className="text-[10px] font-mono font-medium uppercase tracking-widest"
              style={{ color: "#6B7B75" }}
            >
              {WHATSAPP.optIn.fieldPhone.label}
            </label>
            <input
              id={phoneId}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (error === "phone") setError(null);
              }}
              placeholder={WHATSAPP.optIn.fieldPhone.placeholder}
              aria-invalid={error === "phone" ? true : undefined}
              className="w-full h-10 px-3 rounded-lg border text-sm bg-white transition-colors focus:outline-none focus:ring-2"
              style={
                {
                  borderColor: error === "phone" ? "#E05A5A" : "#CFE3D7",
                  "--tw-ring-color": "#25D366",
                } as React.CSSProperties
              }
            />
            {error === "phone" && (
              <p className="text-[11px] font-mono" style={{ color: "#E05A5A" }}>
                {WHATSAPP.optIn.errorPhone}
              </p>
            )}
          </div>

          <div className="flex items-start gap-2.5">
            <input
              id={consentId}
              type="checkbox"
              checked={accepted}
              onChange={(e) => {
                setAccepted(e.target.checked);
                if (error === "consent") setError(null);
              }}
              aria-invalid={error === "consent" ? true : undefined}
              className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer accent-[#25D366]"
            />
            <label
              htmlFor={consentId}
              className="text-[11px] leading-relaxed cursor-pointer"
              style={{ color: "#4A5C55" }}
            >
              {WHATSAPP.optIn.consentPrefix}
              <Link
                href={WHATSAPP.termsHref}
                target="_blank"
                className="underline"
                style={{ color: "#1F5B39" }}
              >
                {WHATSAPP.optIn.consentLinkLabel}
              </Link>
              {WHATSAPP.optIn.consentSuffix}
            </label>
          </div>

          {error === "consent" && (
            <p className="text-[11px] font-mono" style={{ color: "#E05A5A" }}>
              {WHATSAPP.optIn.errorConsent}
            </p>
          )}

          <Button
            type="button"
            size="md"
            className="w-full rounded-full"
            onClick={handleActivate}
            disabled={!ready}
            style={{ backgroundColor: "#25D366", color: "#0B2E1C" }}
          >
            <WhatsAppIcon size={16} color="#0B2E1C" />
            {WHATSAPP.optIn.button}
          </Button>
        </>
      )}
    </div>
  );
}
