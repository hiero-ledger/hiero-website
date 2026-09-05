/**
 * The seeded network drawing behind the page: events, and the gossip links
 * between them.
 *
 * Two layers use it — `HeroSection/HeroTraces` over the hero and `GossipField`
 * under the sand sections — and both build their field once at module scope, so
 * the markup is identical on the server and in the browser and never re-rolls
 * between renders.
 */

export const VIEW_WIDTH = 1200;
export const VIEW_HEIGHT = 760;

/** Gossip reaches neighbours, not everyone, so the field stays clustered. */
const MAX_LINKS_PER_EVENT = 2;
/** Safety valve on the sampling loop; the fields settle in ~150 attempts. */
const MAX_ATTEMPTS = 1600;

export interface GossipEvent {
  x: number;
  y: number;
  r: number;
}

export type GossipLink = readonly [GossipEvent, GossipEvent];

export interface GossipFieldOptions {
  /** Fixed per field, so each one is a drawing rather than a roll. */
  seed: number;
  eventCount: number;
  /** Rejection-sampling floor. Keeps the scatter a texture, not clumps. */
  minSeparation: number;
  /** Links form only between events this close together. */
  linkRadius: number;
  /** Events drawn larger and lit. Omit for an evenly weighted field. */
  accents?: { count: number; minSeparation: number };
}

/** A small LCG. Seeded so a field is a fixed drawing, not a random one. */
function createRandom(seed: number) {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const round1 = (value: number) => Math.round(value * 10) / 10;

const distance = (
  a: GossipEvent | { x: number; y: number },
  x: number,
  y: number,
) => Math.hypot(a.x - x, a.y - y);

export function buildGossipField({
  seed,
  eventCount,
  minSeparation,
  linkRadius,
  accents: accentOptions,
}: GossipFieldOptions) {
  const random = createRandom(seed);
  const events: GossipEvent[] = [];

  // Rejection sampling on a minimum separation: an even scatter reads as a
  // texture, whereas raw uniform sampling clumps and looks like noise.
  for (
    let attempt = 0;
    attempt < MAX_ATTEMPTS && events.length < eventCount;
    attempt++
  ) {
    const x = random() * VIEW_WIDTH;
    const y = random() * VIEW_HEIGHT;

    if (events.some(event => distance(event, x, y) < minSeparation)) continue;

    events.push({
      x: Math.round(x),
      y: Math.round(y),
      r: round1(1.5 + random() * 2.2),
    });
  }

  const links: GossipLink[] = events.flatMap((event, index) =>
    events
      .slice(index + 1)
      .filter(other => distance(other, event.x, event.y) < linkRadius)
      .sort(
        (a, b) => distance(a, event.x, event.y) - distance(b, event.x, event.y),
      )
      .slice(0, MAX_LINKS_PER_EVENT)
      .map(other => [event, other] as GossipLink),
  );

  if (!accentOptions) return { events, links, accents: [] as GossipEvent[] };

  /* Accents are picked after the links exist, from the best-connected events
     that are far enough apart to stay separate incidents. An accent is a node
     that happens to be lit, not one wired differently, so choosing the busy
     ones keeps the bright dots on the graph instead of stranded between
     clusters. */
  const degree = new Map<GossipEvent, number>();

  for (const [from, to] of links) {
    degree.set(from, (degree.get(from) ?? 0) + 1);
    degree.set(to, (degree.get(to) ?? 0) + 1);
  }

  const lit = new Set<GossipEvent>();
  const accents: GossipEvent[] = [];

  for (const candidate of events
    .filter(event => degree.has(event))
    .sort((a, b) => degree.get(b)! - degree.get(a)!)) {
    if (accents.length >= accentOptions.count) break;

    const clear = accents.every(
      accent =>
        distance(accent, candidate.x, candidate.y) >=
        accentOptions.minSeparation,
    );

    if (!clear) continue;

    lit.add(candidate);
    accents.push({ ...candidate, r: round1(4.4 + candidate.r * 0.5) });
  }

  return { events: events.filter(event => !lit.has(event)), links, accents };
}
