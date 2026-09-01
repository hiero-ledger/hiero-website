import {
  buildGossipField,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  type GossipEvent,
} from "@/lib/gossip-field";

export type GossipFieldPlacement =
  "principles" | "issues" | "calls" | "repos" | "quotes";

const SEEDS: Record<GossipFieldPlacement, number> = {
  principles: 58201774,
  issues: 20260901,
  calls: 41720433,
  repos: 77310219,
  quotes: 13480967,
};

/** Built once per placement, at module scope, for the reason above. */
const FIELDS = Object.fromEntries(
  Object.entries(SEEDS).map(([placement, seed]) => [
    placement,
    buildGossipField({
      seed,
      eventCount: 46,
      minSeparation: 92,
      linkRadius: 205,
      accents: { count: 4, minSeparation: 300 },
    }),
  ]),
) as Record<GossipFieldPlacement, ReturnType<typeof buildGossipField>>;

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
