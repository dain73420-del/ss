"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PaymentMethods from "@/components/payment-methods"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Truck, Shield, AlertCircle, CheckCircle } from "lucide-react"

// Mock cart data
const cartItems = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 12999, // Updated to BDT pricing
    quantity: 2,
    image: "/premium-wireless-headphones.png",
  },
  {
    id: 2,
    name: "Gaming Mechanical Keyboard",
    price: 6499, // Updated to BDT pricing
    quantity: 1,
    image: "/gaming-mechanical-keyboard.png",
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [shippingMethod, setShippingMethod] = useState("pathao") // Default to Pathao
  const [paymentMethod, setPaymentMethod] = useState("") // No default payment method
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({})
  const [cardType, setCardType] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    division: "",
    postalCode: "",
  })

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const getShippingCost = () => {
    switch (shippingMethod) {
      case "pathao":
        return 60
      case "redx":
        return 80
      case "steadfast":
        return 70
      case "sundarban":
        return 90
      case "sa-paribahan":
        return 50
      case "free-shipping":
        return 0
      default:
        return 60
    }
  }
  const shippingCost = getShippingCost()
  const codCharge = paymentMethod === "cash-on-delivery" ? 100 : 0
  const tax = subtotal * 0.05 // Updated tax rate for Bangladesh (5% VAT)
  const total = subtotal + shippingCost + tax + codCharge

  const detectCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, "")
    if (/^4/.test(number)) return "visa"
    if (/^5[1-5]/.test(number)) return "mastercard"
    if (/^3[47]/.test(number)) return "amex"
    if (/^6/.test(number)) return "discover"
    return ""
  }

  const formatCardNumber = (value: string) => {
    const number = value.replace(/\s/g, "").replace(/[^0-9]/gi, "")
    const matches = number.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return number
    }
  }

  const validateCard = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, "")
    if (number.length < 13 || number.length > 19) return false

    // Luhn algorithm
    let sum = 0
    let isEven = false
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = Number.parseInt(number.charAt(i), 10)
      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      sum += digit
      isEven = !isEven
    }
    return sum % 10 === 0
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    e.target.value = formatted
    setCardType(detectCardType(formatted))

    // Validate card number
    if (formatted.length > 0) {
      const isValid = validateCard(formatted)
      setPaymentErrors((prev) => ({
        ...prev,
        cardNumber: isValid ? "" : "Invalid card number",
      }))
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4)
    }
    e.target.value = value

    // Validate expiry
    if (value.length === 5) {
      const [month, year] = value.split("/")
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear() % 100
      const currentMonth = currentDate.getMonth() + 1

      const expMonth = Number.parseInt(month, 10)
      const expYear = Number.parseInt(year, 10)

      if (expMonth < 1 || expMonth > 12) {
        setPaymentErrors((prev) => ({ ...prev, expiry: "Invalid month" }))
      } else if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        setPaymentErrors((prev) => ({ ...prev, expiry: "Card has expired" }))
      } else {
        setPaymentErrors((prev) => ({ ...prev, expiry: "" }))
      }
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 4)
    e.target.value = value

    // Validate CVV
    const minLength = cardType === "amex" ? 4 : 3
    if (value.length > 0 && value.length < minLength) {
      setPaymentErrors((prev) => ({ ...prev, cvv: `CVV must be ${minLength} digits` }))
    } else {
      setPaymentErrors((prev) => ({ ...prev, cvv: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Validate payment method selection
      if (!paymentMethod) {
        setPaymentErrors((prev) => ({ ...prev, general: "অনুগ্রহ করে একটি পেমেন্ট মেথড নির্বাচন করুন" }))
        setIsProcessing(false)
        return
      }

      // Create order first
      const orderData = {
        items: cartItems,
        shipping: {
          method: shippingMethod,
          cost: shippingCost,
          address: formData,
        },
        payment: {
          method: paymentMethod,
          amount: total,
        },
        subtotal,
        tax,
        total,
      }

      const orderResponse = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      const order = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(order.error || "Order creation failed")
      }

      // Handle different payment methods
      if (paymentMethod === "cash-on-delivery") {
        // For COD, directly confirm the order
        router.push(`/checkout/success?orderId=${order.id}&method=cod`)
      } else if (paymentMethod === "bkash" || paymentMethod === "nagad" || paymentMethod === "rocket") {
        // Redirect to payment gateway
        const paymentResponse = await fetch("/api/payment/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            method: paymentMethod,
            amount: total,
            customerInfo: formData,
          }),
        })

        const paymentData = await paymentResponse.json()

        if (paymentResponse.ok && paymentData.redirectUrl) {
          // Redirect to payment gateway
          window.location.href = paymentData.redirectUrl
        } else {
          throw new Error(paymentData.error || "Payment initiation failed")
        }
      }
    } catch (error) {
      console.error("[v0] Payment processing error:", error)
      setPaymentErrors((prev) => ({
        ...prev,
        general: error instanceof Error ? error.message : "পেমেন্ট প্রক্রিয়াকরণে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      }))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getCardIcon = () => {
    switch (cardType) {
      case "visa":
        return <div className="text-blue-600 font-bold text-xs">VISA</div>
      case "mastercard":
        return <div className="text-red-600 font-bold text-xs">MC</div>
      case "amex":
        return <div className="text-blue-800 font-bold text-xs">AMEX</div>
      case "discover":
        return <div className="text-orange-600 font-bold text-xs">DISC</div>
      default:
        return <CreditCard className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-gray-900">
            Cart
          </Link>
          <span>/</span>
          <span className="text-gray-900">Checkout</span>
        </nav>

        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+880 1XXX-XXXXXX"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="House/Flat, Road, Area"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City/District</Label>
                      <Input
                        id="city"
                        placeholder="e.g., Dhaka, Chittagong"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="division">Division</Label>
                      <Select
                        value={formData.division}
                        onValueChange={(value) => handleInputChange("division", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select division" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dhaka">Dhaka</SelectItem>
                          <SelectItem value="chittagong">Chittagong</SelectItem>
                          <SelectItem value="rajshahi">Rajshahi</SelectItem>
                          <SelectItem value="khulna">Khulna</SelectItem>
                          <SelectItem value="barisal">Barisal</SelectItem>
                          <SelectItem value="sylhet">Sylhet</SelectItem>
                          <SelectItem value="rangpur">Rangpur</SelectItem>
                          <SelectItem value="mymensingh">Mymensingh</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      placeholder="e.g., 1000"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Method - Bangladesh</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="pathao" id="pathao" />
                      <Label htmlFor="pathao" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              Pathao Courier
                              <Badge variant="secondary" className="text-xs">
                                Popular
                              </Badge>
                            </p>
                            <p className="text-sm text-gray-600">Fast delivery within Dhaka (1-2 days)</p>
                          </div>
                          <span className="font-medium">৳60</span>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="redx" id="redx" />
                      <Label htmlFor="redx" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              RedX Delivery
                              <Badge variant="secondary" className="text-xs">
                                Reliable
                              </Badge>
                            </p>
                            <p className="text-sm text-gray-600">Nationwide delivery (2-3 days)</p>
                          </div>
                          <span className="font-medium">৳80</span>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="steadfast" id="steadfast" />
                      <Label htmlFor="steadfast" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">Steadfast Courier</p>
                            <p className="text-sm text-gray-600">Express delivery service (1-3 days)</p>
                          </div>
                          <span className="font-medium">৳70</span>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="free-shipping" id="free-shipping" />
                      <Label htmlFor="free-shipping" className="flex-1 cursor-pointer">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              Free Shipping
                              <Badge className="bg-green-100 text-green-800 text-xs">Save Money</Badge>
                            </p>
                            <p className="text-sm text-gray-600">Orders above ৳2000 (5-7 days)</p>
                          </div>
                          <span className="font-medium text-green-600">FREE</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Methods - Bangladesh
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentErrors.general && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">{paymentErrors.general}</span>
                    </div>
                  )}

                  <PaymentMethods selectedMethod={paymentMethod} onMethodSelect={setPaymentMethod} />

                  {paymentMethod === "cash-on-delivery" && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-800 font-medium mb-2">Cash on Delivery নির্বাচিত:</p>
                      <p className="text-sm text-orange-700">
                        আপনি পণ্য হাতে পাওয়ার পর টাকা পরিশোধ করবেন। ডেলিভারি চার্জ ৳১০০ প্রযোজ্য।
                      </p>
                    </div>
                  )}

                  {/* Mobile Banking Instructions */}
                  {(paymentMethod === "bkash" || paymentMethod === "nagad" || paymentMethod === "rocket") && (
                    <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg">
                      <p className="text-sm text-pink-800 font-medium mb-2">
                        {paymentMethod === "bkash" ? "bKash" : paymentMethod === "nagad" ? "Nagad" : "Rocket"} Payment
                        Instructions:
                      </p>
                      <ol className="text-sm text-pink-700 space-y-1 list-decimal list-inside">
                        <li>You will receive an SMS with payment instructions</li>
                        <li>Dial the provided USSD code or use the mobile app</li>
                        <li>Enter the merchant number and amount</li>
                        <li>Complete payment with your PIN</li>
                      </ol>
                    </div>
                  )}

                  {/* Bank Transfer Instructions */}
                  {paymentMethod === "bank_transfer" && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium mb-2">Bank Transfer Details:</p>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p>
                          <strong>Account Name:</strong> FMOSWEB Limited
                        </p>
                        <p>
                          <strong>Account Number:</strong> 1234567890
                        </p>
                        <p>
                          <strong>Bank:</strong> Dutch-Bangla Bank Limited
                        </p>
                        <p>
                          <strong>Branch:</strong> Dhanmondi, Dhaka
                        </p>
                        <p>
                          <strong>Routing Number:</strong> 090260323
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Card Details Form */}
                  {paymentMethod === "card" && (
                    <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            onChange={handleCardNumberChange}
                            className={`pr-12 ${paymentErrors.cardNumber ? "border-red-500" : ""}`}
                            maxLength={19}
                            required
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">{getCardIcon()}</div>
                        </div>
                        {paymentErrors.cardNumber && (
                          <p className="text-sm text-red-600 mt-1">{paymentErrors.cardNumber}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            onChange={handleExpiryChange}
                            className={paymentErrors.expiry ? "border-red-500" : ""}
                            maxLength={5}
                            required
                          />
                          {paymentErrors.expiry && <p className="text-sm text-red-600 mt-1">{paymentErrors.expiry}</p>}
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder={cardType === "amex" ? "1234" : "123"}
                            onChange={handleCvvChange}
                            className={paymentErrors.cvv ? "border-red-500" : ""}
                            maxLength={4}
                            required
                          />
                          {paymentErrors.cvv && <p className="text-sm text-red-600 mt-1">{paymentErrors.cvv}</p>}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Doe" required />
                      </div>

                      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-800">Your card information is encrypted and secure</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox id="sameAsShipping" checked={sameAsShipping} onCheckedChange={setSameAsShipping} />
                    <Label htmlFor="sameAsShipping">Same as shipping address</Label>
                  </div>

                  {!sameAsShipping && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="billingAddress">Address</Label>
                        <Input id="billingAddress" required />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="billingCity">City/District</Label>
                          <Input id="billingCity" required />
                        </div>
                        <div>
                          <Label htmlFor="billingDivision">Division</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select division" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dhaka">Dhaka</SelectItem>
                              <SelectItem value="chittagong">Chittagong</SelectItem>
                              <SelectItem value="rajshahi">Rajshahi</SelectItem>
                              <SelectItem value="khulna">Khulna</SelectItem>
                              <SelectItem value="barisal">Barisal</SelectItem>
                              <SelectItem value="sylhet">Sylhet</SelectItem>
                              <SelectItem value="rangpur">Rangpur</SelectItem>
                              <SelectItem value="mymensingh">Mymensingh</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="billingPostalCode">Postal Code</Label>
                        <Input id="billingPostalCode" required />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-white rounded border overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-balance">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">৳{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>{shippingCost === 0 ? "FREE" : `৳${shippingCost}`}</span>
                    </div>
                    {paymentMethod === "cash-on-delivery" && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">COD Charge</span>
                        <span>৳{codCharge}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">VAT (5%)</span>
                      <span>৳{Math.round(tax).toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>৳{Math.round(total).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <Shield className="h-5 w-5" />
                    <div>
                      <p className="font-medium text-sm">Secure Checkout</p>
                      <p className="text-xs">Your information is protected with SSL encryption</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </span>
                ) : (
                  /* Updated button text with BDT currency */
                  `Place Order - ৳${Math.round(total).toLocaleString()}`
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
