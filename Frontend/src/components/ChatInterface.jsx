import { useEffect, useState, useRef } from "react"
import { useAuthStore } from "../stores/authStore"
import { useMessageStore } from "../stores/messageStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ChatInterface({ conversation, onBack }) {
  const { authUser, logout } = useAuthStore()
  const { messages, isLoading, isSending, getAllMessages, sendMessage, setCurrentConversation } = useMessageStore()

  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (conversation?._id) {
      setCurrentConversation(conversation._id)
      getAllMessages(conversation._id)
    }
  }, [conversation, setCurrentConversation, getAllMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || isSending) return

    const messageContent = inputMessage.trim()
    setInputMessage("")

    await sendMessage(conversation._id, messageContent)
  }

  const handleLogout = async () => {
    await logout()
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card flex-shrink-0">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              ← Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">Chat with {conversation.persona === "piyush" ? "Piyush" : "Hitesh"}</h1>
              <p className="text-sm text-muted-foreground">{conversation.title || "New Conversation"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto max-w-4xl">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">No messages yet</p>
                <p className="text-sm text-muted-foreground">
                  Start the conversation with {conversation.persona === "piyush" ? "Piyush" : "Hitesh"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <Card
                      className={`max-w-xs md:max-w-md ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <CardContent className="px-5 ">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {message.role === "user" ? "You" : conversation.persona === "piyush" ? "Piyush" : "Hitesh"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t bg-card p-4 flex-shrink-0">
          <div className="container mx-auto max-w-4xl">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Type your message to ${conversation.persona === "piyush" ? "Piyush" : "Hitesh"}...`}
                disabled={isSending}
                className="flex-1"
              />
              <Button type="submit" disabled={!inputMessage.trim() || isSending}>
                {isSending ? "Sending..." : "Send"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
