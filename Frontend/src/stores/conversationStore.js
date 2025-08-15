import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useConversationStore = create((set, get) => ({
  conversations: [],
  isLoading: false,
  isCreating: false,
  isDeleting: false,
  selectedPersona: null,

  setSelectedPersona: (persona) => {
    set({ selectedPersona: persona })
  },

  getAllConversations: async (persona) => {
    set({ isLoading: true })
    try {
      const response = await axiosInstance.get(`/conversation/${persona}`)
      set({ conversations: response.data.conversations || [] })
    } catch (error) {
      console.error("Error fetching conversations:", error)
      toast.error("Failed to load conversations")
      set({ conversations: [] })
    } finally {
      set({ isLoading: false })
    }
  },

  createConversation: async (persona) => {
    set({ isCreating: true })
    try {
      const response = await axiosInstance.post("/conversation/", { persona })
      const newConversation = response.data.conversation

      set((state) => ({
        conversations: [newConversation, ...state.conversations],
      }))

      toast.success("New conversation created")
      return newConversation
    } catch (error) {
      console.error("Error creating conversation:", error)
      toast.error("Failed to create conversation")
      return null
    } finally {
      set({ isCreating: false })
    }
  },

  deleteConversation: async (conversationId) => {
    set({ isDeleting: true })
    try {
      await axiosInstance.delete(`/conversation/${conversationId}`)

      set((state) => ({
        conversations: state.conversations.filter((conv) => conv._id !== conversationId),
      }))

      toast.success("Conversation deleted")
    } catch (error) {
      console.error("Error deleting conversation:", error)
      toast.error("Failed to delete conversation")
    } finally {
      set({ isDeleting: false })
    }
  },

  getConversationsByPersona: (persona) => {
    const { conversations } = get()
    return conversations.filter((conv) => conv.persona === persona).slice(0, 20) // Get last 20 conversations
  },
}))
