"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"
import { validateIndianPincode, validateIndianPhone, formatIndianPhone } from "@/lib/pincode-api"
import { trackBeginCheckout, trackPurchase } from "@/lib/analytics"
import { Loader2, MapPin, Phone, Mail, User, CreditCard } from "lucide-react"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface ShippingAddress {
  first_name: string
  last_name: string
  address1: string
  address2: string
  city: string
  province: string
  country: string
  zip: string
  phone: string
  email: string
}

export default function CheckoutPage() {
  const { cart, calculateCartTotal, clearCart } = useCart()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [error, setError] = useState("")

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    first_name: "",
    last_name: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    country: "India",
    zip: "",
    phone: "",
    email: "",
  })

  const [customer, setCustomer] = useState<any>(null)
  const cartTotal = calculateCartTotal()

  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart")
      return
    }

    // Load customer data if logged in
    loadCustomerData()

    // Load Razorpay script
    loadRazorpayScript()

    // Track begin checkout
    trackBeginCheckout(
      cart.map((item) => ({
        item_id: item.variantId,
        item_name: item.title,
        category: "Brass Products",
        quantity: item.quantity,
        price: Number.parseFloat(item.price.replace(/[₹,]/g, "")),
      })),
      cartTotal,
    )
  }, [cart, cartTotal])

  const loadCustomerData = async () => {
    try {
      const response = await fetch("/api/customer/profile")
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.customer) {
          setCustomer(data.customer)
          // Pre-fill shipping address with customer data
          setShippingAddress((prev) => ({
            ...prev,
            first_name: data.customer.first_name || "",
            last_name: data.customer.last_name || "",
            email: data.customer.email || "",
            phone: data.customer.phone || "",
            ...(data.customer.default_address && {
              address1: data.customer.default_address.address1 || "",
              address2: data.customer.default_address.address2 || "",
              city: data.customer.default_address.city || "",
              province: data.customer.default_address.province || "",
              zip: data.customer.default_address.zip || "",
              phone: data.customer.default_address.phone || "",
            }),
          }))
        }
      }
    } catch (error) {
      console.error("Error loading customer data:", error)
    }
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handlePincodeChange = async (pincode: string) => {
    handleInputChange("zip", pincode)

    if (validateIndianPincode(pincode)) {
      try {
        const response = await fetch(`/api/pincode?pincode=${pincode}`)
        const data = await response.json()

        if (data.success) {
          setShippingAddress((prev) => ({
            ...prev,
            city: data.data.city,
            province: data.data.state,
            country: data.data.country,
          }))
        }
      } catch (error) {
        console.error("Error fetching pincode data:", error)
      }
    }
  }

  const validateForm = () => {
    const required = ["first_name", "last_name", "address1", "city", "province", "zip", "phone", "email"]

    for (const field of required) {
      if (!shippingAddress[field as keyof ShippingAddress]) {
        setError(`${field.replace("_", " ")} is required`)
        return false
      }
    }

    if (!validateIndianPincode(shippingAddress.zip)) {
      setError("Please enter a valid Indian pincode")
      return false
    }

    if (!validateIndianPhone(shippingAddress.phone)) {
      setError("Please enter a valid Indian phone number")
      return false
    }

    if (!shippingAddress.email.includes("@")) {
      setError("Please enter a valid email address")
      return false
    }

    return true
  }

  const handlePayment = async () => {
    if (!validateForm()) return

    setProcessingPayment(true)
    setError("")

    try {
      // Create Razorpay order
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: cartTotal,
          currency: "INR",
          receipt: `order_${Date.now()}`,
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to create payment order")
      }

      // Prepare Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "PITAL MART",
        description: "Purchase of brass products",
        order_id: orderData.order.id,
        prefill: {
          name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
          email: shippingAddress.email,
          contact: formatIndianPhone(shippingAddress.phone),
        },
        theme: {
          color: "#a22020",
        },
        handler: async (response: any) => {
          await handlePaymentSuccess(response, orderData.order)
        },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      setError(error.message || "Payment failed. Please try again.")
      setProcessingPayment(false)
    }
  }

  const handlePaymentSuccess = async (payment: any, razorpayOrder: any) => {
    try {
      // Prepare order data for Shopify
      const orderData = {
        customer: {
          email: shippingAddress.email,
          first_name: shippingAddress.first_name,
          last_name: shippingAddress.last_name,
          phone: formatIndianPhone(shippingAddress.phone),
        },
        line_items: cart.map((item) => ({
          variant_id: item.variantId,
          quantity: item.quantity,
          price: item.price.replace(/[₹,]/g, ""),
        })),
        shipping_address: {
          ...shippingAddress,
          phone: formatIndianPhone(shippingAddress.phone),
        },
        billing_address: {
          ...shippingAddress,
          phone: formatIndianPhone(shippingAddress.phone),
        },
      }

      // Verify payment and create Shopify order
      const verifyResponse = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment,
          orderData,
        }),
      })

      const verifyData = await verifyResponse.json()

      if (verifyData.success) {
        // Track purchase
        trackPurchase(
          verifyData.order.order_number,
          cart.map((item) => ({
            item_id: item.variantId,
            item_name: item.title,
            category: "Brass Products",
            quantity: item.quantity,
            price: Number.parseFloat(item.price.replace(/[₹,]/g, "")),
          })),
          cartTotal,
        )

        // Clear cart
        clearCart()

        // Redirect to success page
        router.push(`/checkout/success?order=${verifyData.order.order_number}`)
      } else {
        throw new Error(verifyData.message || "Order creation failed")
      }
    } catch (error: any) {
      setError(error.message || "Order processing failed. Please contact support.")
    } finally {
      setProcessingPayment(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <Input
                      value={shippingAddress.first_name}
                      onChange={(e) => handleInputChange("first_name", e.target.value)}
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <Input
                      value={shippingAddress.last_name}
                      onChange={(e) => handleInputChange("last_name", e.target.value)}
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="10-digit mobile number"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                  <Input
                    value={shippingAddress.address1}
                    onChange={(e) => handleInputChange("address1", e.target.value)}
                    placeholder="House/Flat No., Street Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                  <Input
                    value={shippingAddress.address2}
                    onChange={(e) => handleInputChange("address2", e.target.value)}
                    placeholder="Landmark, Area (Optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      value={shippingAddress.zip}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      placeholder="6-digit pincode"
                      className="pl-10"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <Input
                      value={shippingAddress.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <Input
                      value={shippingAddress.province}
                      onChange={(e) => handleInputChange("province", e.target.value)}
                      placeholder="State"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.variantId} className="flex items-center gap-4">
                      <img
                        src={item.image || "/placeholder.svg?height=60&width=60"}
                        alt={item.title}
                        className="w-15 h-15 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.price}</p>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Total</span>
                      <span className="text-xl font-bold text-red-600">{formatPrice(cartTotal)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={processingPayment || loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
                  >
                    {processingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay {formatPrice(cartTotal)}
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm text-gray-500">
                    <p>Secure payment powered by Razorpay</p>
                    <p>We accept UPI, Cards, Net Banking & Wallets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
