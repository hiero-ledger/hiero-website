import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/posts", () => ({
  getSimplePageWithDefaults: () => ({
    title: "Hacktoberfest",
    description: "Contribute now",
    contentMarkdown: "Hacktoberfest content",
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

vi.mock("@/components/IssueList", () => ({
  default: ({ endpoint }: { endpoint: string }) => <div>Issues: {endpoint}</div>,
}));

import HacktoberfestPage from "@/app/hacktoberfest/page";

describe("Hacktoberfest page", () => {
  it("renders simple content page with issue list", () => {
    render(<HacktoberfestPage />);

    expect(screen.getByRole("heading", { name: "Hacktoberfest" })).toBeInTheDocument();
    expect(screen.getByText(/Issues:/)).toBeInTheDocument();
  });
});
