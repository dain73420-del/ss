import { type NextRequest, NextResponse } from "next/server"

const orders: any[] = []

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Create order object
    const order = {
      id: orderId,
      ...orderData,
      status: "pending",
      createdAt: new Date().toISOString(),
      paymentStatus: orderData.payment.method === "cash-on-delivery" ? "cod" : "pending",
    }

    // Store order
    orders.push(order)

    return NextResponse.json({
      success: true,
      id: orderId,
      message: "অর্ডার সফলভাবে তৈরি হয়েছে",
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "অর্ডার তৈরিতে সমস্যা হয়েছে" }, { status: 500 })
  }
}
