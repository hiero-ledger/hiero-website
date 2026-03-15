import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import IssueList from "@/components/IssueList";

describe("IssueList", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders filtered open issues from API", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      json: async () => [
        {
          title: "Issue One",
          link: "https://github.com/org/repo/issues/1",
          org: "org",
          repo: "repo",
          identifier: "1",
          languageTags: ["TypeScript"],
          isAssigned: false,
          isClosed: false,
        },
        {
          title: "Closed issue",
          link: "https://github.com/org/repo/issues/2",
          org: "org",
          repo: "repo",
          identifier: "2",
          languageTags: ["Go"],
          isAssigned: false,
          isClosed: true,
        },
      ],
    } as Response);

    const user = userEvent.setup();
    render(<IssueList endpoint="https://example.com/issues" />);

    expect(screen.getByText("LOADING...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Issue One")).toBeInTheDocument();
    });

    expect(screen.queryByText("Closed issue")).toBeNull();

    await user.selectOptions(screen.getByLabelText("Filter issues by Language"), [
      "TypeScript",
    ]);
    expect(screen.getByText("Issue One")).toBeInTheDocument();
  });

  it("renders error state when request fails", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("network"));

    render(<IssueList endpoint="https://example.com/issues" />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load data. Please try again later."),
      ).toBeInTheDocument();
    });
  });
});
