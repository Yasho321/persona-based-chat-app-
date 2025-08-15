import { useState } from "react"
import { useAuthStore } from "../stores/authStore"
import { useConversationStore } from "../stores/conversationStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ConversationList from "./ConversationList"

export default function PersonaSelection() {
  const { authUser, logout, token } = useAuthStore()
  const { selectedPersona, setSelectedPersona } = useConversationStore()
  const [showConversations, setShowConversations] = useState(false)

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona)
    setShowConversations(true)
  }

  const handleBackToPersonas = () => {
    setShowConversations(false)
    setSelectedPersona(null)
  }

  const handleLogout = async () => {
    await logout()
  }

  if (showConversations && selectedPersona) {
    return <ConversationList onBack={handleBackToPersonas} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Persona Chat</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {authUser?.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Tokens: </span>
              <span className="font-semibold text-primary">{token}</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Choose Your AI Persona</h2>
          <p className="text-muted-foreground">Select a persona to start chatting with</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Piyush Persona */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <img src = "https://github.com/piyushgarg-dev.png" alt = "Piyush Garg" className="rounded-full" />
              </div>
              <CardTitle className="text-xl">Piyush</CardTitle>
              <CardDescription>Founder of teachyst</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with Piyush about programming, web development, and tech trends. Get coding advice and learn new
                technologies.
              </p>
              <Button className="w-full" onClick={() => handlePersonaSelect("piyush")}>
                Chat with Piyush
              </Button>
            </CardContent>
          </Card>

          {/* Hitesh Persona */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
               
                  <img src= "https://github.com/hiteshchoudhary.png" alt = "Hitesh Choudhary" className="rounded-full" />
                
              </div>
              <CardTitle className="text-xl">Hitesh</CardTitle>
              <CardDescription>Founder of Learnyst and Chai aur code </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Learn from Hitesh about full-stack development, JavaScript, and building real-world applications.
              </p>
              <Button className="w-full" onClick={() => handlePersonaSelect("hitesh")}>
                Chat with Hitesh
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
