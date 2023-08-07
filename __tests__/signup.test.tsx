import { render, fireEvent, waitFor } from "@testing-library/react";
import Signup from "@/pages/signup";
import { Auth } from "aws-amplify";

jest.mock("aws-amplify", () => ({
  Auth: {
    signUp: jest.fn(
      async () =>
        await Promise.resolve({
          user: {
            email: "test@test.com",
            password: "password123",
            confirm_password: "password123",
          },
        })
    ),
    signIn: jest.fn(
      async () =>
        await Promise.resolve({
          user: {
            email: "test@test.com",
            password: "password123",
            confirm_password: "password123",
          },
        })
    ),
    confirmSignUp: jest.fn(
      async () => await Promise.resolve({ message: "ok" })
    ),
  },
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => {
    return {
      replace: jest.fn(async () => await Promise.resolve({ message: "ok" })),
    };
  }),
}));

describe("Signup", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText } = render(<Signup />);

    expect(getByPlaceholderText("Email")).toBeInTheDocument();
    expect(getByPlaceholderText("Password")).toBeInTheDocument();
    expect(getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    const { getByPlaceholderText, getByTestId } = render(<Signup />);

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
      expect(Auth.signUp).toHaveBeenCalled();
    });
  });

  it("handles verification form submission", async () => {
    const { getByPlaceholderText, getByTestId } = render(<Signup />);

    // Fill out and submit the signup form
    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "password" },
    });
    fireEvent.change(getByPlaceholderText("Confirm Password"), {
      target: { value: "password" },
    });
    fireEvent.click(getByTestId("signup_submitButton"));

    // Wait for the signup to complete
    await waitFor(() => {
      expect(Auth.signUp).toHaveBeenCalled();
    });

    // Fill out and submit the verification form
    fireEvent.change(getByTestId("signup_submitVerificationInput"), {
      target: { value: "123456" },
    });
    fireEvent.click(getByTestId("signup_submitVerificationButton"));

    // Wait for the verification to complete
    await waitFor(() => {
      expect(Auth.confirmSignUp).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(Auth.signIn).toHaveBeenCalled();
    });
  });

  it("handles verification form submission when fails", async () => {
    const { getByPlaceholderText, getByTestId } = render(<Signup />);

    // Mock Auth.signUp to throw an error
    const confirmSignUpMock = jest.spyOn(Auth, "confirmSignUp");
    confirmSignUpMock.mockImplementation(
      async () => await Promise.reject(new Error("Confirm Sign up failed"))
    );

    // Mock console.log to check that the error is logged
    const consoleLogMock = jest.spyOn(console, "log");
    consoleLogMock.mockImplementation(() => {});

    // Fill out and submit the signup form
    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "password" },
    });
    fireEvent.change(getByPlaceholderText("Confirm Password"), {
      target: { value: "password" },
    });
    fireEvent.click(getByTestId("signup_submitButton"));

    // Wait for the signup to complete
    await waitFor(() => {
      expect(Auth.signUp).toHaveBeenCalled();
    });

    // Fill out and submit the verification form
    fireEvent.change(getByTestId("signup_submitVerificationInput"), {
      target: { value: "123456" },
    });
    fireEvent.click(getByTestId("signup_submitVerificationButton"));

    // Wait for the verification to complete
    await waitFor(() => {
      expect(Auth.confirmSignUp).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(Auth.signIn).toHaveBeenCalled();
    });

    // Check that the error was logged
    // expect consoleLogMock due to having console after catch inside signUpWithEmailAndPassword
    // this should be another type of handling and that should be tested
    expect(consoleLogMock).toHaveBeenCalledWith(
      new Error("Confirm Sign up failed")
    );

    // Clear the mocks after the test
    confirmSignUpMock.mockRestore();
    consoleLogMock.mockRestore();
  });

  it("handles verification form submission when aws returns empty user", async () => {
    const { getByPlaceholderText, getByTestId } = render(<Signup />);

    // Mock Auth.signUp to throw an error
    const signInMock = jest.spyOn(Auth, "signIn");
    signInMock.mockImplementation(async () => await Promise.resolve(null));

    // Mock console.log to check that the error is logged
    const consoleLogMock = jest.spyOn(console, "log");
    consoleLogMock.mockImplementation(() => {});

    // Fill out and submit the signup form
    fireEvent.change(getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(getByPlaceholderText("Password"), {
      target: { value: "password" },
    });
    fireEvent.change(getByPlaceholderText("Confirm Password"), {
      target: { value: "password" },
    });
    fireEvent.click(getByTestId("signup_submitButton"));

    // Wait for the signup to complete
    await waitFor(() => {
      expect(Auth.signUp).toHaveBeenCalled();
    });

    // Fill out and submit the verification form
    fireEvent.change(getByTestId("signup_submitVerificationInput"), {
      target: { value: "123456" },
    });
    fireEvent.click(getByTestId("signup_submitVerificationButton"));

    // Wait for the verification to complete
    await waitFor(() => {
      expect(Auth.confirmSignUp).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(Auth.signIn).toHaveBeenCalled();
    });

    // Check that the error was logged
    // expect consoleLogMock due to having console after catch inside signUpWithEmailAndPassword
    // this should be another type of handling and that should be tested
    expect(consoleLogMock).toHaveBeenCalledWith(
      new Error("Something went wrong!")
    );

    // Clear the mocks after the test
    signInMock.mockRestore();
    consoleLogMock.mockRestore();
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

  it("handles form submission and calls signUpWithEmailAndPassword", async () => {
    const { getByPlaceholderText, getByTestId } = render(<Signup />);
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
      expect(Auth.signUp).toHaveBeenCalled();
    });
  });

  it("handles form submission and Auth.signUp fails", async () => {
    // Mock Auth.signUp to throw an error
    const signUpMock = jest.spyOn(Auth, "signUp");
    signUpMock.mockImplementation(
      async () => await Promise.reject(new Error("Sign up failed"))
    );

    // Mock console.log to check that the error is logged
    const consoleLogMock = jest.spyOn(console, "log");
    consoleLogMock.mockImplementation(() => {});

    const { getByPlaceholderText, getByTestId } = render(<Signup />);
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
      expect(Auth.signUp).toHaveBeenCalled();
    });

    // Check that the error was logged
    // expect consoleLogMock due to having console after catch inside signUpWithEmailAndPassword
    // this should be another type of handling and that should be tested
    expect(consoleLogMock).toHaveBeenCalledWith(new Error("Sign up failed"));

    // Clear the mocks after the test
    signUpMock.mockRestore();
    consoleLogMock.mockRestore();
  });
});
