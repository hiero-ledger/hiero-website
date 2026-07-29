import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  affiliations,
  footerNavGroups,
  menuItems,
  socialLinks,
} from "@/data/navigation";
import Footer from "..";

describe("Footer", () => {
  it("renders the footer copy and policy link", () => {
    const { container } = render(<Footer />);

    expect(screen.getByText(/Copyright/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LF Projects" })).toHaveAttribute(
      "href",
      "https://lfprojects.org",
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders the branding logo linking home", () => {
    render(<Footer />);

    const homeLink = screen.getByRole("link", { name: "Hiero home" });

    expect(homeLink).toHaveAttribute("href", "/");
    expect(within(homeLink).getByAltText("Hiero")).toBeInTheDocument();
  });

  it("renders every navigation link with the shared menu data", () => {
    render(<Footer />);

    const footerNav = screen.getByRole("navigation", { name: "Footer" });

    for (const item of menuItems) {
      expect(
        within(footerNav).getByRole("link", { name: item.name }),
      ).toHaveAttribute("href", item.href);
    }
  });

  it("groups the navigation links under labelled headings", () => {
    render(<Footer />);

    const footerNav = screen.getByRole("navigation", { name: "Footer" });

    for (const group of footerNavGroups) {
      const list = within(footerNav).getByRole("list", { name: group.title });

      expect(
        within(footerNav).getByRole("heading", { name: group.title }),
      ).toBeInTheDocument();

      for (const item of group.items) {
        expect(
          within(list).getByRole("link", { name: item.name }),
        ).toHaveAttribute("href", item.href);
      }
    }
  });

  it("opens external navigation links safely in a new tab", () => {
    render(<Footer />);

    const footerNav = screen.getByRole("navigation", { name: "Footer" });
    const externalItems = footerNavGroups
      .flatMap(group => group.items)
      .filter(item => item.external ?? item.href.startsWith("http"));

    expect(externalItems.length).toBeGreaterThan(0);

    for (const item of externalItems) {
      const link = within(footerNav).getByRole("link", { name: item.name });

      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("keeps internal navigation links in the same tab", () => {
    render(<Footer />);

    const footerNav = screen.getByRole("navigation", { name: "Footer" });
    const internalLink = within(footerNav).getByRole("link", { name: "Blog" });

    expect(internalLink).not.toHaveAttribute("target");
    expect(internalLink).not.toHaveAttribute("rel");
  });

  it("renders the social links", () => {
    render(<Footer />);

    for (const social of socialLinks) {
      const link = screen.getByRole("link", { name: social.name });

      expect(link).toHaveAttribute("href", social.href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("renders the hosting affiliation logos", () => {
    render(<Footer />);

    const lockup = screen.getByRole("list", { name: "Hosted by" });

    for (const affiliation of affiliations) {
      const link = within(lockup).getByRole("link", {
        name: affiliation.name,
      });

      expect(link).toHaveAttribute("href", affiliation.href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(within(link).getByAltText(affiliation.name)).toBeInTheDocument();
    }
  });

  it("renders the back to top control", () => {
    render(<Footer />);

    expect(
      screen.getByRole("button", { name: "Back to top" }),
    ).toBeInTheDocument();
  });
});
