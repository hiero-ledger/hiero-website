import { describe, expect, it } from "vitest";
import { formatPostDate, formatPostDateShort } from "../dates";

/**
 * Frontmatter dates are date-only and land on UTC midnight, so formatting them
 * in the ambient zone showed the day before to anyone behind UTC. These assert
 * the output does not move with the zone.
 *
 * Vitest cannot change the process timezone mid-run, so the zone-independence
 * is asserted structurally: the formatters are pinned to UTC, and a value one
 * millisecond either side of midnight has to land on the stated day.
 */
describe("formatPostDate", () => {
  it("formats UTC midnight as the day the author wrote", () => {
    expect(formatPostDate("2026-08-25T00:00:00.000Z")).toBe("25 August 2026");
  });

  /* This is the case that used to read "24 August 2026" west of UTC. */
  it("does not slip a day at either edge of the UTC day", () => {
    expect(formatPostDate("2026-08-25T00:00:00.000Z")).toBe("25 August 2026");
    expect(formatPostDate("2026-08-25T23:59:59.999Z")).toBe("25 August 2026");
    expect(formatPostDate("2026-08-24T23:59:59.999Z")).toBe("24 August 2026");
  });

  it("resolves the zone to UTC rather than the host's", () => {
    expect(formatPostDate("2026-08-25T00:00:00.000Z")).toBe(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "UTC",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date("2026-08-25T00:00:00.000Z")),
    );
  });
});

describe("formatPostDateShort", () => {
  it("keeps the two-digit day and short month the cards are set in", () => {
    expect(formatPostDateShort("2026-08-25T00:00:00.000Z")).toBe("25 Aug 2026");
    expect(formatPostDateShort("2026-03-04T00:00:00.000Z")).toBe("04 Mar 2026");
  });

  it("does not slip a day at either edge of the UTC day", () => {
    expect(formatPostDateShort("2026-03-04T00:00:00.000Z")).toBe("04 Mar 2026");
    expect(formatPostDateShort("2026-03-04T23:59:59.999Z")).toBe("04 Mar 2026");
  });
});
