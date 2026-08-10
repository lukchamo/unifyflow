/**
 * whatsapp.ts — WhatsApp channel for UnifyFlow cápsulas.
 *
 * Two distinct jobs, deliberately kept apart because their consent model is
 * different:
 *
 *  1. **Compartir la cápsula** (`buildCapsuleShareUrl`) — a click-to-chat
 *     deep link. The message is composed in the *user's own* WhatsApp and sent
 *     by them, so UnifyFlow never stores nor messages a third-party number.
 *     No opt-in needed on our side.
 *
 *  2. **Activar el asistente** (`buildAssistantOptInUrl` + `recordWhatsAppConsent`)
 *     — the person hands us *their own* number so the Unify bot can answer the
 *     interview with them over WhatsApp (text or voice notes). This is a real
 *     opt-in: it requires an explicit, unticked-by-default acceptance of the
 *     WhatsApp terms, and it is confirmed by the person actually sending the
 *     first message from their device (double opt-in).
 */

// ── Assistant identity ────────────────────────────────────────────────────────

/**
 * Number the Unify assistant listens on, in E.164 without the leading "+".
 * Overridable per environment; the fallback is a documentation placeholder so
 * the demo never deep-links into a real person's chat.
 */
export const ASSISTANT_NUMBER: string =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "34900000000";

/** Human-readable rendering of {@link ASSISTANT_NUMBER}, e.g. "+34 900 000 000". */
export function formatAssistantNumber(digits: string = ASSISTANT_NUMBER): string {
  const country = digits.slice(0, 2);
  const rest = digits.slice(2);
  const grouped = rest.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
  return `+${country} ${grouped}`;
}

/**
 * Version of the WhatsApp terms in force. Bump it whenever the text in
 * `WHATSAPP_TERMS` changes — stored consents keep the version they accepted so
 * we can tell who agreed to what.
 */
export const WHATSAPP_TERMS_VERSION = "2026-08-10";

/** Where in the journey the opt-in was collected. */
export type WhatsAppConsentSource = "capsula" | "entrevista" | "panel";

export interface WhatsAppConsent {
  /** Normalised E.164 number, e.g. "+34600123456". */
  phone: string;
  /** ISO-8601 timestamp of the moment the box was ticked. */
  acceptedAt: string;
  termsVersion: string;
  source: WhatsAppConsentSource;
  /** Cápsula the consent belongs to, when there is one. */
  link?: string;
}

// ── Phone normalisation ───────────────────────────────────────────────────────

/** Default country code used when the user types a bare national number. */
const DEFAULT_COUNTRY_CODE = "34";

/**
 * Normalises a typed phone number to E.164 ("+" + 8–15 digits).
 *
 * Accepts the shapes people actually type: "+34 600 123 456",
 * "0034-600-123-456", "600 123 456". A bare national number is prefixed with
 * `countryCode`. Returns "" when there is nothing usable.
 */
export function normalizePhone(
  raw: string,
  countryCode: string = DEFAULT_COUNTRY_CODE
): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const hasPlus = trimmed.startsWith("+");
  let digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";

  if (!hasPlus && digits.startsWith("00")) {
    // International prefix dialled the old way.
    digits = digits.slice(2);
  } else if (!hasPlus && digits.length <= 10) {
    // Bare national number — assume the default country.
    digits = `${countryCode}${digits}`;
  }

  return `+${digits}`;
}

/** True when `raw` normalises to a plausible E.164 number. */
export function isValidPhone(raw: string, countryCode?: string): boolean {
  return /^\+[1-9]\d{7,14}$/.test(normalizePhone(raw, countryCode));
}

// ── Deep links ────────────────────────────────────────────────────────────────

function waUrl(toDigits: string, text: string): string {
  const base = toDigits ? `https://wa.me/${toDigits}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(text)}`;
}

