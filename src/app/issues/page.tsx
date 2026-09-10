import type { Metadata } from "next";

import HeroTraces from "@/components/HeroSection/HeroTraces";
import IssueExplorer from "@/components/IssueExplorer";
import GossipField from "@/components/GossipField";
import { ORGANIZATION, SDK_REPOSITORIES } from "@/issues/repositories";
import { fetchExplorerIssues } from "@/lib/github/issues";
import { formatUtcTimestamp } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Issue Explorer",
  description:
    "Browse open, unassigned issues across the Hiero SDKs, filtered by difficulty and repository, and pick one to work on.",
};

/**
 * The board is regenerated on a timer rather than per request, so every visitor
 * is served the same cached HTML and GitHub sees a handful of searches an hour
 * instead of a handful per visit. See `lib/github/issues` for what that
 * replaced.
 *
 * A literal, not the `REVALIDATE_SECONDS` it has to equal: Next reads segment
 * config statically and rejects the build if this is an imported binding. The
 * two are held together by a test — see `__tests__/revalidate.test.ts`.
 */
export const revalidate = 1800;

export default async function IssueExplorerPage() {
  const data = await fetchExplorerIssues();

  return (
    <>
      <section aria-labelledby="issues-index-heading" className="issues-index">
        {/* The home hero's lattice, on the home hero's ground — a different
            drawing, from a seed of its own. */}
        <HeroTraces seed={88104526} />

        <div className="container issues-index-inner">
          <header className="issues-index-header">
            <div>
              <p className="issues-index-eyebrow">Contribute</p>
              <h1 id="issues-index-heading" className="issues-index-heading">
                Issue Explorer
              </h1>
            </div>

            <div className="issues-index-intro">
              <p className="issues-index-copy">
                Every open issue across the Hiero SDKs that nobody has picked up
                yet. Filter by how much you want to take on, or by the SDK you
                already know.
              </p>

              <ul
                role="list"
                aria-label="Filters applied to every issue on this board"
                className="issues-index-constraints">
                <li>Open</li>
                <li>Unassigned</li>
                <li>{SDK_REPOSITORIES.length} SDKs</li>
              </ul>
            </div>
          </header>

          {/* Where the band closes. Deliberately not a run of display-scale
              counts: that is the home page hero's closing device, and two
              different pages should not open the same way. */}
          <p className="issues-index-provenance">
            <span>
              {data.issues.length.toLocaleString("en-GB")} open{" "}
              {data.issues.length === 1 ? "issue" : "issues"}
            </span>
            <span>
              Refreshed{" "}
              <time dateTime={data.fetchedAt}>
                {formatUtcTimestamp(data.fetchedAt)}
              </time>
            </span>
          </p>

          {/* Said rather than hidden: a partial board looks exactly like a
              complete one, and someone deciding there is nothing to work on
              should know when they are only seeing part of it. */}
          {data.degraded && (
            <p role="status" className="issues-index-notice">
              GitHub did not answer every search this time, so the board below
              is showing {data.issues.length.toLocaleString("en-GB")} of{" "}
              {data.totalOpen.toLocaleString("en-GB")} open issues. It refills
              on the next refresh.
            </p>
          )}
        </div>
      </section>

      <IssueExplorer data={data} organization={ORGANIZATION} />

      <section className="issues-outro">
        <GossipField placement="handoff" />

        <div className="container issues-outro-inner">
          <p className="issues-outro-copy">
            Looking further afield? The SDKs are one corner of Hiero — the
            consensus node, the mirror node and the rest of the organisation
            keep their open issues on GitHub.
          </p>

          <a
            href={`https://github.com/issues?q=${encodeURIComponent(
              `org:${ORGANIZATION} is:issue state:open archived:false no:assignee sort:updated-desc`,
            )}`}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Search every open Hiero issue on GitHub (opens in a new tab)"
            className="issues-outro-link">
            <span>Search every open issue</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </>
  );
}
