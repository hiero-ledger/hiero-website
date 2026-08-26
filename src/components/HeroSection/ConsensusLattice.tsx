"use client";

import { useEffect, useRef } from "react";

/**
 * The hashgraph, drawn as an object rather than an illustration.
 *
 * Five node timelines stand parallel around a circle, crossed by five rings —
 * the consensus rounds — and gossip runs between them. The geometry is the
 * argument: no timeline is longer, closer to the middle, or first, because in a
 * leaderless protocol none of them is. Anything that would have broken that
 * reading (a centre, a spine, a taller column) is deliberately absent.
 *
 * Positions are computed here rather than hand-written so the shape stays
 * honest when a constant changes, and rounded to two decimals so the server and
 * the browser emit byte-identical inline styles.
 */

/** Four nodes is the Byzantine minimum; five keeps the ring legible. */
const NODES = 5;
/** Consensus rounds, stacked earliest at the bottom. */
const ROUNDS = 5;
const RADIUS = 164;
const ROUND_GAP = 74;
/** Turns the ring so no node sits dead centre-front, which would flatten it. */
const PHASE = -0.2;

/**
 * Which node gossiped to which, one round on. Fixed rather than random: the
 * server and the browser have to draw the same graph, and a shape this small
 * reads better hand-chosen than sampled.
 */
const GOSSIP: ReadonlyArray<readonly [number, number, number, number]> = [
  [0, 0, 2, 1],
  [3, 0, 1, 1],
  [4, 0, 2, 1],
  [1, 1, 4, 2],
  [2, 1, 0, 2],
  [4, 2, 2, 3],
  [0, 2, 3, 3],
  [3, 3, 1, 4],
  [1, 3, 4, 4],
];

interface Point {
  x: number;
  y: number;
  z: number;
}

function nodeAt(node: number, round: number): Point {
  const angle = PHASE + (node / NODES) * Math.PI * 2;

  return {
    x: Math.cos(angle) * RADIUS,
    // CSS runs +y downward, so the earliest round carries the largest y.
    y: ((ROUNDS - 1) / 2 - round) * ROUND_GAP,
    z: Math.sin(angle) * RADIUS,
  };
}

const round2 = (value: number) => Number(value.toFixed(2));

/**
 * Everything in the scene is lit from the front, so how far back a point sits
 * is the only depth cue perspective does not give for free.
 */
const depth = (z: number) =>
  round2(0.34 + 0.66 * ((z + RADIUS) / (2 * RADIUS)));

/**
 * Points a bar drawn along +x at the segment between two points. `rotateY` maps
 * +x onto (cos a, 0, −sin a) and `rotateZ` lifts it by b, so solving the pair
 * for the segment's direction gives the two angles below.
 */
function edgeTransform(from: Point, to: Point) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dz = to.z - from.z;
  const length = Math.hypot(dx, dy, dz);
  const yaw = (Math.atan2(-dz, dx) * 180) / Math.PI;
  const pitch = (Math.asin(dy / length) * 180) / Math.PI;

  return {
    length: round2(length),
    transform: `translate3d(${round2(from.x)}px, ${round2(from.y)}px, ${round2(from.z)}px) rotateY(${round2(yaw)}deg) rotateZ(${round2(pitch)}deg)`,
  };
}

const RING_SIZE = RADIUS * 2;
const COLUMN_HEIGHT = (ROUNDS - 1) * ROUND_GAP;

export default function ConsensusLattice() {
  const tiltRef = useRef<HTMLDivElement>(null);

  // Pointer parallax is the difference between a graphic that animates and an
  // object that is there, so it is worth the listener — but only where there is
  // a real pointer to track, and never against a stated motion preference.
  useEffect(() => {
    const tilt = tiltRef.current;
    const wants =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!tilt || !wants) return;

    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = (event.clientY / window.innerHeight) * 2 - 1;

        tilt.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
        tilt.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const rounds = Array.from({ length: ROUNDS }, (_, round) => round);
  const nodes = Array.from({ length: NODES }, (_, node) => node);

  return (
    <div className="hero-lattice" aria-hidden="true">
      <div className="hero-lattice-tilt" ref={tiltRef}>
        <div className="hero-lattice-stage">
          {rounds.map(round => (
            <div
              key={`ring-${round}`}
              className="hero-lattice-ring"
              style={{
                width: `${RING_SIZE}px`,
                height: `${RING_SIZE}px`,
                marginTop: `${-RADIUS}px`,
                marginLeft: `${-RADIUS}px`,
                transform: `translate3d(0, ${round2(nodeAt(0, round).y)}px, 0) rotateX(90deg)`,
              }}
            />
          ))}

          {nodes.map(node => {
            const seat = nodeAt(node, 0);

            return (
              <div
                key={`column-${node}`}
                className="hero-lattice-column"
                style={{
                  height: `${COLUMN_HEIGHT}px`,
                  marginTop: `${-COLUMN_HEIGHT / 2}px`,
                  opacity: depth(seat.z),
                  transform: `translate3d(${round2(seat.x)}px, 0, ${round2(seat.z)}px)`,
                }}
              />
            );
          })}

          {nodes.flatMap(node =>
            rounds.map(round => {
              const point = nodeAt(node, round);

              return (
                <div
                  key={`node-${node}-${round}`}
                  className="hero-lattice-node"
                  style={{
                    opacity: depth(point.z),
                    transform: `translate3d(${round2(point.x)}px, ${round2(point.y)}px, ${round2(point.z)}px)`,
                  }}
                />
              );
            }),
          )}

          {GOSSIP.map(([fromNode, fromRound, toNode, toRound], index) => {
            const from = nodeAt(fromNode, fromRound);
            const edge = edgeTransform(from, nodeAt(toNode, toRound));

            return (
              <div
                key={`gossip-${index}`}
                className="hero-lattice-edge"
                style={
                  {
                    "--edge-length": `${edge.length}px`,
                    "--edge-delay": `${index * 420}ms`,
                    width: `${edge.length}px`,
                    opacity: depth(from.z),
                    transform: edge.transform,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
