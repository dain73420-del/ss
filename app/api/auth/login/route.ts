import { type NextRequest, NextResponse } from "next/server"
import { users } from "@/lib/auth-storage"

export async function POST(request: NextRequest) {
  try {
    const { mobile, password } = await request.json()

    if (!mobile || !password) {
      return NextResponse.json({ message: "Mobile number and password are required" }, { status: 400 })
    }

    // Find user
    const user = users.find((u) => u.mobile === mobile)
    if (!user) {
      return NextResponse.json({ message: "Invalid mobile number or password" }, { status: 401 })
    }

    // Check if account is verified
    if (!user.verified) {
      return NextResponse.json({ message: "Please verify your account first" }, { status: 401 })
    }

    // Verify password (in production, compare hashed passwords)
    if (user.password !== password) {
      return NextResponse.json({ message: "Invalid mobile number or password" }, { status: 401 })
    }

    // Login successful
    return NextResponse.json({
      message: "Login successful",
      user: {
        name: user.name,
        mobile: user.mobile,
        verified: user.verified,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
