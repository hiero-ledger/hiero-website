import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import type { CommunityEvent } from "@/lib/events";
import EventsSection, { MORE_EVENTS_COUNT, MOSAIC_COUNT } from "..";

const data = {
  eyebrow: "Events",
  heading: "Where the community meets",
  text: "Recaps from the [blog](/blog/).",
  footer: "Hosted a meetup? [Write it up](https://example.com/docs).",
};

function photos(count: number, prefix = "photo") {
  return Array.from({ length: count }, (_, i) => ({
    src: `/images/${prefix}-${i + 1}.jpg`,
    alt: `${prefix} ${i + 1}`,
  }));
}

function event(
  slug: string,
  overrides: Partial<CommunityEvent> = {},
): CommunityEvent {
  return {
    slug,
    title: `Event ${slug}`,
    abstract: `About ${slug}`,
    date: "2026-07-07T00:00:00.000Z",
    location: "Berlin, Germany",
    cover: `/images/${slug}.png`,
    photos: [],
    upcoming: false,
    ...overrides,
  };
}

const berlin = event("berlin", { photos: photos(5) });

describe("EventsSection", () => {
  it("renders nothing when there are no events", () => {
    const { container } = render(<EventsSection data={data} events={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("features the first event with its date, place and a link to its recap", () => {
    render(<EventsSection data={data} events={[berlin]} />);

    const feature = screen.getByRole("article", { name: "Event berlin" });

    expect(within(feature).getByText("07 Jul 2026")).toBeInTheDocument();
    expect(within(feature).getByText("Berlin, Germany")).toBeInTheDocument();
    expect(
      within(feature).getByRole("link", {
        name: "Read the recap: Event berlin",
      }),
    ).toHaveAttribute("href", "/blog/berlin");
  });

  it("shows the first MOSAIC_COUNT photos and counts the rest on the last one", () => {
    render(<EventsSection data={data} events={[berlin]} />);

    const feature = screen.getByRole("article", { name: "Event berlin" });
    const tiles = within(feature).getAllByRole("button", { name: /^photo / });

    expect(tiles).toHaveLength(MOSAIC_COUNT);
    expect(tiles[MOSAIC_COUNT - 1]).toHaveTextContent(
      `+${berlin.photos.length - MOSAIC_COUNT}`,
    );
    expect(
      within(feature).getByRole("button", { name: "View all 5 photos" }),
    ).toBeInTheDocument();
  });

  it("falls back to the post's featured image when the featured event has no photos", () => {
    render(<EventsSection data={data} events={[event("online")]} />);

    const feature = screen.getByRole("article", { name: "Event online" });

    expect(within(feature).queryByRole("button")).not.toBeInTheDocument();
    expect(feature.querySelector("img")).toHaveAttribute(
      "src",
      "/images/online.png",
    );
  });

  it("labels an upcoming event and points to its announcement", () => {
    render(
      <EventsSection
        data={data}
        events={[event("next", { upcoming: true })]}
      />,
    );

    expect(screen.getByText("Upcoming")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Read the announcement: Event next" }),
    ).toHaveAttribute("href", "/blog/next");
  });

  it("lists up to MORE_EVENTS_COUNT further events as cards linking to their posts", () => {
    const rest = Array.from({ length: MORE_EVENTS_COUNT + 1 }, (_, i) =>
      event(`more-${i + 1}`),
    );

    render(<EventsSection data={data} events={[berlin, ...rest]} />);

    const cards = within(screen.getByRole("list")).getAllByRole("listitem");

    expect(cards).toHaveLength(MORE_EVENTS_COUNT);
    expect(screen.getByRole("link", { name: "Event more-1" })).toHaveAttribute(
      "href",
      "/blog/more-1",
    );
    expect(
      screen.queryByRole("link", {
        name: `Event more-${MORE_EVENTS_COUNT + 1}`,
      }),
    ).not.toBeInTheDocument();
  });

  it("renders the footer invitation as markdown", () => {
    render(<EventsSection data={data} events={[berlin]} />);

    expect(screen.getByRole("link", { name: "Write it up" })).toHaveAttribute(
      "href",
      "https://example.com/docs",
    );
  });

  describe("photo viewer", () => {
    it("opens at the photo that was clicked and moves focus to Close", async () => {
      const user = userEvent.setup();
      render(<EventsSection data={data} events={[berlin]} />);

      await user.click(screen.getByRole("button", { name: "photo 2" }));

      const viewer = screen.getByRole("dialog", { name: "Event berlin" });

      expect(within(viewer).getByRole("img")).toHaveAttribute(
        "src",
        "/images/photo-2.jpg",
      );
      expect(within(viewer).getByRole("status")).toHaveTextContent(
        "Photo 2 of 5",
      );
      expect(
        within(viewer).getByRole("button", { name: "Close photo viewer" }),
      ).toHaveFocus();
      expect(document.body.style.overflow).toBe("hidden");
    });

    it("steps through the photos with the buttons and arrow keys, wrapping at both ends", async () => {
      const user = userEvent.setup();
      render(<EventsSection data={data} events={[berlin]} />);

      await user.click(
        screen.getByRole("button", { name: "View all 5 photos" }),
      );
      const viewer = screen.getByRole("dialog");
      const shown = () => within(viewer).getByRole("img").getAttribute("src");

      expect(shown()).toBe("/images/photo-1.jpg");

      await user.click(
        within(viewer).getByRole("button", { name: "Previous photo" }),
      );
      expect(shown()).toBe("/images/photo-5.jpg");

      await user.click(
        within(viewer).getByRole("button", { name: "Next photo" }),
      );
      expect(shown()).toBe("/images/photo-1.jpg");

      await user.keyboard("{ArrowRight}{ArrowRight}");
      expect(shown()).toBe("/images/photo-3.jpg");

      await user.keyboard("{ArrowLeft}");
      expect(shown()).toBe("/images/photo-2.jpg");
    });

    it("keeps Tab inside the viewer", async () => {
      const user = userEvent.setup();
      render(<EventsSection data={data} events={[berlin]} />);

      await user.click(
        screen.getByRole("button", { name: "View all 5 photos" }),
      );
      const viewer = screen.getByRole("dialog");
      const close = within(viewer).getByRole("button", {
        name: "Close photo viewer",
      });
      const next = within(viewer).getByRole("button", { name: "Next photo" });

      await user.tab({ shift: true });
      expect(next).toHaveFocus();

      await user.tab();
      expect(close).toHaveFocus();
    });

    it("closes on Escape and gives focus back to what opened it", async () => {
      const user = userEvent.setup();
      render(<EventsSection data={data} events={[berlin]} />);

      const opener = screen.getByRole("button", { name: "View all 5 photos" });
      await user.click(opener);
      await user.keyboard("{Escape}");

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(opener).toHaveFocus();
      expect(document.body.style.overflow).toBe("");
    });

    it("closes on a click on the backdrop but not on the photo", async () => {
      const user = userEvent.setup();
      render(<EventsSection data={data} events={[berlin]} />);

      await user.click(
        screen.getByRole("button", { name: "View all 5 photos" }),
      );
      await user.click(within(screen.getByRole("dialog")).getByRole("img"));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await user.click(screen.getByRole("dialog").parentElement!);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("opens a card's photos from its picture, and names photos without alt text", async () => {
      const user = userEvent.setup();
      const kampala = event("kampala", {
        cover: "/images/class-1.jpg",
        photos: photos(2, "class").map(photo => ({ ...photo, alt: "" })),
      });
      render(<EventsSection data={data} events={[berlin, kampala]} />);

      await user.click(
        screen.getByRole("button", {
          name: "View 2 photos from Event kampala",
        }),
      );

      const viewer = screen.getByRole("dialog", { name: "Event kampala" });
      expect(within(viewer).getByRole("img")).toHaveAccessibleName(
        "Photo 1 of 2 from Event kampala",
      );
    });

    it("leaves out Previous and Next when there is a single photo", async () => {
      const user = userEvent.setup();
      render(
        <EventsSection
          data={data}
          events={[event("solo", { photos: photos(1) })]}
        />,
      );

      expect(
        screen.queryByRole("button", { name: /View all/ }),
      ).not.toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "photo 1" }));
      const viewer = screen.getByRole("dialog");

      expect(
        within(viewer).queryByRole("button", { name: "Next photo" }),
      ).not.toBeInTheDocument();
    });
  });
});
