import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,
  isLoggedOut: false,

  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true })
      const response = await axiosInstance.get("/auth/me")
      set({ authUser: response.data.user })
      set({ isLoggedOut: false })
    } catch (error) {
      console.error("check auth error:", error)
      set({ authUser: null })
      set({ isLoggedOut: true })
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post("/auth/register", data)
      set({ authUser: res.data.user })
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
      }
      set({ isLoggedOut: false })
      toast.success("Account created successfully!")
    } catch (error) {
      console.log("Error signing up", error)
      toast.error(error.response?.data?.message || "Error signing up")
    } finally {
      set({ isSigningUp: false })
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true })
    try {
      const res = await axiosInstance.post("/auth/login", data)
      set({ authUser: res.data.user })
       if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
      }
      set({ isLoggedOut: false })
      toast.success(res.data.message)
    } catch (error) {
      console.log("Error logging in", error)
      toast.error(error.response?.data?.message || "Error logging in")
    } finally {
      set({ isLoggingIn: false })
    }
  },

  logout: async () => {
    try {
      set({ isCheckingAuth: true })
      await axiosInstance.get("/auth/logout")
      set({ authUser: null })
      set({ isLoggedOut: true })
      toast.success("Logout successful")
    } catch (error) {
      console.log("Error logging out", error)
      toast.error("Error logging out")
    } finally {
      set({ isCheckingAuth: false })
    }
  },
}))
