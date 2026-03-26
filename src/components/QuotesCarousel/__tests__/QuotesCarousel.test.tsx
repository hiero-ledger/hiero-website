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

vi.mock("swiper/modules", () => ({
  Autoplay: {},
}));

describe("QuotesCarousel", () => {
  beforeEach(() => {
    swiperActions.slidePrev.mockClear();
    swiperActions.slideNext.mockClear();
  });

  it("renders quotes and wires the custom navigation buttons", async () => {
    const user = userEvent.setup();

    render(
      <QuotesCarousel
        data={[
          {
            quote: "A great project.",
            author: "Jane Doe",
            logo: "/images/logo.svg",
          },
        ]}
      />,
    );

    expect(screen.getByText("A great project.")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous quote" }));
    await user.click(screen.getByRole("button", { name: "Next quote" }));

    expect(swiperActions.slidePrev).toHaveBeenCalled();
    expect(swiperActions.slideNext).toHaveBeenCalled();
  });
});
