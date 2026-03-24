"use client";

/**
 * JumpToIssuesSection Component
 *
 * Provides a "jump to issues" section with pre-filtered GitHub search links
 * for different difficulty levels (Good First, Beginner, Intermediate, Advanced).
 *
 * Each button links to a pre-filtered GitHub issues search for hiero-ledger
 * repositories with the corresponding skill level label.
 */

interface IssueJumpItem {
  label: string;
  description: string;
  href: string;
}

type IssueJumpData = {
  heading: string;
  text: string;
  items: IssueJumpItem[];
};

type JumpToIssuesSectionProps = {
  data: IssueJumpData;
};

/**
 * Generate a GitHub issues search URL with pre-filtered criteria
 * @param skillLabel - The skill label to filter by (e.g., "good first issue", "beginner")
 * @returns URL-encoded GitHub search URL
 */
function generateGitHubIssuesUrl(skillLabel: string): string {
  // Base repositories in the Hiero organization
  const repos = [
    "hiero-sdk-cpp",
    "hiero-sdk-swift",
    "hiero-sdk-python",
    "hiero-sdk-js",
    "hiero-website",
  ];

  // Build repo filter: (repo:hiero-ledger/repo1 OR repo:hiero-ledger/repo2 ...)
  const repoFilter = repos
    .map(repo => `repo:hiero-ledger/${repo}`)
    .join("%20OR%20");

  // Build label filter to match both exact and "skill: " prefixed labels
  // This handles labels like "good first issue" and "skill: good first issue"
  const labelFilter = `(label:"%22${skillLabel}%22"%20OR%20label:"%22skill:%20${skillLabel}%22")`;

  // Construct the full query
  const query =
    `is:open%20is:issue%20org:hiero-ledger%20archived:false%20no:assignee%20` +
    `${labelFilter}%20` +
    `(${repoFilter})`;

  return `https://github.com/issues?q=${query}`;
}

export default function JumpToIssuesSection({
  data,
}: JumpToIssuesSectionProps) {
  return (
    <section
      id="jump-to-issues"
      className="bg-white"
      aria-label="Jump to issues by difficulty level">
      <div className="container pt-[40px] pb-[40px] sm:pt-[60px] sm:pb-[120px]">
        {/* Section Header */}
        <div className="mb-10 sm:mb-16">
          <h2 className="text-2xl mb-2.5 sm:text-4xl sm:mb-5">
            {data.heading}
          </h2>
          <p className="text-lg max-w-full md:max-w-[800px]">{data.text}</p>
        </div>

        {/* Jump Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {data.items.map(item => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border-2 border-white-dark p-6 sm:p-8 transition-all duration-200 hover:border-red hover:shadow-lg">
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Label */}
                <h3 className="text-lg sm:text-xl font-semibold text-red group-hover:text-red-dark transition-colors duration-200 mb-2">
                  {item.label}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600 group-hover:text-gray transition-colors duration-200 flex-grow">
                  {item.description}
                </p>

                {/* Arrow indicator */}
                <div className="mt-4 flex items-center text-red group-hover:text-red-dark transition-all duration-200">
                  <span className="text-base font-medium">Browse issues</span>
                  <svg
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Help text */}
        <p className="text-sm text-gray-600 mt-8">
          Tips: Use these links to find issues that match your skill level. Each
          link filters for unassigned, open issues across our key repositories.
        </p>
      </div>
    </section>
  );
}

// Export the data structure generator for external use
export { generateGitHubIssuesUrl };
export type { IssueJumpItem, IssueJumpData, JumpToIssuesSectionProps };
