import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RichText from "@/components/RichText";
import { extractHeadings } from "@/lib/headings";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

/**
 * The contents-list contract, checked against every real post.
 *
 * `extractHeadings` reads the markdown source on the server to build a post's
 * contents list; `RichText` renders the headings it points at in a separate
 * pass. Nothing joins the two but the id, and an anchor that misses looks like
 * a working page until it is clicked.
 *
 * The sibling `heading-anchors.test.tsx` pins that contract against hand-written
 * markdown, which is where the syntaxes are enumerated deliberately. This one
 * runs it over the actual content, which is what catches a syntax nobody
 * thought to enumerate: the ATX-only version of `extractHeadings` disagreed
 * with the renderer on 32 of these posts, all of them weekly round-ups closing
 * with a setext heading.
 */
describe("heading anchors, over the real posts", () => {
  const posts = getAllPosts();

  it("has posts to check", () => {
    expect(posts.length).toBeGreaterThan(20);
  });

  it("extracts exactly the heading ids that get rendered", () => {
    const mismatches: string[] = [];

    for (const meta of posts) {
      const post = getPostBySlug(meta.slug);
      if (!post) continue;

      const extracted = extractHeadings(post.contentMarkdown).map(
        heading => heading.id,
      );

      const { container, unmount } = render(
        <RichText markdown={post.contentMarkdown} className="content" />,
      );
      const rendered = [...container.querySelectorAll("h1, h2, h3")].map(
        heading => heading.id,
      );
      unmount();

      if (
        extracted.length !== rendered.length ||
        extracted.some((id, i) => id !== rendered[i])
      ) {
        mismatches.push(
          `${meta.slug}: extracted [${extracted.join(", ")}] vs rendered [${rendered.join(", ")}]`,
        );
      }
    }

    expect(mismatches, "posts whose contents list would misanchor").toEqual([]);
  });

  it("gives every rendered heading a non-empty, unique id", () => {
    const offenders: string[] = [];

    for (const meta of posts) {
      const post = getPostBySlug(meta.slug);
      if (!post) continue;

      const { container, unmount } = render(
        <RichText markdown={post.contentMarkdown} className="content" />,
      );
      const ids = [...container.querySelectorAll("h1, h2, h3")].map(h => h.id);
      unmount();

      if (ids.some(id => !id)) offenders.push(`${meta.slug}: empty id`);
      if (new Set(ids).size !== ids.length) {
        offenders.push(`${meta.slug}: duplicate ids`);
      }
    }

    expect(offenders).toEqual([]);
  });
});
