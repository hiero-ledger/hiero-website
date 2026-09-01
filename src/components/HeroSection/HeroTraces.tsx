import { buildGossipField, VIEW_HEIGHT, VIEW_WIDTH } from "@/lib/gossip-field";

const { events, links } = buildGossipField({
  seed: 20260826,
  eventCount: 38,
  minSeparation: 96,
  linkRadius: 210,
});

export default function HeroTraces() {

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
