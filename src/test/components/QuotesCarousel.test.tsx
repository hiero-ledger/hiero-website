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

vi.mock("swiper/modules", () => ({ Autoplay: {} }));

import QuotesCarousel from "@/components/QuotesCarousel";

describe("QuotesCarousel", () => {
  it("renders quotes and handles nav buttons", async () => {
    const user = userEvent.setup();

    render(
      <QuotesCarousel
        data={[
          {
            quote: "A great quote",
            author: "Jane Doe",
            logo: "/images/logo.png",
          },
        ]}
      />,
    );

    expect(screen.getByText("A great quote")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous quote" }));
    await user.click(screen.getByRole("button", { name: "Next quote" }));

    expect(slidePrev).toHaveBeenCalled();
    expect(slideNext).toHaveBeenCalled();
  });
});
