"use client";

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WhatsAppAssistantOptIn } from "./WhatsAppAssistantOptIn";
import { WhatsAppIntervieweeCard } from "./WhatsAppIntervieweeCard";
import { WhatsAppTeaser } from "./WhatsAppTeaser";
import { ASSISTANT_NUMBER, listWhatsAppConsents } from "@/lib/services/whatsapp";
import { WHATSAPP } from "@/lib/data/content";

// next/link renders a plain anchor in tests.
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const openSpy = vi.fn();

beforeEach(() => {
  openSpy.mockReset();
  window.localStorage.clear();
  vi.stubGlobal("open", openSpy);
});

// ── Teaser ────────────────────────────────────────────────────────────────────

describe("WhatsAppTeaser", () => {
  it("announces the novelty without asking for anything", () => {
    render(<WhatsAppTeaser />);
    expect(screen.getByTestId("whatsapp-teaser")).toBeInTheDocument();
    expect(screen.getByText(WHATSAPP.badge)).toBeInTheDocument();
    expect(screen.getByText(WHATSAPP.teaser.title)).toBeInTheDocument();
    // No inputs: the phone number must not be requested before the cápsula exists.
    expect(screen.queryByRole("textbox")).toBeNull();
  });
});

// ── Opt-in ────────────────────────────────────────────────────────────────────

describe("WhatsAppAssistantOptIn", () => {
  function renderOptIn(props = {}) {
    return render(
      <WhatsAppAssistantOptIn
        defaultOpen
        link="unifyflow.eu/e/acme-9f2k"
        company="Acme"
        {...props}
      />
    );
  }

  it("is collapsed behind a disclosure by default", () => {
    render(<WhatsAppAssistantOptIn link="unifyflow.eu/e/acme-9f2k" />);
    expect(screen.getByTestId("whatsapp-optin-disclosure")).toBeInTheDocument();
    expect(screen.queryByTestId("whatsapp-optin")).toBeNull();

    fireEvent.click(screen.getByTestId("whatsapp-optin-disclosure"));
    expect(screen.getByTestId("whatsapp-optin")).toBeInTheDocument();
  });

  it("starts with the consent checkbox unticked", () => {
    renderOptIn();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("keeps the activate button disabled until phone AND consent are given", () => {
    renderOptIn();
    const button = screen.getByRole("button", { name: /Activar asistente/i });
    expect(button).toBeDisabled();

    // Phone only — still disabled.
    fireEvent.change(screen.getByLabelText(/Tu WhatsApp/i), {
      target: { value: "600123456" },
    });
    expect(button).toBeDisabled();

    // Consent only — clear the phone and tick the box.
    fireEvent.change(screen.getByLabelText(/Tu WhatsApp/i), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    expect(button).toBeDisabled();

    // Both — enabled.
    fireEvent.change(screen.getByLabelText(/Tu WhatsApp/i), {
      target: { value: "600123456" },
    });
    expect(button).not.toBeDisabled();
  });

  it("does not enable activation for an invalid number", () => {
    renderOptIn();
    fireEvent.change(screen.getByLabelText(/Tu WhatsApp/i), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("button", { name: /Activar asistente/i })).toBeDisabled();
  });

  it("links to the WhatsApp terms from the consent label", () => {
    renderOptIn();
    const link = screen.getByRole("link", { name: WHATSAPP.optIn.consentLinkLabel });
    expect(link.getAttribute("href")).toBe("/legal/whatsapp");
  });

  it("records the consent and hands off to WhatsApp on activation", () => {
    const onActivated = vi.fn();
    renderOptIn({ onActivated });

    fireEvent.change(screen.getByLabelText(/Tu WhatsApp/i), {
      target: { value: "+34 600 123 456" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /Activar asistente/i }));

    // Consent stored with the normalised number.
    const consents = listWhatsAppConsents();
    expect(consents).toHaveLength(1);
    expect(consents[0].phone).toBe("+34600123456");
    expect(consents[0].source).toBe("capsula");
    expect(onActivated).toHaveBeenCalledOnce();

    // WhatsApp opened with the authorisation message addressed to the assistant.
    expect(openSpy).toHaveBeenCalledOnce();
    const url: string = openSpy.mock.calls[0][0];
    expect(url.startsWith(`https://wa.me/${ASSISTANT_NUMBER}?text=`)).toBe(true);
    expect(decodeURIComponent(url)).toContain("Autorizo");

    // Double opt-in is spelled out.
    expect(screen.getByTestId("whatsapp-optin-confirm")).toBeInTheDocument();
  });

  it("stores nothing when the consent box is never ticked", () => {
    renderOptIn();
    fireEvent.change(screen.getByLabelText(/Tu WhatsApp/i), {
      target: { value: "600123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Activar asistente/i }));

    expect(listWhatsAppConsents()).toHaveLength(0);
    expect(openSpy).not.toHaveBeenCalled();
  });
});

// ── Interviewee card ──────────────────────────────────────────────────────────

describe("WhatsAppIntervieweeCard", () => {
  it("offers a click-to-chat link carrying the cápsula slug", () => {
    render(<WhatsAppIntervieweeCard slug="acme-9f2k" name="Andrés" />);
    const link = screen.getByRole("link", { name: /Responder por WhatsApp/i });
    const href = decodeURIComponent(link.getAttribute("href") ?? "");
    expect(href).toContain(`https://wa.me/${ASSISTANT_NUMBER}`);
    expect(href).toContain("acme-9f2k");
  });

  it("collects no phone number — the invitee writes first", () => {
    render(<WhatsAppIntervieweeCard slug="acme-9f2k" />);
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("links to the WhatsApp terms", () => {
    render(<WhatsAppIntervieweeCard slug="acme-9f2k" />);
    const link = screen.getByRole("link", { name: WHATSAPP.optIn.consentLinkLabel });
    expect(link.getAttribute("href")).toBe("/legal/whatsapp");
  });
});
