import { describe, expect, it } from "vitest";
import organizationStats from "@/data/organization_stats.json";
import repositoryStats from "@/data/repository_stats.json";
import { heroData, meetData, reposData } from "@/data/homePageData";

/**
 * The repository grid states per-repo star counts from two different lists —
 * the curated `reposData.repos` here and the list hardcoded in
 * `src/scripts/sync-repo-stats.mjs`, which is what keys
 * `repository_stats.json`. Nothing in the code makes the two agree, so these
 * tests do: if either list gains or loses a repository on its own, the grid
 * would show missing or zeroed star badges.
 *
 * The hero's headline facts are different: both come from
 * `organization_stats.json`, one GitHub listing of every public hiero-ledger
 * repository, so its repo count and star sum agree by construction.
 */
const listedRepos = reposData.repos.map(repo => repo.name);
const statsRepos = Object.keys(repositoryStats);

function factFor(label: string) {
  const fact = heroData.facts.find(candidate => candidate.label === label);

  expect(fact, `no hero fact labelled "${label}"`).toBeDefined();

  return fact!;
}

describe("homePageData", () => {
  it("names every repository exactly once", () => {
    expect(new Set(listedRepos).size).toBe(listedRepos.length);
    expect(new Set(statsRepos).size).toBe(statsRepos.length);
  });

  it("has grid stats for exactly the repositories the grid lists", () => {
    // Compared as sets: the two lists are written in the same order today, but
    // order is not what the star badges depend on.
    expect(new Set(listedRepos)).toEqual(new Set(statsRepos));
  });

  it("reports a star count for every repository it lists", () => {
    Object.entries(repositoryStats).forEach(([name, stats]) => {
      expect(typeof stats.stars, `${name} has no star count`).toBe("number");
      expect(Number.isFinite(stats.stars)).toBe(true);
    });
  });

  it("carries sane organization-wide statistics", () => {
    expect(Number.isFinite(organizationStats.publicRepositories)).toBe(true);
    expect(Number.isFinite(organizationStats.totalStars)).toBe(true);

    // The whole organization can never hold fewer repositories, or fewer
    // stars, than the curated subset the grid tracks.
    expect(organizationStats.publicRepositories).toBeGreaterThanOrEqual(
      reposData.repos.length,
    );

    const trackedStars = Object.values(repositoryStats).reduce(
      (total, repository) => total + repository.stars,
      0,
    );
    expect(organizationStats.totalStars).toBeGreaterThanOrEqual(trackedStars);
  });

  it("counts the organization's public repositories", () => {
    expect(factFor("Total repositories").value).toBe(
      String(organizationStats.publicRepositories),
    );
  });

  it("sums the organization's stars, punctuated for en-US", () => {
    expect(factFor("GitHub stars").value).toBe(
      organizationStats.totalStars.toLocaleString("en-US"),
    );
  });

  it("counts the community calls it actually lists", () => {
    expect(factFor("Community calls").value).toBe(
      String(meetData.calls.length),
    );
  });
});
