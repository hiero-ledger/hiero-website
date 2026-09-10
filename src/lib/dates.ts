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

/**
 * Coarse age, e.g. "3 days ago" — for the issue board's card metadata.
 *
 * `reference` is passed in rather than read from the clock so the string is a
 * pure function of its arguments. The board renders on the server and hydrates
 * in the browser minutes later, and "now" is not the same instant in those two
 * places; taking the reference from the server's own fetch timestamp makes both
 * passes agree, which is what keeps React from reporting a mismatch.
 */
const AGE_STEPS: [
  limitInSeconds: number,
  secondsPerUnit: number,
  unit: Intl.RelativeTimeFormatUnit,
][] = [
  [60, 1, "second"],
  [3600, 60, "minute"],
  [86400, 3600, "hour"],
  [2592000, 86400, "day"],
  [31536000, 2592000, "month"],
  [Number.POSITIVE_INFINITY, 31536000, "year"],
];

const RELATIVE = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });

export function formatAge(date: string, reference: string): string {
  const elapsed =
    (new Date(reference).getTime() - new Date(date).getTime()) / 1000;

  if (!Number.isFinite(elapsed)) return "";

  /* Clamped at zero: a clock skew of a few seconds between GitHub and the
     build machine would otherwise render an issue as opened "in 4 seconds". */
  const seconds = Math.max(elapsed, 0);

  for (const [limit, perUnit, unit] of AGE_STEPS) {
    if (seconds < limit) {
      return RELATIVE.format(-Math.round(seconds / perUnit), unit);
    }
  }

  return "";
}

const TIMESTAMP = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** e.g. "10 Sep 2026, 17:05 UTC" — when the issue board last reached GitHub. */
export function formatUtcTimestamp(date: string): string {
  return `${TIMESTAMP.format(new Date(date))} UTC`;
}
