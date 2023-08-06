import { render } from "@testing-library/react";
import type { RenderResult } from "@testing-library/react";
import Header from "./Header"; // adjust this import to match your project structure

const customRender = (): RenderResult => render(<Header />);

describe("Layout", () => {
  it("renders the header", () => {
    const { container } = customRender();

    // Check that the Header is rendered
    const headerElement = container.querySelector("header");
    expect(headerElement).toBeInTheDocument();
  });
});
