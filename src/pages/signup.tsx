import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useState } from "react";

interface IFormInput {
  email: string;
  password: string;
  confirm_password: string;
}

const Signup = (): React.ReactNode => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const password = watch("password");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<IFormInput> = (data): void => {
    console.log(data);
  };

  return (
    <div className="flex items-center justify-center h-full">
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
        <button
          type="submit"
          data-testid="signup_submitButton"
          className="w-full p-2 text-white bg-slate-600 cursor-pointer font-semibold rounded hover:bg-slate-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
