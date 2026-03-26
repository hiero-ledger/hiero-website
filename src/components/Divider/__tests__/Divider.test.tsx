import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Divider from "..";

describe("Divider", () => {
  it("renders the Hiero divider icon", () => {
    const { container } = render(<Divider />);

    expect(
      container.querySelector('img[src="/images/Hiero-Icon.svg"]'),
    ).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
