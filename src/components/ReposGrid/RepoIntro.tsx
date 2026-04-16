import Image from "next/image";

interface RepoIntroProps {
  heading: string;
  text: string;
}

export default function RepoIntro({ heading, text }: RepoIntroProps) {
  return (
    <div>
      <p className="font-ibm text-sm text-red uppercase tracking-normal mb-4">
        Explore the code
      </p>
      <h2 className="text-2xl mb-2.5 sm:text-4xl sm:mb-5 tracking-normal">
        {heading}
      </h2>
      <div className="text-lg max-w-full md:max-w-[560px] whitespace-pre-line tracking-normal">
        {text}
      </div>

      <div className="mt-8">
        <a
          href="https://github.com/orgs/hiero-ledger/repositories"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="View all repositories on GitHub (opens in new tab)"
          className="inline-flex items-center gap-3 rounded-lg border border-red px-5 py-3 font-ibm text-sm text-red no-underline uppercase tracking-normal transition-colors duration-200 hover:bg-gray-light hover:text-red-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2">
          <Image
            src="/images/Hiero-Icon-Github.svg"
            alt=""
            aria-hidden="true"
            width={15}
            height={17}
            className="h-4 w-4"
          />
          View all repositories →
        </a>
      </div>
    </div>
  );
}
