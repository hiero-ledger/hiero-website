import RepoGroupHeader from "./RepoGroupHeader";
import RepoLink from "./RepoLink";
import type { DisplayRepoGroup } from "./types";

interface RepoGroupProps {
  group: DisplayRepoGroup;
  index: number;
  featured?: boolean;
  className?: string;
}

export default function RepoGroup({
  group,
  index,
  featured = false,
  className = "",
}: RepoGroupProps) {
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
      <RepoGroupHeader group={group} index={index} />

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
