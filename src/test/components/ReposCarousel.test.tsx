import { forwardRef, useImperativeHandle, type ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const slidePrev = vi.fn();
const slideNext = vi.fn();

vi.mock("swiper/react", () => {
  type MockRef = { swiper: { slidePrev: () => void; slideNext: () => void } };
  type MockProps = { children?: ReactNode };

  const SwiperMock = forwardRef<MockRef, MockProps>(({ children }, ref) => {
    useImperativeHandle(ref, () => ({ swiper: { slidePrev, slideNext } }));
    return <div data-testid="swiper">{children}</div>;
  });
  SwiperMock.displayName = "Swiper";

  const SwiperSlide = ({ children }: MockProps) => (
    <div data-testid="slide">{children}</div>
  );
  SwiperSlide.displayName = "SwiperSlide";

  return { Swiper: SwiperMock, SwiperSlide };
});

vi.mock("swiper/modules", () => ({ Pagination: {} }));

import ReposCarousel from "@/components/ReposCarousel";

describe("ReposCarousel", () => {
  it("renders repositories and handles nav buttons", async () => {
    const user = userEvent.setup();

    render(
      <ReposCarousel
        data={{
          heading: "Repositories",
          text: "Core projects",
          repos: [
            {
              name: "repo-one",
              description: "First repo",
              link: "https://github.com/org/repo-one",
            },
          ],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Repositories" })).toBeInTheDocument();
    expect(screen.getByText("repo-one")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous slide" }));
    await user.click(screen.getByRole("button", { name: "Next slide" }));

    expect(slidePrev).toHaveBeenCalled();
    expect(slideNext).toHaveBeenCalled();
  });
});
