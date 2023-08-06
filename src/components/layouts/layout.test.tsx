import { render, screen } from "@testing-library/react";
import type { RenderResult } from "@testing-library/react";
import Layout from "./layout"; // adjust this import to match your project structure

jest.mock("next/font/google", () => ({
  Inter: jest.fn(() => {
    return {
      className: "mockFontClass",
    };
  }),
}));

jest.mock("@/components/Header", () => {
  return {
    __esModule: true,
    default: () => <header />,
  };
});

const customRender = (): RenderResult =>
  render(
    <Layout>
      <div>Test content</div>
    </Layout>
  );

describe("Layout", () => {
  it("renders the Header component", () => {
    const { container } = customRender();

    // Check that the Header is rendered and role assigned
    const headerElement = container.querySelector("header");
    expect(headerElement).toBeInTheDocument();
  });

  it("renders the main content", () => {
    customRender();

    // Check that the main content is rendered
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveTextContent("Test content");
  });
});
