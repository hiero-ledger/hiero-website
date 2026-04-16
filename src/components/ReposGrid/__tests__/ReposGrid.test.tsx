import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, it, expect } from "vitest";
import ReposGrid from "..";

describe("ReposGrid", () => {
  it("renders grouped repository links", () => {
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

    expect(screen.getByText("Featured path")).toBeInTheDocument();
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
      "hiero-block-node",
      "hiero-sdk-java",
      "hiero-sdk-js",
      "hiero-json-rpc-relay",
      "hiero-local-node",
      "hiero-mirror-node",
      "hiero-sdk-python",
      "hiero-sdk-swift",
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
    ).toEqual(["Shape the project", "Infrastructure", "Build apps"]);

    [
      "hiero-improvement-proposals",
      "tsc",
      "hiero-consensus-node",
      "hiero-mirror-node",
      "hiero-block-node",
      "solo",
      "hiero-sdk-js",
      "hiero-sdk-java",
      "hiero-sdk-go",
      "hiero-sdk-rust",
      "hiero-sdk-python",
      "hiero-sdk-swift",
    ].forEach(name => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });

    [
      "hiero-local-node",
      "hiero-json-rpc-relay",
      "hiero-cli",
      "hiero-mirror-node-explorer",
    ].forEach(name => {
      expect(screen.queryByText(name)).not.toBeInTheDocument();
    });
  });
});
