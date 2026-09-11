import { expect, test } from "@playwright/test";

/**
 * The profile dialog is the only one on the site, and the only part of the TSC
 * page that has state. What is checked here is what a real browser decides and
 * jsdom does not: where focus actually is after a click, whether Tab leaves the
 * dialog, and whether focus comes back to the card that opened it.
 */
test.describe("TSC profile dialog", () => {
  test("traps focus while open and hands it back on close", async ({
    page,
  }) => {
    await page.goto("/tsc");

    const trigger = page.getByRole("button", {
      name: "Read full profile for Richard Bair",
    });

    await trigger.click();

    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Close profile dialog" }),
    ).toBeFocused();

    // Tab cycles inside the dialog rather than walking the page behind it.
    for (let press = 1; press <= 6; press += 1) {
      await page.keyboard.press("Tab");

      const inside = await page.evaluate(
        () =>
          document
            .querySelector(".tsc-profile")
            ?.contains(document.activeElement) ?? false,
      );

      expect(inside, `focus left the dialog after ${press} tabs`).toBe(true);
    }

    // The page behind is held still while the dialog is over it.
    expect(await page.evaluate(() => document.body.style.overflow)).toBe(
      "hidden",
    );

    await page.keyboard.press("Escape");

    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  });

  test("closes on the backdrop, and still returns focus", async ({ page }) => {
    await page.goto("/tsc");

    const trigger = page.getByRole("button", {
      name: "Read full profile for Richard Bair",
    });

    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    // A corner of the backdrop, well clear of the panel.
    await page.mouse.click(20, 20);

    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});
