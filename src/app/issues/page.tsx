"use client";

import Container from "@/components/Container";
import RichText from "@/components/RichText";
import { useState } from "react";
import { useIssues } from "@/hooks/useIssues";
import { GitHubIssue } from "@/issues/types";

type Difficulty = {
  label: string;
  value: string;
};

const difficultyAliases: Record<string, string[]> = {
  "good first issue": [
    "good first issue",
    "skill: good first issue",
  ],
  beginner: [
    "beginner",
    "skill: beginner",
  ],
  intermediate: [
    "intermediate",
    "skill: intermediate",
  ],
  advanced: [
    "advanced",
    "skill: advanced",
  ],
};

function getDifficulty(issue: GitHubIssue): Difficulty | null {
  const issueWithLabels = issue as GitHubIssue & {
    labels?: Array<string | { name?: string }>;
  };

  const labels = issueWithLabels.labels ?? [];

  const labelNames = labels.map(label =>
    (typeof label === "string" ? label : label.name ?? "").toLowerCase(),
  );

  for (const [difficulty, aliases] of Object.entries(difficultyAliases)) {
    const found = aliases.some(alias =>
      labelNames.includes(alias.toLowerCase()),
    );

    if (found) {
      return {
        label:
          difficulty === "good first issue"
            ? "Good First Issue"
            : difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
        value: difficulty,
      };
    }
  }

  return null;
}

function getDifficultyClasses(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "good first issue":
      return "border-[#A7E8C7] bg-[#F0FFF7] text-[#16804F]";

    case "beginner":
      return "border-[#B7D6FF] bg-[#F2F7FF] text-[#2768C7]";

    case "intermediate":
      return "border-[#F1D27A] bg-[#FFF9E8] text-[#B47700]";

    case "advanced":
      return "border-[#F2B4B4] bg-[#FFF3F3] text-[#C62828]";

    default:
      return "border-gray-light bg-white text-gray";
  }
}

function getRepositoryName(repositoryUrl: string) {
  return repositoryUrl.split("/").pop() ?? "unknown";
}

