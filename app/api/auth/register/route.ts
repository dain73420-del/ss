import { type NextRequest, NextResponse } from "next/server"
import { users, otpStore, sendSMS, generateOTP } from "@/lib/auth-storage"

export async function POST(request: NextRequest) {
  try {
    const { name, mobile, password } = await request.json()

    // Validate input
    if (!name || !mobile || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    const mobileRegex = /^01[3-9]\d{8}$/
    if (!mobileRegex.test(mobile)) {
      return NextResponse.json(
        { message: "Please enter a valid Bangladesh mobile number (01XXXXXXXXX)" },
        { status: 400 },
      )
    }

    // Check if mobile number already exists
    const existingUser = users.find((user) => user.mobile === mobile)
    if (existingUser) {
      return NextResponse.json({ message: "Mobile number already registered" }, { status: 400 })
    }

    // Generate OTP
    const otp = generateOTP()
    const expires = Date.now() + 5 * 60 * 1000 // 5 minutes

    // Store user data temporarily (until OTP verification)
    const tempUser = {
      name,
      mobile,
      password, // In production, hash this password
      verified: false,
      createdAt: new Date().toISOString(),
    }

    // Store OTP
    otpStore[mobile] = { otp, expires, verified: false }

    const smsMessage = `আপনার ভেরিফিকেশন কোড: ${otp}। ৫ মিনিটের জন্য বৈধ।`
    await sendSMS(mobile, smsMessage)

    // Add user to temporary storage
    users.push(tempUser)

    return NextResponse.json({
      message: "Registration successful. OTP sent to your mobile.",
      mobile,
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
