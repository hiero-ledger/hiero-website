import type { RepoGroupConfig } from "./types";

export const REPO_GROUPS: RepoGroupConfig[] = [
  {
    heading: "Shape the project",
    text: "Governance and proposal work that guides the ecosystem.",
    repoNames: ["hiero-improvement-proposals", "tsc"],
  },
  {
    heading: "Infrastructure",
    text: "Core services for operating and inspecting networks.",
    repoNames: [
      "hiero-consensus-node",
      "hiero-mirror-node",
      "hiero-block-node",
      "solo",
    ],
  },
  {
    heading: "Build apps",
    text: "SDKs for teams building products on Hiero.",
    repoNames: [
      "hiero-sdk-js",
      "hiero-sdk-java",
      "hiero-sdk-go",
      "hiero-sdk-rust",
      "hiero-sdk-python",
      "hiero-sdk-swift",
    ],
  },
];

export const FALLBACK_REPO_COUNT = 6;
export const FEATURED_REPO_NAMES = new Set(
  REPO_GROUPS.flatMap(group => group.repoNames),
);
