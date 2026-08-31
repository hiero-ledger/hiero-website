/**
 * The network, still running underneath the sand sections.
 *
 * Same material as components/HeroSection/HeroTraces — events and the gossip
 * links between them, no perspective — but inked in charcoal instead of white
 * and dropped to a fraction of even that brightness, because sand is a light
 * ground and anything legible on it competes with the type.
 *
 * Full bleed, not a corner vignette. The field covers its whole section and
 * runs off every edge, so each section reads as a window onto one network
 * continuing behind the page rather than as a drawing parked in a corner. Every
 * section still draws its own crop: one generator, one set of parameters, a
 * different seed per section. A mirrored repeat is legible as a repeat, and
 * five identical fields would announce the device.
 *
 * A few events per field are accents, drawn larger and in brand red. They are
 * the one thing here allowed to be seen rather than merely sensed: without them
 * the field is an even grey texture, and even texture reads as noise. With them
 * it reads as a network with activity in it.
 *
 * The field drifts. It is two boxes rather than one for that reason: the outer
 * one carries the mask and never moves, the inner one carries the drawing and
 * does. Animating a masked element would slide its own aperture along with it,
 * which is a picture being dragged about; holding the aperture still and moving
 * the drawing behind it is a network passing through a window. The inner box is
 * oversized so no drift can pull an edge into view.
 *
 * No JS: the scatter comes from a seeded generator evaluated once at module
 * scope, so the markup is identical on the server and in the browser and the
 * field never reflows or re-rolls between renders. The motion is CSS, so it
 * needs no hydration and answers `prefers-reduced-motion` in the stylesheet.
 */

const VIEW_WIDTH = 1200;
const VIEW_HEIGHT = 760;
const EVENT_COUNT = 46;
/** Links form only between events this close, which leaves the field clustered
 *  rather than evenly webbed — gossip reaches neighbours, not everyone. */
const LINK_RADIUS = 205;
const MAX_LINKS_PER_EVENT = 2;
/** Rejection-sampling floor. Keeps the scatter a texture instead of clumps. */
const MIN_SEPARATION = 92;
/** Enough to give a field a pulse, few enough that they stay incidents. */
const ACCENT_COUNT = 4;
/** Accents are held apart so they never gather into one bright patch. */
const MIN_ACCENT_SEPARATION = 300;

interface Trace {
  x: number;
  y: number;
  r: number;
  accent: boolean;
}

/**
 * Which section a field belongs to — so which crop of the network it draws, and
 * which way its mask thins.
 *
 * Placement is now entirely a matter of masking; see the `.gossip-field--*`
 * rules in globals.css. Each mask thins the field across the side its own
 * section fills with type, so a full-bleed drawing never has to be read
 * through.
 */
export type GossipFieldPlacement =
  "principles" | "issues" | "calls" | "repos" | "quotes";

/** Fixed per placement so a section's ground is a drawing, not a roll. */
const SEEDS: Record<GossipFieldPlacement, number> = {
  principles: 58201774,
  issues: 20260901,
  calls: 41720433,
  repos: 77310219,
  quotes: 13480967,
};

/** A small LCG. Seeded so each field is a fixed drawing, not a random one. */
function createRandom(seed: number) {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function buildField(seed: number) {
  const random = createRandom(seed);
  const events: Trace[] = [];

  for (
    let attempt = 0;
    attempt < 1600 && events.length < EVENT_COUNT;
    attempt++
  ) {
    const x = random() * VIEW_WIDTH;
    const y = random() * VIEW_HEIGHT;
    const tooClose = events.some(
      event => Math.hypot(event.x - x, event.y - y) < MIN_SEPARATION,
    );

    if (tooClose) continue;

    events.push({
      x: Math.round(x),
      y: Math.round(y),
      r: Math.round((1.5 + random() * 2.2) * 10) / 10,
      accent: false,
    });
  }

  const links: Array<[Trace, Trace]> = [];

  events.forEach((event, index) => {
    const neighbours = events
      .slice(index + 1)
      .map(other => ({
        other,
        distance: Math.hypot(other.x - event.x, other.y - event.y),
      }))
      .filter(candidate => candidate.distance < LINK_RADIUS)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, MAX_LINKS_PER_EVENT);

    neighbours.forEach(({ other }) => links.push([event, other]));
  });

  /* Accents are chosen after the links exist, from the events that ended up
     best connected and are far enough apart. An accent is a node that happens
     to be lit, not a node wired differently — picking the busy ones keeps the
     bright dots sitting on the graph instead of stranded between clusters. */
  const linkCount = new Map<Trace, number>();

  links.forEach(([from, to]) => {
    linkCount.set(from, (linkCount.get(from) ?? 0) + 1);
    linkCount.set(to, (linkCount.get(to) ?? 0) + 1);
  });

  const accents: Trace[] = [];

  events
    .filter(event => (linkCount.get(event) ?? 0) > 0)
    .sort((a, b) => (linkCount.get(b) ?? 0) - (linkCount.get(a) ?? 0))
    .forEach(candidate => {
      if (accents.length >= ACCENT_COUNT) return;

      const tooClose = accents.some(
        accent =>
          Math.hypot(accent.x - candidate.x, accent.y - candidate.y) <
          MIN_ACCENT_SEPARATION,
      );

      if (tooClose) return;

      candidate.accent = true;
      candidate.r = Math.round((4.4 + candidate.r * 0.5) * 10) / 10;
      accents.push(candidate);
    });

  return {
    links,
    plain: events.filter(event => !event.accent),
    accents,
  };
}

/** Built once for every placement, at module scope, for the reason above. */
const FIELDS = Object.fromEntries(
  Object.entries(SEEDS).map(([placement, seed]) => [
    placement,
    buildField(seed),
  ]),
) as Record<GossipFieldPlacement, ReturnType<typeof buildField>>;

export default function GossipField({
  placement,
}: {
  placement: GossipFieldPlacement;
}) {
  const { links, plain, accents } = FIELDS[placement];

  return (
    <div
      className={`gossip-field gossip-field--${placement}`}
      aria-hidden="true">
      <svg
        className="gossip-field-web"
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        focusable="false">
        <g className="gossip-field-links">
          {links.map(([from, to]) => (
            <line
              key={`${from.x}-${from.y}-${to.x}-${to.y}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
            />
          ))}
        </g>

        <g className="gossip-field-events">
          {plain.map(event => (
            <circle
              key={`${event.x}-${event.y}`}
              cx={event.x}
              cy={event.y}
              r={event.r}
            />
          ))}
        </g>

        <g className="gossip-field-accents">
          {accents.map(event => (
            <circle
              key={`${event.x}-${event.y}`}
              cx={event.x}
              cy={event.y}
              r={event.r}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
