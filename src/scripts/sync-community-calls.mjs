#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import prettier from "prettier";
import fallbackCommunityCalls from "../data/community_calls.json" with { type: "json" };

const dataDirectory = "src/data";
const targetFile = "src/data/community_calls.json";

// Same endpoint the LFX calendar UI itself calls. Public, no auth required.
const projectSlug = "hiero";
const apiUrl =
  "https://pcc-bff.platform.linuxfoundation.org/production/api/v2/itx-services" +
  `/public/meetings/${projectSlug}?view=pcc&pageSize=9999`;
const FETCH_TIMEOUT_MS = 15_000;

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// The API returns one entry per *occurrence*. Collapse them to one entry per
// meeting series, keeping the soonest upcoming occurrence.
//
// Only future occurrences are considered, for two reasons:
//   - `registrant_count` on a past occurrence is how many people attended, which
//     is a different and much smaller number than how many are signed up.
//   - a series that has stopped recurring drops out of the list entirely, so
//     one-off and retired meetings do not linger on the site.
function collapseToSeries(meetings, now) {
  const series = new Map();

  for (const meeting of meetings) {
    if (!isRecord(meeting)) continue;
    const props = meeting.extendedProps;
    if (!isRecord(props)) continue;
    if (props.visibility !== "public" || props.restricted) continue;

    const meetingId = String(props.meeting_id ?? "");
    const registerLink = props.share_url;
    if (!meetingId || typeof registerLink !== "string") continue;

    const start = Date.parse(meeting.start);
    if (!Number.isFinite(start) || start < now) continue;

    const existing = series.get(meetingId);
    if (existing && existing.start <= start) continue;

    series.set(meetingId, {
      start,
      meetingId,
      name: typeof meeting.title === "string" ? meeting.title.trim() : "",
      registrantCount:
        typeof props.registrant_count === "number" ? props.registrant_count : 0,
      registerLink,
      cadence: describeRecurrence(props.recurrence),
      agenda: typeof props.agenda === "string" ? props.agenda.trim() : "",
    });
  }

  return series;
}

// How often a meeting runs. Deliberately omits the weekday: the exact day and
// time are on the LFX calendar behind the card, and keeping this to the interval
// alone keeps the line short and uniform across cards.
function describeRecurrence(recurrence) {
  if (!isRecord(recurrence)) return "";

  // Zoom omits repeat_interval when it is 1. Anything else non-integer is
  // unexpected, and a wrong cadence is worse than none, so bail rather than
  // interpolate it into the string shown on the card.
  const rawInterval = recurrence.repeat_interval ?? 1;
  if (!Number.isInteger(rawInterval) || rawInterval < 1) return "";
  const interval = rawInterval;

  // type 2 = weekly, type 3 = monthly, in the Zoom recurrence vocabulary.
  if (recurrence.type === 2) {
    return interval === 1 ? "Weekly" : `Every ${interval} weeks`;
  }
  if (recurrence.type === 3) {
    return interval === 1 ? "Monthly" : `Every ${interval} months`;
  }

  return "";
}

function toSortedList(series) {
  return [...series.values()]
    .map(call => {
      const { start, ...rest } = call;
      void start;
      return rest;
    })
    .sort(
      (a, b) =>
        b.registrantCount - a.registrantCount || a.name.localeCompare(b.name),
    );
}

function loadFallback(log = true) {
  if (Array.isArray(fallbackCommunityCalls) && fallbackCommunityCalls.length) {
    if (log) {
      console.warn(
        "[sync-community-calls] Using bundled community calls cache.",
      );
    }
    return fallbackCommunityCalls;
  }

  if (log) {
    console.warn("[sync-community-calls] No cached data available.");
  }
  return [];
}

async function formatForFile(calls) {
  let formatted = `${JSON.stringify(calls, null, 2)}\n`;

  try {
    const prettierConfig = await prettier.resolveConfig(targetFile);
    formatted = await prettier.format(JSON.stringify(calls), {
      ...(prettierConfig ?? {}),
      parser: "json",
      filepath: targetFile,
    });
  } catch (error) {
    console.warn(
      `[sync-community-calls] Prettier formatting failed (${error.message}), using fallback formatting.`,
    );
  }

  if (!formatted.endsWith("\n")) formatted += "\n";
  return formatted;
}

async function writeIfChanged(content) {
  try {
    const existingContent = await readFile(targetFile, "utf8");
    if (existingContent === content) return false;
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  await writeFile(targetFile, content);
  return true;
}

async function fetchFromLfx() {
  console.log("[sync-community-calls] Fetching community calls from LFX...");

  // `pnpm build` and `pnpm dev` both run this first, and fetch has no default
  // timeout — without this a stalled connection hangs the build instead of
  // falling through to the bundled cache.
  const response = await fetch(apiUrl, {
    headers: {
      "User-Agent": "hiero-website-build",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`LFX API responded with ${response.status}`);
  }

  const payload = await response.json();
  const meetings = isRecord(payload) ? payload.meetings : null;
  if (!Array.isArray(meetings)) {
    throw new Error("LFX API response did not contain a meetings array");
  }

  const calls = toSortedList(collapseToSeries(meetings, Date.now()));
  if (calls.length === 0) {
    throw new Error("LFX API returned no upcoming public meetings");
  }

  for (const call of calls) {
    console.log(`  ✓ ${call.name}: ${call.registrantCount} sign-ups`);
  }

  return calls;
}

async function run() {
  let calls;
  try {
    calls = await fetchFromLfx();
  } catch (error) {
    console.warn(
      `[sync-community-calls] LFX fetch failed (${error.message}), falling back to cached data.`,
    );
    calls = loadFallback();
  }

  await mkdir(dataDirectory, { recursive: true });
  const formatted = await formatForFile(calls);
  const didWrite = await writeIfChanged(formatted);

  console.log(
    `[sync-community-calls] Done. ${calls.length} meetings${didWrite ? "" : " (no changes)"}`,
  );
}

run().catch(error => {
  console.error("[sync-community-calls] Unexpected error:", error);
  process.exit(1);
});
