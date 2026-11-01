import { getAllPosts, type EventPhoto, type PostMeta } from "./posts";

export interface CommunityEvent {
  slug: string;
  title: string;
  abstract?: string;
  date: string;
  location?: string;
  /** The first photo where there is one: people read as community, a banner does not. */
  cover: string;
  photos: EventPhoto[];
  upcoming: boolean;
}

/* Event dates are written date-only and land on UTC midnight, so an event
   counts as upcoming until its own day is over rather than from its first
   second. */
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The posts that carry an `[event]`, as the home page's events band lists
 * them: what is coming up first, soonest first, then what has happened, most
 * recent first.
 *
 * "Upcoming" is decided when the page is built, like everything else on the
 * home page, so an event keeps the label until the next deploy after it.
 * Arguments rather than reads so the order is a pure function of them.
 */
export function getCommunityEvents(
  posts: PostMeta[] = getAllPosts(),
  now: number = Date.now(),
): CommunityEvent[] {
  const events = posts.flatMap(post =>
    post.event
      ? [
          {
            slug: post.slug,
            title: post.title,
            abstract: post.abstract,
            date: post.event.date,
            location: post.event.location,
            cover: post.event.photos[0]?.src ?? post.featuredImage,
            photos: post.event.photos,
            upcoming: new Date(post.event.date).getTime() + DAY_MS > now,
          },
        ]
      : [],
  );

  const time = (event: CommunityEvent) => new Date(event.date).getTime();
  const upcoming = events
    .filter(event => event.upcoming)
    .sort((a, b) => time(a) - time(b));
  const past = events
    .filter(event => !event.upcoming)
    .sort((a, b) => time(b) - time(a));

  return [...upcoming, ...past];
}
