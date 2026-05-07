type SDK = "python" | "javascript" | "go" | "rust" | "java" | "cpp" | "swift";
type Difficulty = "good first issue" | "beginner" | "intermediate" | "advanced";

export const sdkMap: Record<SDK, string> = {
  python: "repo:hiero-ledger/hiero-sdk-python",
  javascript: "repo:hiero-ledger/hiero-sdk-js",
  go: "repo:hiero-ledger/hiero-sdk-go",
  rust: "repo:hiero-ledger/hiero-sdk-rust",
  java: "repo:hiero-ledger/hiero-sdk-java",
  cpp: "repo:hiero-ledger/hiero-sdk-cpp",
  swift: "repo:hiero-ledger/hiero-sdk-swift",
};

///Keeping for now ; accidentally works on "skill: beginner" (will remove later)
/*export const difficultyMap: Record<string, string[]> = {
  "good first issue": ["good first issue", "good-first-issue", "starter", "easy"],
  beginner: ["beginner", "easy", "starter"],
  intermediate: ["intermediate"],
  advanced: ["advanced"],
};*/

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

///Keeping for now ; accidentally works on "skill: beginner" (will remove later)
/*export function matchesDifficulty(
  labels: { name: string }[],
  difficulty: string
) {
  if (!difficulty) return true;

  const keywords = difficultyMap[difficulty] ?? [];

  const labelNames = labels.map(l => l.name.toLowerCase());

  return keywords.some(k =>
    labelNames.some(label => label.includes(k))
  );
}*/

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
