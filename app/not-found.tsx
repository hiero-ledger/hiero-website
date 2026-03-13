import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-white min-h-[calc(100vh-90px)] flex items-center py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-20 h-72 w-72 rounded-full bg-red/10 blur-3xl" />
        <div className="absolute -bottom-36 -right-20 h-96 w-96 rounded-full bg-red-dark/10 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 items-center">
          <div className="rounded-3xl bg-linear-to-br from-red-dark via-red to-red text-white p-8 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
            <p className="text-sm tracking-[0.2em] uppercase text-white-dark mb-3">Error 404</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl leading-none tracking-[-0.08rem] mb-4">
              This Page
              <br />
              Is Missing
            </h1>
            <p className="text-base sm:text-lg text-white-dark max-w-xl">
              The link may be outdated, the page may have moved, or the URL might be typed incorrectly.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/"
                className="rounded-full bg-white text-charcoal px-6 py-3 text-center font-medium no-underline hover:bg-sand transition-colors"
              >
                Return Home
              </Link>
              <Link
                href="/blog"
                className="rounded-full border border-white text-white px-6 py-3 text-center font-medium no-underline hover:bg-white hover:text-charcoal transition-colors"
              >
                Visit Blog
              </Link>
              <Link
                href="/#meet"
                className="rounded-full border border-white/70 text-white px-6 py-3 text-center font-medium no-underline hover:bg-white hover:text-charcoal transition-colors"
              >
                Join Community
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl border border-white-dark bg-white p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-4 mb-6">
              <Image src="/images/Hiero-Icon.svg" alt="Hiero" width={40} height={40} />
              <p className="text-lg font-medium">Try one of these paths</p>
            </div>

            <ul className="space-y-3 text-base">
              <li>
                <Link href="/" className="text-red underline hover:text-red-dark">
                  hiero.org/
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-red underline hover:text-red-dark">
                  hiero.org/blog
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/hiero-ledger"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-red underline hover:text-red-dark"
                >
                  github.com/hiero-ledger
                </a>
              </li>
            </ul>

            <div className="mt-8 rounded-2xl bg-gray-light p-5">
              <p className="text-sm text-gray mb-2">Tip</p>
              <p className="text-base">
                If you entered this URL manually, double-check spelling and punctuation.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
