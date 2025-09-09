"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"

export interface CartItem {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Omit<CartItem, "quantity">) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    console.log("[v0] Cart addToCart called with:", product)

    try {
      setItems((prevItems) => {
        console.log("[v0] Current cart items:", prevItems)
        const existingItem = prevItems.find((item) => item.id === product.id)

        if (existingItem) {
          console.log("[v0] Item exists, updating quantity")
          toast({
            title: "কার্ট আপডেট হয়েছে",
            description: `${product.name} এর পরিমাণ বৃদ্ধি পেয়েছে`,
          })
          return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
        } else {
          console.log("[v0] New item, adding to cart")
          toast({
            title: "পণ্যটি কার্টে যুক্ত হয়েছে",
            description: `${product.name} সফলভাবে কার্টে যোগ করা হয়েছে`,
          })
          return [...prevItems, { ...product, quantity: 1 }]
        }
      })
    } catch (error) {
      console.error("[v0] Error adding to cart:", error)
      toast({
        title: "ত্রুটি",
        description: "কার্টে যোগ করতে ব্যর্থ, আবার চেষ্টা করুন",
        variant: "destructive",
      })
    }
  }

  const removeFromCart = (id: number) => {
    setItems((prevItems) => {
      const item = prevItems.find((item) => item.id === id)
      if (item) {
        toast({
          title: "কার্ট থেকে সরানো হয়েছে",
          description: `${item.name} কার্ট থেকে সরিয়ে দেওয়া হয়েছে`,
        })
      }
      return prevItems.filter((item) => item.id !== id)
    })
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    toast({
      title: "কার্ট খালি করা হয়েছে",
      description: "সমস্ত পণ্য কার্ট থেকে সরিয়ে দেওয়া হয়েছে",
    })
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
