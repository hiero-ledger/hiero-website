import { isDifficultyValue, type DifficultyValue } from "@/issues/difficulty";
import type { ExplorerIssue } from "@/issues/types";

/**
 * Everything the board does to a list of issues once it has one.
 *
 * All of it is pure and synchronous, and all of it runs in the browser against
 * an array the server already delivered. That is the point: the previous
 * explorer re-ran seven GitHub searches every time the difficulty select
 * changed — for a filter it then applied locally anyway — so a click cost a
 * second or more and a share of the rate limit. Here a click costs a re-render.
 */

export const SORT_VALUES = ["updated", "created", "discussed"] as const;

export type SortValue = (typeof SORT_VALUES)[number];

export const SORT_OPTIONS: { value: SortValue; label: string }[] = [
  { value: "updated", label: "Recently active" },
  { value: "created", label: "Newest" },
  { value: "discussed", label: "Most discussed" },
];

export function isSortValue(value: string): value is SortValue {
  return (SORT_VALUES as readonly string[]).includes(value);
}

export interface IssueQuery {
  search: string;
  difficulty: DifficultyValue | null;
  repo: string | null;
  sort: SortValue;
}

export const EMPTY_QUERY: IssueQuery = {
  search: "",
  difficulty: null,
  repo: null,
  sort: "updated",
};

export function isDefaultQuery(query: IssueQuery): boolean {
  return (
    query.search.trim() === "" &&
    query.difficulty === null &&
    query.repo === null &&
    query.sort === EMPTY_QUERY.sort
  );
}

/**
 * Free text matches the title, the repository and the labels, so "python",
 * "docs" and "flaky test" all find something without the reader having to know
 * which of the three they are searching.
 *
 * Terms are AND-ed and matched as substrings: an issue board is scanned, not
 * queried, and "sdk timeout" should narrow rather than widen.
 */
function matchesSearch(issue: ExplorerIssue, terms: string[]): boolean {
  if (terms.length === 0) return true;

  const haystack = [
    issue.title,
    issue.repo,
    `#${issue.number}`,
    ...issue.labels,
  ]
    .join(" ")
    .toLowerCase();

  return terms.every(term => haystack.includes(term));
}

function comparator(
  sort: SortValue,
): (a: ExplorerIssue, b: ExplorerIssue) => number {
  switch (sort) {
    case "created":
      return (a, b) => b.createdAt.localeCompare(a.createdAt);

    /* Ties on comment count are common — most issues have none — so the
       secondary key keeps the order stable and useful rather than arbitrary. */
    case "discussed":
      return (a, b) =>
        b.comments - a.comments || b.updatedAt.localeCompare(a.updatedAt);

    case "updated":
    default:
      return (a, b) => b.updatedAt.localeCompare(a.updatedAt);
  }
}

export function filterIssues(
  issues: ExplorerIssue[],
  query: IssueQuery,
): ExplorerIssue[] {
  const terms = query.search
    .toLowerCase()
    .split(/\s+/)
    .filter(term => term.length > 0);

  return issues
    .filter(issue => {
      if (query.difficulty !== null && issue.difficulty !== query.difficulty) {
        return false;
      }

      if (query.repo !== null && issue.repo !== query.repo) {
        return false;
      }

      return matchesSearch(issue, terms);
    })
    .sort(comparator(query.sort));
}

/** How many issues each difficulty would leave, for the counts on the pills. */
export function countByDifficulty(
  issues: ExplorerIssue[],
): Map<DifficultyValue | null, number> {
  const counts = new Map<DifficultyValue | null, number>();

  for (const issue of issues) {
    counts.set(issue.difficulty, (counts.get(issue.difficulty) ?? 0) + 1);
  }

  return counts;
}

/**
 * Query state travels in the URL so a filtered board can be linked to — "the
 * good first issues in hiero-sdk-python" is a thing people paste into Discord.
 * Anything unrecognised falls back to the default rather than erroring, since
 * these values arrive from whatever someone pasted.
 */
export function queryFromParams(params: URLSearchParams): IssueQuery {
  const difficulty = params.get("level") ?? "";
  const sort = params.get("sort") ?? "";
  const repo = params.get("repo");

  return {
    search: params.get("q") ?? "",
    difficulty: isDifficultyValue(difficulty) ? difficulty : null,
    repo: repo !== null && repo.trim() !== "" ? repo : null,
    sort: isSortValue(sort) ? sort : EMPTY_QUERY.sort,
  };
}

/** The search string for a query, empty when the query is the default one. */
export function paramsFromQuery(query: IssueQuery): string {
  const params = new URLSearchParams();

  /* Verbatim, not trimmed. The URL is what the search field reads back from,
     so trimming here would eat the space the moment someone typed it and turn
     "sdk timeout" into "sdktimeout". */
  if (query.search !== "") params.set("q", query.search);
  if (query.difficulty !== null) params.set("level", query.difficulty);
  if (query.repo !== null) params.set("repo", query.repo);
  if (query.sort !== EMPTY_QUERY.sort) params.set("sort", query.sort);

  return params.toString();
}
