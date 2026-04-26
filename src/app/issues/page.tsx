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
  error?: string;
}

export default function GoodFirstIssues() {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);

  //New
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const buildQuery = () => {
    let q = "is:issue state:open";

    const getSdkValue = (key: string | null) => {
      if (key && key in sdkMap) {
        return sdkMap[key as keyof typeof sdkMap];
      }
      return undefined;
    };

    const getDifficultyValue = (key: string | null) => {
      if (key && key in difficultyMap) {
        return difficultyMap[key as keyof typeof difficultyMap];
      }
      return undefined;
    };

    const sdkValue = getSdkValue(sdk);
    const difficultyValue = getDifficultyValue(difficulty);

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

  const getIssues = async (query: string): Promise<GitHubSearchResponse> => {
    const res = await fetch(`/api/issues?q=${encodeURIComponent(query)}`);
    const data = (await res.json()) as unknown as GitHubSearchResponse;

    if (!res.ok) {
      throw new Error(data.error ?? "Failed to fetch issues");
    }

    return data;
  };

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = buildQuery();
        const data = await getIssues(query);
        setIssues(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setIssues([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchIssues();
  }, [difficulty, sdk]);

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={difficulty}
          onChange={e => {
            setDifficulty(e.target.value);
          }}
          className="p-2 rounded border">
          <option value="good first issue">Good First Issue</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select
          value={sdk}
          onChange={e => {
            setSdk(e.target.value);
          }}
          className="p-2 rounded border">
          <option value="">All Repo's</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="go">Go</option>
        </select>
      </div>

      {/* Issues Grid */}
      {loading && <p>Loading issues...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {issues.map(issue => (
          <div
            key={issue.id}
            className="bg-gradient-to-br from-white-dark via-white to-white p-4 rounded-xl shadow-md">
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
