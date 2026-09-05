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
