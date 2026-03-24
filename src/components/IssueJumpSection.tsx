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
    <section aria-labelledby="issue-jump-heading" className="bg-sand">
      <div className="container pt-[40px] pb-[40px] sm:pt-[60px] sm:pb-[80px]">
        <div className="mb-10 sm:mb-12">
          <h2
            id="issue-jump-heading"
            className="text-2xl mb-2.5 sm:text-4xl sm:mb-5">
            {data.heading}
          </h2>
          <p className="text-lg max-w-full md:max-w-[800px]">{data.text}</p>
        </div>

        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          role="list">
          {data.difficulties.map(item => (
            <li key={item.label}>
              {/*
               * Using <a> (not <button>) because this is always a navigation
               * action to an external URL — semantically correct and avoids
               * wrapping a link inside a button, which is invalid HTML.
               */}
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col h-full border-2 border-white-dark rounded-2xl p-6 bg-white hover:border-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2 transition-colors duration-200 no-underline text-charcoal">
                <span className="text-xl font-medium text-red mb-2">
                  {item.label}
                </span>
                <span className="text-base text-gray">{item.description}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
