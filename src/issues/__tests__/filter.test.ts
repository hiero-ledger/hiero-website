import { describe, expect, it } from "vitest";

import {
  EMPTY_QUERY,
  countByDifficulty,
  filterIssues,
  isDefaultQuery,
  paramsFromQuery,
  queryFromParams,
} from "@/issues/filter";
import type { ExplorerIssue } from "@/issues/types";

function issue(overrides: Partial<ExplorerIssue> = {}): ExplorerIssue {
  return {
    id: 1,
    number: 1,
    title: "Something is broken",
    repo: "hiero-sdk-js",
    labels: [],
    difficulty: null,
    comments: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

const issues: ExplorerIssue[] = [
  issue({
    id: 1,
    number: 10,
    title: "Add retry to the client",
    repo: "hiero-sdk-python",
    labels: ["skill: beginner", "networking"],
    difficulty: "beginner",
    comments: 4,
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
  }),
  issue({
    id: 2,
    number: 20,
    title: "Document the transfer flow",
    repo: "hiero-sdk-js",
    labels: ["good first issue", "documentation"],
    difficulty: "good-first-issue",
    comments: 0,
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-15T00:00:00.000Z",
  }),
  issue({
    id: 3,
    number: 30,
    title: "Rework consensus timing",
    repo: "hiero-consensus-node",
    labels: ["skill: advanced"],
    difficulty: "advanced",
    comments: 12,
    createdAt: "2026-02-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
  }),
];

describe("filterIssues", () => {
  it("returns everything, most recently active first, by default", () => {
    expect(filterIssues(issues, EMPTY_QUERY).map(i => i.id)).toEqual([1, 2, 3]);
  });

  it("narrows by level and by repository", () => {
    expect(
      filterIssues(issues, { ...EMPTY_QUERY, difficulty: "advanced" }).map(
        i => i.id,
      ),
    ).toEqual([3]);

    expect(
      filterIssues(issues, { ...EMPTY_QUERY, repo: "hiero-sdk-js" }).map(
        i => i.id,
      ),
    ).toEqual([2]);
  });

  it("searches the title, the repository and the labels", () => {
    const ids = (search: string) =>
      filterIssues(issues, { ...EMPTY_QUERY, search }).map(i => i.id);

    expect(ids("retry")).toEqual([1]);
    expect(ids("python")).toEqual([1]);
    expect(ids("documentation")).toEqual([2]);
    expect(ids("#30")).toEqual([3]);
  });

  it("narrows on each term rather than widening", () => {
    expect(
      filterIssues(issues, { ...EMPTY_QUERY, search: "document transfer" }).map(
        i => i.id,
      ),
    ).toEqual([2]);

    expect(
      filterIssues(issues, { ...EMPTY_QUERY, search: "document retry" }),
    ).toEqual([]);
  });

  it("sorts by age and by discussion", () => {
    expect(
      filterIssues(issues, { ...EMPTY_QUERY, sort: "created" }).map(i => i.id),
    ).toEqual([2, 1, 3]);

    expect(
      filterIssues(issues, { ...EMPTY_QUERY, sort: "discussed" }).map(
        i => i.id,
      ),
    ).toEqual([3, 1, 2]);
  });

  it("leaves the caller's array alone", () => {
    const order = issues.map(i => i.id);

    filterIssues(issues, { ...EMPTY_QUERY, sort: "discussed" });

    expect(issues.map(i => i.id)).toEqual(order);
  });
});

describe("countByDifficulty", () => {
  it("counts each level, and the unlevelled under null", () => {
    const counts = countByDifficulty([...issues, issue({ id: 4 })]);

    expect(counts.get("beginner")).toBe(1);
    expect(counts.get("advanced")).toBe(1);
    expect(counts.get(null)).toBe(1);
    expect(counts.get("intermediate")).toBeUndefined();
  });
});

describe("query in the URL", () => {
  it("round-trips a query", () => {
    const query = {
      search: "retry",
      difficulty: "beginner" as const,
      repo: "hiero-sdk-python",
      sort: "created" as const,
    };

    expect(
      queryFromParams(new URLSearchParams(paramsFromQuery(query))),
    ).toEqual(query);
  });

  it("writes nothing for the default view", () => {
    expect(paramsFromQuery(EMPTY_QUERY)).toBe("");
    expect(isDefaultQuery(queryFromParams(new URLSearchParams()))).toBe(true);
  });

  it("keeps a trailing space, so a two-word search can be typed", () => {
    /* Trimmed here, the space would vanish as it was typed and "sdk timeout"
       would come out as "sdktimeout". */
    expect(paramsFromQuery({ ...EMPTY_QUERY, search: "sdk " })).toBe("q=sdk+");
    expect(queryFromParams(new URLSearchParams("q=sdk+")).search).toBe("sdk ");
  });

  it("falls back to the default for anything it does not recognise", () => {
    const query = queryFromParams(
      new URLSearchParams("level=wizard&sort=chaos&repo="),
    );

    expect(query.difficulty).toBeNull();
    expect(query.sort).toBe(EMPTY_QUERY.sort);
    expect(query.repo).toBeNull();
  });
});
