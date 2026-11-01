import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { getCommunityEvents } from "../events";
import { getAllPosts, type PostEvent, type PostMeta } from "../posts";

function post(slug: string, event?: Partial<PostEvent>): PostMeta {
  return {
    slug,
    title: `Title of ${slug}`,
    date: "2026-01-01T00:00:00.000Z",
    abstract: `Abstract of ${slug}`,
    featuredImage: `/images/${slug}-banner.png`,
    readingMinutes: 1,
    authors: [],
    categories: [],
    tags: [],
    event: event
      ? { date: "2026-01-01T00:00:00.000Z", photos: [], ...event }
      : undefined,
  };
}

const NOW = Date.parse("2026-07-07T12:00:00Z");

describe("getCommunityEvents", () => {
  it("lists only posts that carry an event", () => {
    const events = getCommunityEvents(
      [post("plain"), post("meetup", { date: "2026-05-11T00:00:00.000Z" })],
      NOW,
    );

    expect(events.map(event => event.slug)).toEqual(["meetup"]);
  });

  it("puts upcoming events first, soonest first, then past ones, most recent first", () => {
    const events = getCommunityEvents(
      [
        post("past-old", { date: "2026-02-17T00:00:00.000Z" }),
        post("future-far", { date: "2026-12-01T00:00:00.000Z" }),
        post("past-recent", { date: "2026-05-11T00:00:00.000Z" }),
        post("future-soon", { date: "2026-08-01T00:00:00.000Z" }),
      ],
      NOW,
    );

    expect(events.map(event => [event.slug, event.upcoming])).toEqual([
      ["future-soon", true],
      ["future-far", true],
      ["past-recent", false],
      ["past-old", false],
    ]);
  });

  it("keeps an event upcoming through its own day and past from the next", () => {
    const today = post("today", { date: "2026-07-07T00:00:00.000Z" });

    expect(getCommunityEvents([today], NOW)[0].upcoming).toBe(true);
    expect(
      getCommunityEvents([today], Date.parse("2026-07-08T00:00:00Z"))[0]
        .upcoming,
    ).toBe(false);
  });

  it("uses the first photo as the cover, and the featured image when there are none", () => {
    const [withPhotos, withoutPhotos] = getCommunityEvents(
      [
        post("with-photos", {
          date: "2026-06-01T00:00:00.000Z",
          photos: [
            { src: "/images/first.jpg", alt: "" },
            { src: "/images/second.jpg", alt: "" },
          ],
        }),
        post("without-photos", { date: "2026-05-01T00:00:00.000Z" }),
      ],
      NOW,
    );

    expect(withPhotos.cover).toBe("/images/first.jpg");
    expect(withoutPhotos.cover).toBe("/images/without-photos-banner.png");
  });

  it("carries the post's slug, title, abstract and the event's location", () => {
    const [event] = getCommunityEvents(
      [
        post("berlin", {
          date: "2026-06-01T00:00:00.000Z",
          location: "Berlin, Germany",
        }),
      ],
      NOW,
    );

    expect(event).toMatchObject({
      slug: "berlin",
      title: "Title of berlin",
      abstract: "Abstract of berlin",
      date: "2026-06-01T00:00:00.000Z",
      location: "Berlin, Germany",
    });
  });
});

/* Against the real posts: a mistyped path in an `[event]` table renders as a
   broken image on the home page, and nothing else would catch it. */
describe("event posts in content/posts", () => {
  const events = getCommunityEvents(getAllPosts());

  it("has at least one event for the home page to show", () => {
    expect(events.length).toBeGreaterThan(0);
  });

  it("names only photos that exist under public/", () => {
    const missing = events
      .flatMap(event => event.photos.map(photo => photo.src))
      .filter(
        src => !existsSync(path.join(process.cwd(), "public", src.slice(1))),
      );

    expect(missing, "event photos with no file in public/").toEqual([]);
  });
});
