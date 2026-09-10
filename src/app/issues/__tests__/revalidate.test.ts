import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { REVALIDATE_SECONDS } from "@/lib/github/issues";

/**
 * The page's `revalidate` has to be a literal — Next reads segment config
 * statically and fails the build on an imported binding — so it cannot be the
 * same expression as the `next: { revalidate }` the fetches use.
 *
 * Two numbers that must agree and cannot share a definition drift silently:
 * raising one alone either leaves the page cached past its data or refetches
 * data the page is not rebuilding for. This reads the source, which is the only
 * way to see the literal without importing a server component.
 */
describe("issues page revalidation", () => {
  it("matches the window the GitHub fetches are cached for", () => {
    const source = readFileSync(path.resolve(__dirname, "../page.tsx"), "utf8");

    const match = /export const revalidate = (\d+);/.exec(source);

    expect(match, "no literal `export const revalidate` in page.tsx").not.toBe(
      null,
    );
    expect(Number(match?.[1])).toBe(REVALIDATE_SECONDS);
  });
});
