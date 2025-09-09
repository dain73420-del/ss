import { type NextRequest, NextResponse } from "next/server"
import { otpStore, sendSMS, generateOTP } from "@/lib/auth-storage"

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json()

    if (!mobile) {
      return NextResponse.json({ message: "Mobile number is required" }, { status: 400 })
    }

    // Generate new OTP
    const otp = generateOTP()
    const expires = Date.now() + 5 * 60 * 1000 // 5 minutes

    // Update OTP store
    otpStore[mobile] = { otp, expires, verified: false }

    const smsMessage = `আপনার নতুন ভেরিফিকেশন কোড: ${otp}। ৫ মিনিটের জন্য বৈধ।`
    await sendSMS(mobile, smsMessage)

    return NextResponse.json({
      message: "New OTP sent successfully",
    })
  } catch (error) {
    console.error("[v0] Resend OTP error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
