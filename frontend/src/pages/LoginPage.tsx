import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/zustandStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tooltip } from "react-tooltip";
import toast, { Toaster } from "react-hot-toast";

// Zod schema for validation
const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const success = await login(data.email, data.password);

    if (success) {
      toast.success("Login successful! Redirecting to admin panel...");
      setTimeout(() => navigate("/admin"), 1000);
    } else {
      toast.error("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Toaster /> {/* For displaying toast messages */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input id="email" type="email" {...register("email")} className={`w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 ${errors.email ? "focus:ring-red-500 border-red-500" : "focus:ring-blue-500"}`} placeholder="john@example.com" />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600" data-tooltip-id="email-error">
              {errors.email.message}
            </p>
          )}
          <Tooltip id="email-error" place="top" content={errors.email?.message} />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input id="password" type="password" {...register("password")} className={`w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 ${errors.password ? "focus:ring-red-500 border-red-500" : "focus:ring-blue-500"}`} placeholder="Password" />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600" data-tooltip-id="password-error">
              {errors.password.message}
            </p>
          )}
          <Tooltip id="password-error" place="top" content={errors.password?.message} />
        </div>

        {/* Submit Button */}
        <button type="submit" className="cursor-pointer w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Login
        </button>

        {/* Register Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")} className="cursor-pointer text-blue-500 hover:underline focus:outline-none">
            Register
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
