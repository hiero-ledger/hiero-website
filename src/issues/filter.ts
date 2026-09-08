import trackedRepositories from "@/data/tracked_repositories.json";

type SDK = "python" | "javascript" | "go" | "rust" | "java" | "cpp" | "swift";
type Difficulty = "good first issue" | "beginner" | "intermediate" | "advanced";

const org = trackedRepositories.organization;

export const sdkMap: Record<SDK, string> = {
  python: `repo:${org}/hiero-sdk-python`,
  javascript: `repo:${org}/hiero-sdk-js`,
  go: `repo:${org}/hiero-sdk-go`,
  rust: `repo:${org}/hiero-sdk-rust`,
  java: `repo:${org}/hiero-sdk-java`,
  cpp: `repo:${org}/hiero-sdk-cpp`,
  swift: `repo:${org}/hiero-sdk-swift`,
};

export const difficultyMap: Record<Difficulty, RegExp[]> = {
  "good first issue": [/good[- ]first[- ]issue/i],
  beginner: [/beginner/i, /starter/i, /easy/i],
  intermediate: [/intermediate/i],
  advanced: [/advanced/i],
};

export function buildRepoList(selected: string): string[] {
  if (selected in sdkMap) {
    return [sdkMap[selected as SDK]];
  }

  return Object.values(sdkMap);
}

export function matchesDifficulty(
  labels: { name: string }[],
  difficulty: string,
) {
  if (!difficulty) return true;

  if (!(difficulty in difficultyMap)) return true;

  const patterns = difficultyMap[difficulty as Difficulty];

  return labels.some(label =>
    patterns.some(pattern => pattern.test(label.name)),
  );
}
