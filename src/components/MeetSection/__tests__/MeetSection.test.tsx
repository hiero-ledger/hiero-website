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
              schedule: "Every Tuesday",
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
    expect(screen.getByText(/Every Tuesday/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Register/i })).toHaveAttribute(
      "href",
      "https://example.com/register",
    );
  });
});
