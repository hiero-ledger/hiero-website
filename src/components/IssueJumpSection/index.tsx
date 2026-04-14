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

export default function IssueJumpSection({ data }: IssueJumpSectionProps) {
  return (
    <section
      id="contribute"
      aria-labelledby="issue-jump-heading"
      className="bg-white anchor">
      <div className="container pt-[40px] pb-[40px] sm:pt-[60px] sm:pb-[80px] grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] gap-10 lg:gap-20">
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

        <div className="hiero-path-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {data.difficulties.map((item, i) => (
            <a
              key={item.label}
              href={item.href.startsWith("http") ? item.href : "#"}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hiero-motion-card hiero-path-card hiero-reveal flex min-h-[210px] flex-col rounded-lg border border-white-dark bg-white p-6 no-underline text-charcoal shadow-[0_10px_28px_rgba(30,30,30,0.05)] hover:border-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2">
              <span aria-hidden="true" className="hiero-node-mark" />
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-red font-ibm text-sm text-white tracking-normal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-10 block text-xl font-medium break-words tracking-normal">
                {item.label}
              </span>
              <span className="mt-2 block text-base text-gray tracking-normal">
                {item.description}
              </span>
              <span className="hiero-card-arrow mt-auto pt-6 font-ibm text-sm text-red uppercase tracking-normal">
                Browse issues →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
