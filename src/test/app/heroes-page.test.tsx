import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/posts", () => ({
  getSimplePageWithDefaults: () => ({
    title: "Hiero Heroes",
    description: "Meet contributors",
    contentMarkdown: "Heroes content",
  }),
}));

vi.mock("@/components/SimpleContentPage", () => ({
  default: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
      <h1>{title}</h1>
      <div>{children}</div>
    </div>
  ),
}));

vi.mock("@/components/ContributorsGrid", () => ({
  default: ({ endpoint }: { endpoint: string }) => <div>Grid: {endpoint}</div>,
}));

import HeroesPage from "@/app/heroes/page";

describe("Heroes page", () => {
  it("renders simple content page with contributors grid", () => {
    render(<HeroesPage />);

    expect(screen.getByRole("heading", { name: "Hiero Heroes" })).toBeInTheDocument();
    expect(screen.getByText(/Grid:/)).toBeInTheDocument();
  });
});
