"use client";

import { useState, useEffect } from "react";

interface Issue {
  title: string;
  link: string;
  org: string;
  repo: string;
  identifier: string;
  languageTags: string[];
  isAssigned: boolean;
  isClosed: boolean;
}

export default function IssueList({ endpoint }: { endpoint: string }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [language, setLanguage] = useState("");

  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then((data: Issue[]) => {
        setIssues(data.filter(issue => !issue.isAssigned && !issue.isClosed));
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [endpoint]);

  const languages = Array.from(
    new Set(issues.flatMap(i => i.languageTags)),
  ).sort();
  const filtered = language
    ? issues.filter(i => i.languageTags.includes(language))
    : issues;
  const sorted = [...filtered].sort(
    (a, b) =>
      a.org.localeCompare(b.org) ||
      a.repo.localeCompare(b.repo) ||
      a.identifier.localeCompare(b.identifier),
  );

  if (loading)
    return <div className="text-center text-xl text-gray-700">LOADING...</div>;
  if (error)
    return (
      <div className="text-center text-xl text-gray-700">
        Failed to load data. Please try again later.
      </div>
    );

  return (
    <div className="flex flex-col">
      <label htmlFor="language-filter" className="block prose lg:prose-xl">
        Filter issues by Language
      </label>
      <select
        id="language-filter"
        value={language}
        onChange={e => setLanguage(e.target.value)}
        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
        <option value="">All Languages</option>
        {languages.map(lang => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
      <ul className="divide-y divide-gray-100">
        {sorted.map(issue => (
          <li
            key={issue.link}
            className="flex flex-row justify-between gap-x-6 py-5">
            <div className="flex-initial">
              <a href={issue.link} target="_blank" rel="noopener noreferrer">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {issue.title}
                </p>
              </a>
              <a
                href={`https://github.com/${issue.org}/${issue.repo}`}
                target="_blank"
                rel="noopener noreferrer">
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                  {issue.repo}
                </p>
              </a>
            </div>
            <div>
              {issue.languageTags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  {tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
