export default function Home() {
  return (
    <section className="bg-linear-to-br from-red-dark via-red to-red text-white">
      <div className="container py-24 sm:py-36 text-center">
        <h1 className="text-4xl sm:text-3xl leading-none tracking-[-0.15rem] mb-4">Hiero Website Migration In Progress</h1>
        <p className="text-xl max-w-3xl mx-auto text-white-dark">
          This Next.js version is being rebuilt from the Hugo site. Homepage sections are coming next.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://github.com/hiero-ledger/hiero-website"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-charcoal no-underline px-6 py-3 rounded-full font-medium hover:bg-sand transition-colors"
          >
            View Repository
          </a>
          <a
            href="/blog"
            className="border border-white text-black no-underline px-6 py-3 rounded-full font-medium hover:bg-white hover:text-charcoal transition-colors"
          >
            Blog (Next.js)
          </a>
        </div>
      </div>
    </section>
  );
}
