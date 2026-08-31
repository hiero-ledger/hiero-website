import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import QuotesCarousel, { AUTO_ADVANCE_MS } from "..";

const quotesData = {
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
};

describe("QuotesCarousel", () => {
  it("changes the visible quote with the navigation buttons", async () => {
    const user = userEvent.setup();

    render(<QuotesCarousel data={quotesData} />);

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

  it("automatically advances to the next quote", () => {
    vi.useFakeTimers();

    try {
      render(<QuotesCarousel data={quotesData} />);

      act(() => {
        vi.advanceTimersByTime(AUTO_ADVANCE_MS);
      });

      expect(screen.getByText("Built together.")).toBeInTheDocument();
      expect(screen.getByLabelText("Quote 2 of 2")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it("lets visitors pause and resume automatic rotation", () => {
    vi.useFakeTimers();

    try {
      render(<QuotesCarousel data={quotesData} />);

      fireEvent.click(
        screen.getByRole("button", {
          name: "Pause automatic quote rotation",
        }),
      );

      act(() => {
        vi.advanceTimersByTime(AUTO_ADVANCE_MS);
      });

      expect(screen.getByText("A great project.")).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole("button", {
          name: "Resume automatic quote rotation",
        }),
      );
      fireEvent.blur(
        screen.getByRole("button", {
          name: "Pause automatic quote rotation",
        }),
      );

      act(() => {
        vi.advanceTimersByTime(AUTO_ADVANCE_MS);
      });

      expect(screen.getByText("Built together.")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
