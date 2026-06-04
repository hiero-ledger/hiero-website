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
  const isExternalLink = /^https?:\/\//.test(item.href);
  const cardClassName = [
    "hiero-motion-card hiero-path-card hiero-reveal flex min-h-[210px] flex-col rounded-lg border border-white-dark bg-white p-5 no-underline text-charcoal shadow-[0_10px_28px_rgba(30,30,30,0.05)] hover:border-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2 sm:min-h-[230px] xl:p-6",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      href={item.href}
      target={isExternalLink ? "_blank" : undefined}
      rel={isExternalLink ? "noopener noreferrer nofollow" : undefined}
      className={cardClassName}
      style={{ animationDelay: `${index * 80}ms` }}>
      <span aria-hidden="true" className="hiero-node-mark" />
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red font-ibm text-sm text-white tracking-normal">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="mt-10 block break-words text-xl font-medium leading-tight tracking-normal">
        {item.label}
      </span>
      <span className="mt-2 block break-words text-base text-gray tracking-normal">
        {item.description}
      </span>
      <span className="hiero-card-arrow mt-auto break-words pt-6 font-ibm text-sm text-red uppercase tracking-normal">
        Browse issues →
      </span>
    </a>
  );
}

export default function IssueJumpSection({ data }: IssueJumpSectionProps) {
  return (
    <section
      id="contribute"
      aria-labelledby="issue-jump-heading"
      className="bg-white anchor">
      <div className="container grid grid-cols-1 gap-10 pt-[40px] pb-[40px] sm:pt-[60px] sm:pb-[80px]">
        <div className="max-w-[720px]">
          <p className="font-ibm text-sm text-red uppercase tracking-normal mb-4">
            Start contributing
          </p>
          <h2
            id="issue-jump-heading"
            className="text-2xl mb-2.5 sm:text-4xl sm:mb-5 tracking-normal">
            {data.heading}
          </h2>
          <p className="text-lg max-w-full tracking-normal">{data.text}</p>
        </div>

        {data.difficulties.length > 0 ? (
          <div className="hiero-path-grid grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 xl:gap-6">
            {data.difficulties.map((item, index) => (
              <IssueJumpCard key={item.label} item={item} index={index} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
