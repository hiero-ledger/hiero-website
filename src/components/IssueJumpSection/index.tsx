interface DifficultyLink {
  label: string;
  description: string;
  href: string;
}

interface IssueJumpData {
  heading: string;
  text: string;
  difficulties: DifficultyLink[];
}

interface IssueJumpSectionProps {
  data: IssueJumpData;
}

interface IssueJumpCardProps {
  item: DifficultyLink;
  index: number;
  className?: string;
}

function IssueJumpCard({ item, index, className = "" }: IssueJumpCardProps) {
  const cardClassName = [
    "hiero-motion-card hiero-path-card hiero-reveal flex min-h-[230px] flex-col rounded-lg border border-white-dark bg-white p-5 no-underline text-charcoal shadow-[0_10px_28px_rgba(30,30,30,0.05)] hover:border-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2 xl:p-6",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      href={item.href.startsWith("http") ? item.href : "#"}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={cardClassName}
      style={{ animationDelay: `${index * 80}ms` }}>
      <span aria-hidden="true" className="hiero-node-mark" />
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red font-ibm text-sm text-white tracking-normal">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="mt-10 block break-normal hyphens-none text-xl font-medium leading-tight tracking-normal xl:text-2xl">
        {item.label}
      </span>
      <span className="mt-2 block text-base text-gray tracking-normal">
        {item.description}
      </span>
      <span className="hiero-card-arrow mt-auto pt-6 font-ibm text-sm text-red uppercase tracking-normal">
        Browse issues →
      </span>
    </a>
  );
}

export default function IssueJumpSection({ data }: IssueJumpSectionProps) {
  const featuredDifficulty = data.difficulties.at(0);
  const remainingDifficulties = data.difficulties.slice(1);

  return (
    <section
      id="contribute"
      aria-labelledby="issue-jump-heading"
      className="bg-white anchor">
      <div className="container grid grid-cols-1 gap-10 pt-[40px] pb-[40px] sm:pt-[60px] sm:pb-[80px] lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.68fr)] lg:gap-16">
        <div className="flex flex-col">
          <div>
            <p className="font-ibm text-sm text-red uppercase tracking-normal mb-4">
              Start contributing
            </p>
            <h2
              id="issue-jump-heading"
              className="text-2xl mb-2.5 sm:text-4xl sm:mb-5 tracking-normal">
              {data.heading}
            </h2>
            <p className="text-lg max-w-full md:max-w-[560px] tracking-normal">
              {data.text}
            </p>
          </div>

          {featuredDifficulty ? (
            <IssueJumpCard
              item={featuredDifficulty}
              index={0}
              className="mt-8 w-full max-w-[380px] lg:mt-10"
            />
          ) : null}
        </div>

        {remainingDifficulties.length > 0 ? (
          <div className="hiero-path-grid grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 lg:gap-6">
            {remainingDifficulties.map((item, i) => (
              <IssueJumpCard key={item.label} item={item} index={i + 1} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
