import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import QuotesCarousel from "..";

describe("QuotesCarousel", () => {
  it("changes the visible quote with the navigation buttons", async () => {
    const user = userEvent.setup();

    render(
      <QuotesCarousel
        data={{
          eyebrow: "Community voices",
          heading: "Voices from the ecosystem",
          text: "What the community is saying.",
          quotes: [
            {
              quote: "A great project.",
              author: "Jane Doe",
              logo: "/images/logo.svg",
            },
            {
              quote: "Built together.",
              author: "Alex Doe",
              logo: "/images/logo-two.svg",
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Voices from the ecosystem" }),
    ).toBeInTheDocument();
    expect(screen.getByText("A great project.")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.queryByText("Built together.")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Quote 1 of 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next quote" }));

    expect(screen.getByText("Built together.")).toBeInTheDocument();
    expect(screen.getByText("Alex Doe")).toBeInTheDocument();
    expect(screen.queryByText("A great project.")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Quote 2 of 2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous quote" }));

    expect(screen.getByText("A great project.")).toBeInTheDocument();
    expect(screen.getByLabelText("Quote 1 of 2")).toBeInTheDocument();
  });
});
