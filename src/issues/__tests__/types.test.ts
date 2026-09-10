import { describe, expect, it } from "vitest";

import { issueUrl, parseIssue, parseSearchPage } from "@/issues/types";

const raw = {
  id: 42,
  number: 7,
  title: "  Add retry to the client  ",
  repository_url: "https://api.github.com/repos/hiero-ledger/hiero-sdk-python",
  labels: [{ name: "skill: beginner" }, { name: "networking" }],
  comments: 3,
  created_at: "2026-03-01T09:00:00Z",
  updated_at: "2026-09-01T09:00:00Z",
};

describe("parseIssue", () => {
  it("keeps only what the board renders, and derives the rest", () => {
    expect(parseIssue(raw)).toEqual({
      id: 42,
      number: 7,
      title: "Add retry to the client",
      repo: "hiero-sdk-python",
      labels: ["skill: beginner", "networking"],
      difficulty: "beginner",
      comments: 3,
      createdAt: "2026-03-01T09:00:00.000Z",
      updatedAt: "2026-09-01T09:00:00.000Z",
    });
  });

  it("drops an item missing anything the board needs", () => {
    for (const missing of [
      "id",
      "number",
      "title",
      "repository_url",
      "created_at",
      "updated_at",
    ]) {
      expect(parseIssue({ ...raw, [missing]: undefined }), missing).toBeNull();
    }
  });

  it("drops a pull request that came back from an issue search", () => {
    expect(parseIssue({ ...raw, pull_request: { url: "…" } })).toBeNull();
  });

  it("survives fields arriving as the wrong type", () => {
    const parsed = parseIssue({
      ...raw,
      comments: "lots",
      labels: ["plain string", { name: 5 }, null],
    });

    expect(parsed?.comments).toBe(0);
    expect(parsed?.labels).toEqual(["plain string"]);
  });
});

describe("parseSearchPage", () => {
  it("keeps the valid items and the total", () => {
    const page = parseSearchPage({
      total_count: 260,
      items: [raw, { nonsense: true }, { ...raw, id: 43 }],
    });

    expect(page.issues.map(issue => issue.id)).toEqual([42, 43]);
    expect(page.totalCount).toBe(260);
  });

  /**
   * The cast this replaced returned a rate-limit body — `{message, …}` with no
   * `items` — as if it were a result set, and the page then died reading
   * `.items` off it. Throwing here is what lets the fetch mark the board
   * degraded instead.
   */
  it("throws on a response that is not a result set", () => {
    expect(() => parseSearchPage({ message: "rate limited" })).toThrow();
    expect(() => parseSearchPage(null)).toThrow();
  });
});

describe("issueUrl", () => {
  it("rebuilds the link the payload no longer carries", () => {
    expect(issueUrl("hiero-ledger", parseIssue(raw)!)).toBe(
      "https://github.com/hiero-ledger/hiero-sdk-python/issues/7",
    );
  });
});
