import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect } from "vitest";
import ReposGrid from "..";
import repoStats from "@/data/repository_stats.json";

const stats: Record<string, { stars: number }> = repoStats as Record<
  string,
  { stars: number }
>;

describe("ReposGrid", () => {
  it("renders repository cards with star counts in a grid", () => {
    render(
      <ReposGrid
        data={{
          heading: "Repositories",
          text: "Explore repos",
          repos: [
            {
              name: "hiero-sdk-js",
              description: "JavaScript SDK",
              link: "https://github.com/hiero-ledger/hiero-sdk-js",
            },
          ],
        }}
      />,
    );

    expect(screen.getByText("hiero-sdk-js")).toBeInTheDocument();
    expect(screen.getByText("JavaScript SDK")).toBeInTheDocument();

    const repoCard = screen.getByRole("link", {
      name: /View hiero-sdk-js repository/i,
    });
    expect(repoCard).toHaveAttribute(
      "href",
      "https://github.com/hiero-ledger/hiero-sdk-js",
    );

    const starCount = stats["hiero-sdk-js"]?.stars ?? 0;
    expect(screen.getByText(`⭐ ${starCount}`)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /View all repositories/i }),
    ).toBeInTheDocument();
  });

  it("limits displayed repos to the top 9 by star count", () => {
    const allRepoNames = [
      "hiero-sdk-rust",
      "solo",
      "hiero-sdk-go",
      "hiero-consensus-node",
      "hiero-improvement-proposals",
      "hiero-sdk-java",
      "hiero-sdk-js",
      "hiero-json-rpc-relay",
      "hiero-local-node",
      "hiero-mirror-node",
      "hiero-cli",
      "hiero-mirror-node-explorer",
    ];

    const mappedRepos = allRepoNames.map(name => ({
      name,
      description: `Description for ${name}`,
      link: `https://github.com/hiero-ledger/${name}`,
    }));

    render(
      <ReposGrid
        data={{
          heading: "Repositories",
          text: "All repos",
          repos: mappedRepos,
        }}
      />,
    );

    const expectedOrder = [...allRepoNames]
      .sort((a, b) => (stats[b]?.stars ?? 0) - (stats[a]?.stars ?? 0))
      .slice(0, 9);

    expect(
      screen
        .getAllByRole("heading", { level: 3 })
        .map(node => node.textContent),
    ).toEqual(expectedOrder);
  });
});
