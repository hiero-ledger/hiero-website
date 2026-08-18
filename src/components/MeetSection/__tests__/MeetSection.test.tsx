import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import MeetSection, { VISIBLE_COUNT } from "..";

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
  it("shows only the first VISIBLE_COUNT calls until expanded", async () => {
    const user = userEvent.setup();
    const total = VISIBLE_COUNT + 2;
    const calls = Array.from({ length: total }, (_, i) => ({
      name: `Call ${i + 1}`,
      description: `Description ${i + 1}`,
      registerLink: `https://example.com/${i + 1}`,
    }));

    render(<MeetSection data={{ heading: "Meet", text: "Join us.", calls }} />);

    expect(
      screen.getByRole("heading", { name: `Call ${VISIBLE_COUNT}` }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: `Call ${VISIBLE_COUNT + 1}` }),
    ).toBeNull();

    const toggle = screen.getByRole("button", {
      name: new RegExp(`View all ${total} community calls`, "i"),
    });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(
      screen.getByRole("heading", { name: `Call ${total}` }),
    ).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    await user.click(toggle);
    expect(
      screen.queryByRole("heading", { name: `Call ${VISIBLE_COUNT + 1}` }),
    ).toBeNull();
  });

  it("omits the toggle when there is nothing to expand", () => {
    render(
      <MeetSection
        data={{
          heading: "Meet",
          text: "Join us.",
          calls: [
            {
              name: "Only Call",
              description: "Just one.",
              registerLink: "https://example.com/only",
            },
          ],
        }}
      />,
    );

    expect(screen.queryByRole("button")).toBeNull();
  });
});
