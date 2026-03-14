import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Divider from "@/components/Divider";

describe("Divider", () => {
  it("renders icon and horizontal line", () => {
    const { container } = render(<Divider />);

    const icon = container.querySelector("img[src='/images/Hiero-Icon.svg']");
    const line = container.querySelector(".bg-white-dark");

    expect(icon).not.toBeNull();
    expect(line).not.toBeNull();
  });
});
