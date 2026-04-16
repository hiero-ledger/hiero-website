import type { RepoGroupConfig } from "./types";

export const REPO_GROUPS: RepoGroupConfig[] = [
  {
    heading: "Core infrastructure",
    text: "Start with the services used to run, inspect, and test Hiero networks.",
    repoNames: ["hiero-consensus-node", "hiero-mirror-node", "solo"],
  },
  {
    heading: "Developer SDKs",
    text: "Use these client libraries when building applications on Hiero.",
    repoNames: [
      "hiero-sdk-js",
      "hiero-sdk-java",
      "hiero-sdk-go",
      "hiero-sdk-python",
    ],
  },
];

export const FALLBACK_REPO_COUNT = 4;
export const FEATURED_REPO_NAMES = new Set(
  REPO_GROUPS.flatMap(group => group.repoNames),
);
