import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import repoStats from "@/data/repository_stats.json";
import ReposCarousel from "..";

describe("ReposCarousel", () => {
  it("renders repository cards with star counts in a grid", () => {
    const starCount = repoStats["hiero-sdk-js"].stars;

    render(
      <ReposCarousel
        data={{
          heading: "Popular repositories",
          text: "Explore the project ecosystem.",
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
      screen.getByRole("heading", { name: "Popular repositories" }),
    ).toBeInTheDocument();
    expect(screen.getByText("JavaScript SDK")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /View hiero-sdk-js repository/i }),
    ).toHaveAttribute("href", "https://github.com/hiero-ledger/hiero-sdk-js");
    expect(screen.getByText(`⭐ ${starCount}`)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /View all repositories/i }),
    ).toHaveAttribute(
      "href",
      "https://github.com/orgs/hiero-ledger/repositories",
    );
  });

  it("limits displayed repos to the top 9 by star count", () => {
    const repos = [
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
    ].map(name => ({
      name,
      description: `Description for ${name}`,
      link: `https://github.com/hiero-ledger/${name}`,
    }));

    render(
      <ReposCarousel
        data={{
          heading: "Repositories",
          text: "All repos",
          repos,
        }}
      />,
    );

    expect(
      screen.getAllByRole("heading", { level: 3 }).map(node => node.textContent),
    ).toEqual([
      "hiero-consensus-node",
      "hiero-sdk-js",
      "hiero-local-node",
      "hiero-sdk-java",
      "hiero-mirror-node",
      "hiero-improvement-proposals",
      "hiero-sdk-go",
      "hiero-json-rpc-relay",
      "hiero-sdk-rust",
    ]);
  });
});
