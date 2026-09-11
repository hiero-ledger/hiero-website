import { classifyDifficulty, type DifficultyValue } from "@/issues/difficulty";

/**
 * One issue, reduced to what the board renders.
 *
 * A GitHub search item is ~4KB of JSON — body text, a dozen API URLs, the
 * author's full profile, reaction counts. The explorer holds several hundred
 * issues in the browser so that filtering is instant, and shipping them raw
 * would put megabytes into the page. Everything below is derived at fetch time
 * on the server and nothing else travels.
 */
export interface ExplorerIssue {
  /** GitHub's own issue id; unique across repositories, so it keys the grid. */
  id: number;
  /** Per-repository number, shown as `#123`. */
  number: number;
  title: string;
  /** Repository name only — the organisation is the same for all of them. */
  repo: string;
  labels: string[];
  difficulty: DifficultyValue | null;
  comments: number;
  /** ISO 8601, UTC. */
  createdAt: string;
  /** ISO 8601, UTC. */
  updatedAt: string;
}

export interface ExplorerData {
  issues: ExplorerIssue[];
  /** Repository names present in `issues`, sorted, for the filter. */
  repos: string[];
  /**
   * Open unassigned issues across the SDKs, as GitHub counts them. Equal to
   * `issues.length` on a healthy refresh — the scope is fetched whole — and
   * larger than it when a page failed, which is how the board knows it is
   * showing less than it should.
   */
  totalOpen: number;
  /** When the server last reached GitHub, ISO 8601. */
  fetchedAt: string;
  /**
   * True when at least one search request failed and the board is showing a
   * partial result. The page says so rather than pretending the list is whole.
   */
  degraded: boolean;
}

/**
 * Boundary validation for the GitHub search response.
 *
 * What was here before was `data as GitHubSearchResponse` — a cast, which
 * checks nothing. A malformed or rate-limited response then reached the render
 * as an object with no `items`, and the page died on `.flatMap`. Everything
 * below is rebuilt from validated primitives, and an item that fails any check
 * is dropped rather than rendered.
 */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toText(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function toCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.trunc(value)
    : 0;
}

function toIsoDate(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

/**
 * `repository_url` is an API URL (`.../repos/<org>/<name>`); the board only
 * ever shows the name, and deriving it here means the name never has to be
 * re-parsed in a component.
 */
function toRepoName(value: unknown): string | null {
  const url = toText(value);

  if (url === null) return null;

  const name = url.split("/").filter(Boolean).pop();

  return name !== undefined && /^[\w.-]+$/.test(name) ? name : null;
}

function toLabelNames(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map(label => {
      if (typeof label === "string") return toText(label);
      return isRecord(label) ? toText(label.name) : null;
    })
    .filter((label): label is string => label !== null);
}

/** One search item, or null when it is not an issue this board can show. */
export function parseIssue(value: unknown): ExplorerIssue | null {
  if (!isRecord(value)) return null;

  /* `is:issue` should already exclude these, but the qualifier has been known
     to leak pull requests, and a PR on an issue board is noise. */
  if (value.pull_request !== undefined) return null;

  const id = typeof value.id === "number" ? value.id : null;
  const number = typeof value.number === "number" ? value.number : null;
  const title = toText(value.title);
  const repo = toRepoName(value.repository_url);
  const createdAt = toIsoDate(value.created_at);
  const updatedAt = toIsoDate(value.updated_at);

  if (
    id === null ||
    number === null ||
    title === null ||
    repo === null ||
    createdAt === null ||
    updatedAt === null
  ) {
    return null;
  }

  const labels = toLabelNames(value.labels);

  return {
    id,
    number,
    title,
    repo,
    labels,
    difficulty: classifyDifficulty(labels),
    comments: toCount(value.comments),
    createdAt,
    updatedAt,
  };
}

export interface ParsedSearchPage {
  issues: ExplorerIssue[];
  /** GitHub's count of everything matching, not just this page. */
  totalCount: number;
}

export function parseSearchPage(value: unknown): ParsedSearchPage {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    throw new Error("GitHub search returned an unexpected shape");
  }

  return {
    issues: value.items
      .map(parseIssue)
      .filter((issue): issue is ExplorerIssue => issue !== null),
    totalCount: toCount(value.total_count),
  };
}

/**
 * The URL a card links to. Built rather than carried: `html_url` is one more
 * ~70-byte string per issue in the payload, and it is entirely derivable.
 */
export function issueUrl(organization: string, issue: ExplorerIssue): string {
  return `https://github.com/${organization}/${issue.repo}/issues/${issue.number}`;
}
