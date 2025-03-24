import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error message
    setSuccess(false); // Reset success message

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        setSuccess(true); // Show success message
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input type="text" id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input type="email" id="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Error Message */}
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-200 rounded">{error}</div>}

        {/* Success Message */}
        {success && <div className="mb-4 p-2 bg-green-100 text-green-700 border border-green-200 rounded">Registration successful! Redirecting to login...</div>}

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
          Register
        </button>

        {/* Login Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-blue-500 cursor-pointer hover:underline focus:outline-none">
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
