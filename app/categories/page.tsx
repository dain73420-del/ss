import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Smartphone, Shirt, Home, Dumbbell, BookOpen, Gamepad2 } from "lucide-react"

const categories = [
  {
    id: "electronics",
    name: "Electronics",
    description: "Latest gadgets, smartphones, laptops and tech accessories",
    icon: Smartphone,
    image: "/modern-electronics.png",
    productCount: 245,
    color: "bg-blue-500",
  },
  {
    id: "fashion",
    name: "Fashion",
    description: "Trendy clothing, shoes, and accessories for all occasions",
    icon: Shirt,
    image: "/fashion-clothing-collection.png",
    productCount: 189,
    color: "bg-pink-500",
  },
  {
    id: "home-garden",
    name: "Home & Garden",
    description: "Furniture, decor, and gardening essentials for your space",
    icon: Home,
    image: "/cozy-living-room.png",
    productCount: 156,
    color: "bg-green-500",
  },
  {
    id: "sports",
    name: "Sports",
    description: "Sports equipment, fitness gear, and outdoor activities",
    icon: Dumbbell,
    image: "/sports-equipment-fitness.jpg",
    productCount: 98,
    color: "bg-orange-500",
  },
  {
    id: "books",
    name: "Books",
    description: "Educational books, novels, and digital publications",
    icon: BookOpen,
    image: "/books-library-collection.jpg",
    productCount: 234,
    color: "bg-purple-500",
  },
  {
    id: "toys",
    name: "Toys",
    description: "Fun toys, games, and educational items for children",
    icon: Gamepad2,
    image: "/children-toys-games.jpg",
    productCount: 87,
    color: "bg-yellow-500",
  },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 text-balance">Shop by Categories</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto text-pretty">
            Discover our wide range of products organized by categories. Find exactly what you're looking for.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card
                key={category.id}
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-white"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute top-4 left-4 ${category.color} p-2 rounded-lg`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="absolute top-4 right-4 bg-white/90 text-slate-700">
                    {category.productCount} products
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{category.name}</h3>
                  <p className="text-slate-600 mb-4 text-pretty">{category.description}</p>
                  <Link href={`/products?category=${category.id}`}>
                    <Button className="w-full group-hover:bg-slate-900 transition-colors">
                      Browse {category.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Featured Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Can't find what you're looking for?</h2>
          <p className="text-slate-600 mb-6">Browse all our products or use our search feature</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" variant="outline">
                View All Products
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg">Search Products</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
