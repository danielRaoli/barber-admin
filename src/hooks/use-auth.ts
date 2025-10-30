"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { checkAuthAction } from "@/actions/auth-actions"

interface User {
  id: string
  email: string
  name?: string
}

interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const result = await checkAuthAction()

      if (result.isAuthenticated && result.user) {
        setUser(result.user)

      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const isAuthenticated = !!user

  return {
    user,
    isLoading,
    isAuthenticated,
  }
}

export function useAuthRedirect() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}