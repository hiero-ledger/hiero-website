import type { Metadata } from "next";

import GossipField from "@/components/GossipField";
import TscCommittee, { type TscMember } from "@/components/TscCommittee";
import TscHeroNetwork from "@/components/TscHeroNetwork";
import tscMembers from "@/data/technical_steering_committee.json";

export const metadata: Metadata = {
  title: "Technical Steering Committee",
  description:
    "The Technical Steering Committee is responsible for technical governance within the Hiero project. Meet the current members and read the charter they work from.",
};

const TECHNICAL_CHARTER_URL =
  "https://github.com/hiero-ledger/governance/blob/main/hiero-technical-charter.md";
const MEETING_CALENDAR_URL =
  "https://zoom-lfx.platform.linuxfoundation.org/meetings/hiero?view=week";

const governanceResources = [
  {
    title: "Technical Charter",
    description:
      "Read the formal scope, decision model, and operating rules for the Technical Steering Committee.",
    href: TECHNICAL_CHARTER_URL,
  },
  {
    title: "Governance Repository",
    description:
      "Track governance documents, committee updates, and cross-project policy changes on GitHub.",
    href: "https://github.com/hiero-ledger/governance",
  },
];

export default function TscPage() {
  return (
    <>
      {/* TSC Hero */}
      <section className="relative overflow-hidden bg-[#24000F] text-white">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background: `
              radial-gradient(
                circle at 70% 20%,
                rgba(217, 45, 106, 0.52),
                transparent 34%
              ),
              radial-gradient(
                circle at 18% 75%,
                rgba(184, 26, 86, 0.60),
                transparent 42%
              ),
              radial-gradient(
                circle at 90% 70%,
                rgba(217, 45, 106, 0.45),
                transparent 38%
              ),
              linear-gradient(
                110deg,
                #21000d 0%,
                #5d0b2c 42%,
                #b81a56 100%
              )
            `,
          }}
        />

        {/* Animated network */}
        <TscHeroNetwork />

        <div className="container relative z-10">
          <div className="mx-auto flex min-h-[580px] items-center justify-center py-20 sm:py-24 lg:py-28">
            <div className="mx-auto max-w-[680px] text-center">
              <div className="mb-7 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                <span className="h-2 w-2 rounded-full bg-red-light" />
                Hiero Technical Governance
              </div>

              <h1 className="relative mb-6 text-[42px] font-medium leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                The TSC of Hiero
              </h1>

              <div className="mx-auto mb-7 h-px w-24 bg-white" />

              <p className="relative mx-auto max-w-[620px] text-lg leading-7 tracking-[-0.02em] text-white/80 sm:text-xl sm:leading-8">
                The Hiero Technical Steering Committee (TSC) is the committee
                responsible for technical governance within the Hiero project.
              </p>

              <div className="relative mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href={TECHNICAL_CHARTER_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white bg-white px-5 py-2.5 text-sm font-medium text-red transition-colors hover:bg-gray-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red"
                  aria-label="View Technical Charter (opens in new tab)">
                  View Technical Charter
                </a>

                <a
                  href={MEETING_CALENDAR_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red"
                  aria-label="Open Meeting Calendar (opens in new tab)">
                  Open Meeting Calendar
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="tsc-about-heading" className="tsc-about">
        <GossipField placement="charter" />

        <div className="container tsc-about-inner">
          <header className="tsc-about-header">
            <div>
              <p className="tsc-about-eyebrow">Governance</p>
              <h2 id="tsc-about-heading" className="tsc-about-heading">
                About the TSC
              </h2>
            </div>

            <div className="tsc-about-intro">
              <p className="tsc-about-copy">
                The duties, goals, and rights of the committee are defined in
                the{" "}
                <a
                  href={TECHNICAL_CHARTER_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="tsc-about-link"
                  aria-label="Read the technical charter (opens in a new tab)">
                  technical charter
                </a>{" "}
                of the Hiero project. This page lists the committee as it stands
                today, alongside the governance resources the project works
                from.
              </p>

              <ul role="list" className="tsc-about-facts">
                <li>Vendor neutral</li>
                <li>Open meetings</li>
                <li>Public charter</li>
              </ul>
            </div>
          </header>
        </div>
      </section>

      <TscCommittee members={tscMembers as TscMember[]} />

      <section
        aria-labelledby="tsc-resources-heading"
        className="tsc-resources">
        <GossipField placement="governance" />

        <div className="container tsc-resources-inner">
          <header className="tsc-resources-header">
            <div>
              <p className="tsc-resources-eyebrow">Resources</p>
              <h2 id="tsc-resources-heading" className="tsc-resources-heading">
                Where the work is kept
              </h2>
            </div>

            <div className="tsc-resources-intro">
              <p className="tsc-resources-copy">
                Review the charter and follow governance activity through the
                project&apos;s primary source materials.
              </p>
            </div>
          </header>

          <ul role="list" className="tsc-resources-grid">
            {governanceResources.map(resource => (
              <li key={resource.title} className="tsc-resource">
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="tsc-resource-link"
                  aria-label={`${resource.title} (opens in a new tab)`}>
                  <span className="tsc-resource-platform">GitHub</span>

                  <h3 className="tsc-resource-name">{resource.title}</h3>
                  <p className="tsc-resource-description">
                    {resource.description}
                  </p>

                  <span className="tsc-resource-action" aria-hidden="true">
                    <span>Open resource</span>
                    <span className="tsc-resource-action-glyph">↗</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
