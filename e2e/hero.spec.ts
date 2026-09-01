import { expect, test, type Page } from "@playwright/test";

/**
 * The hero's responsive behaviour, which is entirely a cascade decision and so
 * entirely invisible to the vitest suite: every size in it comes out of a
 * `clamp`/`min` against `vw`, `svh` and `cqw`, and which of the three layouts is
 * live comes out of a media query on the viewport's *shape*. A component test
 * sees the class name and learns nothing.
 *
 * Every case below is a regression that shipped green. The stack ran to 874px
 * inside a 678px viewport on an iPad in landscape, because the split layout
 * started at 1280 and nothing under it looked at height. A `26vw` wordmark came
 * out at 173px on a 375px-tall phone. And the mark's band stopped at the
 * container's gutter, where the mask re-tiled and brought the ledger plane back
 * past a hard vertical seam.
 */

/** The header spacer in layout.tsx (`h-22.5`), i.e. what the hero has to work with. */
const HEADER = 90;

type Mode = "stack" | "split" | "compact";

interface Case {
  name: string;
  width: number;
  height: number;
  mode: Mode;
  /**
   * Ceiling on hero height as a multiple of the usable viewport. 1 means the
   * colophon has to land on the fold, which is the design's own intent and is
   * reachable everywhere the mark can sit beside the type. Portrait phones get
   * slack instead of a truncated hero: the content is five blocks deep and a
   * 667px-tall screen cannot hold it without dropping one.
   */
  maxFolds: number;
}

const CASES: Case[] = [
  { name: "iPhone SE", width: 320, height: 568, mode: "stack", maxFolds: 1.7 },
  { name: "iPhone 14", width: 390, height: 844, mode: "stack", maxFolds: 1.15 },
  {
    name: "iPad portrait",
    width: 768,
    height: 1024,
    mode: "stack",
    maxFolds: 1,
  },
  {
    name: 'iPad Pro 12.9" portrait',
    width: 1024,
    height: 1366,
    mode: "stack",
    maxFolds: 1,
  },
  // 1024 wide in both, and they want opposite layouts. This pair is the whole
  // reason the split keys on aspect ratio rather than on width.
  {
    name: "iPad landscape",
    width: 1024,
    height: 768,
    mode: "split",
    maxFolds: 1,
  },
  { name: "laptop", width: 1280, height: 800, mode: "split", maxFolds: 1 },
  { name: "desktop", width: 1920, height: 1080, mode: "split", maxFolds: 1 },
  {
    name: "short window",
    width: 900,
    height: 600,
    mode: "split",
    maxFolds: 1.05,
  },
  {
    name: "phone landscape",
    width: 667,
    height: 375,
    mode: "compact",
    maxFolds: 1.3,
  },
  {
    name: "large phone landscape",
    width: 844,
    height: 390,
    mode: "compact",
    maxFolds: 1.3,
  },
];

interface Box {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

interface Geometry {
  clientWidth: number;
  scrollWidth: number;
  hero: Box;
  scene: Box | null;
  emblem: Box | null;
  title: Box;
  /**
   * How far right the wordmark's glyphs actually reach. The element's own box is
   * the whole column and says nothing — "Hiero" sets to 2.2x its font size, so
   * at 216px it uses 476px of a 700px column.
   *
   * Horizontally a range rect is exactly the advance width. Vertically it is
   * not: Chrome measures the font's ascent and descent rather than the
   * `leading-[0.78]` line box, which puts its top edge some 80px above the cap
   * at display sizes. So this is only ever asked a horizontal question.
   */
  titleInkRight: number;
}

async function measure(page: Page): Promise<Geometry> {
  return page.evaluate(() => {
    const rect = ({
      top,
      right,
      bottom,
      left,
      width,
      height,
    }: DOMRect): Box => ({ top, right, bottom, left, width, height });
    const box = (selector: string): Box | null => {
      const element = document.querySelector(selector);
      return element ? rect(element.getBoundingClientRect()) : null;
    };

    const range = document.createRange();
    range.selectNodeContents(document.querySelector(".hero-section-title")!);

    return {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      hero: box(".hero-section")!,
      scene: box(".hero-mark-scene"),
      emblem: box(".hero-mark-emblem"),
      title: box(".hero-section-title")!,
      titleInkRight: range.getBoundingClientRect().right,
    };
  });
}

for (const { name, width, height, mode, maxFolds } of CASES) {
  test.describe(`${name} (${width}x${height})`, () => {
    test.use({ viewport: { width, height }, reducedMotion: "reduce" });

    test(`lays the hero out as ${mode} and keeps it near the fold`, async ({
      page,
    }) => {
      await page.goto("/");
      const {
        clientWidth,
        scrollWidth,
        hero,
        scene,
        emblem,
        title,
        titleInkRight,
      } = await measure(page);

      // The traces and the mark both bleed past the frame on purpose. They are
      // allowed to, as long as the section clips them instead of the document
      // growing a sideways scrollbar.
      expect(scrollWidth, "document scrolls sideways").toBeLessThanOrEqual(
        clientWidth,
      );

      const usable = height - HEADER;
      expect(
        hero.height,
        `hero is ${Math.round(hero.height)}px against ${usable}px of viewport`,
      ).toBeLessThanOrEqual(usable * maxFolds);

      expect(scene, "the mark scene is missing").not.toBeNull();
      expect(emblem, "the mark card is missing").not.toBeNull();

      if (mode === "stack") {
        // A band in the flow: shorter than the hero, and the card fits inside
        // it. At `min(13rem,56vw)` the card was 208px in a 192px band and hung
        // out of both edges.
        expect(scene!.height).toBeLessThan(hero.height);
        expect(emblem!.top).toBeGreaterThanOrEqual(scene!.top - 2);
        expect(emblem!.bottom).toBeLessThanOrEqual(scene!.bottom + 2);

        // The band reaches the viewport's edge. Ending it at the container's
        // gutter is what left a hard seam in the ledger plane, because a mask
        // is also a clip and this one re-tiled past the box.
        expect(
          scene!.right,
          "the band stops short of the frame and will show a seam",
        ).toBeGreaterThanOrEqual(clientWidth - 1);

        // Stacked, the two subjects are separated by the band's bottom edge, so
        // the question is vertical: the wordmark's column starts below it.
        expect(
          title.top,
          "the wordmark starts inside the mark's band",
        ).toBeGreaterThanOrEqual(scene!.bottom);
      } else {
        // A panel beside the type: full-height, so it costs the column nothing.
        expect(scene!.height).toBeCloseTo(hero.height, 0);
        expect(scene!.top).toBeCloseTo(hero.top, 0);

        // Side by side, the question is horizontal, and it is the one the
        // `44cqw` cap on the wordmark exists to answer.
        expect(
          titleInkRight,
          "the wordmark runs into the mark",
        ).toBeLessThanOrEqual(emblem!.left);
      }
    });
  });
}
