import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement window.matchMedia — provide a minimal stub so GSAP
// (ScrollTrigger.register) and gsap.matchMedia() don't throw during tests.
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
