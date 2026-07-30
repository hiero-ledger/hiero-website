import Image from "next/image";
import Link from "next/link";
import BackToTop from "@/components/BackToTop";
import Container from "@/components/Container";
import {
  affiliations,
  footerNavGroups,
  isExternalLink,
  opensInNewTab,
  socialLinks,
  withNewTabHint,
  type AffiliationName,
  type MenuItem,
} from "@/data/navigation";

/**
 * Rendered heights, keyed by affiliation. These two lockups have very
 * different aspect ratios, so they cannot share one size. Kept here rather
 * than in `@/data/navigation` so styling stays out of the data module.
 */
const affiliationClasses: Record<AffiliationName, string> = {
  "LF Decentralized Trust": "h-3.5 w-auto sm:h-4",
  "The Linux Foundation": "h-7 w-auto sm:h-8",
};

// Inline rather than inline-flex so the external-link icon stays on the same
// line as the last word when a long label wraps.
const linkClasses =
  "group/link text-[0.9375rem] leading-6 text-sand/85 no-underline transition-colors duration-200 ease-out hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal";

function ExternalLinkIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="ml-1.5 inline-block align-[-0.05em] text-sand/60 transition-colors duration-300 ease-in-out group-hover/link:text-red-light">
      <path
        d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FooterLink({ item }: { item: MenuItem }) {
  if (isExternalLink(item)) {
    const openInNewTab = opensInNewTab(item);
    // Tie the icon to the last word so it can never wrap onto a line by itself.
    const words = item.name.split(" ");
    const lastWord = words.pop() ?? item.name;

    return (
      <a
        href={item.href}
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
        aria-label={openInNewTab ? withNewTabHint(item.name) : undefined}
        className={linkClasses}>
        {words.length > 0 ? `${words.join(" ")} ` : null}
        <span className="whitespace-nowrap">
          {lastWord}
          <ExternalLinkIcon />
        </span>
      </a>
    );
  }

  return (
    <Link href={item.href} className={linkClasses}>
      {item.name}
    </Link>
  );
}

function groupHeadingId(title: string) {
  return `footer-group-${title.toLowerCase().replace(/\s+/g, "-")}`;
}

/** Shared look for the small uppercase section labels; pair with a text colour. */
const sectionLabelClasses =
  "flex items-center gap-2.5 text-xs font-medium tracking-[0.16em] uppercase";

/** Brand-red tick that carries a bit of colour into the label rows. */
function LabelAccent({ className }: { className: string }) {
  return (
    <span aria-hidden="true" className={`h-px w-4 shrink-0 ${className}`} />
  );
}

export default function Footer() {
  return (
    <div className="relative overflow-hidden bg-charcoal">
      <div className="relative overflow-hidden text-sand">
        <div
          aria-hidden="true"
          className="h-1 w-full bg-linear-to-r from-red-dark via-red-light to-red-dark"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-red/18 via-transparent to-red-dark/20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-sand/15 to-transparent"
        />

        <Container className="relative py-12 sm:py-16 lg:py-18">
          <div className="grid gap-x-8 gap-y-12 lg:grid-cols-[minmax(16rem,1.45fr)_minmax(0,3fr)]">
            <div className="flex max-w-sm flex-col items-start lg:pr-10">
              <Link
                href="/"
                aria-label="Hiero home"
                className="inline-flex rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-4 focus-visible:ring-offset-charcoal">
                <Image
                  src="/images/Hiero-Logo-wText-white.svg"
                  alt="Hiero"
                  width={207}
                  height={60}
                  className="h-10 w-auto sm:h-11"
                />
              </Link>
              <p className="mt-6 text-sm leading-6 text-sand/70">
                An open-source, vendor-neutral distributed ledger technology,
                built in the open as a Linux Foundation Decentralized Trust
                project.
              </p>
              <ul className="mt-7 flex items-center gap-2.5">
                {socialLinks.map(social => (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={withNewTabHint(social.name)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-sand/20 bg-white/5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-red-light hover:bg-red-light focus:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal">
                      {/* The source icons have different aspect ratios (GitHub
                          is 15x17, Discord 127x96), so letterbox them in a
                          square box rather than stretching both to it. */}
                      <Image
                        src={social.iconOnDark}
                        alt={social.name}
                        width={20}
                        height={20}
                        className="h-5 w-5 object-contain"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <nav
              aria-label="Footer"
              className="grid gap-x-8 gap-y-10 sm:grid-cols-3">
              {footerNavGroups.map(group => (
                <div key={group.title}>
                  <h2
                    id={groupHeadingId(group.title)}
                    className={`mb-6 text-sand/60 ${sectionLabelClasses}`}>
                    <LabelAccent className="bg-red-light" />
                    {group.title}
                  </h2>
                  <ul
                    aria-labelledby={groupHeadingId(group.title)}
                    className="flex flex-col items-start gap-3">
                    {group.items.map(item => (
                      <li key={item.name}>
                        <FooterLink item={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </Container>
      </div>

      <div className="bg-sand text-charcoal">
        <Container className="py-7 sm:py-8">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
            <div className="grid gap-7 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-10">
              <div className="flex flex-col gap-3">
                <h2
                  id="footer-affiliations"
                  className={`text-charcoal/70 ${sectionLabelClasses}`}>
                  <LabelAccent className="bg-red" />
                  Hosted by
                </h2>
                <ul
                  aria-labelledby="footer-affiliations"
                  className="flex flex-wrap items-center gap-x-7 gap-y-4">
                  {affiliations.map(affiliation => (
                    <li key={affiliation.name}>
                      <a
                        href={affiliation.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={withNewTabHint(affiliation.name)}
                        className="inline-flex max-w-full rounded-sm transition-opacity duration-200 ease-out hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-4 focus-visible:ring-offset-sand">
                        <Image
                          src={affiliation.logo}
                          alt={affiliation.name}
                          width={affiliation.width}
                          height={affiliation.height}
                          className={`max-w-full object-contain ${affiliationClasses[affiliation.name]}`}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-charcoal/15 text-sm leading-6 text-charcoal/70 sm:border-l sm:pl-10">
                <p>Copyright © Hiero a Series of LF Projects, LLC</p>
                <p>
                  For web site terms, trademarks and project policies, see{" "}
                  <a
                    href="https://lfprojects.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={withNewTabHint("LF Projects")}
                    className="font-medium text-red underline decoration-red/35 underline-offset-2 transition-colors duration-200 ease-out hover:text-red-dark hover:decoration-red-dark">
                    LF Projects
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="justify-self-end">
              <BackToTop />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
