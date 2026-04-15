import { create } from "zustand";
import api from "../lib/api";

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  authError: null,
  authLoading: false,

  signup: async ({ name, email, password, jobTitle = "", company = "" }) => {
    set({ authLoading: true, authError: null });
    try {
      const { data } = await api.post("/api/auth/signup", {
        name, email, password, jobTitle, company,
      });
      localStorage.setItem("huntboard-jwt", data.token);
      set({ user: data.user, isAuthenticated: true, authLoading: false });
      return true;
    } catch (err) {
      set({
        authError: err.response?.data?.message || "Signup failed",
        authLoading: false,
      });
      return false;
    }
  },

  login: async ({ email, password, turnstileToken }) => {
    set({ authLoading: true, authError: null });
    try {
      const { data } = await api.post("/api/auth/login", {
        email, password, turnstileToken,
      });
      localStorage.setItem("huntboard-jwt", data.token);
      set({ user: data.user, isAuthenticated: true, authLoading: false });
      return true;
    } catch (err) {
      set({
        authError: err.response?.data?.message || "Invalid email or password.",
        authLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("huntboard-jwt");
    set({ user: null, isAuthenticated: false, authError: null });
  },

  // Called on app mount — rehydrates session from stored JWT
  checkAuth: async () => {
    const token = localStorage.getItem("huntboard-jwt");
    if (!token) return;
    try {
      const { data } = await api.get("/api/auth/me");
      set({ user: data.user, isAuthenticated: true });
    } catch {
      localStorage.removeItem("huntboard-jwt");
      set({ user: null, isAuthenticated: false });
    }
  },

  updateProfile: async (updates) => {
    try {
      const { data } = await api.put("/api/auth/me", updates);
      set({ user: data.user });
    } catch (err) {
      console.error("Profile update failed:", err.response?.data?.message);
    }
  },

  clearError: () => set({ authError: null }),
}));

export default useAuthStore;
