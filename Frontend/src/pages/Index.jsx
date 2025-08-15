import { useEffect } from "react"
import { useAuthStore } from "../stores/authStore"
import Auth from "../components/Auth"
import LoadingSpinner from "../components/LoadingSpinner"
import PersonaSelection from "../components/PersonaSelection"

export default function Index() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) {
    return <LoadingSpinner />
  }

  if (!authUser) {
    return <Auth/>
  }

  return <PersonaSelection />
}