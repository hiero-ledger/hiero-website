export const sdkMap: Record<string, string> = {
  python: "repo:hiero-ledger/hiero-sdk-python",
  javascript: "repo:hiero-ledger/hiero-sdk-js",
  go: "repo:hiero-ledger/hiero-sdk-go",
  rust: "repo:hiero-ledger/hiero-sdk-rust",
  java: "repo:hiero-ledger/hiero-sdk-java",
  cpp: "repo:hiero-ledger/hiero-sdk-cpp",
  swift: "repo:hiero-ledger/hiero-sdk-swift", // ✅ add this
};

///Keeping for now ; accidentally works on "skill: beginner" (will remove later)
/*export const difficultyMap: Record<string, string[]> = {
  "good first issue": ["good first issue", "good-first-issue", "starter", "easy"],
  beginner: ["beginner", "easy", "starter"],
  intermediate: ["intermediate"],
  advanced: ["advanced"],
};*/

export const difficultyMap: Record<string, RegExp[]> = {
  "good first issue": [/good[- ]first[- ]issue/i],
  beginner: [/beginner/i, /starter/i, /easy/i],
  intermediate: [/intermediate/i],
  advanced: [/advanced/i],
};

export function buildRepoList(selected: string): string[] {
  return sdkMap[selected] ? [sdkMap[selected]] : Object.values(sdkMap);
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

  const patterns = difficultyMap[difficulty] ?? [];

  return labels.some(label =>
    patterns.some(pattern => pattern.test(label.name)),
  );
}
