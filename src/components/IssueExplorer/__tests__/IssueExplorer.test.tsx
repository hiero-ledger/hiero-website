import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import IssueExplorer from "..";
import type { ExplorerData, ExplorerIssue } from "@/issues/types";

function issue(overrides: Partial<ExplorerIssue> & { id: number }) {
  return {
    number: overrides.id,
    title: `Issue ${overrides.id}`,
    repo: "hiero-sdk-js",
    labels: [],
    difficulty: null,
    comments: 0,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
    ...overrides,
  } satisfies ExplorerIssue;
}

const issues: ExplorerIssue[] = [
  issue({
    id: 1,
    title: "Add retry to the client",
    repo: "hiero-sdk-python",
    labels: ["skill: beginner", "networking"],
    difficulty: "beginner",
    updatedAt: "2026-09-05T00:00:00.000Z",
  }),
  issue({
    id: 2,
    title: "Document the transfer flow",
    labels: ["good first issue"],
    difficulty: "good-first-issue",
    updatedAt: "2026-09-04T00:00:00.000Z",
  }),
  issue({
    id: 3,
    title: "Rework transaction signing",
    repo: "hiero-sdk-cpp",
    difficulty: "advanced",
    updatedAt: "2026-09-03T00:00:00.000Z",
  }),
];

const data: ExplorerData = {
  issues,
  repos: ["hiero-sdk-cpp", "hiero-sdk-js", "hiero-sdk-python"],
  totalOpen: 341,
  fetchedAt: "2026-09-10T00:00:00.000Z",
  degraded: false,
};

function renderBoard(overrides: Partial<ExplorerData> = {}) {
  return render(
    <IssueExplorer
      data={{ ...data, ...overrides }}
      organization="hiero-ledger"
    />,
  );
}

const cardTitles = () =>
  screen
    .getAllByRole("link")
    .map(link => link.getAttribute("aria-label")?.split(" — ")[0]);

beforeEach(() => {
  window.history.replaceState(null, "", "/issues");
  // jsdom has no layout, so it does not implement this.
  Element.prototype.scrollIntoView = vi.fn();
});

describe("IssueExplorer", () => {
  it("renders every issue without going anywhere for them", () => {
    renderBoard();

    expect(cardTitles()).toEqual([
      "Add retry to the client",
      "Document the transfer flow",
      "Rework transaction signing",
    ]);

    expect(
      screen.getByRole("link", { name: /Add retry to the client/ }),
    ).toHaveAttribute(
      "href",
      "https://github.com/hiero-ledger/hiero-sdk-python/issues/1",
    );
  });

  it("filters by level, and says how many each level would leave", async () => {
    const user = userEvent.setup();
    renderBoard();

    const beginner = screen.getByRole("button", { name: "Beginner, 1 issue" });

    await user.click(beginner);

    expect(cardTitles()).toEqual(["Add retry to the client"]);
    expect(beginner).toHaveAttribute("aria-pressed", "true");
  });

  it("filters by repository and by free text", async () => {
    const user = userEvent.setup();
    renderBoard();

    await user.selectOptions(
      screen.getByLabelText("Repository"),
      "hiero-sdk-cpp",
    );
    expect(cardTitles()).toEqual(["Rework transaction signing"]);

    await user.selectOptions(screen.getByLabelText("Repository"), "");
    await user.type(screen.getByRole("searchbox"), "transfer");
    expect(cardTitles()).toEqual(["Document the transfer flow"]);
  });

  it("puts the current filters in the URL so the board can be shared", async () => {
    const user = userEvent.setup();
    renderBoard();

    await user.click(screen.getByRole("button", { name: /Advanced/ }));

    expect(window.location.search).toBe("?level=advanced");
  });

  it("opens on the filter a shared link asked for", () => {
    window.history.replaceState(null, "", "/issues?level=good-first-issue");

    renderBoard();

    expect(cardTitles()).toEqual(["Document the transfer flow"]);
    expect(
      screen.getByRole("button", { name: /Good first issue/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("offers a way back when a filter matches nothing", async () => {
    const user = userEvent.setup();
    renderBoard();

    await user.type(screen.getByRole("searchbox"), "nothing matches this");

    expect(screen.getByText("Nothing matches those filters")).toBeVisible();

    await user.click(
      within(
        screen.getByText("Nothing matches those filters").parentElement!,
      ).getByRole("button", { name: "Clear filters" }),
    );

    expect(cardTitles()).toHaveLength(3);
    expect(window.location.search).toBe("");
  });

  /**
   * The count is the only thing on the page that changes when a filter is
   * applied but nothing is scrolled, so it is the one thing that has to be
   * announced.
   */
  it("announces the result count", async () => {
    const user = userEvent.setup();
    renderBoard();

    await user.click(screen.getByRole("button", { name: /Advanced/ }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "1 issue matches the current filters.",
    );
  });

  it("pages a long board, and returns to the first page on a filter", async () => {
    const user = userEvent.setup();
    const many = Array.from({ length: 30 }, (_, index) =>
      issue({
        id: index + 100,
        title: `Bulk issue ${index}`,
        difficulty: index === 0 ? "advanced" : null,
        updatedAt: `2026-08-${String(31 - index).padStart(2, "0")}T00:00:00.000Z`,
      }),
    );

    renderBoard({ issues: many, repos: ["hiero-sdk-js"] });

    expect(cardTitles()).toHaveLength(12);

    await user.click(screen.getByRole("button", { name: "Page 3" }));
    expect(cardTitles()).toHaveLength(6);

    /* Page 3 does not exist once the filter leaves one issue, so the board has
       to come back rather than render an empty page. */
    await user.click(screen.getByRole("button", { name: /Advanced/ }));
    expect(cardTitles()).toEqual(["Bulk issue 0"]);
  });

  it("distinguishes an empty board from an over-narrow filter", () => {
    renderBoard({ issues: [], repos: [], degraded: true });

    expect(screen.getByText("The board could not be loaded")).toBeVisible();
    expect(screen.queryByText("Nothing matches those filters")).toBeNull();
  });

  it("names repositories exactly, in the filter and on the card", () => {
    renderBoard();

    expect(screen.getByRole("option", { name: "hiero-sdk-js" })).toHaveValue(
      "hiero-sdk-js",
    );

    const card = screen.getByRole("link", { name: /transfer flow/ });
    expect(within(card).getByText("hiero-sdk-js")).toBeVisible();
  });

  it("shows the level a card advertises, and never twice", () => {
    renderBoard();

    const card = screen.getByRole("link", { name: /Add retry/ });

    expect(within(card).getByText("Beginner")).toBeVisible();
    /* `skill: beginner` is what the badge is made of, so it is not also a
       chip; `networking` is not, so it is. */
    expect(within(card).queryByText("skill: beginner")).toBeNull();
    expect(within(card).getByText("networking")).toBeVisible();
  });
});
