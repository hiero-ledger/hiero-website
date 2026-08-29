import { describe, expect, it } from "vitest";
import repositoryStats from "@/data/repository_stats.json";
import { heroData, meetData, reposData } from "@/data/homePageData";

/**
 * The hero states two numbers about "our repositories": how many there are and
 * how many stars they have between them. They come from two different lists —
 * the curated `reposData.repos` here and the list hardcoded in
 * `src/scripts/sync-repo-stats.mjs`, which is what keys
 * `repository_stats.json`. Nothing in the code makes the two agree, so these
 * tests do: if either list gains or loses a repository on its own, the hero
 * would quietly count one set of repositories and total the stars of another.
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

  it("counts the same repositories it totals the stars of", () => {
    // Compared as sets: the two lists are written in the same order today, but
    // order is not what the hero's numbers depend on.
    expect(new Set(listedRepos)).toEqual(new Set(statsRepos));
  });

  it("reports a star count for every repository it lists", () => {
    Object.entries(repositoryStats).forEach(([name, stats]) => {
      expect(typeof stats.stars, `${name} has no star count`).toBe("number");
      expect(Number.isFinite(stats.stars)).toBe(true);
    });
  });

  it("counts the repositories it actually lists", () => {
    expect(factFor("Core repositories").value).toBe(
      String(reposData.repos.length),
    );
  });

  it("sums the stars of the whole repository set, punctuated for en-US", () => {
    const stars = Object.values(repositoryStats).reduce(
      (total, repository) => total + repository.stars,
      0,
    );

    expect(factFor("GitHub stars").value).toBe(stars.toLocaleString("en-US"));
  });

  it("counts the community calls it actually lists", () => {
    expect(factFor("Community calls").value).toBe(
      String(meetData.calls.length),
    );
  });
});
