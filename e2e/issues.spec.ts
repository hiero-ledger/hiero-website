import { expect, test, type Page } from "@playwright/test";

/**
 * Browser-level behaviour of the Issue Explorer.
 *
 * Two things here are invisible to jsdom and to the unit suite:
 *
 *  - the level badges are the one place on the site that uses colours from
 *    outside the brand palette (the green/blue/amber/red convention every
 *    issue tracker uses), and only a real cascade says what those tints
 *    actually resolve to against the sand band they sit on;
 *  - the board is server-rendered and filtered in the browser, so "the issues
 *    are in the HTML before any script runs" is a property of the page, not
 *    of the component.
 */

/**
 * The board's contents come from GitHub at build time, and an unauthenticated
 * build behind a rate limit legitimately renders an empty board — the page
 * says so. Structure and colour are checked either way; anything that needs a
 * card skips rather than fails, so a throttled build does not turn into a red
 * suite.
 */
async function cardCount(page: Page): Promise<number> {
  return page.locator(".issues-card").count();
}

test.describe("issue explorer", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("ships the board in the HTML, before any script runs", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/issues/");

    /* The whole point of the rewrite: no spinner, no fetch, no empty shell.
       The filters need script, but the issues do not. */
    await expect(
      page.getByRole("heading", { name: "Issue Explorer" }),
    ).toBeVisible();
    await expect(page.locator("text=Loading issues")).toHaveCount(0);

    const cards = await cardCount(page);
    test.skip(cards === 0, "board came back empty — GitHub rate limit");

    expect(cards).toBeGreaterThan(0);
    /* Every card is an SDK issue: the board is scoped to `hiero-sdk-*`, and a
       link to anything else means the repository filter has stopped biting. */
    const hrefs = await page
      .locator(".issues-card")
      .evaluateAll(nodes => nodes.map(node => node.getAttribute("href") ?? ""));

    for (const href of hrefs) {
      expect(href).toMatch(
        /^https:\/\/github\.com\/hiero-ledger\/hiero-sdk-[\w.-]+\/issues\/\d+$/,
      );
    }

    await context.close();
  });

  /**
   * Each level in turn, via its own filter link, because the four colour pairs
   * are four separate risks and page one of the board carries whichever three
   * happen to be most recently active.
   */
  const LEVELS = [
    "good-first-issue",
    "beginner",
    "intermediate",
    "advanced",
  ] as const;

  for (const level of LEVELS) {
    test(`the ${level} badge stays readable`, async ({ page }) => {
      await page.goto(`/issues/?level=${level}`);
      await expect(page.locator(".issues-levels")).toBeVisible();

      /* Measured here rather than through `collectContrastFailures`, which
         cannot see this band: it skips any element whose background comes
         from an ancestor painting a gradient, and both of this page's bands
         do. The badges are worth checking on their own anyway — they are the
         one place on the site using colours from outside the brand palette,
         and each carries an opaque fill, so the ratio is well defined. */
      const ratios = await page
        .locator(`.issues-card-level[data-level="${level}"]`)
        .evaluateAll(nodes =>
          nodes.map(node => {
            const styles = getComputedStyle(node);

            const channels = (value: string) =>
              (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);

            const luminance = ([r, g, b]: number[]) => {
              const channel = (c: number) => {
                const s = c / 255;
                return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
              };
              return (
                0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
              );
            };

            const [light, dark] = [
              luminance(channels(styles.color)),
              luminance(channels(styles.backgroundColor)),
            ].sort((a, b) => b - a);

            return Math.round(((light + 0.05) / (dark + 0.05)) * 100) / 100;
          }),
        );

      test.skip(
        ratios.length === 0,
        `no ${level} issues on the board — GitHub rate limit, or none labelled`,
      );

      expect(Math.min(...ratios), `${level} badge`).toBeGreaterThanOrEqual(4.5);
    });
  }

  test("filters without asking GitHub, and says so in the URL", async ({
    page,
  }) => {
    /* Only requests for issue data are interesting. Next prefetches the routes
       in the header and lazily pulls its own chunks whenever it likes, so
       asserting on the raw request list measures the framework, not the
       filter — that version of this test failed about one run in three. */
    const dataRequests: string[] = [];
    page.on("request", request => {
      const url = request.url();
      if (/api\.github\.com|\/api\/issues/.test(url)) dataRequests.push(url);
    });

    await page.goto("/issues/");
    await expect(page.locator(".issues-levels")).toBeVisible();

    test.skip(
      (await cardCount(page)) === 0,
      "board came back empty — GitHub rate limit",
    );

    await page.getByRole("button", { name: /^Good first issue,/ }).click();

    await expect(page).toHaveURL(/\?level=good-first-issue$/);

    const levels = await page
      .locator(".issues-card-level")
      .evaluateAll(nodes => nodes.map(node => node.textContent?.trim()));

    expect(new Set(levels)).toEqual(new Set(["Good first issue"]));

    /* Filtering is a re-render over an array already in the page. The explorer
       this replaced answered the same click with seven GitHub searches. */
    expect(
      dataRequests,
      `filtering fetched issue data:\n${dataRequests.join("\n")}`,
    ).toEqual([]);
  });

  test("opens on the filter a shared link carries", async ({ page }) => {
    await page.goto("/issues/?level=advanced");

    await expect(
      page.getByRole("button", { name: /^Advanced,/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("keeps the toolbar usable at a phone width", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/issues/");

    /* Nothing may overflow the viewport: a filter bar that scrolls sideways is
       a filter bar nobody finds the second half of. */
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, "page scrolls horizontally").toBeLessThanOrEqual(0);

    /* `exact` matters: the search field's own label mentions repositories, so
       a substring match resolves to two controls. */
    for (const label of ["Repository", "Sort"]) {
      await expect(page.getByLabel(label, { exact: true })).toBeVisible();
    }

    await expect(page.getByRole("searchbox")).toBeVisible();
  });
});
