// Suffixes the LFX calendar uses, in the casing we want on the site. Matched
// case-insensitively so "community call" and "Community Call" both normalise.
const CANONICAL_SUFFIXES = [
  "Community Call",
  "Community Group",
  "Working Group",
  "Office Hours",
  "Subcommittee",
];

/**
 * Turn an LFX calendar meeting title into a card name.
 *
 * The calendar prefixes most Hiero meetings with "Hiero", which is redundant
 * under a heading that already says so, and its casing is inconsistent
 * ("Hiero Monthly Maintainers community call"). Deriving the name rather than
 * hand-maintaining it means a rename on the calendar reaches the site on the
 * next build — the failure that left "Hiero Mirror Node" on the homepage after
 * it became "Block Stream Community Group".
 *
 * Names that normalisation cannot get right are handled by `callOverrides` in
 * src/data/homePageData.ts.
 */
export function normaliseCallName(name: string): string {
  let result = name.trim().replace(/\s+/g, " ");

  result = result.replace(/^Hiero\s+/i, "");
  result = result.replace(/\s+Meeting$/i, "");

  for (const suffix of CANONICAL_SUFFIXES) {
    const pattern = new RegExp(`\\s${suffix}$`, "i");
    if (pattern.test(result)) {
      result = result.replace(pattern, ` ${suffix}`);
      break;
    }
  }

  return result.trim();
}
