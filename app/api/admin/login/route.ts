import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminCredentials } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Verify admin credentials
    const admin = verifyAdminCredentials(email, password)

    if (!admin) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Login successful
    return NextResponse.json({
      message: "Admin login successful",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error("[v0] Admin login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
