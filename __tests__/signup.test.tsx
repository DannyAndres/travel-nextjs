import { render, fireEvent, waitFor } from "@testing-library/react";
import Signup from "@/pages/signup"; // adjust the import path as needed

describe("Signup", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText } = render(<Signup />);

    expect(getByPlaceholderText("Email")).toBeInTheDocument();
    expect(getByPlaceholderText("Password")).toBeInTheDocument();
    expect(getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    const { getByPlaceholderText, getByTestId } = render(<Signup />);

    // mocking possible api request, in this case only console log
    const mockLog = jest.spyOn(console, "log");

    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const confirmPasswordInput = getByPlaceholderText("Confirm Password");
    const submitButton = getByTestId("signup_submitButton");

    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLog).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "password123",
        confirm_password: "password123",
      });
    });
  });

  it("toggles password visibility", () => {
    const { getByPlaceholderText, getByTestId } = render(<Signup />);
    const passwordInput = getByPlaceholderText("Password") as HTMLInputElement;
    const confirmPasswordInput = getByPlaceholderText(
      "Confirm Password"
    ) as HTMLInputElement;
    const showPasswordText = getByTestId("signup_showPasswordButton");

    // Initially, the password fields should be of type "password"
    expect(passwordInput.type).toBe("password");
    expect(confirmPasswordInput.type).toBe("password");

    // Click the "Show" text
    fireEvent.click(showPasswordText);

    // The password fields should now be of type "text"
    expect(passwordInput.type).toBe("text");
    expect(confirmPasswordInput.type).toBe("text");

    // The "Show" text should have changed to "Hide"
    expect(getByTestId("signup_hidePasswordButton")).toBeInTheDocument();

    // Click the "Hide" text
    fireEvent.click(getByTestId("signup_hidePasswordButton"));

    // The password fields should be of type "password" again
    expect(passwordInput.type).toBe("password");
    expect(confirmPasswordInput.type).toBe("password");

    // The "Hide" text should have changed back to "Show"
    expect(getByTestId("signup_showPasswordButton")).toBeInTheDocument();
  });

  it("toggles confirm password visibility", () => {
    const { getByPlaceholderText, getByTestId } = render(<Signup />);
    const passwordInput = getByPlaceholderText("Password") as HTMLInputElement;
    const confirmPasswordInput = getByPlaceholderText(
      "Confirm Password"
    ) as HTMLInputElement;
    const showPasswordText = getByTestId("signup_showConfirmPasswordButton");

    // Initially, the password fields should be of type "password"
    expect(passwordInput.type).toBe("password");
    expect(confirmPasswordInput.type).toBe("password");

    // Click the "Show" text
    fireEvent.click(showPasswordText);

    // The password fields should now be of type "text"
    expect(passwordInput.type).toBe("text");
    expect(confirmPasswordInput.type).toBe("text");

    // The "Show" text should have changed to "Hide"
    expect(getByTestId("signup_hideConfirmPasswordButton")).toBeInTheDocument();

    // Click the "Hide" text
    fireEvent.click(getByTestId("signup_hideConfirmPasswordButton"));

    // The password fields should be of type "password" again
    expect(passwordInput.type).toBe("password");
    expect(confirmPasswordInput.type).toBe("password");

    // The "Hide" text should have changed back to "Show"
    expect(getByTestId("signup_showConfirmPasswordButton")).toBeInTheDocument();
  });

  it("shows an error message when the passwords do not match", async () => {
    const { getByPlaceholderText, getByTestId, findByText } = render(
      <Signup />
    );
    const passwordInput = getByPlaceholderText("Password");
    const confirmPasswordInput = getByPlaceholderText("Confirm Password");
    const submitButton = getByTestId("signup_submitButton");

    // Enter different passwords in the password fields
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password456" },
    });

    // Click the submit button
    fireEvent.click(submitButton);

    // The error message should be shown
    const errorMessage = await findByText("The passwords do not match");
    expect(errorMessage).toBeInTheDocument();
  });
});
