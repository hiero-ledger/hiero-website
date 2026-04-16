import { buildDisplayGroups } from "./buildDisplayGroups";
import RepoGroup from "./RepoGroup";
import RepoIntro from "./RepoIntro";
import type { ReposGridProps } from "./types";

export default function ReposGrid({ data }: ReposGridProps) {
  const displayGroups = buildDisplayGroups(data.repos);
  const featuredGroup = displayGroups.at(0);
  const remainingGroups = displayGroups.slice(1);

  return (
    <section id="repos" className="anchor">
      <div className="bg-white">
        <div className="container grid grid-cols-1 gap-10 pt-[40px] pb-[40px] sm:pt-[60px] sm:pb-[120px] lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.52fr)] lg:gap-16 xl:gap-20">
          <div className="flex min-w-0 flex-col">
            <RepoIntro heading={data.heading} text={data.text} />

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
