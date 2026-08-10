import { describe, it, expect, beforeEach } from "vitest";
import {
  ASSISTANT_NUMBER,
  WHATSAPP_TERMS_VERSION,
  buildAssistantOptInUrl,
  buildCapsuleShareUrl,
  buildIntervieweeOptInUrl,
  formatAssistantNumber,
  isValidPhone,
  listWhatsAppConsents,
  normalizePhone,
  recordWhatsAppConsent,
} from "./whatsapp";
import { WHATSAPP_TERMS } from "@/lib/data/content";

// ── normalizePhone ────────────────────────────────────────────────────────────

describe("normalizePhone", () => {
  it("keeps an already-international number", () => {
    expect(normalizePhone("+34600123456")).toBe("+34600123456");
  });

  it("strips spaces, dots and dashes", () => {
    expect(normalizePhone("+34 600-123.456")).toBe("+34600123456");
  });

  it("converts a 00 prefix into +", () => {
    expect(normalizePhone("0034600123456")).toBe("+34600123456");
  });

  it("prefixes a bare national number with the default country code", () => {
    expect(normalizePhone("600 123 456")).toBe("+34600123456");
  });

  it("honours an explicit country code", () => {
    expect(normalizePhone("3001234567", "57")).toBe("+573001234567");
  });

  it("returns empty string for blank or letter-only input", () => {
    expect(normalizePhone("   ")).toBe("");
    expect(normalizePhone("no-soy-un-numero")).toBe("");
  });
});

// ── isValidPhone ──────────────────────────────────────────────────────────────

describe("isValidPhone", () => {
  it.each(["+34600123456", "600123456", "0034600123456", "+57 300 123 4567"])(
    "accepts %s",
    (input) => {
      expect(isValidPhone(input)).toBe(true);
    }
  );

  it.each(["", "123", "+0123456789", "abc"])("rejects %s", (input) => {
    expect(isValidPhone(input)).toBe(false);
  });
});

// ── Deep links ────────────────────────────────────────────────────────────────

describe("buildCapsuleShareUrl", () => {
  it("targets the contact picker when no recipient is given", () => {
    const url = buildCapsuleShareUrl({ link: "unifyflow.eu/e/acme-9f2k" });
    expect(url.startsWith("https://wa.me/?text=")).toBe(true);
  });

  it("includes the capsule link and the company name in the message", () => {
    const url = buildCapsuleShareUrl({
      link: "unifyflow.eu/e/acme-9f2k",
      company: "Distribuciones Robledo",
    });
    const text = decodeURIComponent(url.split("?text=")[1]);
    expect(text).toContain("https://unifyflow.eu/e/acme-9f2k");
    expect(text).toContain("Distribuciones Robledo");
    expect(text).toContain("notas de voz");
  });

  it("addresses a specific recipient when one is given", () => {
    const url = buildCapsuleShareUrl({
      link: "unifyflow.eu/e/acme-9f2k",
      to: "600 123 456",
    });
    expect(url.startsWith("https://wa.me/34600123456?text=")).toBe(true);
  });
});

describe("buildAssistantOptInUrl", () => {
  it("addresses the assistant number and states the authorisation", () => {
    const url = buildAssistantOptInUrl({
      phone: "600123456",
      link: "unifyflow.eu/e/acme-9f2k",
      company: "Acme",
    });
    expect(url.startsWith(`https://wa.me/${ASSISTANT_NUMBER}?text=`)).toBe(true);

    const text = decodeURIComponent(url.split("?text=")[1]);
    expect(text).toContain("ALTA UnifyFlow");
    expect(text).toContain("Autorizo");
    expect(text).toContain("+34600123456");
    expect(text).toContain("unifyflow.eu/e/acme-9f2k");
  });
});

describe("buildIntervieweeOptInUrl", () => {
  it("carries the capsule slug and the voice-note authorisation", () => {
    const url = buildIntervieweeOptInUrl("acme-9f2k", "Andrés");
    const text = decodeURIComponent(url.split("?text=")[1]);
    expect(url.startsWith(`https://wa.me/${ASSISTANT_NUMBER}?text=`)).toBe(true);
    expect(text).toContain("acme-9f2k");
    expect(text).toContain("Andrés");
    expect(text).toContain("nota de voz");
  });
});

describe("formatAssistantNumber", () => {
  it("groups the national part in threes behind a + prefix", () => {
    expect(formatAssistantNumber("34900000000")).toBe("+34 900 000 000");
  });
});

// ── Consent ───────────────────────────────────────────────────────────────────

describe("recordWhatsAppConsent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stamps the normalised phone, the terms version and a timestamp", () => {
    const consent = recordWhatsAppConsent({
      phone: "600 123 456",
      source: "capsula",
      link: "unifyflow.eu/e/acme-9f2k",
    });

    expect(consent.phone).toBe("+34600123456");
    expect(consent.termsVersion).toBe(WHATSAPP_TERMS_VERSION);
    expect(consent.source).toBe("capsula");
    expect(consent.link).toBe("unifyflow.eu/e/acme-9f2k");
    expect(Number.isNaN(Date.parse(consent.acceptedAt))).toBe(false);
  });

  it("appends to the consents already stored on the device", () => {
    recordWhatsAppConsent({ phone: "600123456", source: "capsula" });
    recordWhatsAppConsent({ phone: "600123457", source: "entrevista" });

    const stored = listWhatsAppConsents();
    expect(stored).toHaveLength(2);
    expect(stored.map((c) => c.source)).toEqual(["capsula", "entrevista"]);
  });

  it("omits the link key when there is no capsule", () => {
    const consent = recordWhatsAppConsent({ phone: "600123456", source: "panel" });
    expect(consent.link).toBeUndefined();
  });
});

// ── Terms version ─────────────────────────────────────────────────────────────

describe("terms version", () => {
  it("matches the version published on the terms page", () => {
    expect(WHATSAPP_TERMS.version).toBe(WHATSAPP_TERMS_VERSION);
  });
});
