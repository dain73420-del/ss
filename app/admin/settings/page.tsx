"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Settings, Key } from "lucide-react"

export default function AdminSettingsPage() {
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      alert("নতুন পাসওয়ার্ড মিলছে না")
      return
    }

    if (formData.newPassword.length < 6) {
      alert("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে")
        setFormData({
          email: "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        alert(data.message || "পাসওয়ার্ড পরিবর্তন ব্যর্থ")
      }
    } catch (error) {
      console.error("[v0] Password change error:", error)
      alert("পাসওয়ার্ড পরিবর্তন ব্যর্থ। আবার চেষ্টা করুন।")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Settings className="h-8 w-8 text-amber-600" />
          অ্যাডমিন সেটিংস
        </h1>
        <p className="text-gray-600 mt-2">আপনার অ্যাকাউন্ট সেটিংস পরিচালনা করুন</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-amber-600" />
              পাসওয়ার্ড পরিবর্তন
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">অ্যাডমিন ইমেইল</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@fmosweb.com"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="oldPassword">বর্তমান পাসওয়ার্ড</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showPasswords.old ? "text" : "password"}
                    placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                    value={formData.oldPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, oldPassword: e.target.value }))}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("old")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword">নতুন পাসওয়ার্ড</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="নতুন পাসওয়ার্ড লিখুন (কমপক্ষে ৬ অক্ষর)"
                    value={formData.newPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">নতুন পাসওয়ার্ড নিশ্চিত করুন</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="নতুন পাসওয়ার্ড আবার লিখুন"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={isLoading}>
                {isLoading ? "পরিবর্তন করা হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
