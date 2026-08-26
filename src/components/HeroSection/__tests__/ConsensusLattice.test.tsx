import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ConsensusLattice from "../ConsensusLattice";

const NODES = 5;
const ROUNDS = 5;

describe("ConsensusLattice", () => {
  it("draws a ring per round, a timeline per node, and a point at every crossing", () => {
    const { container } = render(<ConsensusLattice />);

    expect(container.querySelectorAll(".hero-lattice-ring")).toHaveLength(
      ROUNDS,
    );
    expect(container.querySelectorAll(".hero-lattice-column")).toHaveLength(
      NODES,
    );
    expect(container.querySelectorAll(".hero-lattice-node")).toHaveLength(
      NODES * ROUNDS,
    );
    expect(
      container.querySelectorAll(".hero-lattice-edge").length,
    ).toBeGreaterThan(0);
  });

  it("gives every node timeline the same length, because none of them leads", () => {
    const { container } = render(<ConsensusLattice />);
    const heights = [
      ...container.querySelectorAll<HTMLElement>(".hero-lattice-column"),
    ].map(column => column.style.height);

    expect(new Set(heights).size).toBe(1);
  });

  it("stays out of the accessibility tree", () => {
    const { container } = render(<ConsensusLattice />);

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("hands each gossip edge the length its travelling event needs", () => {
    const { container } = render(<ConsensusLattice />);

    for (const edge of container.querySelectorAll<HTMLElement>(
      ".hero-lattice-edge",
    )) {
      expect(edge.style.getPropertyValue("--edge-length")).toBe(
        edge.style.width,
      );
      expect(edge.style.transform).toMatch(
        /^translate3d\(.+\) rotateY\(.+\) rotateZ\(.+\)$/,
      );
    }
  });
});
