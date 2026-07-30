"use client";

import Container from "@/components/Container";
import RichText from "@/components/RichText";
import { useState } from "react";
import { useIssues } from "@/hooks/useIssues";
import { GitHubIssue } from "@/issues/types";

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
    <Container>
      <div className="mb-10">
        <h1 className="text-2xl mb-2.5 sm:text-4xl sm:mb-5">Issue Explorer</h1>
        <RichText
          className="text-lg max-w-full md:max-w-[800px]"
          markdown="Browse open issues across the Hiero SDKs by difficulty. The four levels below are the rungs of the [Issue Progression Initiative](/blog/hiero-issue-progression-initiative)."
        />
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={difficulty}
          onChange={e => {
            setDifficulty(e.target.value);
          }}>
          <option value="">All Difficulties</option>
          <option value="good first issue">Good First Issue</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select
          value={sdk}
          onChange={e => {
            setSdk(e.target.value);
          }}>
          <option value="">All Repos</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="swift">Swift</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {typeof error === "string" && <p>{error}</p>}
      {!loading && !error && issues.length === 0 && (
        <p>No issues found matching the selected filters.</p>
      )}

      <div className="grid grid-cols-4 gap-6">
        {issues.map(issue => (
          <div key={issue.id}>
            <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
              <RichText markdown={issue.title ?? ""} className="line-clamp-2" />
            </a>

            <p className="text-sm opacity-70 mt-2">
              {issue.repository_url.split("/").pop() ?? "unknown"}
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
}
