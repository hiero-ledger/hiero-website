"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface Contributor {
  userName: string;
  avatarUrl: string;
}

export default function ContributorsGrid({ endpoint }: { endpoint: string }) {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then((data: Contributor[]) => {
        setContributors(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [endpoint]);

  if (loading)
    return <div className="text-center text-xl text-gray-700">LOADING...</div>;
  if (error)
    return (
      <div className="text-center text-xl text-gray-700">
        Failed to load data. Please try again later.
      </div>
    );

  return (
    <ul
      role="list"
      className="grid grid-cols-2 sm:grid-cols-4 gap-6 list-none p-0">
      {contributors.map(c => (
        <li key={c.userName} className="flex justify-center">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://github.com/${c.userName}`}
            className="no-underline">
            <div className="flex flex-col justify-center items-center">
              <Image
                className="rounded-full h-32 w-32 bg-slate-600 p-0.5"
                src={c.avatarUrl}
                alt={`Avatar of ${c.userName}`}
                width={128}
                height={128}
                unoptimized
              />
              <span className="text-center mt-1">{c.userName}</span>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
