import { expect, test } from "@playwright/test";
import { collectContrastFailures } from "./helpers/contrast";

/**
 * 700px is deliberate. It is not a device size -- it is the gap that opens up
 * whenever the JS breakpoint, the utility prefix and a media query in
 * globals.css stop agreeing. Nobody opens a browser at 700px by accident,
 * which is exactly why a regression there survives review.
 */
const WIDTHS = [
  { name: "mobile", width: 375, height: 667 },
  { name: "between", width: 700, height: 800 },
  { name: "desktop", width: 1280, height: 900 },
];

async function openMenuIfPresent(page: import("@playwright/test").Page) {
  const opener = page.getByRole("button", { name: "Open menu" });
  if (!(await opener.isVisible().catch(() => false))) return false;
  await opener.click();
  await expect(page.locator("#navigation")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  return true;
}

for (const { name, width, height } of WIDTHS) {
  test.describe(`${name} (${width}x${height})`, () => {
    test.use({ viewport: { width, height } });

    test("navigation text is readable against its background", async ({
      page,
    }) => {
      await page.goto("/");
      await openMenuIfPresent(page);

      // Scoped to the header: the nav overlay and the bar behind it are the
      // pair that has actually gone wrong, and a site-wide sweep would need
      // its own pass over pre-existing content first.
      const failures = await page.evaluate(collectContrastFailures, "header");

      expect(
        failures,
        `Unreadable navigation text at ${width}px:\n` +
          failures
            .map(
              f =>
                `  "${f.text}" ${f.color} on ${f.background} = ${f.ratio}:1 (needs ${f.required}:1)`,
            )
            .join("\n"),
      ).toEqual([]);
    });

    test("every menu item is reachable inside the viewport", async ({
      page,
    }) => {
      await page.goto("/");
      const opened = await openMenuIfPresent(page);
      test.skip(!opened, "no mobile menu at this width");

      const clipped = await page.evaluate(() => {
        const items = Array.from(
          document.querySelectorAll("#menu > li"),
        ) as HTMLElement[];
        return items
          .map(li => {
            const box = li.getBoundingClientRect();
            return {
              text: (li.textContent ?? "").trim().slice(0, 30),
              top: Math.round(box.top),
              bottom: Math.round(box.bottom),
            };
          })
          .filter(i => i.top < 0 || i.bottom > window.innerHeight);
      });

      // The overlay locks body scrolling, so anything outside the viewport
      // cannot be scrolled to -- it is simply unreachable.
      expect(
        clipped,
        `Menu items outside the viewport at ${width}x${height}:\n` +
          clipped
            .map(i => `  "${i.text}" top=${i.top} bottom=${i.bottom}`)
            .join("\n"),
      ).toEqual([]);
    });

    test("the page does not scroll sideways", async ({ page }) => {
      await page.goto("/");
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(
        overflow.clientWidth + 1,
      );
    });
  });
}
