import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

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
        try {
          const res = await axios.post("http://localhost:5000/api/auth/login", {
            email,
            password,
          });
          console.log(res);
          const { user, token } = res.data;
          set({ user, token, isAuthenticated: true });

          return true;
        } catch (error: any) {
          console.error("Login failed:", error);

          // Extract error message from server response
          const errorMessage = error.response?.data?.message || "Invalid email or password.";
          console.error("Error message:", errorMessage);
          return false; // Ensure we return false on failed login
        }
      },

      // Logout Function
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      // Fetch Logged-In User Details
      fetchUser: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const res = await axios.get("http://localhost:5000/api/auth/me", {
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
