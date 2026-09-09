import { expect, test } from "@playwright/test";

/**
 * Browser-level behaviour of the blog.
 *
 * Everything here is invisible to jsdom, and two of these guard defects that
 * shipped green through lint, Prettier and the whole unit suite:
 *
 *  - the article rail is a height-capped flex column, so its children were
 *    shrinkable by default and the featured plate was silently squashed to two
 *    thirds of its height and clipped against its own rounded corner;
 *  - once stuck, a rail taller than the viewport ran off the bottom of the
 *    screen and put Share out of reach on the longest post.
 *
 * Neither is expressible as "does this component emit this class".
 */

/**
 * A post with enough headings to earn a contents list. Hardcoded because the
 * archive's first page is weekly round-ups, which have one heading each and so
 * never render one. If this post is ever removed, point these two tests at
 * another long one rather than deleting them.
 */
const LONG_POST = "/blog/hiero-consensus-specifications";

test.describe("blog archive", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("shows nine cards in three full rows, each with its image", async ({
    page,
  }) => {
    await page.goto("/blog/");

    const cards = page.locator(".blog-grid-item");
    await expect(cards).toHaveCount(9);

    // Three rows of three, so no row is left with an orphan: nine distinct
    // left edges would mean one column, three would mean the grid held.
    const boxes = await cards.evaluateAll(items =>
      items.map(item => {
        const box = item.getBoundingClientRect();
        return { top: Math.round(box.top), left: Math.round(box.left) };
      }),
    );
    expect(new Set(boxes.map(b => b.top)).size, "should be three rows").toBe(3);
    expect(
      new Set(boxes.map(b => b.left)).size,
      "should be three columns",
    ).toBe(3);

    // The images are the point of the grid, so they have to actually decode.
    // They load lazily, so they have to be in view and then given a moment —
    // asserting straight after `goto` measures the loading, not the result.
    await cards.last().scrollIntoViewIfNeeded();

    await expect
      .poll(
        async () =>
          page
            .locator(".blog-card-image")
            .evaluateAll(
              (images: HTMLImageElement[]) =>
                images.filter(i => !i.naturalWidth).length,
            ),
        { message: "every card image should load" },
      )
      .toBe(0);
  });

  test("stacks to a single column on a phone without scrolling sideways", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/blog/");

    // Counted first: `evaluateAll` returns [] when nothing matches, and an
    // empty list trivially satisfies the row assertion below — so without this
    // the test passed when the archive rendered no cards at all.
    const cards = page.locator(".blog-grid-item");
    await expect(cards).toHaveCount(9);

    const tops = await cards.evaluateAll(items =>
      items.map(item => Math.round(item.getBoundingClientRect().top)),
    );
    expect(new Set(tops).size, "each card should be on its own row").toBe(
      tops.length,
    );

    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      ),
      "the page must not scroll sideways",
    ).toBe(false);
  });
});

