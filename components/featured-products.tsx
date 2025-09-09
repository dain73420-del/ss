"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"

const featuredProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 124,
    image: "/premium-wireless-headphones.png",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.9,
    reviews: 89,
    image: "/smart-fitness-watch.png",
    badge: "New",
  },
  {
    id: 3,
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.7,
    reviews: 156,
    image: "/portable-bluetooth-speaker.jpg",
    badge: "Sale",
  },
  {
    id: 4,
    name: "Wireless Charging Pad",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.6,
    reviews: 78,
    image: "/wireless-charging-pad.png",
    badge: "Hot",
  },
]

export default function FeaturedProducts() {
  const router = useRouter()
  const { addToCart } = useCart()

  const handleAddToCart = (product: (typeof featuredProducts)[0]) => {
    console.log("[v0] Adding product to cart:", product)
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
    })
    console.log("[v0] Product added to cart successfully")
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">Featured Products</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            Discover our handpicked selection of premium products that our customers love most
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Badge */}
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

                  {/* Wishlist Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-balance">{product.name}</h3>

                  {/* Rating */}
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

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    <span className="text-sm text-green-600 font-medium">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white transform transition-all duration-200 hover:scale-105 active:scale-95"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-amber-600 text-amber-600 hover:bg-amber-50 bg-transparent"
            onClick={() => router.push("/products")}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}
