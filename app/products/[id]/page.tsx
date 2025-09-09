"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, ShoppingCart, Heart, Share2, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react"

// Mock product data - in real app, this would come from API
const productData = {
  1: {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 124,
    images: [
      "/premium-wireless-headphones.png",
      "/premium-wireless-headphones.png",
      "/premium-wireless-headphones.png",
    ],
    category: "Electronics",
    brand: "AudioTech",
    inStock: true,
    stockCount: 15,
    badge: "Best Seller",
    description:
      "Experience premium audio quality with our flagship wireless headphones. Featuring advanced noise cancellation, 30-hour battery life, and premium materials for ultimate comfort.",
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Premium leather ear cups",
      "Bluetooth 5.0 connectivity",
      "Quick charge - 5 min for 2 hours",
      "Built-in voice assistant",
    ],
    specifications: {
      "Driver Size": "40mm",
      "Frequency Response": "20Hz - 20kHz",
      Impedance: "32 ohms",
      Weight: "250g",
      Connectivity: "Bluetooth 5.0, 3.5mm jack",
      Battery: "30 hours playback",
    },
  },
  2: {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.9,
    reviews: 89,
    images: ["/smart-fitness-watch.png", "/smart-fitness-watch.png", "/smart-fitness-watch.png"],
    category: "Electronics",
    brand: "FitTech",
    inStock: true,
    stockCount: 12,
    badge: "New",
    description:
      "Advanced fitness tracking with heart rate monitoring, GPS, and 7-day battery life. Perfect companion for your active lifestyle with comprehensive health insights.",
    features: [
      "Heart Rate Monitoring",
      "Built-in GPS",
      "7-day battery life",
      "Water resistant (50m)",
      "Sleep tracking",
      "Multiple sport modes",
    ],
    specifications: {
      Display: "1.4 inch AMOLED",
      "Battery Life": "7 days",
      "Water Resistance": "5ATM",
      Weight: "45g",
      Connectivity: "Bluetooth 5.0, Wi-Fi",
      Sensors: "Heart rate, GPS, Accelerometer",
    },
  },
  3: {
    id: 3,
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.7,
    reviews: 156,
    images: ["/portable-bluetooth-speaker.jpg", "/portable-bluetooth-speaker.jpg", "/portable-bluetooth-speaker.jpg"],
    category: "Electronics",
    brand: "SoundWave",
    inStock: true,
    stockCount: 25,
    badge: "Sale",
    description:
      "Compact yet powerful Bluetooth speaker with 360-degree sound, waterproof design, and 12-hour battery life. Perfect for outdoor adventures and home entertainment.",
    features: [
      "360-degree sound",
      "Waterproof (IPX7)",
      "12-hour battery life",
      "Wireless stereo pairing",
      "Built-in microphone",
      "Compact design",
    ],
    specifications: {
      "Output Power": "20W",
      "Battery Life": "12 hours",
      "Water Resistance": "IPX7",
      Weight: "600g",
      Connectivity: "Bluetooth 5.0",
      "Frequency Response": "60Hz - 20kHz",
    },
  },
  4: {
    id: 4,
    name: "Wireless Charging Pad",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.6,
    reviews: 78,
    images: ["/wireless-charging-pad.png", "/wireless-charging-pad.png", "/wireless-charging-pad.png"],
    category: "Electronics",
    brand: "ChargeTech",
    inStock: false,
    stockCount: 0,
    badge: "Hot",
    description:
      "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator and overcharge protection for safe, efficient charging.",
    features: [
      "Fast wireless charging (15W)",
      "Qi-compatible",
      "LED charging indicator",
      "Overcharge protection",
      "Non-slip surface",
      "Ultra-thin design",
    ],
    specifications: {
      "Output Power": "15W max",
      Input: "USB-C",
      Compatibility: "Qi-enabled devices",
      Weight: "150g",
      Dimensions: "100 x 100 x 8mm",
      Safety: "Over-current, over-voltage protection",
    },
  },
  5: {
    id: 5,
    name: "Gaming Mechanical Keyboard",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviews: 203,
    images: ["/gaming-mechanical-keyboard.png", "/gaming-mechanical-keyboard.png", "/gaming-mechanical-keyboard.png"],
    category: "Electronics",
    brand: "GameTech",
    inStock: true,
    stockCount: 18,
    badge: "Gaming",
    description:
      "Professional gaming mechanical keyboard with RGB backlighting, tactile switches, and programmable keys. Built for competitive gaming and productivity.",
    features: [
      "Mechanical tactile switches",
      "RGB backlighting",
      "Programmable keys",
      "Anti-ghosting technology",
      "Detachable USB-C cable",
      "Aluminum frame",
    ],
    specifications: {
      "Switch Type": "Mechanical Tactile",
      Backlighting: "RGB",
      "Key Layout": "Full-size (104 keys)",
      Connection: "USB-C",
      "Polling Rate": "1000Hz",
      Weight: "1.2kg",
    },
  },
  6: {
    id: 6,
    name: "4K Webcam",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.5,
    reviews: 67,
    images: ["/4k-webcam.png", "/4k-webcam.png", "/4k-webcam.png"],
    category: "Electronics",
    brand: "VisionTech",
    inStock: true,
    stockCount: 8,
    badge: "Professional",
    description:
      "Ultra HD 4K webcam with auto-focus, noise-canceling microphone, and wide-angle lens. Perfect for professional video calls, streaming, and content creation.",
    features: [
      "4K Ultra HD recording",
      "Auto-focus technology",
      "Noise-canceling microphone",
      "90-degree field of view",
      "Plug-and-play setup",
      "Privacy shutter",
    ],
    specifications: {
      Resolution: "4K (3840x2160) @ 30fps",
      "Field of View": "90 degrees",
      Focus: "Auto-focus",
      Microphone: "Dual stereo with noise cancellation",
      Connection: "USB 3.0",
      Compatibility: "Windows, Mac, Linux",
    },
  },
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number.parseInt(params.id as string)
  const product = productData[productId as keyof typeof productData]

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    )
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsAddingToCart(false)
    // In real app, would update cart state/context
    alert(`Added ${quantity} ${product.name} to cart!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <span>Home</span>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg shadow-sm border overflow-hidden">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg border-2 overflow-hidden ${
                    selectedImage === index ? "border-amber-500" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.brand}</Badge>
                {product.badge && (
                  <Badge
                    className={
                      product.badge === "Best Seller"
                        ? "bg-amber-500 text-white"
                        : product.badge === "New"
                          ? "bg-green-500 text-white"
                          : product.badge === "Sale"
                            ? "bg-red-500 text-white"
                            : product.badge === "Hot"
                              ? "bg-blue-500 text-white"
                              : product.badge === "Professional"
                                ? "bg-purple-500 text-white"
                                : ""
                    }
                  >
                    {product.badge}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4 text-balance">{product.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "text-amber-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium">{product.rating}</span>
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                <Badge className="bg-green-100 text-green-800">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              </div>

              <p className="text-gray-600 leading-relaxed text-pretty">{product.description}</p>
            </div>

            {/* Quantity and Add to Cart */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Quantity:</span>
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stockCount}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    {product.inStock ? (
                      <span className="text-green-600">✓ In stock ({product.stockCount} available)</span>
                    ) : (
                      <span className="text-red-600">✗ Out of stock</span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                      size="lg"
                      disabled={!product.inStock || isAddingToCart}
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {isAddingToCart ? "Adding..." : "Add to Cart"}
                    </Button>
                    <Button variant="outline" size="lg">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="lg">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Shipping & Returns */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <Truck className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-gray-600">On orders over $50</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <Shield className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                <p className="text-sm font-medium">2 Year Warranty</p>
                <p className="text-xs text-gray-600">Full coverage</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <RotateCcw className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                <p className="text-sm font-medium">30-Day Returns</p>
                <p className="text-xs text-gray-600">No questions asked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-900">{key}:</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <p className="text-gray-600">Reviews functionality coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Shipping Information</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Free standard shipping on orders over $50</li>
                        <li>• Express shipping available for $9.99</li>
                        <li>• Orders processed within 1-2 business days</li>
                        <li>• Delivery time: 3-7 business days</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Returns & Exchanges</h4>
                      <ul className="space-y-1 text-gray-600">
                        <li>• 30-day return policy</li>
                        <li>• Items must be in original condition</li>
                        <li>• Free return shipping on defective items</li>
                        <li>• Refunds processed within 5-7 business days</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
