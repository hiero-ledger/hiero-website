import Image from "next/image";
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
  repos: DisplayRepoItem[];
}

interface DisplayRepoItem extends RepoItem {
  stars: number;
}

const REPO_GROUPS: RepoGroupConfig[] = [
  {
    heading: "Shape the project",
    text: "Governance and proposal work that guides the ecosystem.",
    repoNames: ["hiero-improvement-proposals", "tsc"],
  },
  {
    heading: "Infrastructure",
    text: "Core services for operating and inspecting networks.",
    repoNames: [
      "hiero-consensus-node",
      "hiero-mirror-node",
      "hiero-block-node",
      "solo",
    ],
  },
  {
    heading: "Build apps",
    text: "SDKs for teams building products on Hiero.",
    repoNames: [
      "hiero-sdk-js",
      "hiero-sdk-java",
      "hiero-sdk-go",
      "hiero-sdk-rust",
      "hiero-sdk-python",
      "hiero-sdk-swift",
    ],
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
  const withStars = (repo: RepoItem): DisplayRepoItem => ({
    ...repo,
    stars: getStars(repo.name),
  });
  const repoGroups = REPO_GROUPS.map(group => ({
    ...group,
    repos: group.repoNames
      .map(name => reposByName.get(name))
      .filter((repo): repo is RepoItem => repo != null)
      .map(withStars),
  })).filter(group => group.repos.length > 0);
  const fallbackRepos = data.repos
    .filter(repo => !featuredRepoNames.has(repo.name))
    .sort((a, b) => getStars(b.name) - getStars(a.name))
    .slice(0, FALLBACK_REPO_COUNT)
    .map(withStars);
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
  const [featuredGroup, ...remainingGroups] = displayGroups;

  return (
    <section id="repos" className="anchor">
      <div className="bg-white">
        <div className="container grid grid-cols-1 gap-10 pt-[40px] pb-[40px] sm:pt-[60px] sm:pb-[120px] lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.52fr)] lg:gap-16 xl:gap-20">
          <div className="flex min-w-0 flex-col">
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
                  className="inline-flex items-center gap-3 rounded-lg border border-red px-5 py-3 font-ibm text-sm text-red no-underline uppercase tracking-normal transition-colors duration-200 hover:bg-gray-light hover:text-red-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2">
                  <Image
                    src="/images/Hiero-Icon-Github.svg"
                    alt=""
                    aria-hidden="true"
                    width={15}
                    height={17}
                    className="h-4 w-4"
                  />
                  View all repositories →
                </a>
              </div>
            </div>

            {featuredGroup ? (
              <RepoGroup
                group={featuredGroup}
                index={0}
                featured
                className="mt-10"
              />
            ) : null}
          </div>

          {remainingGroups.length > 0 ? (
            <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
              {remainingGroups.map((group, index) => (
                <RepoGroup
                  key={group.heading}
                  group={group}
                  index={index + 1}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function RepoGroup({
  group,
  index,
  featured = false,
  className = "",
}: {
  group: DisplayRepoGroup;
  index: number;
  featured?: boolean;
  className?: string;
}) {
  const panelClassName = [
    "hiero-repo-panel hiero-reveal flex h-full min-w-0 flex-col rounded-lg border border-white-dark bg-white shadow-[0_10px_28px_rgba(30,30,30,0.05)]",
    featured ? "lg:max-w-[560px]" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={panelClassName}
      style={{ animationDelay: `${index * 110}ms` }}>
      <header className="border-b border-white-dark p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-red font-ibm text-sm text-white tracking-normal">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="rounded-lg bg-gray-light px-3 py-1 font-ibm text-sm text-gray uppercase tracking-normal">
            Code area
          </span>
        </div>
        <h3 className="text-xl font-medium tracking-normal sm:text-2xl">
          {group.heading}
        </h3>
        <p className="text-base text-gray mt-2 tracking-normal">{group.text}</p>
      </header>

      <div className="flex flex-1 flex-col divide-y divide-white-dark">
        {group.repos.map((repo, repoIndex) => (
          <RepoLink
            key={repo.name}
            repo={repo}
            featured={repoIndex === 0}
            index={repoIndex}
          />
        ))}
      </div>
    </article>
  );
}

function RepoLink({
  repo,
  featured,
  index,
}: {
  repo: DisplayRepoItem;
  featured: boolean;
  index: number;
}) {
  return (
    <a
      href={repo.link}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`View ${repo.name} repository on GitHub`}
      className="hiero-repo-link group grid min-w-0 grid-cols-1 gap-4 px-5 py-5 no-underline text-charcoal hover:bg-gray-light hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-inset sm:grid-cols-[minmax(0,1fr)_auto] sm:px-6"
      style={{ animationDelay: `${180 + index * 70}ms` }}>
      <span className="flex min-w-0 gap-3">
        <span
          aria-hidden="true"
          className={`hiero-repo-dot mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${
            featured ? "bg-red" : "bg-white-dark"
          }`}
        />
        <span className="min-w-0">
          {featured ? (
            <span className="mb-2 block font-ibm text-xs text-red uppercase tracking-normal">
              Featured path
            </span>
          ) : null}
          <span className="block break-words text-base font-medium tracking-normal sm:text-lg">
            {repo.name}
          </span>
          <span className="mt-1 block text-sm text-gray tracking-normal">
            {repo.description}
          </span>
        </span>
      </span>
      <span className="flex shrink-0 items-center self-start rounded-lg border border-red px-3 py-2 font-ibm text-sm text-red uppercase tracking-normal transition-transform duration-200 group-hover:translate-x-1">
        Open →
      </span>
    </a>
  );
}
