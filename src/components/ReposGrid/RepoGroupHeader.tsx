import type { DisplayRepoGroup } from "./types";

interface RepoGroupHeaderProps {
  group: DisplayRepoGroup;
  index: number;
}

export default function RepoGroupHeader({
  group,
  index,
}: RepoGroupHeaderProps) {
  return (
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
  );
}
