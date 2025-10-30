"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

interface User {
  id: string
  email: string
  name?: string
}

interface AuthResult {
  user: User | null
  isAuthenticated: boolean
}

export async function checkAuthAction(): Promise<AuthResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session?.user) {
      return {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name || undefined
        },
        isAuthenticated: true
      }
    }

    return {
      user: null,
      isAuthenticated: false
    }
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error)
    return {
      user: null,
      isAuthenticated: false
    }
  }
}

export async function requireAuthAction(): Promise<User> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user?.id) {
      redirect("/")
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name || undefined
    }
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error)
    redirect("/")
  }
}