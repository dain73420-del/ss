import { type NextRequest, NextResponse } from "next/server"
import { users, otpStore } from "@/lib/auth-storage"

export async function POST(request: NextRequest) {
  try {
    const { mobile, otp } = await request.json()

    if (!mobile || !otp) {
      return NextResponse.json({ message: "Mobile number and OTP are required" }, { status: 400 })
    }

    // Check if OTP exists and is valid
    const storedOTP = otpStore[mobile]
    if (!storedOTP) {
      return NextResponse.json({ message: "No OTP found for this mobile number" }, { status: 400 })
    }

    // Check if OTP has expired
    if (Date.now() > storedOTP.expires) {
      delete otpStore[mobile]
      return NextResponse.json({ message: "OTP has expired. Please request a new one." }, { status: 400 })
    }

    // Verify OTP
    if (storedOTP.otp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 })
    }

    // Find and activate user
    const userIndex = users.findIndex((user) => user.mobile === mobile)
    if (userIndex === -1) {
      return NextResponse.json({ message: "User not found" }, { status: 400 })
    }

    // Mark user as verified
    users[userIndex].verified = true
    users[userIndex].verifiedAt = new Date().toISOString()

    // Mark OTP as used
    otpStore[mobile].verified = true

    // Clean up OTP
    delete otpStore[mobile]

    return NextResponse.json({
      message: "Account verified successfully",
      user: {
        name: users[userIndex].name,
        mobile: users[userIndex].mobile,
        verified: true,
      },
    })
  } catch (error) {
    console.error("[v0] OTP verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
