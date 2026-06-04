import type { RepoItem } from "./types";

interface RepoLinkProps {
  repo: RepoItem;
  featured: boolean;
  index: number;
}

export default function RepoLink({ repo, featured, index }: RepoLinkProps) {
  return (
    <a
      href={repo.link}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`View ${repo.name} repository on GitHub`}
      className="hiero-repo-link group grid min-w-0 grid-cols-1 gap-4 px-5 py-5 no-underline text-charcoal hover:bg-gray-light hover:text-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-inset sm:grid-cols-[minmax(0,1fr)_auto] sm:px-6"
      style={{ animationDelay: `${180 + index * 70}ms` }}>
      <span className="flex min-w-0 items-start gap-3">
        <span
          aria-hidden="true"
          className={`hiero-repo-dot mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${
            featured ? "bg-red" : "bg-white-dark"
          }`}
        />
        <span className="min-w-0">
          {featured ? (
            <span className="mb-2 block font-ibm text-xs text-red uppercase tracking-normal">
              Recommended start
            </span>
          ) : null}
          <span className="block break-words text-base font-medium tracking-normal sm:text-lg">
            {repo.name}
          </span>
          <span className="mt-1 block break-words text-sm text-gray tracking-normal">
            {repo.description}
          </span>
        </span>
      </span>
      <span className="flex shrink-0 items-center self-start justify-self-start whitespace-nowrap rounded-lg border border-red px-3 py-2 font-ibm text-sm text-red uppercase tracking-normal transition-transform duration-200 group-hover:translate-x-1 sm:justify-self-end">
        Open →
      </span>
    </a>
  );
}
