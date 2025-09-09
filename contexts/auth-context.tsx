"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"

export interface User {
  id: string
  name: string
  email: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, phone?: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user exists in localStorage (simple demo implementation)
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const existingUser = users.find((u: any) => u.email === email && u.password === password)

      if (existingUser) {
        const { password: _, ...userWithoutPassword } = existingUser
        setUser(userWithoutPassword)

        toast({
          title: "সফলভাবে লগইন হয়েছে",
          description: `স্বাগতম, ${existingUser.name}!`,
        })

        setIsLoading(false)
        return true
      } else {
        toast({
          title: "লগইন ব্যর্থ",
          description: "ভুল ইমেইল বা পাসওয়ার্ড",
          variant: "destructive",
        })

        setIsLoading(false)
        return false
      }
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "লগইন করতে সমস্যা হয়েছে, আবার চেষ্টা করুন",
        variant: "destructive",
      })

      setIsLoading(false)
      return false
    }
  }

  const signup = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const existingUser = users.find((u: any) => u.email === email)

      if (existingUser) {
        toast({
          title: "সাইনআপ ব্যর্থ",
          description: "এই ইমেইল দিয়ে ইতিমধ্যে একাউন্ট আছে",
          variant: "destructive",
        })

        setIsLoading(false)
        return false
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        password, // In real app, this would be hashed
      }

      // Save to users array
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Auto-login after signup
      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)

      toast({
        title: "সফলভাবে একাউন্ট তৈরি হয়েছে",
        description: `স্বাগতম, ${name}! আপনি স্বয়ংক্রিয়ভাবে লগইন হয়েছেন।`,
      })

      setIsLoading(false)
      return true
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "একাউন্ট তৈরি করতে সমস্যা হয়েছে, আবার চেষ্টা করুন",
        variant: "destructive",
      })

      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    toast({
      title: "লগআউট সম্পন্ন",
      description: "আপনি সফলভাবে লগআউট হয়েছেন",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
