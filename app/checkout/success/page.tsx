"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for order processing
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase from PITAL MART</p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Details</h2>
              {orderNumber && (
                <p className="text-gray-600">
                  Order Number: <span className="font-medium text-gray-800">#{orderNumber}</span>
                </p>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-green-800 font-medium">Payment Successful</p>
                  <p className="text-green-600 text-sm">Your payment has been processed successfully</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="flex items-center">
                  <Package className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">Order Processing</p>
                    <p className="text-sm text-gray-600">We're preparing your items for shipment</p>
                  </div>
                </div>
                <span className="text-yellow-600 text-sm font-medium">In Progress</span>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• You'll receive an order confirmation email shortly</li>
                  <li>• We'll send you tracking information once your order ships</li>
                  <li>• Your order will be delivered within 5-7 business days</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/account">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Package className="w-4 h-4" />
              View My Orders
            </Button>
          </Link>

          <Link href="/products">
            <Button className="bg-red-600 hover:bg-red-700 flex items-center gap-2">
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Need help? Contact us at support@pitalmart.com or call +91-XXXXXXXXXX</p>
        </div>
      </div>
    </div>
  )
}
