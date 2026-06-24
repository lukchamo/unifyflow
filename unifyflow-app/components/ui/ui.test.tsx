/**
 * ui.test.tsx — TDD tests for UI primitives
 * Run: npx vitest run components/ui/ui.test.tsx
 */
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatusPill } from "./StatusPill";
import { Avatar } from "./Avatar";
import { ProgressSegments } from "./ProgressSegments";

describe("StatusPill", () => {
  it('renders "Oportunidad IA" for estado="opportunity"', () => {
    render(<StatusPill estado="opportunity" />);
    expect(screen.getByText("Oportunidad IA")).toBeInTheDocument();
  });

  it('renders "Validado" for estado="validated"', () => {
    render(<StatusPill estado="validated" />);
    expect(screen.getByText("Validado")).toBeInTheDocument();
  });

  it('renders "Borrador" for estado="draft"', () => {
    render(<StatusPill estado="draft" />);
    expect(screen.getByText("Borrador")).toBeInTheDocument();
  });
});

describe("Avatar", () => {
  it('renders initials "MR" for name="Marta Ruiz"', () => {
    render(<Avatar name="Marta Ruiz" />);
    expect(screen.getByText("MR")).toBeInTheDocument();
  });

  it('renders initials "AB" for name="Ana Benitez Lopez" (first 2 words)', () => {
    render(<Avatar name="Ana Benitez Lopez" />);
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("renders single initial for single-word name", () => {
    render(<Avatar name="Carlos" />);
    expect(screen.getByText("C")).toBeInTheDocument();
  });
});

describe("ProgressSegments", () => {
  it("renders 4 segments for total={4}", () => {
    const { container } = render(<ProgressSegments total={4} active={3} />);
    // Each segment is a div inside the container
    const segments = container.querySelectorAll("[data-segment]");
    expect(segments).toHaveLength(4);
  });

  it("marks 3 segments as active out of 4", () => {
    const { container } = render(<ProgressSegments total={4} active={3} />);
    const activeSegments = container.querySelectorAll('[data-active="true"]');
    const inactiveSegments = container.querySelectorAll('[data-active="false"]');
    expect(activeSegments).toHaveLength(3);
    expect(inactiveSegments).toHaveLength(1);
  });
});
