/**
 * The contributor-difficulty vocabulary, shared by the fetch that asks GitHub
 * for labelled issues and the board that filters them in the browser.
 *
 * Hiero repositories do not agree on how a skill level is written: some carry
 * `good first issue`, some `skill: good first issue`, some `Good-First-Issue`.
 * Rather than a list of loose regexes — the previous approach, where
 * `/beginner/i` also matched `beginner-friendly-docs-only` and `/easy/i`
 * matched `easy to reproduce` — labels are normalised to one canonical form and
 * then matched exactly.
 */

export const DIFFICULTY_VALUES = [
  "good-first-issue",
  "beginner",
  "intermediate",
  "advanced",
] as const;

export type DifficultyValue = (typeof DIFFICULTY_VALUES)[number];

export interface Difficulty {
  value: DifficultyValue;
  label: string;
  /** Canonical (normalised) label names that mean this level. */
  aliases: string[];
}

/**
 * Order is priority order: an issue labelled both `good first issue` and
 * `beginner` is shown as the more inviting of the two, because that is the one
 * a first-time contributor is scanning for.
 */
export const DIFFICULTIES: Difficulty[] = [
  {
    value: "good-first-issue",
    label: "Good first issue",
    aliases: ["good first issue", "first timers only", "first issue"],
  },
  {
    value: "beginner",
    label: "Beginner",
    aliases: ["beginner", "starter", "easy"],
  },
  {
    value: "intermediate",
    /* Not "medium": several repositories carry `priority: medium`, and while
       the prefix is stripped before matching, an unprefixed `medium` on a
       priority scale would be read as a difficulty. */
    label: "Intermediate",
    aliases: ["intermediate"],
  },
  {
    value: "advanced",
    label: "Advanced",
    aliases: ["advanced", "hard", "expert"],
  },
];

/**
 * A label reduced to the form the aliases above are written in: lower case, no
 * `skill:`-style qualifier, separators collapsed to single spaces. This is what
 * lets one alias cover `skill: good first issue`, `Good-First-Issue` and
 * `good first issue` without three entries.
 */
export function normaliseLabel(name: string): string {
  return name
    .toLowerCase()
    .replace(/^\s*(skill|level|difficulty|complexity)\s*:\s*/, "")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const LABEL_BY_VALUE = new Map<DifficultyValue, string>(
  DIFFICULTIES.map(difficulty => [difficulty.value, difficulty.label]),
);

export function difficultyLabel(value: DifficultyValue): string {
  return LABEL_BY_VALUE.get(value) ?? value;
}

export function isDifficultyValue(value: string): value is DifficultyValue {
  return LABEL_BY_VALUE.has(value as DifficultyValue);
}

/**
 * The level an issue advertises, or null when it advertises none. Walks
 * `DIFFICULTIES` rather than the issue's own label order so the answer does not
 * depend on which label a maintainer happened to add first.
 */
export function classifyDifficulty(labels: string[]): DifficultyValue | null {
  const normalised = new Set(labels.map(normaliseLabel));

  for (const difficulty of DIFFICULTIES) {
    if (difficulty.aliases.some(alias => normalised.has(alias))) {
      return difficulty.value;
    }
  }

  return null;
}
