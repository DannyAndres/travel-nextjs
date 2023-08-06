import HomePage from "@/pages/index";
import { render, screen } from "@testing-library/react";

jest.mock("@/components/layouts/layout", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

describe("HomePage", () => {
  it("renders welcome message", () => {
    render(<HomePage />);
    const welcomeMessage = screen.getByText(/Welcome to our website!/i);
    expect(welcomeMessage).toBeInTheDocument();
  });
});
