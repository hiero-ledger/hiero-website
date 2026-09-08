import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { extractHeadings } from "@/lib/headings";
import RichText from "..";

/**
 * The contract between the two halves of a post's contents list.
 *
 * `extractHeadings` reads the markdown source on the server to build the list;
 * `RichText` renders the headings it points at in a separate pass, from the
 * same source but through `react-markdown`. Nothing joins them but the id, and
 * nothing else in the suite would notice them drifting apart — a broken anchor
 * looks like a working page until you click it.
 */
function renderedIds(markdown: string): string[] {
  const { container } = render(
    <RichText markdown={markdown} className="content" />,
  );

  return [...container.querySelectorAll("h1, h2, h3")].map(
    heading => heading.id,
  );
}

describe("heading anchors", () => {
  it("gives every heading an id", () => {
    const ids = renderedIds("## First section\n\ntext\n\n### A detail");

    expect(ids).toEqual(["first-section", "a-detail"]);
  });

  it.each([
    ["plain headings", "# One\n\n## Two\n\n### Three"],
    [
      "headings carrying inline markup",
      "## **Limited Support of Swift 5.x**\n\n### Read the `docs`\n\n## See [the charter](https://hiero.org)",
    ],
    [
      "repeated headings",
      "## Background\n\ntext\n\n## Background\n\nmore\n\n### Background",
    ],
    [
      "headings around a fenced block",
      "## Before\n\n```python\n# not a heading\n```\n\n## After",
    ],
    [
      "punctuation-heavy headings",
      "## HCS-1: File Management\n\n## HCS-20: Auditable Points\n\n## Get involved!",
    ],
    [
      "setext headings mixed with atx",
      "## Intro\n\nbody\n\n**Want to be featured?**\n--\n\nmore",
    ],
    [
      "a setext heading before a repeated atx heading",
      "Lead in\n===\n\n## Background\n\n## Background",
    ],
  ])("matches the extracted contents ids for %s", (_name, markdown) => {
    const extracted = extractHeadings(markdown).map(heading => heading.id);

    expect(renderedIds(markdown)).toEqual(extracted);
  });

  it("keeps the ids unique when a heading repeats", () => {
    const ids = renderedIds("## Background\n\n## Background\n\n## Background");

    expect(ids).toEqual(["background", "background-2", "background-3"]);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
