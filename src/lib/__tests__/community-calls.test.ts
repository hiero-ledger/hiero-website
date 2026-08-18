import { describe, expect, it } from "vitest";

import { normaliseCallName } from "../community-calls";

describe("normaliseCallName", () => {
  it.each([
    ["Hiero TSC Meeting", "TSC"],
    ["Hiero Community Call", "Community Call"],
    ["Hiero SDK Community Call", "SDK Community Call"],
    ["Hiero Identity Community Call", "Identity Community Call"],
    ["Hiero Python SDK Community Call", "Python SDK Community Call"],
    ["Hiero Solo Community Call", "Solo Community Call"],
    ["Hiero Solo Action Community Call", "Solo Action Community Call"],
    ["Hiero Community Management", "Community Management"],
    ["Hiero SDK Python Office Hours", "SDK Python Office Hours"],
  ])("strips the Hiero prefix and Meeting suffix: %s", (input, expected) => {
    expect(normaliseCallName(input)).toBe(expected);
  });

  it("canonicalises suffix casing", () => {
    expect(normaliseCallName("Hiero Monthly Maintainers community call")).toBe(
      "Monthly Maintainers Community Call",
    );
    expect(normaliseCallName("Block Stream community group")).toBe(
      "Block Stream Community Group",
    );
  });

  it("leaves non-Hiero meetings alone", () => {
    expect(normaliseCallName("Automation Migration Community Call")).toBe(
      "Automation Migration Community Call",
    );
    expect(normaliseCallName("HOL: Registries Subcommittee")).toBe(
      "HOL: Registries Subcommittee",
    );
    expect(
      normaliseCallName(
        "HOL Cryptographic Agent Execution Standards Working Group",
      ),
    ).toBe("HOL Cryptographic Agent Execution Standards Working Group");
  });

  it("does not strip Hiero when it is part of a longer word", () => {
    expect(normaliseCallName("Hierophant Working Group")).toBe(
      "Hierophant Working Group",
    );
  });

  it("collapses stray whitespace", () => {
    expect(normaliseCallName("  Hiero   Solo   Community Call  ")).toBe(
      "Solo Community Call",
    );
  });
});
