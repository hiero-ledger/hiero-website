"use client";

import { useState } from "react";

import RichText from "@/components/RichText";

interface MeetCall {
  name: string;
  description: string;
  // Derived from the LFX recurrence rule, e.g. "Weekly" or "Every 2 weeks".
  // Empty for a meeting with no recurrence, in which case it is not rendered.
  cadence?: string;
  registerLink: string;
}

interface MeetData {
  eyebrow: string;
  heading: string;
  text: string;
  calls: MeetCall[];
}

interface MeetSectionProps {
  data: MeetData;
}

export const VISIBLE_COUNT = 9;

export default function MeetSection({ data }: MeetSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = data.calls.length > VISIBLE_COUNT;
  const visibleCalls =
    expanded || !hasMore ? data.calls : data.calls.slice(0, VISIBLE_COUNT);

  return (
    <section
      id="meet"
      aria-labelledby="community-calls-heading"
      className="community-calls anchor">
      <div className="container community-calls-inner">
        <header className="community-calls-header">
          <div>
            <p className="community-calls-eyebrow">{data.eyebrow}</p>
            <h2
              id="community-calls-heading"
              className="community-calls-heading">
              {data.heading}
            </h2>
          </div>

          <div className="community-calls-intro">
            <RichText markdown={data.text} className="community-calls-copy" />

            <p
              className="community-calls-count"
              aria-label={`${data.calls.length} community calls`}>
              <span className="community-calls-count-value" aria-hidden="true">
                {String(data.calls.length).padStart(2, "0")}
              </span>
              <span className="community-calls-count-label" aria-hidden="true">
                open spaces
                <br />
                to take part
              </span>
            </p>
          </div>
        </header>

        <div className="community-calls-board-heading" aria-hidden="true">
          <span>Recurring community spaces</span>
          <span>
            {expanded || !hasMore
              ? `Showing all ${data.calls.length}`
              : `Showing ${VISIBLE_COUNT} of ${data.calls.length}`}
          </span>
        </div>

        <ul id="meet-calls" role="list" className="community-calls-grid">
          {visibleCalls.map((call, index) => (
            <li key={call.registerLink} className="community-call-item">
              <a
                href={call.registerLink}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Register for ${call.name} (opens in new tab)`}
                className="community-call-link">
                <div className="community-call-meta">
                  {call.cadence ? (
                    <span className="community-call-cadence">
                      {call.cadence}
                    </span>
                  ) : null}
                  <span className="community-call-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="community-call-name">{call.name}</h3>
                <p className="community-call-description">{call.description}</p>

                <span className="community-call-action" aria-hidden="true">
                  <span>Register</span>
                  <span className="community-call-action-glyph">↗</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        {hasMore && (
          <div className="community-calls-toggle-row">
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-controls="meet-calls"
              className="community-calls-toggle">
              <span>
                {expanded
                  ? "Show fewer community calls"
                  : `View all ${data.calls.length} community calls`}
              </span>
              <span aria-hidden="true">{expanded ? "↑" : "↓"}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
