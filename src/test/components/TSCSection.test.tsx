import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TSCSection from "@/components/TSCSection";

describe("TSCSection", () => {
  it(
    "opens and closes member bio modal",
    () => {
      render(<TSCSection />);

      expect(screen.getByRole("heading", { name: /technical steering committee/i })).toBeInTheDocument();

      const bioButtons = screen.getAllByRole("button", { name: "Bio" });
      fireEvent.click(bioButtons[0]);

      const closeButton = screen.getByRole("button", { name: /Close bio/i });
      expect(closeButton).toBeInTheDocument();

      fireEvent.click(closeButton);
      expect(screen.queryByRole("button", { name: /Close bio/i })).toBeNull();
    },
    15000,
  );
});
