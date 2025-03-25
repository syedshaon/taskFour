import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/zustandStore";
import Logo from "@/assets/logo.jpg";
import Background from "@/assets/background.jpg";

// ✅ Define schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password cannot be empty"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;
type RegisterFormInputs = z.infer<typeof registerSchema>;

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const isLogin = location.pathname === "/login";
  const { login } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true }); // Redirect logged-in users
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormInputs | RegisterFormInputs>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  const onSubmit = async (data: any) => {
    if (isLogin) {
      // Login logic
      const success = await login(data.email, data.password);
      if (success) {
        // toast.success("Login successful! Redirecting...");
        setTimeout(() => navigate("/admin"), 1000);
      } else {
        toast.error("Invalid credentials.");
      }
    } else {
      // Register logic
      try {
        const response = await axios.post("http://localhost:5000/api/auth/register", data);
        if (response.status === 201) {
          toast.success("Registration successful! Redirecting to login...");
          reset();
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Registration failed.");
      }
    }
  };

  return (
    <div className="flex bg-cover items-center justify-center h-screen bg-white/80" style={{ backgroundImage: `url(${Background})` }}>
      <div className="bg-white p-6 rounded shadow-md w-96">
        <img src={Logo} alt="Logo" className="w-24 mx-auto mb-4" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-2xl font-bold mb-4 text-center">{isLogin ? "Login" : "Register"}</h2>

          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input type="text" id="name" {...register("name")} className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {"name" in errors && errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
          )}

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input type="email" id="email" {...register("email")} className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input type="password" id="password" {...register("password")} className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
            {isSubmitting ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => navigate(isLogin ? "/register" : "/login")} className="text-blue-500 cursor-pointer hover:underline focus:outline-none">
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
