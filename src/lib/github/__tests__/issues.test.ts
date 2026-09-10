import { describe, expect, it } from "vitest";

import {
  BASE_QUERY,
  MAX_QUERY_LENGTH,
  ORGANIZATION,
  SDK_REPOSITORIES,
  buildRepositoryQueries,
} from "@/issues/repositories";
import { SEARCH_QUERIES } from "@/lib/github/issues";

describe("the repository scope", () => {
  it("is the SDKs, and only the SDKs", () => {
    expect(SDK_REPOSITORIES.length).toBeGreaterThan(0);

    for (const name of SDK_REPOSITORIES) {
      expect(name).toMatch(/^hiero-sdk-/);
    }

    /* Coordination repositories have `sdk` in the name but no issues a
       contributor could pick up as SDK work. */
    expect(SDK_REPOSITORIES).not.toContain("sdk-collaboration-hub");
    expect(SDK_REPOSITORIES).not.toContain("hiero-consensus-node");
  });
});

/**
 * The one thing about these queries that cannot be caught by reading them:
 * GitHub answers 422 to anything over its length limit, and the board then
 * silently loses every repository in that group — which looks like "the Rust
 * SDK has nothing open" rather than like a bug. The module throws on load if
 * it happens, so this test's real job is to fail in CI when someone adds an
 * SDK, rather than at the next deploy.
 */
describe("the search queries", () => {
  it("stay inside GitHub's query length limit", () => {
    for (const query of SEARCH_QUERIES) {
      expect(
        query.length,
        `query is ${query.length} characters:\n${query}`,
      ).toBeLessThanOrEqual(MAX_QUERY_LENGTH);
    }
  });

  it("cover every SDK exactly once, and nothing else", () => {
    const searched = SEARCH_QUERIES.flatMap(query => [
      ...query.matchAll(/repo:[\w-]+\/([\w.-]+)/g),
    ]).map(match => match[1]);

    expect([...searched].sort()).toEqual([...SDK_REPOSITORIES].sort());
  });

  it("carry the constraints the page promises", () => {
    for (const query of SEARCH_QUERIES) {
      expect(query).toContain(BASE_QUERY);
      expect(query).toContain(`repo:${ORGANIZATION}/`);
    }
  });

  /**
   * `repo:a,b` is a validation error — unlike `label:`, this qualifier has no
   * comma form — so the split is the only way to stay under the limit.
   */
  it("splits into more groups as the list grows, rather than overflowing", () => {
    const many = Array.from(
      { length: 40 },
      (_, index) => `hiero-sdk-${String(index).padStart(12, "x")}`,
    );

    const queries = buildRepositoryQueries(many);

    expect(queries.length).toBeGreaterThan(1);

    for (const query of queries) {
      expect(query.length).toBeLessThanOrEqual(MAX_QUERY_LENGTH);
    }

    const searched = queries.flatMap(query =>
      [...query.matchAll(/repo:[\w-]+\/([\w.-]+)/g)].map(match => match[1]),
    );

    expect(searched.sort()).toEqual([...many].sort());
  });

  /**
   * A single repository whose name alone blows the budget cannot be grouped
   * with anything, and must still come back as its own query rather than
   * being dropped.
   */
  it("never drops a repository it cannot fit", () => {
    const queries = buildRepositoryQueries(["hiero-sdk-" + "x".repeat(400)]);

    expect(queries).toHaveLength(1);
    expect(queries[0]).toContain("x".repeat(400));
  });
});
