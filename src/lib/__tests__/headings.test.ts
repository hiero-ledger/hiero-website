import { describe, expect, it } from "vitest";
import {
  createSlugger,
  extractHeadings,
  headingText,
  slugify,
} from "../headings";

describe("slugify", () => {
  it("reduces a heading to a url-safe slug", () => {
    expect(slugify("What is included in the repository")).toBe(
      "what-is-included-in-the-repository",
    );
  });

  it("collapses punctuation and trims the edges", () => {
    expect(slugify("HCS-1: File Management")).toBe("hcs-1-file-management");
    expect(slugify("  Get involved!  ")).toBe("get-involved");
  });

  it("comes back empty when there is nothing to slug", () => {
    expect(slugify("🎉")).toBe("");
  });
});

describe("headingText", () => {
  it("strips the inline markup a heading renders away", () => {
    expect(headingText("**Limited Support of Swift 5.x**")).toBe(
      "Limited Support of Swift 5.x",
    );
    expect(headingText("Read the `hiero-sdk-python` docs")).toBe(
      "Read the hiero-sdk-python docs",
    );
    expect(headingText("See [the charter](https://hiero.org/charter)")).toBe(
      "See the charter",
    );
  });

  it("drops closing hashes and squashes runs of space", () => {
    expect(headingText("Background ##")).toBe("Background");
    expect(headingText("A   spaced    title")).toBe("A spaced title");
  });
});

describe("createSlugger", () => {
  it("numbers repeats instead of colliding", () => {
    const slug = createSlugger();

    expect(slug("Background")).toBe("background");
    expect(slug("Background")).toBe("background-2");
    expect(slug("Background")).toBe("background-3");
    expect(slug("Other")).toBe("other");
  });

  it("falls back to a usable slug when there is no sluggable text", () => {
    const slug = createSlugger();

    expect(slug("🎉")).toBe("section");
    expect(slug("")).toBe("section-2");
  });
});

describe("extractHeadings", () => {
  it("finds h1 to h3 and reports h1 and h2 at the same level", () => {
    const headings = extractHeadings(
      ["# One", "text", "## Two", "### Three", "#### Four"].join("\n"),
    );

    expect(headings).toEqual([
      { id: "one", text: "One", level: 2 },
      { id: "two", text: "Two", level: 2 },
      { id: "three", text: "Three", level: 3 },
    ]);
  });

  /* A `#` comment in a Python block is not a heading, and this blog carries
     Python. */
  it("ignores hashes inside fenced code", () => {
    const markdown = [
      "## Real heading",
      "```python",
      "# not a heading",
      "## also not",
      "```",
      "## Second real heading",
    ].join("\n");

    expect(extractHeadings(markdown).map(h => h.text)).toEqual([
      "Real heading",
      "Second real heading",
    ]);
  });

  it("handles tilde fences as well as backticks", () => {
    const markdown = ["~~~", "# hidden", "~~~", "## visible"].join("\n");

    expect(extractHeadings(markdown).map(h => h.text)).toEqual(["visible"]);
  });

  it("requires a space after the hashes", () => {
    expect(extractHeadings("#hashtag\n## Real").map(h => h.text)).toEqual([
      "Real",
    ]);
  });

  it("returns nothing for a post with no headings", () => {
    expect(extractHeadings("Just a paragraph.\n\nAnd another.")).toEqual([]);
  });
});
