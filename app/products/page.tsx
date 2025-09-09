"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import ProductFilters from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List, Filter } from "lucide-react"

// Mock product data
const products = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 124,
    image: "/premium-wireless-headphones.png",
    category: "Electronics",
    brand: "AudioTech",
    inStock: true,
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
    category: "Electronics",
    brand: "FitTech",
    inStock: true,
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
    category: "Electronics",
    brand: "SoundWave",
    inStock: true,
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
    category: "Electronics",
    brand: "ChargeTech",
    inStock: false,
    badge: "Hot",
  },
  {
    id: 5,
    name: "Gaming Mechanical Keyboard",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviews: 203,
    image: "/gaming-mechanical-keyboard.png",
    category: "Electronics",
    brand: "GameTech",
    inStock: true,
    badge: "Gaming",
  },
  {
    id: 6,
    name: "4K Webcam",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.5,
    reviews: 67,
    image: "/4k-webcam.png",
    category: "Electronics",
    brand: "VisionTech",
    inStock: true,
    badge: "Professional",
  },
]

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState(products)

  const handleFilterChange = (filters: any) => {
    let filtered = products

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) => filters.categories.includes(product.category))
    }

    // Apply brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter((product) => filters.brands.includes(product.brand))
    }

    // Apply price range filter
    if (filters.priceRange.min > 0 || filters.priceRange.max < 1000) {
      filtered = filtered.filter(
        (product) => product.price >= filters.priceRange.min && product.price <= filters.priceRange.max,
      )
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter((product) => product.rating >= filters.minRating)
    }

    // Apply availability filter
    if (filters.inStockOnly) {
      filtered = filtered.filter((product) => product.inStock)
    }

    setFilteredProducts(filtered)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    const sorted = [...filteredProducts]

    switch (value) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        sorted.sort((a, b) => b.id - a.id)
        break
      default:
        // Featured - keep original order
        break
    }

    setFilteredProducts(sorted)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">Discover our complete collection of premium products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters onFilterChange={handleFilterChange} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <span className="text-sm text-gray-600">
                    Showing {filteredProducts.length} of {products.length} products
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mb-6">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <ProductFilters onFilterChange={handleFilterChange} />
                </div>
              </div>
            )}

            {/* Products Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Grid className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
