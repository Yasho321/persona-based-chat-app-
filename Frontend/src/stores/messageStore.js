import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useMessageStore = create((set, get) => ({
  messages: [],
  isLoading: false,
  isSending: false,
  currentConversationId: null,

  setCurrentConversation: (conversationId) => {
    set({ currentConversationId: conversationId, messages: [] })
  },

  getAllMessages: async (conversationId) => {
    set({ isLoading: true })
    try {
      const response = await axiosInstance.get(`/message/${conversationId}`)
      set({
        messages: response.data.messages || [],
        currentConversationId: conversationId,
      })
    } catch (error) {
      console.error("Error fetching messages:", error)
      toast.error("Failed to load messages")
      set({ messages: [] })
    } finally {
      set({ isLoading: false })
    }
  },

  sendMessage: async (conversationId, content) => {
    set({ isSending: true })

    // Add user message immediately to UI
    const userMessage = { role: "user", content }
    set((state) => ({
      messages: [...state.messages, userMessage],
    }))

    try {
      const response = await axiosInstance.post(`/message/${conversationId}`, { content })

      // Add AI response to messages
      if (response.data.parsed) {
        set((state) => ({
          messages: [...state.messages, response.data.parsed],
        }))
      }

      return response.data
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Failed to send message")

      // Remove user message on error
      set((state) => ({
        messages: state.messages.slice(0, -1),
      }))

      return null
    } finally {
      set({ isSending: false })
    }
  },

  clearMessages: () => {
    set({ messages: [], currentConversationId: null })
  },
}))
