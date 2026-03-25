import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import IssueList from "../IssueList";

const fetchMock = vi.fn();

describe("IssueList", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("shows a loading state while issues are being fetched", () => {
    fetchMock.mockReturnValue(new Promise(() => {}));

    render(<IssueList endpoint="/api/issues" />);

    expect(screen.getByText("LOADING...")).toBeInTheDocument();
  });

  it("filters out closed and assigned issues and lets users filter by language", async () => {
    const user = userEvent.setup();

    fetchMock.mockResolvedValue({
      json: vi.fn().mockResolvedValue([
        {
          title: "Rust issue",
          link: "https://issues.example/rust",
          org: "hiero",
          repo: "repo-b",
          identifier: "2",
          languageTags: ["Rust"],
          isAssigned: false,
          isClosed: false,
        },
        {
          title: "Go issue",
          link: "https://issues.example/go",
          org: "hiero",
          repo: "repo-a",
          identifier: "1",
          languageTags: ["Go"],
          isAssigned: false,
          isClosed: false,
        },
        {
          title: "Assigned issue",
          link: "https://issues.example/assigned",
          org: "hiero",
          repo: "repo-c",
          identifier: "3",
          languageTags: ["Rust"],
          isAssigned: true,
          isClosed: false,
        },
        {
          title: "Closed issue",
          link: "https://issues.example/closed",
          org: "hiero",
          repo: "repo-d",
          identifier: "4",
          languageTags: ["Go"],
          isAssigned: false,
          isClosed: true,
        },
      ]),
    });

    render(<IssueList endpoint="/api/issues" />);

    expect(await screen.findByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Go issue")).toBeInTheDocument();
    expect(screen.getByText("Rust issue")).toBeInTheDocument();
    expect(screen.queryByText("Assigned issue")).not.toBeInTheDocument();
    expect(screen.queryByText("Closed issue")).not.toBeInTheDocument();

    const issueLinks = screen
      .getAllByRole("link")
      .filter(link => link.getAttribute("href")?.startsWith("https://issues.example"));

    expect(issueLinks.map(link => link.textContent)).toEqual([
      "Go issue",
      "Rust issue",
    ]);

    await user.selectOptions(screen.getByRole("combobox"), "Rust");

    expect(screen.getByText("Rust issue")).toBeInTheDocument();
    expect(screen.queryByText("Go issue")).not.toBeInTheDocument();
  });

  it("shows an error message when the fetch fails", async () => {
    fetchMock.mockRejectedValue(new Error("Network error"));

    render(<IssueList endpoint="/api/issues" />);

    expect(
      await screen.findByText("Failed to load data. Please try again later."),
    ).toBeInTheDocument();
  });
});
