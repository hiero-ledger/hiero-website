import { describe, expect, it } from "vitest";
import {
  isRecord,
  toCount,
  toHttpUrl,
  toId,
  toText,
} from "../sync-helpers.mjs";

/**
 * The boundary between a third-party API response and a file this repo
 * commits.
 *
 * Both sync scripts write their output into `src/data`, which the app then
 * imports, so a response field that is not what it claims to be ends up in the
 * build. These are the checks that stop it, and the cases below are the ones
 * that actually went wrong before them: a star count that was never validated
 * on the fetch path, and a URL that reached an `href` on nothing more than a
 * `typeof` string check.
 */

describe("toCount", () => {
  it("accepts finite non-negative numbers", () => {
    expect(toCount(0)).toBe(0);
    expect(toCount(404)).toBe(404);
  });

  it("truncates to an integer", () => {
    expect(toCount(40.7)).toBe(40);
  });

  /* `totalStars += repo.stargazers_count ?? 0` concatenated instead of adding
     when the field was a string, turning a total into "0123". */
  it("rejects numeric strings rather than coercing them", () => {
    expect(toCount("123")).toBeNull();
    expect(toCount("")).toBeNull();
  });

  it("rejects values that are not usable counts", () => {
    expect(toCount(-5)).toBeNull();
    expect(toCount(NaN)).toBeNull();
    expect(toCount(Infinity)).toBeNull();
    expect(toCount(null)).toBeNull();
    expect(toCount(undefined)).toBeNull();
    expect(toCount({})).toBeNull();
    expect(toCount([1])).toBeNull();
    expect(toCount(true)).toBeNull();
  });
});

describe("toHttpUrl", () => {
  it("keeps an http(s) URL byte-for-byte", () => {
    const url =
      "https://zoom-lfx.platform.linuxfoundation.org/meeting/95775743341?password=c07443bf";
    expect(toHttpUrl(url)).toBe(url);
    expect(toHttpUrl("http://example.com/a")).toBe("http://example.com/a");
  });

  /* This value is rendered as an `href` by MeetSection, so a scheme that can
     execute must never survive validation. */
  it("rejects schemes that can execute or carry a payload", () => {
    expect(toHttpUrl("javascript:alert(1)")).toBeNull();
    expect(toHttpUrl("JavaScript:alert(1)")).toBeNull();
    expect(toHttpUrl("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(toHttpUrl("vbscript:msgbox(1)")).toBeNull();
    expect(toHttpUrl("file:///etc/passwd")).toBeNull();
  });

  it("rejects anything that is not an absolute URL string", () => {
    expect(toHttpUrl("//evil.example")).toBeNull();
    expect(toHttpUrl("/relative/path")).toBeNull();
    expect(toHttpUrl("not a url")).toBeNull();
    expect(toHttpUrl("")).toBeNull();
    expect(toHttpUrl(null)).toBeNull();
    expect(toHttpUrl({ toString: () => "https://example.com" })).toBeNull();
  });
});

describe("toId", () => {
  /* `String(props.meeting_id ?? "")` wrote the literal "[object Object]" into
     the data file when the field was not a scalar. */
  it("takes scalars and refuses everything else", () => {
    expect(toId("95775743341")).toBe("95775743341");
    expect(toId(95775743341)).toBe("95775743341");
    expect(toId("  padded  ")).toBe("padded");
    expect(toId({})).toBe("");
    expect(toId([])).toBe("");
    expect(toId(null)).toBe("");
    expect(toId(undefined)).toBe("");
  });
});

describe("toText", () => {
  it("trims strings and flattens anything else to empty", () => {
    expect(toText("  Hiero TSC Meeting  ")).toBe("Hiero TSC Meeting");
    expect(toText({})).toBe("");
    expect(toText(42)).toBe("");
    expect(toText(null)).toBe("");
  });

  it("keeps newlines inside an agenda intact", () => {
    expect(toText("Line one\nLine two")).toBe("Line one\nLine two");
  });
});

describe("isRecord", () => {
  it("accepts only plain objects", () => {
    expect(isRecord({})).toBe(true);
    expect(isRecord([])).toBe(false);
    expect(isRecord(null)).toBe(false);
    expect(isRecord("x")).toBe(false);
  });
});
