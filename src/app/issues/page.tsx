"use client";

import RichText from "@/components/RichText";
import { useEffect, useState } from "react";

interface GitHubIssue {
  id: number;
  title: string;
  html_url: string;
  repository_url: string;
}

interface GitHubSearchResponse {
  items: GitHubIssue[];
}

function hasKey<T extends object>(
  obj: T,
  key: PropertyKey
): key is keyof T {
  return key in obj;
}

export default function GoodFirstIssues() {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);

  // Filters
  const [difficulty, setDifficulty] = useState("good first issue");
  const [sdk, setSdk] = useState("");

  // Maps
  const difficultyMap = {
    "good first issue": 'label:"good first issue"',
    beginner: "label:beginner",
    intermediate: "label:intermediate",
    advanced: "label:advanced",
  } as const;

  const sdkMap = {
    python: "repo:hiero-ledger/hiero-sdk-python",
    javascript: "repo:hiero-ledger/hiero-sdk-js",
    cpp: "repo:hiero-ledger/hiero-sdk-cpp",
    java: "repo:hiero-ledger/hiero-sdk-java",
    go: "repo:hiero-ledger/hiero-sdk-go",
  } as const;

  /*const buildQuery = () => {
    let q = "state:open";

    if (sdk && hasKey(sdkMap, sdk)) {
      q += ` ${sdkMap[sdk]}`;
    } else {
      q += " org:hiero-ledger";
    }

    if (difficulty && hasKey(difficultyMap, difficulty)) {
      q += ` ${difficultyMap[difficulty]}`;
    }

    return q;
  };*/

  const buildQuery = () => {
    let q = "state:open";

    const sdkValue =
      sdk && hasKey(sdkMap, sdk) ? sdkMap[sdk] : undefined;

    const difficultyValue =
      difficulty && hasKey(difficultyMap, difficulty)
        ? difficultyMap[difficulty]
        : undefined;

    if (sdkValue) {
      q += ` ${sdkValue}`;
    } else {
      q += " org:hiero-ledger";
    }

    if (difficultyValue) {
      q += ` ${difficultyValue}`;
    }

    return q;
  };

  useEffect(() => {
    const fetchIssues = async () => {
      const query = buildQuery();

      try {
        const res = await fetch(
          `https://api.github.com/search/issues?q=${encodeURIComponent(query)}`
        );

        if (!res.ok) {
          throw new Error(`GitHub API error: ${res.status}`);
        }

        const data = (await res.json()) as GitHubSearchResponse;

        setIssues(data.items);
      } catch (err) {
        console.error("Failed to fetch issues:", err);
        setIssues([]);
      }
    };

    void fetchIssues(); // satisfies Codacy
  }, [difficulty, sdk]);

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
          }}
          className="p-2 rounded border"
        >
          <option value="good first issue">Good First Issue</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select
          value={sdk}
          onChange={(e) => {setSdk(e.target.value)}}
          className="p-2 rounded border"
        >
          <option value="">All Repo's</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="go">Go</option>
        </select>
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="bg-gradient-to-br from-white-dark via-white to-white p-4 rounded-xl shadow-md"
          >
            <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
              <RichText markdown={issue.title} />
            </a>
            <p className="text-sm opacity-70 mt-2">
              {issue.repository_url.split("/").pop()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}