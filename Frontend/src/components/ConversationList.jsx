import { useEffect, useState } from "react"
import { useAuthStore } from "../stores/authStore"
import { useConversationStore } from "../stores/conversationStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ChatInterface from "./ChatInterface"

export default function ConversationList({ onBack }) {
  const { authUser, logout } = useAuthStore()
  const {
    selectedPersona,
    conversations,
    isLoading,
    isCreating,
    getAllConversations,
    createConversation,
    deleteConversation,
    getConversationsByPersona,
  } = useConversationStore()

  const [selectedConversation, setSelectedConversation] = useState(null)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    if (selectedPersona) {
      getAllConversations(selectedPersona)
    }
  }, [getAllConversations, selectedPersona])

  const personaConversations = getConversationsByPersona(selectedPersona)

  const handleNewConversation = async () => {
    const newConversation = await createConversation(selectedPersona)
    if (newConversation) {
      setSelectedConversation(newConversation)
      setShowChat(true)
    }
  }

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation)
    setShowChat(true)
  }

  const handleBackToConversations = () => {
    setShowChat(false)
    setSelectedConversation(null)
    if (selectedPersona) {
      getAllConversations(selectedPersona)
    }
  }

  const handleDeleteConversation = async (conversationId, e) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this conversation?")) {
      await deleteConversation(conversationId)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (showChat && selectedConversation) {
    return <ChatInterface conversation={selectedConversation} onBack={handleBackToConversations} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              ← Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{selectedPersona === "piyush" ? "Piyush" : "Hitesh"} Conversations</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {authUser?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* New Conversation Button */}
        <div className="mb-6">
          <Button onClick={handleNewConversation} disabled={isCreating} className="w-full md:w-auto">
            {isCreating ? "Creating..." : "Start New Conversation"}
          </Button>
        </div>

        {/* Conversations List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Conversations</h2>
            <Badge variant="secondary">{personaConversations.length} conversations</Badge>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : personaConversations.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">No conversations yet</p>
                <p className="text-sm text-muted-foreground">
                  Start your first conversation with {selectedPersona === "piyush" ? "Piyush" : "Hitesh"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {personaConversations.map((conversation) => (
                <Card
                  key={conversation._id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{conversation.title || "New Conversation"}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{formatDate(conversation.updatedAt)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteConversation(conversation._id, e)}
                          className="text-destructive hover:text-destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="capitalize">
                        {conversation.persona}
                      </Badge>
                      <span className="text-sm text-muted-foreground">Click to open</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
