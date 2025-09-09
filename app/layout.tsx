import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { SearchProvider } from "@/contexts/search-context"
import { Toaster } from "@/components/ui/toaster"
import BottomNavigation from "@/components/bottom-navigation"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "FMOSWEB - Premium E-commerce Platform",
  description: "Your trusted online shopping destination for quality products",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <AuthProvider>
          <CartProvider>
            <SearchProvider>
              <Suspense fallback={null}>{children}</Suspense>
              <Toaster />
              <BottomNavigation />
            </SearchProvider>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
