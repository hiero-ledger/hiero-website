import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ContributorsGrid from "@/components/ContributorsGrid";

describe("ContributorsGrid", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders contributor profiles from API", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      json: async () => [
        { userName: "alice", avatarUrl: "https://example.com/a.png" },
      ],
    } as Response);

    render(<ContributorsGrid endpoint="https://example.com/contributors" />);

    await waitFor(() => {
      expect(screen.getByText("alice")).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: /alice/i })).toHaveAttribute(
      "href",
      "https://github.com/alice",
    );
  });

  it("renders error state on request failure", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("network"));

    render(<ContributorsGrid endpoint="https://example.com/contributors" />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load data. Please try again later."),
      ).toBeInTheDocument();
    });
  });
});
