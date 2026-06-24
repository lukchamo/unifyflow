import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock next/image since it requires Next.js runtime
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt as string} />;
  },
}));

// Mock next/font/google — used in layout
vi.mock("next/font/google", () => ({
  Newsreader: () => ({ variable: "--font-newsreader", className: "newsreader" }),
  IBM_Plex_Sans: () => ({ variable: "--font-sans", className: "plex-sans" }),
  IBM_Plex_Mono: () => ({ variable: "--font-mono", className: "plex-mono" }),
}));

// Import page after mocks
import LandingPage from "@/app/page";

describe("Landing page", () => {
  it("renders H1 hero text", () => {
    render(<LandingPage />);
    expect(
      screen.getByText("El espejo que tu empresa nunca tuvo.")
    ).toBeInTheDocument();
  });

  it("renders all 4 HowItWorks step titles", () => {
    render(<LandingPage />);
    expect(screen.getByText("Invita a tu equipo")).toBeInTheDocument();
    expect(screen.getByText("Responden en 5 min")).toBeInTheDocument();
    expect(screen.getByText("El mapa se dibuja solo")).toBeInTheDocument();
    expect(screen.getByText("Dónde aplicar IA")).toBeInTheDocument();
  });

  it("renders 3 pricing plan names", () => {
    render(<LandingPage />);
    expect(screen.getByText("El espejo")).toBeInTheDocument();
    expect(screen.getByText("Radiografía + IA")).toBeInTheDocument();
    expect(screen.getByText("Mapa Vivo")).toBeInTheDocument();
  });

  it("renders Differentiator UnifyFlow highlight row", () => {
    render(<LandingPage />);
    const matches = screen.getAllByText("UnifyFlow");
    expect(matches.length).toBeGreaterThan(0);
  });

  it("renders Preview locked label", () => {
    render(<LandingPage />);
    expect(
      screen.getByText("Oportunidades 2 y 3, bloqueadas")
    ).toBeInTheDocument();
  });

  it("Showcase renders both Borrador and Validado chips (reduced-motion / no-JS users see final state)", () => {
    render(<LandingPage />);
    // Both chips must be in the DOM — animated one is hidden via GSAP only when
    // motion is allowed; no-JS / reduced-motion users see both rendered.
    expect(screen.getByText("Borrador")).toBeInTheDocument();
    expect(screen.getByText("✓ Validado")).toBeInTheDocument();
  });
});
