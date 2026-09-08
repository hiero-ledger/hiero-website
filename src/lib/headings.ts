/**
 * Heading anchors for article content.
 *
 * A post's contents list is built from the markdown source on the server,
 * while the headings it points at are rendered from the same source by
 * `RichText` in a separate pass. Nothing joins the two but the id, so both
 * sides compute it here: `createSlugger` is called in the same document order
 * in both places, which is what keeps the duplicate counters — and therefore
 * every anchor after the first repeated heading — in step.
 */

export interface ArticleHeading {
  id: string;
  text: string;
  /** 2 for a top-level section, 3 for one nested under it. */
  level: 2 | 3;
}

/** `#` inside a fenced block is a comment in someone's Python, not a heading. */
const FENCE = /^\s*(?:```|~~~)/;

const ATX_HEADING = /^(#{1,3})\s+(.+?)\s*$/;

/** `===` makes the paragraph above it an h1, `---` an h2. */
const SETEXT_UNDERLINE = /^ {0,3}(?:=+|-+)\s*$/;

/**
 * Lines that start a block of their own, so a paragraph cannot run into an
 * underline through them: list items, block quotes, table rows, and indented
 * code. Without this a dash under a list would read as a heading.
 */
const LEADS_A_BLOCK = /^(?: {4,}|\s*(?:[-*+>|]\s|\d+[.)]\s))/;

/**
 * Inline markdown reduced to the words it renders as, so a slug taken from the
 * source matches one taken from the rendered heading's text.
 */
export function headingText(markdown: string): string {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/\s*#+\s*$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Slugs for one document. Repeated headings — "Background" twice in the same
 * post — get a counter rather than a colliding id.
 */
export function createSlugger(): (text: string) => string {
  const seen = new Map<string, number>();

  return (text: string) => {
    const base = slugify(text) || "section";
    const used = seen.get(base) ?? 0;

    seen.set(base, used + 1);

    return used === 0 ? base : `${base}-${used + 1}`;
  };
}

/**
 * Every h1–h3 in the post, in order. h1 and h2 both come back as level 2: a
 * few posts open with a `#`, and in a contents list that is the same kind of
 * entry as a `##`, whatever the tag ends up being.
 *
 * Both heading syntaxes are recognised, because both are in the content. Most
 * of the weekly round-ups close with
 *
 *     **Want to be featured on the Hiero-Website?**
 *     --
 *
 * which is a setext h2, and `react-markdown` renders it as one. Counting only
 * `#` headings missed it in 32 of the 73 posts — leaving those entries out of
 * a contents list, and worse, taking the slug counters here out of step with
 * the ones `RichText` runs while rendering, which silently repoints every
 * anchor after the first repeated heading.
 */
export function extractHeadings(markdown: string): ArticleHeading[] {
  const slug = createSlugger();
  const headings: ArticleHeading[] = [];
  const lines = markdown.split("\n");

  let inFence = false;
  /** The paragraph a setext underline would turn into a heading. */
  let paragraph: string[] = [];

  const push = (text: string, level: 2 | 3) => {
    headings.push({
      // Called for every heading even when the text is empty, because
      // `RichText` will call it for that heading too and the counters have to
      // stay aligned.
      id: slug(text),
      text,
      level,
    });
  };

  for (const line of lines) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      paragraph = [];
      continue;
    }

    if (inFence) continue;

    const atx = ATX_HEADING.exec(line);

    if (atx) {
      paragraph = [];
      push(headingText(atx[2]), atx[1].length >= 3 ? 3 : 2);
      continue;
    }

    // An underline only makes a heading of the paragraph directly above it.
    // With a blank line above instead, a row of dashes is a thematic break —
    // which is what most of the `---` in these posts actually are.
    const underline = SETEXT_UNDERLINE.exec(line);

    if (underline && paragraph.length > 0) {
      push(headingText(paragraph.join(" ")), 2);
      paragraph = [];
      continue;
    }

    if (!line.trim() || LEADS_A_BLOCK.test(line)) {
      paragraph = [];
      continue;
    }

    paragraph.push(line.trim());
  }

  return headings;
}
