import repoStats from "@/data/repository_stats.json";

type RepoItem = {
  name: string;
  description: string;
  link: string;
};

type ReposData = {
  heading: string;
  text: string;
  repos: RepoItem[];
};

type ReposCarouselProps = {
  data: ReposData;
};

type RepoStats = Partial<Record<string, { stars: number }>>;

const VISIBLE_COUNT = 9;

export default function ReposCarousel({ data }: ReposCarouselProps) {
  const stats = repoStats as RepoStats;

  if (process.env.NODE_ENV === "development") {
    const missing = data.repos
      .filter(r => !(r.name in stats))
      .map(r => r.name);
    if (missing.length > 0) {
      console.warn(
        `[ReposCarousel] Missing stats for: ${missing.join(", ")}. These repos will sort as 0 stars.`,
      );
    }
  }

  const sortedRepos = [...data.repos]
    .sort((a, b) => (stats[b.name]?.stars ?? 0) - (stats[a.name]?.stars ?? 0))
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sortedRepos.map(repo => (
              <div
                key={repo.name}
                className="border-2 border-white-dark rounded-2xl p-8 hover:border-red transition-colors duration-200 bg-white h-full flex flex-col">
                <h3 className="text-xl sm:text-2xl font-medium mb-3">
                  {repo.name}
                </h3>
                <p className="text-base mb-4 text-gray-600 flex-grow">
                  {repo.description}
                </p>
                <div className="flex flex-row justify-between items-center mt-4">
                  <a
                    href={repo.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`View ${repo.name} repository on GitHub`}
                    className="text-red hover:text-red-dark text-base font-medium underline">
                    View Repository →
                  </a>
                  <span className="text-sm text-gray-600">
                    ⭐ {stats[repo.name]?.stars ?? 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="https://github.com/orgs/hiero-ledger/repositories"
              target="_blank"
              rel="noreferrer noopener"
              className="text-red hover:text-red-dark text-lg font-medium underline">
              View all repositories →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
