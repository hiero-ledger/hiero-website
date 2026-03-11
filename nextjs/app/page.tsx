export default function Home() {
  return (
    <section className="bg-linear-to-br from-red-dark via-red to-red text-white min-h-[calc(100vh-90px)] flex items-center">
      <div className="container py-16 sm:py-24 lg:py-32 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-3xl leading-[0.95] tracking-[-0.08rem] sm:text-4xl sm:tracking-[-0.15rem] lg:text-4xl">
            Hiero Website Migration In Progress
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white-dark sm:text-xl lg:max-w-3xl">
          This Next.js version is being rebuilt from the Hugo site. Homepage sections are coming next.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
            <a
              href="https://github.com/hiero-ledger/hiero-website"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full bg-white px-6 py-3 text-center font-medium text-charcoal no-underline transition-colors hover:bg-sand sm:w-auto sm:min-w-[12rem]"
            >
              View Repository
            </a>
            <a
              href="/blog"
              className="w-full rounded-full border border-white px-6 py-3 text-center font-medium text-white no-underline transition-colors hover:bg-white hover:text-charcoal sm:w-auto sm:min-w-[12rem]"
            >
              Blog (Next.js)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
