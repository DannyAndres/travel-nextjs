import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";

interface IFormInput {
  email: string;
  password: string;
  confirm_password: string;
}

interface IFormVerification {
  code: string;
}

const Signup = (): React.ReactNode => {
  const router = useRouter();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const verificationForm = useForm<IFormVerification>();

  const email = watch("email");
  const password = watch("password");
  const [showPassword, setShowPassword] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [submitDisabledVerification, setSubmitDisabledVerification] =
    useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [signUpError, setSignUpError] = useState<string>("");

  const signUpWithEmailAndPassword = async (
    data: IFormInput
  ): Promise<void> => {
    const { password, email } = data;
    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
        },
      });
      setSubmitSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        // Now TypeScript knows that `e` is an `Error`, so you can access `e.message`
        setSignUpError(err.message);
      }
      setSubmitDisabled(false);
      console.log(err);
    }
  };

  const verifyCode = async (data: IFormVerification): Promise<void> => {
    const { code } = data;
    try {
      await Auth.confirmSignUp(email, code);
      const amplifyUser = await Auth.signIn(email, password);
      if (amplifyUser != null) {
        await router.replace(`/`);
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data): Promise<void> => {
    setSignUpError("");
    setSubmitDisabled(true);
    setSubmitSuccess(false);
    await signUpWithEmailAndPassword(data);
  };

  const onVerification: SubmitHandler<IFormVerification> = async (
    data
  ): Promise<void> => {
    setSubmitDisabledVerification(true);
    await verifyCode(data);
    setSubmitDisabledVerification(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit(onSubmit)();
        }}
        className="p-6 bg-white border w-[50%] border-gray-300 rounded"
      >
        <h3 className="mb-4 text-xl-2 text-gray-700 font-semibold">Sign Up</h3>
        <input
          {...register("email", {
            required: true,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "invalid email address",
            },
          })}
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 font-light focus:ring-slate-600"
          placeholder="Email"
        />
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "You must specify a password",
              minLength: {
                value: 8,
                message: "Password must have at least 8 characters",
              },
            })}
            className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 font-light focus:ring-slate-600"
            placeholder="Password"
          />
          <div
            onClick={() => {
              setShowPassword(!showPassword);
            }}
            className="absolute right-2 top-2 cursor-pointer"
          >
            {showPassword ? (
              <span
                data-testid="signup_hidePasswordButton"
                className="font-light text-gray-600"
              >
                Hide
              </span>
            ) : (
              <span
                data-testid="signup_showPasswordButton"
                className="font-light text-gray-600"
              >
                Show
              </span>
            )}
          </div>
        </div>
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            {...register("confirm_password", {
              required: "You must type your password again",
              validate: (value) =>
                value === password || "The passwords do not match",
            })}
            className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 font-light focus:ring-slate-600"
            placeholder="Confirm Password"
          />
          <div
            onClick={() => {
              setShowPassword(!showPassword);
            }}
            className="absolute right-2 top-2 cursor-pointer"
          >
            {showPassword ? (
              <span
                data-testid="signup_hideConfirmPasswordButton"
                className="font-light text-gray-600"
              >
                Hide
              </span>
            ) : (
              <span
                data-testid="signup_showConfirmPasswordButton"
                className="font-light text-gray-600"
              >
                Show
              </span>
            )}
          </div>
        </div>
        {errors.confirm_password != null && (
          <p className="bg-red-100 text-red-900 mb-2 px-2 py-4 text-center rounded">
            {errors.confirm_password.message}
          </p>
        )}
        {signUpError !== "" && (
          <p className="bg-red-100 text-red-900 mb-2 px-2 py-4 text-center rounded">
            {signUpError}
          </p>
        )}
        <button
          disabled={submitDisabled}
          type="submit"
          data-testid="signup_submitButton"
          className={`${
            submitDisabled
              ? "cursor-not-allowed bg-slate-200 text-slate-300"
              : "cursor-pointer bg-slate-600 hover:bg-slate-700 text-white"
          } w-full p-2 font-semibold rounded`}
        >
          Sign Up
        </button>
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void verificationForm.handleSubmit(onVerification)();
        }}
        className={`${
          submitSuccess ? "" : "hidden"
        } p-6 mt-4 bg-white border w-[50%] border-gray-300 rounded`}
      >
        <h3 className="mb-4 text-xl-2 text-gray-700 font-semibold">
          Verification Code
        </h3>
        <input
          data-testid="signup_submitVerificationInput"
          type="text"
          {...verificationForm.register("code", {
            required: "You must enter a code",
            minLength: {
              value: 6,
              message: "Your verification is 6 characters long.",
            },
            maxLength: {
              value: 6,
              message: "Your verification is 6 characters long.",
            },
          })}
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 font-light focus:ring-slate-600"
          placeholder="Verification Code"
        />
        {verificationForm.formState.errors.code != null && (
          <p className="bg-red-100 text-red-900 mb-2 px-2 py-4 text-center rounded">
            {verificationForm.formState.errors.code.message}
          </p>
        )}
        <button
          disabled={submitDisabledVerification}
          type="submit"
          data-testid="signup_submitVerificationButton"
          className={`${
            submitDisabledVerification
              ? "cursor-not-allowed bg-slate-200 text-slate-300"
              : "cursor-pointer bg-slate-600 hover:bg-slate-700 text-white"
          } w-full p-2 font-semibold rounded`}
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default Signup;
