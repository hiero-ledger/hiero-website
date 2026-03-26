import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import repoStats from "@/data/repository_stats.json";
import ReposCarousel from "..";

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

      return <div data-testid="repos-swiper">{children}</div>;
    }),
    SwiperSlide: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="repos-slide">{children}</div>
    ),
  };
});

vi.mock("swiper/modules", () => ({
  Pagination: {},
}));

describe("ReposCarousel", () => {
  beforeEach(() => {
    swiperActions.slidePrev.mockClear();
    swiperActions.slideNext.mockClear();
  });

  it("renders repository cards, repo stats, and carousel navigation", async () => {
    const user = userEvent.setup();
    const starCount = repoStats["hiero-sdk-js"].stars;

    render(
      <ReposCarousel
        data={{
          heading: "Popular repositories",
          text: "Explore the project ecosystem.",
          repos: [
            {
              name: "hiero-sdk-js",
              description: "JavaScript SDK",
              link: "https://github.com/hiero-ledger/hiero-sdk-js",
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Popular repositories" }),
    ).toBeInTheDocument();
    expect(screen.getByText("JavaScript SDK")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /View Repository/i }),
    ).toHaveAttribute("href", "https://github.com/hiero-ledger/hiero-sdk-js");
    expect(screen.getByText(`⭐ ${starCount}`)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous slide" }));
    await user.click(screen.getByRole("button", { name: "Next slide" }));

    expect(swiperActions.slidePrev).toHaveBeenCalled();
    expect(swiperActions.slideNext).toHaveBeenCalled();
  });
});
