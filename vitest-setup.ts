import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { afterEach, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({
    src = "",
    alt = "",
    ...props
  }: {
    src?: string | { src?: string };
    alt?: string;
  }) =>
    createElement("img", {
      ...props,
      alt,
      src: typeof src === "string" ? src : (src?.src ?? ""),
    }),
}));

vi.mock("next/link", () => ({
  default: ({
    href = "",
    children,
    ...props
  }: {
    href?: string | { pathname?: string };
    children?: ReactNode;
  }) =>
    createElement(
      "a",
      {
        ...props,
        href: typeof href === "string" ? href : (href?.pathname ?? ""),
      },
      children,
    ),
}));

if (typeof window !== "undefined") {
  Object.defineProperty(window, "scrollTo", {
    value: vi.fn(),
    writable: true,
  });

  // jsdom does not implement matchMedia, so provide a no-match default that
  // individual tests can spy on or override.
  Object.defineProperty(window, "matchMedia", {
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
    writable: true,
  });
}

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
  document.body.style.overflow = "";
});
