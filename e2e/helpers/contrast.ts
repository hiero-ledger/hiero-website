/**
 * Runs inside the page. Returns every visible text-bearing element whose
 * contrast against its *effective* background falls below the WCAG AA
 * threshold for its size.
 *
 * "Effective" background matters: an element is usually transparent, so the
 * colour a reader actually sees comes from an ancestor. Walking up and
 * compositing is what catches charcoal text sitting on a charcoal overlay --
 * both elements are individually fine, and only the pair is broken.
 */
export const AA_NORMAL = 4.5;
export const AA_LARGE = 3;

export interface ContrastFailure {
  text: string;
  selector: string;
  color: string;
  background: string;
  ratio: number;
  required: number;
  fontSize: number;
}

export function collectContrastFailures(rootSelector = "body"): ContrastFailure[] {
  // Declared inside the function on purpose: page.evaluate ships the function
  // body to the browser, so anything at module scope is not defined there.
  const aaNormal = 4.5;
  const aaLarge = 3;

  type Rgba = { r: number; g: number; b: number; a: number };

  const parse = (value: string): Rgba | null => {
    const m = value.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    const [r, g, b, a = 1] = parts;
    if ([r, g, b].some(Number.isNaN)) return null;
    return { r, g, b, a };
  };

  // src over dst, both premultiplied out to plain rgb.
  const over = (src: Rgba, dst: Rgba): Rgba => {
    const a = src.a + dst.a * (1 - src.a);
    if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
    const blend = (s: number, d: number) =>
      (s * src.a + d * dst.a * (1 - src.a)) / a;
    return {
      r: blend(src.r, dst.r),
      g: blend(src.g, dst.g),
      b: blend(src.b, dst.b),
      a,
    };
  };

  const luminance = ({ r, g, b }: Rgba) => {
    const channel = (c: number) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };

  const ratio = (fg: Rgba, bg: Rgba) => {
    const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
    return (a + 0.05) / (b + 0.05);
  };

  const isHidden = (el: Element) => {
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") return true;
    if (Number(cs.opacity) === 0) return true;
    const box = el.getBoundingClientRect();
    return box.width === 0 || box.height === 0;
  };

  const hiddenBranch = (el: Element) => {
    for (let n: Element | null = el; n; n = n.parentElement) {
      if (isHidden(n)) return true;
      if (n.getAttribute("aria-hidden") === "true") return true;
    }
    return false;
  };

  /**
   * null means "cannot be known from computed styles alone" -- an ancestor
   * paints a gradient or image, so there is no single background colour to
   * compare against. Those elements are skipped rather than guessed at; a
   * false failure on every hero would get the whole check switched off.
   */
  const effectiveBackground = (el: Element): Rgba | null => {
    let acc: Rgba = { r: 0, g: 0, b: 0, a: 0 };
    for (let n: Element | null = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage !== "none") return null;
      const bg = parse(cs.backgroundColor);
      if (bg && bg.a > 0) {
        acc = over(acc, bg);
        if (acc.a >= 1) return acc;
      }
    }
    // Nothing opaque all the way up: the canvas is white.
    return over(acc, { r: 255, g: 255, b: 255, a: 1 });
  };

  const describe = (el: Element) => {
    const id = el.id ? `#${el.id}` : "";
    const cls = el.className && typeof el.className === "string"
      ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
      : "";
    return `${el.tagName.toLowerCase()}${id}${cls}`;
  };

  const failures: ContrastFailure[] = [];

  const root = document.querySelector(rootSelector);
  if (!root) throw new Error(`contrast root not found: ${rootSelector}`);

  for (const el of Array.from(root.querySelectorAll("*"))) {
    // Only elements that render their own text, so each string is judged once.
    const own = Array.from(el.childNodes)
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .map(n => n.textContent ?? "")
      .join("")
      .trim();
    if (!own) continue;
    if (hiddenBranch(el)) continue;

    const cs = getComputedStyle(el);
    const fg = parse(cs.color);
    if (!fg) continue;

    const bg = effectiveBackground(el);
    if (!bg) continue;

    const composited = over(fg, bg);
    const value = ratio(composited, bg);

    const fontSize = parseFloat(cs.fontSize);
    const bold = Number(cs.fontWeight) >= 700;
    const large = fontSize >= 24 || (bold && fontSize >= 18.66);
    const required = large ? aaLarge : aaNormal;

    if (value < required) {
      failures.push({
        text: own.slice(0, 40),
        selector: describe(el),
        color: cs.color,
        background: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
        ratio: Math.round(value * 100) / 100,
        required,
        fontSize,
      });
    }
  }

  return failures;
}
