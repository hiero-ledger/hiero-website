import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SimpleContentPage from "@/components/SimpleContentPage";

describe("SimpleContentPage", () => {
  it("renders page content and children", () => {
    render(
      <SimpleContentPage
        title="Heroes"
        description="Community contributors"
        contentMarkdown="Main body content.">
        <div>Extra child content</div>
      </SimpleContentPage>,
    );

    expect(screen.getByRole("heading", { name: "Heroes" })).toBeInTheDocument();
    expect(screen.getByText("Community contributors")).toBeInTheDocument();
    expect(screen.getByText("Main body content.")).toBeInTheDocument();
    expect(screen.getByText("Extra child content")).toBeInTheDocument();
  });
});
