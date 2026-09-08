/**
 * Post dates, formatted in UTC.
 *
 * Frontmatter dates are written date-only (`date = 2026-08-25`) and normalised
 * to UTC midnight by `lib/posts`. Formatting those with the ambient timezone
 * shows the day before to anyone behind UTC — a post dated the 25th read "24
 * August 2026" across the Americas.
 *
 * It also mattered for correctness, not just accuracy: the archive cards render
 * inside a client component, so the build machine's timezone and the visitor's
 * would disagree on the text and React would report a hydration mismatch.
 * Pinning the zone makes the output identical everywhere, which is why this is
 * `Intl` rather than `date-fns` — `format` has no timezone of its own.
 */

const LONG = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const SHORT = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/** e.g. "25 August 2026" — for the article header and the lead post. */
export function formatPostDate(date: string): string {
  return LONG.format(new Date(date));
}

/** e.g. "25 Aug 2026" — for the archive cards, which set it in mono caps. */
export function formatPostDateShort(date: string): string {
  return SHORT.format(new Date(date));
}
