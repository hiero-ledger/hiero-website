import { buildGossipField, VIEW_HEIGHT, VIEW_WIDTH } from "@/lib/gossip-field";

/** The home hero's own drawing. Changing it redraws that page's background. */
const DEFAULT_SEED = 20260826;

/**
 * One field per seed, built once when it is first asked for rather than on
 * every render.
 *
 * A field is deterministic from its seed, so caching costs nothing in fidelity
 * and saves repeating the rejection-sampling layout — the expensive part. It
 * also pins each seed to the same drawing on the server and in the browser,
 * which is what keeps hydration quiet.
 */
const fields = new Map<number, ReturnType<typeof buildGossipField>>();

function fieldFor(seed: number) {
  const cached = fields.get(seed);

  if (cached !== undefined) return cached;

  const built = buildGossipField({
    seed,
    eventCount: 38,
    minSeparation: 96,
    linkRadius: 210,
  });

  fields.set(seed, built);

  return built;
}

/**
 * The lattice behind a dark band: faint links, travelling signals along them,
 * and the events they connect.
 *
 * `seed` exists so a second dark band can carry the same illustration without
 * carrying the same drawing — see the Issue Explorer's header. Its styling
 * lives in `globals.css` under `.hero-traces` and expects a dark ground.
 */
export default function HeroTraces({ seed = DEFAULT_SEED }: { seed?: number }) {
  const { events, links } = fieldFor(seed);

  const traceLines = (prefix: string) =>
    links.map(([from, to]) => (
      <line
        key={`${prefix}${from.x}-${from.y}-${to.x}-${to.y}`}
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
      />
    ));

  return (
    <svg
      className="hero-traces"
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false">
      <g className="hero-traces-links">{traceLines("")}</g>
      <g className="hero-traces-signals">{traceLines("signal-")}</g>
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