test.describe("blog article", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("keeps the rail's plate at its natural height", async ({ page }) => {
    await page.goto(LONG_POST);

    // The measurement is meaningless until the image has decoded: an
    // undecoded one reports a natural size of zero by zero.
    const image = page.locator(".blog-rail-image");
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(
        async () => image.evaluate(el => (el as HTMLImageElement).naturalWidth),
        {
          message: "the plate image should load",
        },
      )
      .toBeGreaterThan(0);

    const box = await page.evaluate(() => {
      const plate = document.querySelector(".blog-rail-plate");
      const image = document.querySelector(".blog-rail-image");
      if (!plate || !image) return null;
      return {
        plate: plate.getBoundingClientRect().height,
        image: image.getBoundingClientRect().height,
        natural:
          (image as HTMLImageElement).naturalHeight /
          (image as HTMLImageElement).naturalWidth,
        width: image.getBoundingClientRect().width,
      };
    });

    expect(box, "the rail should render a plate at this width").not.toBeNull();

    // The plate is the image plus its hairline border, not a squashed box.
    expect(
      Math.abs(box!.plate - box!.image),
      "the plate must not compress its image",
    ).toBeLessThanOrEqual(4);

    // And the image keeps the source's own proportions, so no artwork is cut.
    expect(
      Math.abs(box!.image - box!.width * box!.natural),
      "the image must keep its aspect ratio",
    ).toBeLessThanOrEqual(2);
  });

  test("sticks the rail and keeps all of it on screen", async ({ page }) => {
    await page.goto(LONG_POST);

    const rail = page.locator(".blog-rail");
    await expect(rail).toHaveCSS("position", "sticky");

    await page.mouse.move(640, 500);
    await page.mouse.wheel(0, 3600);

    // The regression this guards: a stuck rail taller than the screen used to
    // extend past the bottom edge, and the part below it could not be got to
    // at all. Its own box must now sit inside the viewport...
    await expect
      .poll(
        async () => {
          const box = await rail.boundingBox();
          if (!box) return null;
          return Math.round(box.y + box.height) <= page.viewportSize()!.height;
        },
        { message: "the stuck rail should sit inside the viewport" },
      )
      .toBe(true);

    // ...and everything in it has to remain reachable, which on a short
    // window means the rail scrolls rather than hiding its lower half. Share
    // is the last thing in it, so it is what proves the point.
    const inner = page.locator(".blog-rail-inner");
    await inner.evaluate(el => {
      el.scrollTop = el.scrollHeight;
    });

    const share = page.locator('.blog-rail [aria-label="Share on X"]');
    await expect
      .poll(
        async () => {
          const box = await share.boundingBox();
          if (!box) return null;
          const height = page.viewportSize()!.height;
          return box.y >= 0 && Math.round(box.y + box.height) <= height;
        },
        { message: "share should be reachable inside the stuck rail" },
      )
      .toBe(true);
  });

  test("tracks the section being read in the contents list", async ({
    page,
  }) => {
    await page.goto(LONG_POST);

    const contents = page.locator(".blog-contents-link");
    await expect(
      contents.first(),
      "this post should be long enough for a contents list",
    ).toBeVisible();

    const first = await contents.first().textContent();

    await page.mouse.move(640, 500);
    await page.mouse.wheel(0, 5200);

    // Exactly one entry is marked, wherever the reader stops — the marker
    // should never be absent, which is how the first version of this failed.
    await expect(page.locator(".blog-contents-link[aria-current]")).toHaveCount(
      1,
    );

    await expect
      .poll(
        async () =>
          page
            .locator(".blog-contents-link[aria-current]")
            .first()
            .textContent(),
        { message: "the marked entry should follow the reader down the page" },
      )
      .not.toBe(first);

    // And back to the top puts it back on the first section.
    await page.mouse.wheel(0, -6000);

    await expect
      .poll(async () =>
        page.locator(".blog-contents-link[aria-current]").first().textContent(),
      )
      .toBe(first);
  });

  test("gives every contents entry a heading to land on, clear of the header", async ({
    page,
  }) => {
    await page.goto(LONG_POST);

    // A contents list whose anchors miss looks like a working page until it is
    // clicked, so nothing else in the suite would notice.
    const orphans = await page.evaluate(() =>
      [...document.querySelectorAll(".blog-contents-link")]
        .map(link => (link.getAttribute("href") ?? "").slice(1))
        .filter(id => !id || !document.getElementById(id)),
    );
    expect(orphans, "every contents link needs a target").toEqual([]);

    const target = page.locator(".blog-contents-link").nth(3);
    const href = (await target.getAttribute("href"))!;
    await target.click();

    const headerHeight = await page.evaluate(
      () =>
        document.querySelector(".site-header")?.getBoundingClientRect()
          .height ?? 0,
    );

    await expect
      .poll(
        async () =>
          page.locator(href).evaluate(el => el.getBoundingClientRect().top),
        { message: "a jumped-to heading should clear the fixed header" },
      )
      .toBeGreaterThanOrEqual(headerHeight);
  });

  test("does not scroll sideways on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(LONG_POST);

    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      ),
    ).toBe(false);
  });
});
