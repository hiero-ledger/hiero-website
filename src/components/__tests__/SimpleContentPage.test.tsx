import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SimpleContentPage from "../SimpleContentPage";

describe("SimpleContentPage", () => {
  it("renders markdown content and child content", () => {
    render(
      <SimpleContentPage
        title="Hacktoberfest"
        description="Contribute this season"
        contentMarkdown="Welcome to **Hiero**."
      >
        <div>Extra section</div>
      </SimpleContentPage>,
    );

    expect(
      screen.getByRole("heading", { name: "Hacktoberfest" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Contribute this season")).toBeInTheDocument();
    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
    expect(screen.getByText("Extra section")).toBeInTheDocument();
  });
});
