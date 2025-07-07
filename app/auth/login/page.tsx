"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"email" | "otp">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setStep("otp")
      } else {
        setError(data.message || "Failed to send OTP")
      }
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (data.success) {
        router.push("/account")
      } else {
        setError(data.message || "Invalid OTP")
      }
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleShopifyLogin = () => {
    // Redirect to Shopify's Customer Account portal
    window.location.href = `https://shopify.com/${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN?.replace(".myshopify.com", "")}/account`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="flex flex-col items-center">
              <img src="https://i.ibb.co/vvPM0njt/Vector-1.png" alt="Logo Symbol" className="w-8 h-5 mb-2" />
              <h1 className="text-3xl font-lancelot text-[#a22020]">PITAL MART</h1>
            </div>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue shopping</p>
        </div>

        {/* Login Options */}
        <div className="space-y-4">
          {/* Shopify Customer Account Login */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Login</h3>
                <Button
                  onClick={handleShopifyLogin}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 flex items-center justify-center gap-2"
                >
                  Login with Shopify Account
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <p className="text-xs text-gray-500 mt-2">Secure login through Shopify's customer portal</p>
              </div>
            </CardContent>
          </Card>

          {/* Custom OTP Login */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-xl text-gray-800">
                {step === "email" ? "Login with Email" : "Enter OTP"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">
                  {error}
                </div>
              )}

              {step === "email" ? (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-700 hover:bg-red-800 text-white py-3"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOTPSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP sent to {email}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        className="pl-10"
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" onClick={() => setStep("email")} variant="outline" className="flex-1">
                      Back
                    </Button>
                    <Button type="submit" disabled={loading} className="flex-1 bg-red-700 hover:bg-red-800 text-white">
                      {loading ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Continue as Guest */}
        <div className="text-center">
          <Link href="/">
            <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent">
              Continue as Guest
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
