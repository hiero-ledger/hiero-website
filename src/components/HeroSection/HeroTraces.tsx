/**
 * The network the lattice is one part of.
 *
 * A flat field of gossip traces — events and the links between them — spread
 * across the whole hero behind the type. It is the same material as the
 * HieroMarkScene beside it, drawn without perspective and at a fraction of the
 * brightness, so the framed mark reads as part of a network that carries on
 * past the edges rather than an illustration parked on a gradient.
 *
 * No JS: the scatter comes from a seeded generator evaluated once at module
 * scope, so the markup is identical on the server and in the browser and the
 * field never reflows or re-rolls between renders.
 */

const VIEW_WIDTH = 1200;
const VIEW_HEIGHT = 760;
const EVENT_COUNT = 38;
/** Links form only between events this close, which leaves the field clustered
 *  rather than evenly webbed — gossip reaches neighbours, not everyone. */
const LINK_RADIUS = 210;
const MAX_LINKS_PER_EVENT = 2;

interface Trace {
  x: number;
  y: number;
  r: number;
}

/** A small LCG. Seeded so the field is a fixed drawing, not a random one. */
function createRandom(seed: number) {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function buildField() {
  const random = createRandom(20260826);
  const events: Trace[] = [];

  // Rejection sampling on a minimum separation: an even scatter reads as a
  // texture, whereas raw uniform sampling clumps and looks like noise.
  for (
    let attempt = 0;
    attempt < 900 && events.length < EVENT_COUNT;
    attempt++
  ) {
    const x = random() * VIEW_WIDTH;
    const y = random() * VIEW_HEIGHT;
    const tooClose = events.some(
      event => Math.hypot(event.x - x, event.y - y) < 96,
    );

    if (tooClose) continue;

    events.push({
      x: Math.round(x),
      y: Math.round(y),
      r: Math.round((1.5 + random() * 2.2) * 10) / 10,
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

  return { events, links };
}

const { events, links } = buildField();

export default function HeroTraces() {
  return (
    <svg
      className="hero-traces"
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false">
      <g className="hero-traces-links">
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
      <g className="hero-traces-events">
        {events.map(event => (
          <circle
            key={`${event.x}-${event.y}`}
            cx={event.x}
            cy={event.y}
            r={event.r}
          />
        ))}
      </g>
    </svg>
  );
}
