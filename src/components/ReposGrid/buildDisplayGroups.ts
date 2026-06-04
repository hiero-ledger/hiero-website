import {
  FALLBACK_REPO_COUNT,
  FEATURED_REPO_NAMES,
  REPO_GROUPS,
} from "./repoGroups";
import type { DisplayRepoGroup, RepoItem } from "./types";

export function buildDisplayGroups(repos: RepoItem[]): DisplayRepoGroup[] {
  const reposByName = new Map(repos.map(repo => [repo.name, repo]));
  const repoGroups = REPO_GROUPS.map(group => ({
    ...group,
    repos: group.repoNames
      .map(name => reposByName.get(name))
      .filter((repo): repo is RepoItem => repo != null),
  })).filter(group => group.repos.length > 0);

  if (repoGroups.length > 0) {
    return repoGroups;
  }

  const fallbackRepos = repos
    .filter(repo => !FEATURED_REPO_NAMES.has(repo.name))
    .slice(0, FALLBACK_REPO_COUNT);

  return fallbackRepos.length > 0
    ? [
        {
          heading: "Featured repositories",
          text: "Useful places to start exploring the codebase.",
          repos: fallbackRepos,
        },
      ]
    : [];
}
