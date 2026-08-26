import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HeroSection from "..";

const data = {
  eyebrow: "A Linux Foundation Decentralized Trust project",
  heading: "Hiero",
  lede: "Open-source, vendor-neutral distributed ledger technology.",
  actions: [
    { name: "Start contributing", href: "/#contribute" },
    { name: "Browse the code", href: "https://github.com/hiero-ledger/" },
  ],
  facts: [
    { value: "20", label: "Core repositories" },
    { value: "2,256", label: "GitHub stars" },
    { value: "14", label: "Community calls" },
  ],
};

describe("HeroSection", () => {
  it("renders the credential, the wordmark and the positioning line", () => {
    render(<HeroSection data={data} />);

    expect(screen.getByText(data.eyebrow)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Hiero" })).toBeInTheDocument();
    expect(screen.getByText(data.lede)).toBeInTheDocument();
  });

  it("names the section by its heading", () => {
    render(<HeroSection data={data} />);

    expect(screen.getByRole("region", { name: "Hiero" })).toBeInTheDocument();
  });

  it("routes the primary action in-app and leaves the tab alone", () => {
    render(<HeroSection data={data} />);

    const primary = screen.getByRole("link", { name: "Start contributing" });

    expect(primary).toHaveAttribute("href", "/#contribute");
    expect(primary).not.toHaveAttribute("target");
  });

  it("opens the external action in a new tab and says so", () => {
    render(<HeroSection data={data} />);

    const external = screen.getByRole("link", {
      name: "Browse the code (opens in a new tab)",
    });

    expect(external).toHaveAttribute(
      "href",
      "https://github.com/hiero-ledger/",
    );
    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("lists every fact as a value and its label", () => {
    render(<HeroSection data={data} />);

    const facts = screen.getAllByRole("listitem");

    expect(facts).toHaveLength(data.facts.length);
    data.facts.forEach((fact, index) => {
      expect(facts[index]).toHaveTextContent(`${fact.value}${fact.label}`);
      expect(within(facts[index]).getByText(fact.value)).toBeInTheDocument();
    });
  });

  it("matches the rendered structure", () => {
    const { container } = render(<HeroSection data={data} />);

    expect(container.firstChild).toMatchSnapshot();
  });
});
