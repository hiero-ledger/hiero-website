import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MeetSection from "@/components/MeetSection";

describe("MeetSection", () => {
  it("renders heading, description, and register link", () => {
    render(
      <MeetSection
        data={{
          heading: "Community Calls",
          text: "Join us every week.",
          calls: [
            {
              name: "TSC",
              description: "Technical committee call",
              schedule: "Weekly",
              registerLink: "https://example.com/register",
            },
          ],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Community Calls" })).toBeInTheDocument();
    expect(screen.getByText("Technical committee call")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Register/i })).toHaveAttribute(
      "href",
      "https://example.com/register",
    );
  });
});
