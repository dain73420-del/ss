"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, ShoppingCart, Grid3X3 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export default function BottomNavigation() {
  const pathname = usePathname()
  const { getTotalItems } = useCart()
  const cartCount = getTotalItems()

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
    },
    {
      href: "/products",
      icon: Package,
      label: "Products",
    },
    {
      href: "/cart",
      icon: ShoppingCart,
      label: "Cart",
      badge: cartCount > 0 ? cartCount : null,
    },
    {
      href: "/categories",
      icon: Grid3X3,
      label: "Categories",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 relative ${
                isActive ? "text-amber-600" : "text-gray-500 hover:text-amber-600"
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? "text-amber-600" : "text-gray-500"}`} />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center min-w-[16px] text-[10px] font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${isActive ? "text-amber-600" : "text-gray-500"}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
