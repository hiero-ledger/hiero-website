import {
  buildGossipField,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  type GossipEvent,
} from "@/lib/gossip-field";

/**
 * One field per placement, built once when the module is loaded rather than on
 * every render.
 *
 * A field is deterministic from its seed, so building it at module scope costs
 * nothing in fidelity and saves repeating the rejection-sampling layout — the
 * expensive part — on every render. It also pins each placement to the same
 * drawing on the server and in the browser, which is what keeps hydration
 * quiet. The seeds are arbitrary but fixed: changing one redraws that section's
 * background.
 */
const field = (seed: number) =>
  buildGossipField({
    seed,
    eventCount: 46,
    minSeparation: 92,
    linkRadius: 205,
    accents: { count: 4, minSeparation: 300 },
  });

const FIELDS = {
  principles: field(58201774),
  issues: field(20260901),
  calls: field(41720433),
  repos: field(77310219),
  quotes: field(13480967),
};

export type GossipFieldPlacement = keyof typeof FIELDS;

function Events({ events }: { events: GossipEvent[] }) {
  return events.map(event => (
    <circle
      key={`${event.x}-${event.y}`}
      cx={event.x}
      cy={event.y}
      r={event.r}
    />
  ));
}

export default function GossipField({
  placement,
}: {
  placement: GossipFieldPlacement;
}) {
  const { links, events, accents } = FIELDS[placement];

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
          <Events events={events} />
        </g>

        <g className="gossip-field-accents">
          <Events events={accents} />
        </g>
      </svg>
    </div>
  );
}
