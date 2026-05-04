import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MeetSection from "..";

describe("MeetSection", () => {
  it("renders community calls and register links", () => {
    render(
      <MeetSection
        data={{
          heading: "Meet the community",
          text: "Join the **weekly** calls.",
          calls: [
            {
              name: "Maintainers Call",
              description: "Discuss active workstreams.",
              registerLink: "https://example.com/register",
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Meet the community" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Maintainers Call" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Register/i })).toHaveAttribute(
      "href",
      "https://example.com/register",
    );
  });

  it("keeps the starter call list focused", () => {
    const calls = Array.from({ length: 5 }, (_, index) => ({
      name: `Call ${index + 1}`,
      description: `Description ${index + 1}`,
      registerLink: `https://example.com/register-${index + 1}`,
    }));

    render(
      <MeetSection
        data={{
          heading: "Meet the community",
          text: "Join the calls.",
          calls,
        }}
      />,
    );

    expect(screen.getByText("Call 1")).toBeInTheDocument();
    expect(screen.getByText("Call 4")).toBeInTheDocument();
    expect(screen.queryByText("Call 5")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /View all community calls/i }),
    ).toBeInTheDocument();
  });
});
