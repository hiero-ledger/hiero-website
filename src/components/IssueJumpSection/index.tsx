interface DifficultyLink {
  label: string;
  description: string;
  href: string;
}

interface IssueJumpData {
  eyebrow: string;
  heading: string;
  text: string;
  filters: string[];
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
      className="issue-jump anchor">
      <div className="container issue-jump-inner">
        <header className="issue-jump-header">
          <div>
            <p className="issue-jump-eyebrow">{data.eyebrow}</p>
            <h2 id="issue-jump-heading" className="issue-jump-heading">
              {data.heading}
            </h2>
          </div>

          <div className="issue-jump-intro">
            <p className="issue-jump-copy">{data.text}</p>

            <ul
              role="list"
              aria-label="Filters applied to every issue search"
              className="issue-jump-filters">
              {data.filters.map(filter => (
                <li key={filter} className="issue-jump-filter">
                  {filter}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="issue-jump-list-heading" aria-hidden="true">
          <span>Choose a starting point</span>
          <span>GitHub issue search</span>
        </div>

        <ol className="issue-jump-list">
          {data.difficulties.map((item, index) => {
            const isExternal = /^https?:\/\//.test(item.href);

            return (
              <li key={item.label} className="issue-jump-item">
                <a
                  href={isExternal ? item.href : "#"}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer nofollow" : undefined}
                  className="issue-jump-link">
                  <span className="issue-jump-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="issue-jump-label">{item.label}</h3>
                  <p className="issue-jump-description">{item.description}</p>

                  <span className="issue-jump-action">
                    <span className="issue-jump-action-label">View issues</span>
                    <span
                      className="issue-jump-action-glyph"
                      aria-hidden="true">
                      ↗
                    </span>
                    {isExternal ? (
                      <span className="sr-only"> (opens in a new tab)</span>
                    ) : null}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
