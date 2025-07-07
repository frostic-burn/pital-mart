"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Mail, CheckCircle } from "lucide-react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await register(email)
      setSuccess(true)
    } catch (error: any) {
      setError(error.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a verification link to <strong>{email}</strong>. Please check your email and click the link
                to verify your account.
              </p>
              <div className="space-y-4">
                <Button onClick={() => setSuccess(false)} variant="outline" className="w-full">
                  Try Different Email
                </Button>
                <Link href="/auth/login">
                  <Button className="w-full bg-red-700 hover:bg-red-800 text-white">Back to Login</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">Join our community of brass utensil enthusiasts</p>
        </div>

        {/* Registration Form */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-xl text-gray-800">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>
              )}

              {/* Email Field */}
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
                    placeholder="Enter your email address"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  We'll send you a verification link to complete your registration
                </p>
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={loading} className="w-full bg-red-700 hover:bg-red-800 text-white py-3">
                {loading ? "Sending verification email..." : "Continue"}
              </Button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-red-700 hover:text-red-800 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

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
