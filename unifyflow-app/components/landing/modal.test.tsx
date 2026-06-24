"use client";

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import QuickStartModal from "./QuickStartModal";
import Pricing from "./Pricing";

// ── Mocks ────────────────────────────────────────────────────────────────────

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock next/font/google
vi.mock("next/font/google", () => ({
  Newsreader: () => ({ variable: "--font-newsreader", className: "newsreader" }),
  IBM_Plex_Sans: () => ({ variable: "--font-sans", className: "plex-sans" }),
  IBM_Plex_Mono: () => ({ variable: "--font-mono", className: "plex-mono" }),
}));

// Mock clipboard — jsdom doesn't provide navigator.clipboard, so we define it.
const writeText = vi.fn().mockResolvedValue(undefined);

// ── ToastViewport wrapper ────────────────────────────────────────────────────
import { ToastViewport } from "@/components/ui/ToastViewport";

function renderModal(open = true, onOpenChange = vi.fn()) {
  return render(
    <ToastViewport>
      <QuickStartModal open={open} onOpenChange={onOpenChange} />
    </ToastViewport>
  );
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("QuickStartModal", () => {
  beforeEach(() => {
    writeText.mockClear();
    // jsdom does not implement navigator.clipboard; install it manually.
    // vi.stubGlobal handles the read-only navigator correctly.
    vi.stubGlobal("navigator", {
      ...global.navigator,
      clipboard: { writeText },
    });
  });

  it("renders start step when open", () => {
    renderModal();
    expect(screen.getByText("Crea el espejo de tu empresa.")).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre de la empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tu email/i)).toBeInTheDocument();
  });

  it("submit button is disabled initially (both fields empty)", () => {
    renderModal();
    const btn = screen.getByRole("button", { name: /Generar enlace de equipo/i });
    expect(btn).toBeDisabled();
  });

  it("submit button disabled when only company filled", async () => {
    const user = userEvent.setup();
    renderModal();
    await user.type(screen.getByLabelText(/Nombre de la empresa/i), "Acme S.L.");
    const btn = screen.getByRole("button", { name: /Generar enlace de equipo/i });
    expect(btn).toBeDisabled();
  });

  it("submit button disabled when only email filled", async () => {
    const user = userEvent.setup();
    renderModal();
    await user.type(screen.getByLabelText(/Tu email/i), "test@example.com");
    const btn = screen.getByRole("button", { name: /Generar enlace de equipo/i });
    expect(btn).toBeDisabled();
  });

  it("submit button disabled when email is invalid", async () => {
    const user = userEvent.setup();
    renderModal();
    await user.type(screen.getByLabelText(/Nombre de la empresa/i), "Acme S.L.");
    await user.type(screen.getByLabelText(/Tu email/i), "not-an-email");
    const btn = screen.getByRole("button", { name: /Generar enlace de equipo/i });
    expect(btn).toBeDisabled();
  });

  it("submit button ENABLED when both company + valid email filled", async () => {
    const user = userEvent.setup();
    renderModal();
    await user.type(screen.getByLabelText(/Nombre de la empresa/i), "Acme S.L.");
    await user.type(screen.getByLabelText(/Tu email/i), "test@example.com");
    const btn = screen.getByRole("button", { name: /Generar enlace de equipo/i });
    expect(btn).not.toBeDisabled();
  });

  it("submitting moves to link step and shows a generated unifyflow.eu/e/ link", async () => {
    const user = userEvent.setup();
    renderModal();
    await user.type(screen.getByLabelText(/Nombre de la empresa/i), "Acme S.L.");
    await user.type(screen.getByLabelText(/Tu email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /Generar enlace de equipo/i }));

    await waitFor(() => {
      expect(screen.getByText("Tu enlace está listo.")).toBeInTheDocument();
    });

    // The link input should contain a unifyflow.eu/e/ URL
    const linkInput = screen.getByRole("textbox", { name: /enlace/i });
    expect(linkInput).toBeDefined();
    expect((linkInput as HTMLInputElement).value).toMatch(/unifyflow\.eu\/e\//);
  });

  it("copy button writes link to clipboard", async () => {
    renderModal();

    // Use fireEvent to avoid userEvent pointer-events issues with Radix Dialog
    fireEvent.change(screen.getByLabelText(/Nombre de la empresa/i), {
      target: { value: "Distribuciones Robledo" },
    });
    fireEvent.change(screen.getByLabelText(/Tu email/i), {
      target: { value: "admin@robledo.com" },
    });

    // Wait for form to become valid and submit
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Generar enlace de equipo/i })).not.toBeDisabled()
    );
    fireEvent.click(screen.getByRole("button", { name: /Generar enlace de equipo/i }));

    await waitFor(() => screen.getByText("Tu enlace está listo."));

    // Retrieve the generated link
    const linkInput = screen.getByRole("textbox", { name: /enlace/i }) as HTMLInputElement;
    const linkValue = linkInput.value;

    // Click copy button and wait for clipboard write
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Copiar/i }));
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(writeText).toHaveBeenCalledOnce();
    const calledWith: string = writeText.mock.calls[0][0];
    expect(calledWith).toBe(`https://${linkValue}`);
    expect(calledWith).toMatch(/^https:\/\/unifyflow\.eu\/e\//);
  });

  it("email button has href starting with mailto:", async () => {
    const user = userEvent.setup();
    renderModal();
    await user.type(screen.getByLabelText(/Nombre de la empresa/i), "Test Corp");
    await user.type(screen.getByLabelText(/Tu email/i), "a@b.com");
    await user.click(screen.getByRole("button", { name: /Generar enlace de equipo/i }));

    await waitFor(() => screen.getByText("Tu enlace está listo."));

    const emailBtn = screen.getByRole("link", { name: /Enviar por email/i });
    expect(emailBtn.getAttribute("href")).toMatch(/^mailto:/);
  });

  it("done button closes the modal", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderModal(true, onOpenChange);

    await user.type(screen.getByLabelText(/Nombre de la empresa/i), "Empresa Test");
    await user.type(screen.getByLabelText(/Tu email/i), "test@test.com");
    await user.click(screen.getByRole("button", { name: /Generar enlace de equipo/i }));

    await waitFor(() => screen.getByText("Tu enlace está listo."));

    await user.click(screen.getByRole("button", { name: /Entendido/i }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("resets to start step when modal is closed and reopened", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ToastViewport>
        <QuickStartModal open={true} onOpenChange={vi.fn()} />
      </ToastViewport>
    );

    await user.type(screen.getByLabelText(/Nombre de la empresa/i), "Empresa Test");
    await user.type(screen.getByLabelText(/Tu email/i), "test@test.com");
    await user.click(screen.getByRole("button", { name: /Generar enlace de equipo/i }));
    await waitFor(() => screen.getByText("Tu enlace está listo."));

    // Close modal
    rerender(
      <ToastViewport>
        <QuickStartModal open={false} onOpenChange={vi.fn()} />
      </ToastViewport>
    );

    // Reopen
    rerender(
      <ToastViewport>
        <QuickStartModal open={true} onOpenChange={vi.fn()} />
      </ToastViewport>
    );

    await waitFor(() => {
      expect(screen.getByText("Crea el espejo de tu empresa.")).toBeInTheDocument();
    });
  });
});

// ── Pricing tests ────────────────────────────────────────────────────────────

describe("Pricing with onOpenModal", () => {
  it("calls onOpenModal when free plan CTA is clicked", async () => {
    const user = userEvent.setup();
    const onOpenModal = vi.fn();
    render(<Pricing onOpenModal={onOpenModal} />);

    // Free plan: "Empieza gratis"
    const freeBtn = screen.getByRole("button", { name: /Empieza gratis/i });
    await user.click(freeBtn);
    expect(onOpenModal).toHaveBeenCalledOnce();
  });

  it("calls onOpenModal when highlighted plan CTA is clicked", async () => {
    const user = userEvent.setup();
    const onOpenModal = vi.fn();
    render(<Pricing onOpenModal={onOpenModal} />);

    const highlightBtn = screen.getByRole("button", { name: /Desbloquear radiografía/i });
    await user.click(highlightBtn);
    expect(onOpenModal).toHaveBeenCalledOnce();
  });

  it("renders without crashing when onOpenModal is not provided", () => {
    render(<Pricing />);
    expect(screen.getByText("El espejo")).toBeInTheDocument();
  });
});
