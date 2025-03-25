import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import toast from "react-hot-toast";
const apiUrl = import.meta.env.VITE_API_URL;

interface UserType {
  id: number;
  name: string;
  email: string;
  lastLogin: number;
  status: "active" | "blocked";
}

interface AuthState {
  user: UserType | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean; // Add this line
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false, // Initial state

      // Login Function with Improved Error Handling
      login: async (email, password) => {
        const toastId = toast.loading("Logging in...");
        try {
          const res = await axios.post(`${apiUrl}/auth/login`, {
            email,
            password,
          });
          console.log(res);
          const { user, token } = res.data;
          set({ user, token, isAuthenticated: true });
          toast.success("Logged in successfully!", { id: toastId });

          return true;
        } catch (error: any) {
          console.error("Login failed:", error);

          // // Extract error message from server response
          const errorMessage = error.response?.data?.message || "Invalid email or password.";
          console.error("Error message:", errorMessage);
          toast.error(errorMessage, { id: toastId });
          return error; // Ensure we return false on failed login
        }
      },

      // Logout Function
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        toast.success("Logged out successfully!");
      },

      // Fetch Logged-In User Details
      fetchUser: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const res = await axios.get(`${apiUrl}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({ user: res.data, isAuthenticated: true });
        } catch (error) {
          console.error("Failed to fetch user:", error);
          set({ user: null, token: null, isAuthenticated: false }); // Ensure proper state reset
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state._hasHydrated = true;
      },
    }
  )
);
