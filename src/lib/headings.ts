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

const HEADING = /^(#{1,3})\s+(.+?)\s*$/;

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
 */
export function extractHeadings(markdown: string): ArticleHeading[] {
  const slug = createSlugger();
  const headings: ArticleHeading[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      continue;
    }

    if (inFence) continue;

    const match = HEADING.exec(line);

    if (!match) continue;

    const text = headingText(match[2]);

    headings.push({
      // Called for every heading even when the text is empty, because
      // `RichText` will call it for that heading too and the counters have to
      // stay aligned.
      id: slug(text),
      text,
      level: match[1].length >= 3 ? 3 : 2,
    });
  }

  return headings;
}
