"use client";

import RichText from "@/components/RichText";
import Container from "@/components/Container";
import { useEffect, useState } from "react";

/* -----------------------------
   Types
------------------------------ */
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

/* -----------------------------
   Debounce hook
------------------------------ */
function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounced;
}

/* -----------------------------
   Maps
------------------------------ */
const sdkMap: Record<string, string> = {
  python: "repo:hiero-ledger/hiero-sdk-python",
  javascript: "repo:hiero-ledger/hiero-sdk-js",
  cpp: "repo:hiero-ledger/hiero-sdk-cpp",
  java: "repo:hiero-ledger/hiero-sdk-java",
  go: "repo:hiero-ledger/hiero-sdk-go",
  rust: "repo:hiero-ledger/hiero-sdk-rust",
  block_node: "repo:hiero-ledger/hiero-block-node",
  mirror_node: "repo:hiero-ledger/hiero-mirror-node",
  consensus_node: "repo:hiero-ledger/hiero-consensus-node",
  hiero_docs: "repo:hiero-ledger/hiero-docs",
};

const difficultyMap: Record<string, string[]> = {
  "good first issue": [
    "good first issue",
    "good-first-issue",
    "starter",
    "easy",
  ],
  beginner: ["beginner", "easy", "starter"],
  intermediate: ["intermediate"],
  advanced: ["advanced"],
};

/* -----------------------------
   Cache
------------------------------ */
const cache = new Map<string, GitHubSearchResponse>();

/* -----------------------------
   Helpers (splits complexity)
------------------------------ */
function getKeywords(difficulty: string): string[] {
  if (Object.prototype.hasOwnProperty.call(difficultyMap, difficulty)) {
    return difficultyMap[difficulty];
  }

  return [];
}

function matchesDifficulty(issue: GitHubIssue, difficulty: string) {
  if (!difficulty) return true;

  const text = issue.title.toLowerCase();
  const keywords = getKeywords(difficulty);

  return keywords.length > 0 ? keywords.some(k => text.includes(k)) : true;
}

function buildRepoList(selected: string): string[] {
  if (Object.prototype.hasOwnProperty.call(sdkMap, selected)) {
    return [sdkMap[selected as keyof typeof sdkMap]];
  }

  return Object.values(sdkMap);
}

async function fetchFromApi(query: string, signal?: AbortSignal) {
  if (cache.has(query)) {
    const cached = cache.get(query);
    if (cached) return cached;
  }

  const url = `/api/issues?q=${encodeURIComponent(query)}`;

  const res = await fetch(url, { signal });

  const data = (await res.json()) as GitHubSearchResponse;

  if (!res.ok) {
    throw new Error(data.error ?? "Failed to fetch issues");
  }

  cache.set(query, data);

  return data;
}

/* -----------------------------
   Component
------------------------------ */
export default function GoodFirstIssues() {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [difficulty, setDifficulty] = useState("");
  const [sdk, setSdk] = useState("");

  const debouncedDifficulty = useDebouncedValue(difficulty);
  const debouncedSdk = useDebouncedValue(sdk);

  useEffect(() => {
    const controller = new AbortController();

    const fetchIssues = async () => {
      setLoading(true);
      setError(null);

      try {
        const base = "is:issue state:open";
        const repos = buildRepoList(debouncedSdk);

        const results = await Promise.all(
          repos.map(repo => fetchFromApi(`${base} ${repo}`, controller.signal)),
        );

        const merged = results.flatMap(r => r.items);

        const unique = Array.from(new Map(merged.map(i => [i.id, i])).values());

        const filtered = debouncedDifficulty
          ? unique.filter(i => matchesDifficulty(i, debouncedDifficulty))
          : unique;

        setIssues(filtered);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        setError(err instanceof Error ? err.message : "Unknown error occurred");

        setIssues([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchIssues();

    return () => {
      controller.abort();
    };
  }, [debouncedDifficulty, debouncedSdk]);

  return (
    <Container>
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          className="p-2 rounded border">
          <option value="">All Difficulties</option>
          <option value="good first issue">Good First Issue</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <select
          value={sdk}
          onChange={e => setSdk(e.target.value)}
          className="p-2 rounded border">
          <option value="">All Repos</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="block_node">Block Node</option>
          <option value="mirror_node">Mirror Node</option>
          <option value="consensus_node">Consensus Node</option>
          <option value="hiero_docs">Hiero Docs</option>
        </select>
      </div>

      {/* Issues */}
      {loading && <p>Loading issues...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {issues.map(issue => (
          <div
            key={issue.id}
            className="bg-gradient-to-br from-white-dark via-white to-white p-4 rounded-xl shadow-md">
            <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
              <RichText markdown={issue.title} className="line-clamp-2" />
            </a>
            <p className="text-sm opacity-70 mt-2">
              {issue.repository_url.split("/").pop()}
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
}
