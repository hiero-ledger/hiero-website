import {
  MAX_QUERY_LENGTH,
  ORGANIZATION,
  buildRepositoryQueries,
} from "@/issues/repositories";
import {
  parseSearchPage,
  type ExplorerData,
  type ExplorerIssue,
  type ParsedSearchPage,
} from "@/issues/types";

/**
 * The Issue Explorer's data, fetched on the server.
 *
 * This used to run in the browser: the page mounted, then issued one
 * `/api/issues` request per SDK repository — seven of them — each of which
 * proxied a GitHub search. So a visitor saw a spinner until seven round trips
 * finished, and seven searches went out per page view against a limit of ten
 * per minute for an unauthenticated caller. Two visitors inside a minute was
 * enough to start getting 403s back.
 *
 * What happens instead: two searches, on the server, behind Next's data cache,
 * shared by every visitor for `REVALIDATE_SECONDS`. The page ships the result
 * in its HTML, so the list is there on first paint, and the browser then
 * filters that array locally without going anywhere.
 *
 * Two, rather than one per repository, because the SDKs fit into two queries
 * inside GitHub's query-length limit — see `issues/repositories`.
 */

const SEARCH_ENDPOINT = "https://api.github.com/search/issues";

/** GitHub's maximum, so a page of results costs one request rather than two. */
const PER_PAGE = 100;

/**
 * How stale the board may get. Half an hour is well inside how fast an issue
 * tracker of this size actually moves, and it puts the searches at a handful
 * an hour no matter how much traffic the page takes.
 */
export const REVALIDATE_SECONDS = 1800;

/** `fetch` has no default timeout, and a hung search must not hang a render. */
const FETCH_TIMEOUT_MS = 10_000;

/**
 * Page budget per query. The SDKs carry a few hundred open unassigned issues
 * between them, so three pages is the whole scope with room to grow — and
 * because the scope is fetched whole, every issue labelled for a skill level
 * is on the board by construction rather than by a second search hunting for
 * them.
 */
const PAGES_PER_QUERY = 3;

/** The searches, fixed at module load: the repository list is static. */
export const SEARCH_QUERIES = buildRepositoryQueries();

/**
 * Over the limit, GitHub answers 422 and the board loses a whole group of
 * repositories — a failure that looks like "the Rust SDK has nothing open"
 * rather than like a bug. `buildRepositoryQueries` splits the list to prevent
 * it; this is the assertion that it did.
 */
for (const query of SEARCH_QUERIES) {
  if (query.length > MAX_QUERY_LENGTH) {
    throw new Error(
      `Issue search query is ${query.length} characters, over GitHub's ` +
        `${MAX_QUERY_LENGTH}-character limit:\n${query}`,
    );
  }
}

function headers(): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "hiero-issue-explorer",

    /* Optional, but it takes the search limit from 10 requests a minute to 30
       and is what the setup guides already tell contributors to export. */
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  };
}

function searchUrl(query: string, page: number): string {
  const params = new URLSearchParams({
    q: query,
    per_page: String(PER_PAGE),
    page: String(page),
    sort: "updated",
    order: "desc",

    /* The `OR` chain and its parentheses need this. Without it GitHub reads
       the whole group as free text and returns nothing — and it does so with
       a 200, which is why the board can look empty rather than broken. */
    advanced_search: "true",
  });

  return `${SEARCH_ENDPOINT}?${params.toString()}`;
}

async function fetchPage(url: string): Promise<ParsedSearchPage> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: headers(),
      signal: controller.signal,
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      throw new Error(`GitHub search responded ${response.status}`);
    }

    return parseSearchPage(await response.json());
  } finally {
    clearTimeout(timeout);
  }
}

interface SearchResult {
  issues: ExplorerIssue[];
  totalCount: number;
  /** True when a page of this search could not be fetched. */
  degraded: boolean;
}

/**
 * GitHub asks callers to make requests one at a time and to leave a second
 * between them, and enforces it with a secondary rate limit that returns 403
 * even when the primary limit has room to spare. Requests fired concurrently
 * were reliably enough to trip it from an unauthenticated build, which cost
 * the board a page of issues each time.
 *
 * So: one request in flight, a second apart.
 */
const PAUSE_BETWEEN_REQUESTS_MS = 1000;

/**
 * A secondary rate limit clears in seconds, so the page that hit one is worth
 * asking for a second time before giving up on it. Two attempts, not more:
 * past that the caller is doing exactly what the limit exists to stop.
 */
const ATTEMPTS_PER_PAGE = 2;
const RETRY_BACKOFF_MS = 5000;

function pause(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** One page, retried once, or null when both attempts failed. */
async function fetchPageWithRetry(
  url: string,
  page: number,
): Promise<ParsedSearchPage | null> {
  for (let attempt = 1; attempt <= ATTEMPTS_PER_PAGE; attempt += 1) {
    try {
      return await fetchPage(url);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (attempt === ATTEMPTS_PER_PAGE) {
        console.warn(`[issues] search page ${page} failed: ${message}`);
        return null;
      }

      console.warn(
        `[issues] search page ${page} failed (${message}), retrying`,
      );
      await pause(RETRY_BACKOFF_MS);
    }
  }

  return null;
}

/**
 * One search, page by page. A page that fails ends the search rather than
 * failing it: a board one page short is much better than an empty one.
 */
async function search(query: string): Promise<SearchResult> {
  const issues: ExplorerIssue[] = [];
  let totalCount = 0;
  let degraded = false;

  for (let page = 1; page <= PAGES_PER_QUERY; page += 1) {
    if (page > 1) await pause(PAUSE_BETWEEN_REQUESTS_MS);

    const result = await fetchPageWithRetry(searchUrl(query, page), page);

    if (result === null) {
      degraded = true;
      break;
    }

    issues.push(...result.issues);
    totalCount = result.totalCount;

    /* Paged off the reported total, not off how full the page came back.
       GitHub returns short pages in the middle of a result set — 83 items on
       page 1 of 2,466 was what it gave during this rewrite — and reading that
       as the end of the results silently cut the board to a third of its
       size. */
    if (page * PER_PAGE >= totalCount) break;
  }

  return { issues, totalCount, degraded };
}

/**
 * Every SDK issue, from however many searches the repository list needs.
 *
 * The searches run one after another rather than together, for the reason
 * above. Their repository sets do not overlap, so the merge is a concatenation
 * — the deduplication is only there because a repository listed twice should
 * cost a duplicate card, not two.
 */
export async function fetchExplorerIssues(): Promise<ExplorerData> {
  const results: SearchResult[] = [];

  for (const [index, query] of SEARCH_QUERIES.entries()) {
    if (index > 0) await pause(PAUSE_BETWEEN_REQUESTS_MS);

    results.push(await search(query));
  }

  const byId = new Map<number, ExplorerIssue>();

  for (const issue of results.flatMap(result => result.issues)) {
    if (!byId.has(issue.id)) byId.set(issue.id, issue);
  }

  const issues = [...byId.values()].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );

  return {
    issues,
    repos: [...new Set(issues.map(issue => issue.repo))].sort((a, b) =>
      a.localeCompare(b),
    ),
    /* The scope is fetched whole, so the totals are the board — unless a page
       failed, in which case the reported total is the honest number and the
       board says it is short of it. */
    totalOpen: Math.max(
      results.reduce((sum, result) => sum + result.totalCount, 0),
      issues.length,
    ),
    fetchedAt: new Date().toISOString(),
    degraded: results.some(result => result.degraded),
  };
}

export { ORGANIZATION, MAX_QUERY_LENGTH };
