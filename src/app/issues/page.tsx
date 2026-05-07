"use client";

import Container from "@/components/Container";
import RichText from "@/components/RichText";
import { useState } from "react";
import { useIssues } from "@/hooks/useIssues";
import { GitHubIssue } from "@/issues/types";

export default function GoodFirstIssues() {
  const [difficulty, setDifficulty] = useState<string>("");
  const [sdk, setSdk] = useState<string>("");

  const { issues, loading, error } = useIssues(difficulty, sdk);
  const safeIssues: GitHubIssue[] = Array.isArray(issues) ? issues : [];

  return (
    <Container>
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

      <div className="grid grid-cols-4 gap-6">
        {safeIssues.map(issue => (
          <div key={issue.id}>
            <a href={issue.html_url} target="_blank" rel="noreferrer">
              <RichText markdown={issue.title ?? ""} className="line-clamp-2" />
            </a>

            <p className="text-sm opacity-70 mt-2">
              {issue.repository_url?.split("/").pop() ?? "unknown"}
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
}
