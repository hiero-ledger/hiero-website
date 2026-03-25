import { render, screen } from "@testing-library/react";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import ContributorsGrid from "../ContributorsGrid";

const fetchMock = vi.fn();

describe("ContributorsGrid", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("shows a loading state while contributor data is still pending", () => {
    fetchMock.mockReturnValue(new Promise(() => {}));

    render(<ContributorsGrid endpoint="/api/contributors" />);

    expect(screen.getByText("LOADING...")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/contributors");
  });

  it("renders contributor cards after a successful fetch", async () => {
    fetchMock.mockResolvedValue({
      json: vi.fn().mockResolvedValue([
        { userName: "alice", avatarUrl: "https://avatars.example/alice.png" },
        { userName: "bob", avatarUrl: "https://avatars.example/bob.png" },
      ]),
    });

    render(<ContributorsGrid endpoint="/api/contributors" />);

    expect(await screen.findByText("alice")).toBeInTheDocument();
    expect(screen.getByText("bob")).toBeInTheDocument();
    expect(screen.queryByText("LOADING...")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /alice/i })).toHaveAttribute(
      "href",
      "https://github.com/alice",
    );
    expect(screen.getByRole("img", { name: "Avatar of bob" })).toHaveAttribute(
      "src",
      "https://avatars.example/bob.png",
    );
  });

  it("shows an error message when the fetch fails", async () => {
    fetchMock.mockRejectedValue(new Error("Network error"));

    render(<ContributorsGrid endpoint="/api/contributors" />);

    expect(
      await screen.findByText("Failed to load data. Please try again later."),
    ).toBeInTheDocument();
    expect(screen.queryByText("LOADING...")).not.toBeInTheDocument();
  });
});
