import Image from "next/image";

import repoStats from "@/data/repository_stats.json";
import GossipField from "@/components/GossipField";

interface RepoItem {
  name: string;
  description: string;
  link: string;
}

interface ReposData {
  eyebrow: string;
  heading: string;
  text: string;
  repos: RepoItem[];
}

interface ReposGridProps {
  data: ReposData;
}

type RepoStats = Partial<Record<string, { stars: number }>>;

const VISIBLE_COUNT = 9;

export default function ReposGrid({ data }: ReposGridProps) {
  const statsMap = new Map(
    Object.entries(repoStats as RepoStats)
      .filter((entry): entry is [string, { stars: number }] => entry[1] != null)
      .map(([key, val]) => [key, val.stars]),
  );
  const getStars = (name: string): number => statsMap.get(name) ?? 0;

  if (process.env.NODE_ENV === "development") {
    const missing = data.repos
      .filter(r => !statsMap.has(r.name))
      .map(r => r.name);
    if (missing.length > 0) {
      console.warn(
        `[ReposGrid] Missing stats for: ${missing.join(", ")}. These repos will sort as 0 stars.`,
      );
    }
  }

  const sortedRepos = [...data.repos]
    .sort((a, b) => getStars(b.name) - getStars(a.name))
    .slice(0, VISIBLE_COUNT);

  return (
    <section
      id="repos"
      aria-labelledby="repositories-heading"
      className="repositories">
      <GossipField placement="repos" />

      <div className="container repositories-inner">
        <header className="repositories-header">
          <div>
            <p className="repositories-eyebrow">{data.eyebrow}</p>
            <h2 id="repositories-heading" className="repositories-heading">
              {data.heading}
            </h2>
          </div>

          <div className="repositories-intro">
            <p className="repositories-copy">{data.text}</p>

            <ul role="list" className="repositories-features">
              <li>Open source</li>
              <li>GitHub hosted</li>
              <li>Community maintained</li>
            </ul>
          </div>
        </header>

        <ul role="list" className="repositories-grid">
          {sortedRepos.map(repo => (
            <li key={repo.name} className="repository-item">
              <RepoCard repo={repo} stars={getStars(repo.name)} />
            </li>
          ))}
        </ul>

        <div className="repositories-footer">
          <p>Explore the complete Hiero codebase on GitHub.</p>
          <a
            href="https://github.com/orgs/hiero-ledger/repositories"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="View all repositories on GitHub (opens in new tab)"
            className="repositories-all-link">
            <span>View all repositories</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function RepoCard({ repo, stars }: { repo: RepoItem; stars: number }) {
  return (
    <a
      href={repo.link}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`View ${repo.name} repository on GitHub (opens in new tab)`}
      className="repository-link">
      <div className="repository-meta">
        <span className="repository-platform">
          <Image
            src="/images/Hiero-Icon-Github.svg"
            alt=""
            width={16}
            height={17}
            className="repository-github-icon"
          />
          GitHub
        </span>
        <span className="repository-stars" aria-label={`${stars} GitHub stars`}>
          <span aria-hidden="true">★</span> {stars}
        </span>
      </div>

      <h3 className="repository-name">{repo.name}</h3>
      <p className="repository-description">{repo.description}</p>

      <span className="repository-action" aria-hidden="true">
        <span>Explore repository</span>
        <span className="repository-action-glyph">↗</span>
      </span>
    </a>
  );
}