export interface CapsuleShareInput {
  /** Cápsula link without protocol, e.g. "unifyflow.eu/e/acme-9f2k". */
  link: string;
  /** Company the cápsula belongs to, used in the message. */
  company?: string;
  /** Optional recipient in E.164 or national form; omit to let WhatsApp ask. */
  to?: string;
}

/**
 * Click-to-chat link that opens WhatsApp with the cápsula ready to send.
 * Without `to`, WhatsApp shows the contact picker.
 */
export function buildCapsuleShareUrl({
  link,
  company,
  to,
}: CapsuleShareInput): string {
  const org = company?.trim() ? ` de ${company.trim()}` : "";
  const text =
    `Hola 👋 Estamos dibujando el mapa de procesos${org} con UnifyFlow.\n\n` +
    `Son 3–4 preguntas, menos de 5 minutos, desde el móvil:\n` +
    `https://${link}\n\n` +
    `Si prefieres, puedes responder aquí mismo por WhatsApp —incluso con notas de voz—: ` +
    `escribe a ${formatAssistantNumber()} y el asistente de Unify te hace las preguntas.`;

  return waUrl(to ? normalizePhone(to).replace(/\D/g, "") : "", text);
}

export interface AssistantOptInInput {
  /** The person's own number, in E.164 or national form. */
  phone: string;
  /** Cápsula the conversation belongs to, when there is one. */
  link?: string;
  company?: string;
}

/**
 * Link that opens the user's WhatsApp with the authorisation message addressed
 * to the Unify assistant. Sending it is the second half of the double opt-in:
 * the ticked box records the intent, this message proves the number is theirs.
 */
export function buildAssistantOptInUrl({
  phone,
  link,
  company,
}: AssistantOptInInput): string {
  const normalized = normalizePhone(phone);
  const org = company?.trim() ? ` (${company.trim()})` : "";
  const capsule = link ? `\nCápsula: https://${link}` : "";
  const text =
    `ALTA UnifyFlow${org}\n` +
    `Autorizo a UnifyFlow a conversar conmigo por WhatsApp en este número ` +
    `(${normalized || phone.trim()}) para responder la entrevista por texto o nota de voz.` +
    capsule;

  return waUrl(ASSISTANT_NUMBER, text);
}

/**
 * Link for an *invitee* who would rather answer over WhatsApp than in the web
 * app. They write from their own device, so the message itself is the opt-in.
 */
export function buildIntervieweeOptInUrl(slug: string, name?: string): string {
  const who = name?.trim() ? ` Soy ${name.trim()}.` : "";
  const text =
    `Hola, quiero responder mi entrevista de UnifyFlow por aquí.${who}\n` +
    `Código: ${slug}\n` +
    `Autorizo que el asistente me escriba por WhatsApp para hacerme las preguntas ` +
    `y acepto responder por texto o nota de voz.`;

  return waUrl(ASSISTANT_NUMBER, text);
}

// ── Consent record ────────────────────────────────────────────────────────────

const CONSENT_STORAGE_KEY = "uf.whatsapp.consents";

/**
 * Builds — and, in the browser, persists — the record of an accepted opt-in.
 * Storage is best-effort: a private-mode failure must never block the flow.
 */
export function recordWhatsAppConsent(input: {
  phone: string;
  source: WhatsAppConsentSource;
  link?: string;
}): WhatsAppConsent {
  const consent: WhatsAppConsent = {
    phone: normalizePhone(input.phone),
    acceptedAt: new Date().toISOString(),
    termsVersion: WHATSAPP_TERMS_VERSION,
    source: input.source,
    ...(input.link ? { link: input.link } : {}),
  };

  if (typeof window !== "undefined") {
    try {
      const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      const list: WhatsAppConsent[] = raw ? JSON.parse(raw) : [];
      list.push(consent);
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Storage unavailable (private mode, quota) — the consent still stands.
    }
  }

  return consent;
}

/** Consents recorded on this device. Empty when storage is unavailable. */
export function listWhatsAppConsents(): WhatsAppConsent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WhatsAppConsent[]) : [];
  } catch {
    return [];
  }
}
