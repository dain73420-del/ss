"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  Edit,
  Save,
  X,
  Bot,
  Sparkles,
  MessageSquare,
  ShoppingCart,
} from "lucide-react"

// Mock user data
const mockUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
  },
  joinDate: "January 2024",
}

// Mock order data
const mockOrders = [
  {
    id: "FMOS123456",
    date: "2024-01-15",
    status: "Delivered",
    total: 758.97,
    items: [
      { name: "Premium Wireless Headphones", quantity: 2, price: 299.99 },
      { name: "Gaming Mechanical Keyboard", quantity: 1, price: 149.99 },
    ],
  },
  {
    id: "FMOS123457",
    date: "2024-01-10",
    status: "Processing",
    total: 299.99,
    items: [
      { name: "Wireless Mouse", quantity: 1, price: 79.99 },
      { name: "USB-C Hub", quantity: 1, price: 49.99 },
    ],
  },
]

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState(mockUser)
  const [aiPreferences, setAiPreferences] = useState({
    personalizedRecommendations: true,
    aiChatAssistant: true,
    smartSearch: true,
    priceAlerts: false,
    autoReorder: false,
  })

  const handleSave = () => {
    // In real app, would save to backend
    console.log("[v0] Saving user info:", userInfo)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setUserInfo(mockUser)
    setIsEditing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <p className="text-gray-600">Manage your account settings and view your orders</p>
          </div>
          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <p className="text-sm text-gray-600">Update your personal details</p>
                </div>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} className="bg-amber-600 hover:bg-amber-700">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userInfo.firstName}
                      onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userInfo.lastName}
                      onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Address</h3>
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={userInfo.address.street}
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          address: { ...userInfo.address, street: e.target.value },
                        })
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={userInfo.address.city}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            address: { ...userInfo.address, city: e.target.value },
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={userInfo.address.state}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            address: { ...userInfo.address, state: e.target.value },
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={userInfo.address.zipCode}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            address: { ...userInfo.address, zipCode: e.target.value },
                          })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order History
                </CardTitle>
                <p className="text-sm text-gray-600">View and track your orders</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <Card key={order.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">Order #{order.id}</h3>
                            <p className="text-sm text-gray-600">
                              Placed on {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                            <p className="text-lg font-bold mt-1">${order.total.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>
                                {item.name} (x{item.quantity})
                              </span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Track Order
                          </Button>
                          {order.status === "Delivered" && (
                            <Button variant="outline" size="sm">
                              Reorder
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  My Wishlist
                </CardTitle>
                <p className="text-sm text-gray-600">Items you've saved for later</p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-600 mb-4">Save items you love to buy them later</p>
                  <Link href="/products">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white">Start Shopping</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Assistant Tab */}
          <TabsContent value="ai-assistant" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  AI Shopping Assistant
                </CardTitle>
                <p className="text-sm text-gray-600">Personalize your AI-powered shopping experience</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-blue-100 bg-blue-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold">Smart Recommendations</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Get personalized product suggestions based on your preferences and shopping history
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Enable Recommendations</span>
                        <Switch
                          checked={aiPreferences.personalizedRecommendations}
                          onCheckedChange={(checked) =>
                            setAiPreferences({ ...aiPreferences, personalizedRecommendations: checked })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-green-100 bg-green-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold">AI Chat Assistant</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Get instant help with product questions, order tracking, and shopping advice
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Enable Chat Assistant</span>
                        <Switch
                          checked={aiPreferences.aiChatAssistant}
                          onCheckedChange={(checked) =>
                            setAiPreferences({ ...aiPreferences, aiChatAssistant: checked })
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-100 bg-purple-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Settings className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold">Smart Search</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Enhanced search with AI understanding of natural language queries
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Enable Smart Search</span>
                        <Switch
                          checked={aiPreferences.smartSearch}
                          onCheckedChange={(checked) => setAiPreferences({ ...aiPreferences, smartSearch: checked })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-100 bg-orange-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <ShoppingCart className="h-5 w-5 text-orange-600" />
                        <h3 className="font-semibold">Smart Shopping</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        AI-powered price alerts and automatic reordering for your favorite items
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Price Drop Alerts</span>
                          <Switch
                            checked={aiPreferences.priceAlerts}
                            onCheckedChange={(checked) => setAiPreferences({ ...aiPreferences, priceAlerts: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Auto Reorder</span>
                          <Switch
                            checked={aiPreferences.autoReorder}
                            onCheckedChange={(checked) => setAiPreferences({ ...aiPreferences, autoReorder: checked })}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-600" />
                    AI Assistant Status
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Your AI assistant is learning your preferences to provide better recommendations
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat with AI Assistant
                    </Button>
                    <Button variant="outline">View AI Insights</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
                <p className="text-sm text-gray-600">Manage your account preferences</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive order updates and promotions</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-600">Get text updates for your orders</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Security</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-gray-600">Update your account password</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Account Actions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Download Your Data</p>
                        <p className="text-sm text-gray-600">Get a copy of your account data</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-600">Delete Account</p>
                        <p className="text-sm text-gray-600">Permanently delete your account</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
