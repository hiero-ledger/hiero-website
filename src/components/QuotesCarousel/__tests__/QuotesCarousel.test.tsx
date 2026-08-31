import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import QuotesCarousel from "..";

const swiperActions = vi.hoisted(() => ({
  slidePrev: vi.fn(),
  slideNext: vi.fn(),
}));

vi.mock("swiper/react", async () => {
  const React = await import("react");

  return {
    Swiper: React.forwardRef(function MockSwiper(
      { children }: { children: React.ReactNode },
      ref,
    ) {
      React.useImperativeHandle(ref, () => ({
        swiper: swiperActions,
      }));

      return <div data-testid="quotes-swiper">{children}</div>;
    }),
    SwiperSlide: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="quotes-slide">{children}</div>
    ),
  };
});

describe("QuotesCarousel", () => {
  beforeEach(() => {
    swiperActions.slidePrev.mockClear();
    swiperActions.slideNext.mockClear();
  });

  it("renders quotes and wires the custom navigation buttons", async () => {
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

    await user.click(screen.getByRole("button", { name: "Previous quote" }));
    await user.click(screen.getByRole("button", { name: "Next quote" }));

    expect(swiperActions.slidePrev).toHaveBeenCalled();
    expect(swiperActions.slideNext).toHaveBeenCalled();
  });
});
