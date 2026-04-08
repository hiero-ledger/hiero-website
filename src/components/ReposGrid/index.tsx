import repoStats from "@/data/repository_stats.json";

interface RepoItem {
  name: string;
  description: string;
  link: string;
}

interface ReposData {
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
    <div id="repos" className="anchor">
      <div className="bg-white">
        <div className="container pt-[40px] pb-[40px] sm:pt-[60px] sm:pb-[120px]">
          <div className="mb-10 sm:mb-16">
            <h2 className="text-2xl mb-2.5 sm:text-4xl sm:mb-5">
              {data.heading}
            </h2>
            <div className="text-lg max-w-full md:max-w-[800px]">
              {data.text}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {sortedRepos.map(repo => (
              <div key={repo.name}>
                <RepoCard repo={repo} stars={getStars(repo.name)} />
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="https://github.com/orgs/hiero-ledger/repositories"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="View all repositories on GitHub (opens in new tab)"
              className="text-red hover:text-red-dark text-lg font-medium underline">
              View all repositories →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function RepoCard({ repo, stars }: { repo: RepoItem; stars: number }) {
  return (
    <a
      href={repo.link}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`View ${repo.name} repository on GitHub`}
      className="relative flex flex-col border-2 border-white-dark rounded-2xl p-8 hover:border-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2 transition-colors duration-200 bg-white h-full no-underline text-charcoal">
      <div className="absolute top-4 right-4 z-10">
        <span className="inline-flex items-center justify-center min-w-[48px] text-sm text-gray-600">
          ⭐ {stars}
          <span className="sr-only">{stars} stars</span>
        </span>
      </div>
      <h3 className="text-xl sm:text-2xl font-medium mb-3 pr-10">{repo.name}</h3>
      <p className="text-base text-gray-600 flex-grow">
        {repo.description}
      </p>
    </a>
  );
}
