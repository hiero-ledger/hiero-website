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
  it("renders grouped repository links with star counts", () => {
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

    expect(
      screen.getByRole("heading", { name: "Repositories" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Build apps" }),
    ).toBeInTheDocument();
    expect(screen.getByText("hiero-sdk-js")).toBeInTheDocument();
    expect(screen.getByText("JavaScript SDK")).toBeInTheDocument();

    const repoLink = screen.getByRole("link", {
      name: /View hiero-sdk-js repository/i,
    });
    expect(repoLink).toHaveAttribute(
      "href",
      "https://github.com/hiero-ledger/hiero-sdk-js",
    );

    const starCount = stats["hiero-sdk-js"]?.stars ?? 0;
    expect(screen.getByText(`⭐ ${starCount}`)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /View all repositories/i }),
    ).toBeInTheDocument();
  });

  it("features curated starter repos instead of every available repo", () => {
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
      "tsc",
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

    expect(
      screen
        .getAllByRole("heading", { level: 3 })
        .map(node => node.textContent),
    ).toEqual(["Build apps", "Run infrastructure", "Shape the project"]);

    [
      "hiero-sdk-js",
      "hiero-sdk-java",
      "hiero-consensus-node",
      "hiero-mirror-node",
      "hiero-improvement-proposals",
      "tsc",
    ].forEach(name => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });

    ["hiero-sdk-go", "solo", "hiero-local-node"].forEach(name => {
      expect(screen.queryByText(name)).not.toBeInTheDocument();
    });
  });
});