export default function IssueExplorer() {
  const [difficulty, setDifficulty] = useState<string>("");
  const [sdk, setSdk] = useState<string>("");

  const {
    issues,
    loading,
    error,
  }: {
    issues: GitHubIssue[];
    loading: boolean;
    error: string | null;
  } = useIssues(difficulty, sdk);

  return (
    <div className="min-h-screen bg-white font-serif text-charcoal">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#24000F]">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background: `
              radial-gradient(circle at 70% 20%, rgba(217, 45, 106, 0.55), transparent 34%),
              radial-gradient(circle at 88% 55%, rgba(184, 26, 86, 0.85), transparent 45%),
              linear-gradient(110deg, #21000d 0%, #5d0b2c 38%, #b81a56 100%)
            `,
          }}
        />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-20"
          aria-hidden="true"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
            `,
            backgroundSize: "54px 54px",
          }}
        />

        {/* Decorative network nodes */}
        <div
          className="absolute inset-0 opacity-30"
          aria-hidden="true"
        >
          <span className="absolute left-[29%] top-[42%] h-3 w-3 rounded-full bg-white/70 shadow-[0_0_0_12px_rgba(255,255,255,0.08)]" />
          <span className="absolute left-[47%] top-[62%] h-4 w-4 rounded-full bg-white/60 shadow-[0_0_0_18px_rgba(255,255,255,0.07)]" />
          <span className="absolute left-[69%] top-[28%] h-3 w-3 rounded-full bg-white/60 shadow-[0_0_0_14px_rgba(255,255,255,0.07)]" />
          <span className="absolute right-[10%] top-[54%] h-4 w-4 rounded-full bg-white/60 shadow-[0_0_0_18px_rgba(255,255,255,0.07)]" />
          <span className="absolute right-[28%] bottom-[17%] h-3 w-3 rounded-full bg-white/60 shadow-[0_0_0_14px_rgba(255,255,255,0.07)]" />

          <div className="absolute left-[29%] top-[43%] h-px w-[21%] rotate-[18deg] bg-white/30" />
          <div className="absolute left-[48%] top-[62%] h-px w-[24%] -rotate-[29deg] bg-white/30" />
          <div className="absolute left-[69%] top-[29%] h-px w-[19%] rotate-[32deg] bg-white/30" />
        </div>

        <Container>
          <div className="relative z-10 flex min-h-[580px] items-center py-24 sm:min-h-[580px] lg:min-h-[580px]">
            <div className="max-w-[620px]">
              <div className="mb-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                <span className="h-2 w-2 rounded-full bg-red-light" />
                Open Source · Hiero SDKs
              </div>

              <h1 className="max-w-[520px] text-6xl font-medium leading-[0.92] tracking-[-0.055em] text-white sm:text-7xl lg:text-[7.5rem] lg:leading-[0.88]">
                Issue
                <br />
                Explorer
              </h1>

              <div className="my-8 h-px w-24 bg-white" />

              <p className="max-w-[520px] text-lg leading-7 tracking-[-0.02em] text-white/80 sm:text-xl">
                Find open issues across Hiero SDKs and start contributing
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/20 bg-white/15 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm">
                  {issues.length} open issues
                </span>

                <span className="rounded-full border border-white/20 bg-white/15 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm">
                  Ready to contribute
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-light bg-white">
        <Container>
          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              {/* Difficulty */}
              <div className="relative">
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className="h-10 min-w-[140px] appearance-none rounded-lg border border-gray-light bg-white px-4 pr-10 text-sm font-medium text-charcoal outline-none transition-colors hover:border-gray focus:border-red focus:ring-2 focus:ring-red-light/20"
                >
                  <option value="">All Difficulties</option>
                  <option value="good first issue">Good First Issue</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray">
                  ▾
                </span>
              </div>

              {/* Repository */}
              <div className="relative">
                <select
                  value={sdk}
                  onChange={e => setSdk(e.target.value)}
                  className="h-10 min-w-[110px] appearance-none rounded-lg border border-gray-light bg-white px-4 pr-10 text-sm font-medium text-charcoal outline-none transition-colors hover:border-gray focus:border-red focus:ring-2 focus:ring-red-light/20"
                >
                  <option value="">All Repos</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="swift">Swift</option>
                </select>

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray">
                  ▾
                </span>
              </div>
            </div>

            <div className="w-fit rounded-lg border border-gray-light bg-gray-light/40 px-4 py-2 text-sm font-medium text-charcoal">
              {issues.length} {issues.length === 1 ? "issue" : "issues"}
            </div>
          </div>
        </Container>
      </section>

      {/* Issue list */}
      <main className="bg-[#FAFAF9]">
        <Container>
          <div className="py-9 sm:py-10">
            {loading && (
              <div className="py-20 text-center">
                <p className="text-lg text-gray">Loading issues...</p>
              </div>
            )}

            {typeof error === "string" && (
              <div className="rounded-xl border border-red/20 bg-red/5 p-6 text-red">
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && issues.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-lg text-gray">
                  No issues found matching the selected filters.
                </p>
              </div>
            )}

            {!loading && !error && issues.length > 0 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {issues.map(issue => {
                  const issueDifficulty = getDifficulty(issue);
                  const repository = getRepositoryName(issue.repository_url);
                  console.log(issue.title, issue.labels);
                  return (
                    <a
                      key={issue.id}
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-[185px] flex-col rounded-xl border border-[#E8E8E6] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-red/30 hover:shadow-[0_8px_30px_rgba(30,30,30,0.08)]"
                    >
                      {/* Repository */}
                      <div>
                        <span className="inline-flex rounded-md bg-red/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-red">
                          {repository}
                        </span>
                      </div>

                      {/* Title */}
                      <div className="mt-4 flex-1">
                        <RichText
                          markdown={issue.title ?? ""}
                          className="line-clamp-3 text-[15px] font-medium leading-5 tracking-[-0.02em] text-charcoal"
                        />
                      </div>

                      {/* Bottom row */}
                      <div className="mt-5 flex items-center justify-between border-t border-gray-light pt-4">
                        <div>
                          {issueDifficulty ? (
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${getDifficultyClasses(
                                issueDifficulty.value,
                              )}`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {issueDifficulty.label}
                            </span>
                          ) : (
                            <span className="text-xs text-gray">
                              Open issue
                            </span>
                          )}
                        </div>

                        <span className="text-lg text-gray transition-transform duration-200 group-hover:translate-x-1 group-hover:text-red">
                          →
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </main>
    </div>
  );
}