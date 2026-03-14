/* eslint-disable @next/next/no-img-element */
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import type { AnchorHTMLAttributes, ImgHTMLAttributes, ReactNode } from "react";
import { afterEach, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string | { pathname?: string };
    children?: ReactNode;
  } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) => {
    const resolvedHref =
      typeof href === "string" ? href : (href.pathname ?? "");

    return (
      <a href={resolvedHref} {...props}>
        {children}
      </a>
    );
  },
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string | { src: string };
    alt: string;
  } & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">) => {
    const resolvedSrc = typeof src === "string" ? src : src.src;

    return <img src={resolvedSrc} alt={alt} {...props} />;
  },
}));

afterEach(() => {
  cleanup();
});
