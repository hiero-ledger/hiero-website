"use client";

import { useState } from "react";

import RichText from "@/components/RichText";

interface MeetCall {
  name: string;
  description: string;
  // Derived from the LFX recurrence rule, e.g. "Every 2 weeks, Thursdays".
  // Empty for a meeting with no recurrence, in which case it is not rendered.
  cadence?: string;
  registerLink: string;
}

interface MeetData {
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
    <div id="meet" className="anchor">
      <div className="bg-white">
        <div className="container pt-[40px] pb-[40px] sm:pt-[60px] sm:pb-[120px]">
          <div className="mb-10 sm:mb-16">
            <h2 className="text-2xl mb-2.5 sm:text-4xl sm:mb-5">
              {data.heading}
            </h2>
            <RichText
              markdown={data.text}
              className="text-lg max-w-full md:max-w-[800px] space-y-4"
            />
          </div>
          <div
            id="meet-calls"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {visibleCalls.map((call, i) => (
              <a
                key={i}
                href={call.registerLink}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Register for ${call.name} (opens in new tab)`}
                className="grid grid-rows-subgrid row-span-3 gap-0 border-2 border-white-dark rounded-2xl p-8 hover:border-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2 transition-colors duration-200 bg-white no-underline text-charcoal">
                <h3 className="text-xl sm:text-2xl font-medium">{call.name}</h3>
                <p className="flex items-center gap-1.5 text-sm text-gray-500 pt-1">
                  {call.cadence && (
                    <>
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        viewBox="0 0 16 16"
                        className="h-4 w-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <rect x="2" y="3" width="12" height="11" rx="2" />
                        <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
                      </svg>
                      {call.cadence}
                    </>
                  )}
                </p>
                <p className="text-base text-gray-600 pt-3">
                  {call.description}
                </p>
              </a>
            ))}
          </div>
          {hasMore && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
                aria-controls="meet-calls"
                className="text-red hover:text-red-dark text-lg font-medium underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2 rounded">
                {expanded
                  ? "Show fewer community calls ↑"
                  : `View all ${data.calls.length} community calls ↓`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
