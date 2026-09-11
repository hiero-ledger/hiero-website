import { describe, expect, it } from "vitest";

import {
  DIFFICULTIES,
  classifyDifficulty,
  difficultyLabel,
  isDifficultyValue,
  normaliseLabel,
} from "@/issues/difficulty";

describe("normaliseLabel", () => {
  it("folds the spellings the organisation actually uses onto one form", () => {
    for (const spelling of [
      "Good First Issue",
      "good first issue",
      "skill: good first issue",
      "Skill: Good-First-Issue",
      "  good_first_issue  ",
    ]) {
      expect(normaliseLabel(spelling)).toBe("good first issue");
    }
  });

  it("only strips a qualifier it recognises", () => {
    /* `priority: medium` must not become `medium`, or a priority scale starts
       classifying issues as intermediate. */
    expect(normaliseLabel("priority: medium")).toBe("priority: medium");
    expect(normaliseLabel("difficulty: advanced")).toBe("advanced");
  });
});

describe("classifyDifficulty", () => {
  it("reads a level off any of its spellings", () => {
    expect(classifyDifficulty(["skill: beginner"])).toBe("beginner");
    expect(classifyDifficulty(["Good First Issue"])).toBe("good-first-issue");
    expect(classifyDifficulty(["Advanced", "bug"])).toBe("advanced");
  });

  it("prefers the most inviting level when an issue carries two", () => {
    expect(classifyDifficulty(["advanced", "good first issue"])).toBe(
      "good-first-issue",
    );
    expect(classifyDifficulty(["intermediate", "beginner"])).toBe("beginner");
  });

  it("does not match a label that merely contains a level word", () => {
    /* The regex list this replaced matched all three of these. */
    expect(classifyDifficulty(["beginner-friendly-docs"])).toBeNull();
    expect(classifyDifficulty(["easy to reproduce"])).toBeNull();
    expect(classifyDifficulty(["priority: medium"])).toBeNull();
  });

  it("returns null for an issue with no level at all", () => {
    expect(classifyDifficulty([])).toBeNull();
    expect(classifyDifficulty(["bug", "documentation"])).toBeNull();
  });
});

describe("the difficulty vocabulary", () => {
  it("gives every value a label and recognises every value", () => {
    for (const difficulty of DIFFICULTIES) {
      expect(isDifficultyValue(difficulty.value)).toBe(true);
      expect(difficultyLabel(difficulty.value)).toBe(difficulty.label);
    }

    expect(isDifficultyValue("expert")).toBe(false);
  });
});
