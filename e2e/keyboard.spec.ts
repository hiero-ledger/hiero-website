import { expect, test } from "@playwright/test";

/**
 * Keyboard-only behaviour of the header bar.
 *
 * Both of these shipped green through lint, Prettier and the full unit suite:
 * jsdom has no layout, so the sliding rule cannot be measured there, and it has
 * no scrolling, so the header never hides. Neither defect is visible to a mouse
 * user, which is the other half of why they survived review.
 */

/** Geometry of the sliding underline, measured the way the component sets it. */
async function rule(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const el = document.querySelector(".menu-rule");
    if (!el) return null;
    const cs = getComputedStyle(el);
    const m = cs.transform.match(/matrix\(1, 0, 0, 1, ([-\d.]+)/);
    return {
      width: Math.round(parseFloat(cs.width)),
      x: m ? Math.round(Number(m[1])) : null,
      opacity: cs.opacity,
    };
  });
}

/** Move focus to the first control outside the header, without using a pointer. */
async function focusOutsideHeader(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    (document.activeElement as HTMLElement | null)?.blur();
    const target = document.querySelector<HTMLElement>(
      "main a, main button, footer a",
    );
    target?.focus();
  });
}

test.describe("desktop keyboard navigation", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("the sliding rule returns to the current page after focus leaves the bar", async ({
    page,
  }) => {
    await page.goto("/blog/");
    const atRest = await rule(page);
    expect(atRest, "the rule should mark the current page at rest").not.toBeNull();
    expect(atRest!.opacity).toBe("1");

    await page.locator('.menu-link:has-text("Calendar")').focus();
    await expect
      .poll(async () => (await rule(page))!.x)
      .not.toBe(atRest!.x);

    await focusOutsideHeader(page);

    // Left parked, the underline marks a page the reader is not on.
    await expect
      .poll(async () => (await rule(page))!.x, {
        message: "rule should settle back onto the active page",
      })
      .toBe(atRest!.x);
    expect((await rule(page))!.width).toBe(atRest!.width);
  });

  test("a page with no active nav item hides the rule again after focus leaves", async ({
    page,
  }) => {
    // Home matches no menu item: "Contribute" and "Connect" are in-page
    // anchors and "Calendar" is external, so the rule has nothing to mark.
    await page.goto("/");
    await expect.poll(async () => (await rule(page))!.opacity).toBe("0");

    await page.locator('.menu-link:has-text("TSC")').focus();
    await expect.poll(async () => (await rule(page))!.opacity).toBe("1");

    await focusOutsideHeader(page);
    await expect
      .poll(async () => (await rule(page))!.opacity, {
        message: "rule should hide again where no nav item is active",
      })
      .toBe("0");
  });

  test("the header reveals itself when focus enters it while hidden", async ({
    page,
  }) => {
    await page.goto("/blog/");
    const bar = page.locator("header > div");

    await page.mouse.move(640, 500);
    await page.mouse.wheel(0, 600);
    await expect(bar).toHaveClass(/site-header--hidden/);

    // Shift-tabbing back up lands here; the bar is off-screen at this point.
    await page.locator('header a[aria-label="Go to homepage"]').focus();

    await expect(
      bar,
      "focus must not land on an off-screen control",
    ).not.toHaveClass(/site-header--hidden/);
    const box = await page
      .locator('header a[aria-label="Go to homepage"]')
      .boundingBox();
    expect(box, "the focused link should have a box").not.toBeNull();
    expect(box!.y, "focused link should be inside the viewport").toBeGreaterThanOrEqual(0);
  });
});
