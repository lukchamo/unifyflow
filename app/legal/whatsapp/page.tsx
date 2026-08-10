/**
 * app/legal/whatsapp/page.tsx — Terms of the UnifyFlow WhatsApp channel.
 *
 * Linked from every WhatsApp opt-in checkbox. Server component: static text,
 * no interactivity, so it stays cheap and indexable.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { WHATSAPP_TERMS } from "@/lib/data/content";
import { formatAssistantNumber } from "@/lib/services/whatsapp";

export const metadata: Metadata = {
  title: "Términos del canal de WhatsApp · UnifyFlow",
  description:
    "Qué autorizas al dejar tu número, qué mensajes recibes, qué datos tratamos y cómo darte de baja del canal de WhatsApp de UnifyFlow.",
};

export default function WhatsAppTermsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-14">
      <Link
        href="/"
        className="text-xs font-mono uppercase tracking-widest"
        style={{ color: "var(--accent-dk)" }}
      >
        ← UnifyFlow
      </Link>

      <h1
        className="mt-6 text-3xl leading-tight"
        style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
      >
        {WHATSAPP_TERMS.title}
      </h1>

      <p className="mt-2 text-xs font-mono" style={{ color: "#8A908D" }}>
        Versión {WHATSAPP_TERMS.version} · actualizado el {WHATSAPP_TERMS.updatedAt}
      </p>

      <p className="mt-6 text-sm leading-relaxed" style={{ color: "#4A5C55" }}>
        {WHATSAPP_TERMS.intro}
      </p>

      <div
        className="mt-6 rounded-xl border p-4 text-sm leading-relaxed"
        style={{ borderColor: "#D6EBDD", backgroundColor: "#F2FAF5", color: "#1F5B39" }}
      >
        Número del asistente:{" "}
        <span className="font-mono">{formatAssistantNumber()}</span>. Escribe{" "}
        <strong>BAJA</strong> en el chat para desactivar el canal en cualquier
        momento.
      </div>

      <div className="mt-10 flex flex-col gap-8">
        {WHATSAPP_TERMS.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-3">
            <h2
              className="text-lg"
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                color: "#1C201E",
              }}
            >
              {section.heading}
            </h2>

            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-sm leading-relaxed"
                style={{ color: "#4A5C55" }}
              >
                {paragraph}
              </p>
            ))}

            {"list" in section && section.list && (
              <ul className="flex flex-col gap-2">
                {section.list.map((item) => (
                  <li
                    key={item}
                    className="text-sm flex items-start gap-2 leading-relaxed"
                    style={{ color: "#4A5C55" }}
                  >
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "#25D366" }}
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <p className="mt-12 text-xs" style={{ color: "#8A908D" }}>
        Datos en la UE · GDPR · privacidad@unifyflow.eu
      </p>
    </main>
  );
}
