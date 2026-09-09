import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import prettier from "prettier";

/**
 * Shared machinery for the data sync scripts. Each script owns its fetch and
 * its fallback semantics; what they share is the tail end of every run — turn
 * a value into stable prettier-formatted JSON and write it only when the
 * content actually changed, so `pnpm sync:data` leaves no churn behind when
 * nothing moved.
 */

export function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Boundary validators for values arriving over the network.
 *
 * Both sync scripts fetch JSON from a third party and write it into files that
 * are committed and imported by the app, so nothing from a response reaches a
 * file as-is: every field is rebuilt from these as a validated primitive, and
 * anything that fails validation is dropped rather than written.
 */

/**
 * A finite, non-negative integer, or null.
 *
 * `sync-repo-stats` accumulated `stargazers_count` with `+=` directly off the
 * response, so a string in that field would have concatenated instead of
 * added — turning a star total into "0123". The script already had this check
 * as `getStars`, but only ever ran it over the bundled cache, never over a
 * fresh response.
 */
export function toCount(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.trunc(value)
    : null;
}

/**
 * An `http`/`https` URL, or null.
 *
 * `share_url` from the LFX response is rendered as an `href` by
 * components/MeetSection. It was checked only for being a string, so a
 * `javascript:` URL in that field would have been written into
 * `community_calls.json` and become a clickable script on the home page.
 */
export function toHttpUrl(value) {
  if (typeof value !== "string") return null;

  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  return url.protocol === "http:" || url.protocol === "https:"
    ? url.toString()
    : null;
}

/** A trimmed string, or "" — never an object, a number, or null. */
export function toText(value) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * An identifier as a trimmed string, or "".
 *
 * `String(value)` was used here, which turns an object into the literal
 * "[object Object]" and would have written that into the data file as a
 * meeting id.
 */
export function toId(value) {
  return typeof value === "string" || typeof value === "number"
    ? String(value).trim()
    : "";
}

export async function formatJsonForFile(value, filePath, logPrefix) {
  let formatted = `${JSON.stringify(value, null, 2)}\n`;

  try {
    const prettierConfig = await prettier.resolveConfig(filePath);
    formatted = await prettier.format(JSON.stringify(value), {
      ...(prettierConfig ?? {}),
      parser: "json",
      filepath: filePath,
    });
  } catch (error) {
    console.warn(
      `${logPrefix} Prettier formatting failed (${error.message}), using fallback formatting.`,
    );
  }

  if (!formatted.endsWith("\n")) {
    formatted += "\n";
  }

  return formatted;
}

/**
 * Formats `value` as JSON and writes it to `filePath`, creating the directory
 * if needed. Returns true when the file changed, false when the content was
 * already identical.
 */
export async function writeJsonIfChanged(value, filePath, logPrefix) {
  const content = await formatJsonForFile(value, filePath, logPrefix);

  try {
    const existingContent = await readFile(filePath, "utf8");
    if (existingContent === content) {
      return false;
    }
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
  return true;
}
