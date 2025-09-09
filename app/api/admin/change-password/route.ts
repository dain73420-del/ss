import { type NextRequest, NextResponse } from "next/server"
import { changeAdminPassword } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const { email, oldPassword, newPassword } = await request.json()

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json(
        {
          message: "Email, old password, and new password are required",
        },
        { status: 400 },
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          message: "New password must be at least 6 characters long",
        },
        { status: 400 },
      )
    }

    // Change password
    const success = changeAdminPassword(email, oldPassword, newPassword)

    if (!success) {
      return NextResponse.json(
        {
          message: "Invalid email or old password",
        },
        { status: 401 },
      )
    }

    return NextResponse.json({
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("[v0] Password change error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
