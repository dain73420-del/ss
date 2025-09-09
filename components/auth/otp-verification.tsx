"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertCircle } from "lucide-react"

interface OTPVerificationProps {
  mobile: string
  onVerificationSuccess: () => void
  onBack: () => void
}

export default function OTPVerification({ mobile, onVerificationSuccess, onBack }: OTPVerificationProps) {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resending, setResending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, otp }),
      })

      const data = await response.json()

      if (response.ok) {
        onVerificationSuccess()
      } else {
        setError(data.message || "Invalid OTP")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setResending(true)
    setError("")

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      })

      if (response.ok) {
        setError("")
        // Show success message briefly
      } else {
        const data = await response.json()
        setError(data.message || "Failed to resend OTP")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setResending(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Shield className="h-12 w-12 text-amber-600 mx-auto mb-2" />
        <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
        <CardDescription>Enter the 4-digit code sent to {mobile}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="otp">OTP Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 4-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="text-center text-2xl tracking-widest"
              maxLength={4}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading || otp.length !== 4}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resending}
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                {resending ? "Resending..." : "Resend OTP"}
              </button>
            </p>
            <button type="button" onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700">
              Back to Registration
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
