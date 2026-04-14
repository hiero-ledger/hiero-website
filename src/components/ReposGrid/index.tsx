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

interface RepoGroupConfig {
  heading: string;
  text: string;
  repoNames: string[];
}

interface DisplayRepoGroup {
  heading: string;
  text: string;
  repos: RepoItem[];
}

const REPO_GROUPS: RepoGroupConfig[] = [
  {
    heading: "Build apps",
    text: "SDKs for teams building products on Hiero.",
    repoNames: ["hiero-sdk-js", "hiero-sdk-java"],
  },
  {
    heading: "Run infrastructure",
    text: "Core services for operating and inspecting networks.",
    repoNames: ["hiero-consensus-node", "hiero-mirror-node"],
  },
  {
    heading: "Shape the project",
    text: "Governance and proposal work that guides the ecosystem.",
    repoNames: ["hiero-improvement-proposals", "tsc"],
  },
];

const FALLBACK_REPO_COUNT = 6;
const featuredRepoNames = new Set(
  REPO_GROUPS.flatMap(group => group.repoNames),
);

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

  const reposByName = new Map(data.repos.map(repo => [repo.name, repo]));
  const repoGroups = REPO_GROUPS.map(group => ({
    ...group,
    repos: group.repoNames
      .map(name => reposByName.get(name))
      .filter((repo): repo is RepoItem => repo != null),
  })).filter(group => group.repos.length > 0);
  const fallbackRepos = data.repos
    .filter(repo => !featuredRepoNames.has(repo.name))
    .sort((a, b) => getStars(b.name) - getStars(a.name))
    .slice(0, FALLBACK_REPO_COUNT);
  const displayGroups: DisplayRepoGroup[] =
    repoGroups.length > 0
      ? repoGroups
      : fallbackRepos.length > 0
        ? [
            {
              heading: "Featured repositories",
              text: "Useful places to start exploring the codebase.",
              repos: fallbackRepos,
            },
          ]
        : [];

  return (
    <section id="repos" className="anchor">
      <div className="bg-white">
        <div className="container pt-[40px] pb-[40px] sm:pt-[60px] sm:pb-[120px] grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.45fr)] gap-10 lg:gap-20">
          <div>
            <p className="font-ibm text-sm text-red uppercase tracking-normal mb-4">
              Explore the code
            </p>
            <h2 className="text-2xl mb-2.5 sm:text-4xl sm:mb-5 tracking-normal">
              {data.heading}
            </h2>
            <div className="text-lg max-w-full md:max-w-[560px] whitespace-pre-line tracking-normal">
              {data.text}
            </div>
            <div className="mt-8">
              <a
                href="https://github.com/orgs/hiero-ledger/repositories"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="View all repositories on GitHub (opens in new tab)"
                className="text-red hover:text-red-dark text-lg font-medium underline tracking-normal">
                View all repositories →
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
            {displayGroups.map(group => (
              <RepoGroup
                key={group.heading}
                group={group}
                getStars={getStars}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RepoGroup({
  group,
  getStars,
}: {
  group: DisplayRepoGroup;
  getStars: (name: string) => number;
}) {
  return (
    <article className="hiero-repo-panel hiero-reveal flex h-full min-h-[360px] flex-col rounded-lg border border-t-4 border-white-dark border-t-red bg-white p-5 shadow-[0_10px_28px_rgba(30,30,30,0.05)]">
      <div className="min-h-[132px] border-b border-white-dark pb-5">
        <p className="font-ibm text-sm text-red uppercase tracking-normal mb-4">
          Code area
        </p>
        <h3 className="text-xl sm:text-2xl font-medium tracking-normal">
          {group.heading}
        </h3>
        <p className="text-base text-gray mt-2 tracking-normal">{group.text}</p>
      </div>

      <div className="mt-1 divide-y divide-white-dark">
        {group.repos.map(repo => (
          <RepoLink key={repo.name} repo={repo} stars={getStars(repo.name)} />
        ))}
      </div>
    </article>
  );
}

function RepoLink({ repo, stars }: { repo: RepoItem; stars: number }) {
  return (
    <a
      href={repo.link}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`View ${repo.name} repository on GitHub`}
      className="group grid min-h-[112px] grid-cols-[minmax(0,1fr)_auto] gap-4 py-5 no-underline text-charcoal transition-colors duration-200 hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2">
      <span className="min-w-0">
        <span className="block text-base sm:text-lg font-medium break-words tracking-normal">
          {repo.name}
        </span>
        <span className="block text-sm text-gray mt-1 tracking-normal">
          {repo.description}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end justify-between">
        <span className="rounded-lg bg-gray-light px-2 py-1 font-ibm text-sm text-gray tracking-normal">
          ⭐ {stars}
          <span className="sr-only">{stars} stars</span>
        </span>
        <span className="font-ibm text-sm text-red uppercase tracking-normal transition-transform duration-200 group-hover:translate-x-1">
          Open
        </span>
      </span>
    </a>
  );
}
