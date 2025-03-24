import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/zustandStore";
import Notification from "../components/Notification";

const Register = () => {
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password);
      setNotification({ message: "Registration successful!", type: "success" });
      setTimeout(() => navigate("/login"), 2000); // Redirect after success
    } catch (error: any) {
      setNotification({ message: error.message || "Registration failed!", type: "error" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      <form onSubmit={handleRegister} className="p-6 bg-white shadow-md rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded mb-3" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded mb-3" required />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
