"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ShoppingCart, Heart, Eye } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  rating: number
  reviews: number
  image: string
  category: string
  brand: string
  inStock: boolean
  badge?: string
}

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
}

export default function ProductCard({ product, viewMode }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = (product: Product) => {
    console.log("[v0] Adding product to cart from ProductCard:", product)
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
    })
    console.log("[v0] Product added to cart successfully from ProductCard")
  }

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="flex">
            <div className="relative w-48 h-48 flex-shrink-0">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover rounded-l-lg"
              />
              {product.badge && (
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      product.badge === "Best Seller"
                        ? "bg-amber-500 text-white"
                        : product.badge === "New"
                          ? "bg-green-600 text-white"
                          : product.badge === "Sale"
                            ? "bg-red-600 text-white"
                            : "bg-orange-600 text-white"
                    }`}
                  >
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-amber-600 text-lg mb-2">{product.name}</h3>
                  </Link>
                </div>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "text-amber-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-900">${product.price}</span>
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                  <span className="text-sm text-green-600 font-medium">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Link href={`/products/${product.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  <Button
                    className="bg-amber-600 hover:bg-amber-700 text-white transform transition-all duration-200 hover:scale-105 active:scale-95"
                    disabled={!product.inStock}
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {product.badge && (
            <div className="absolute top-3 left-3">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  product.badge === "Best Seller"
                    ? "bg-amber-500 text-white"
                    : product.badge === "New"
                      ? "bg-green-600 text-white"
                      : product.badge === "Sale"
                        ? "bg-red-600 text-white"
                        : "bg-orange-600 text-white"
                }`}
              >
                {product.badge}
              </span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Heart className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex space-x-2">
              <Link href={`/products/${product.id}`} className="flex-1">
                <Button variant="outline" className="w-full bg-white/90 hover:bg-white">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </Link>
              <Button
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white transform transition-all duration-200 hover:scale-105 active:scale-95"
                disabled={!product.inStock}
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.inStock ? "Add" : "Out"}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-gray-900 mb-2 hover:text-amber-600 text-balance">{product.name}</h3>
          </Link>

          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) ? "text-amber-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {product.rating} ({product.reviews})
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            <span className="text-sm text-green-600 font-medium">
              Save ${(product.originalPrice - product.price).toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
