"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, X, ShoppingBag, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, loading, totalPrice } = useCart()
  const [promoCode, setPromoCode] = useState("")

  const subtotal = totalPrice || 0
  const bagDiscount = Math.floor(subtotal * 0.1) // 10% discount
  const deliveryCharges = subtotal > 2000 ? 0 : 70
  const total = subtotal - bagDiscount + deliveryCharges

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-red-800 text-white py-8 rounded-b-3xl">
        <div className="container mx-auto px-8">
          <div className="text-center">
            <p className="text-sm mb-2">Hello User!</p>
            <h1 className="text-3xl font-lancelot">Your Cart Is Ready</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <div className="container mx-auto px-8 max-w-6xl">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-lancelot text-gray-800 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Add some beautiful brass items to your cart and start shopping.</p>
              <Link href="/products">
                <Button className="bg-red-700 hover:bg-red-800 text-white px-8 py-3">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left Column - Cart Items */}
              <div className="lg:col-span-3">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                      <div className="flex items-center space-x-6">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 relative">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={`${item.title} in shopping cart`}
                            fill
                            className="object-cover rounded-xl"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="font-lancelot text-lg text-gray-800 mb-3">{item.title}</h3>

                          {/* Quantity and Size Controls */}
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0 hover:bg-gray-100"
                                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="mx-3 text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0 hover:bg-gray-100"
                                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            
                            <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                              <option>Medium</option>
                              <option>Small</option>
                              <option>Large</option>
                            </select>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-semibold text-gray-800">
                              ₹{(Number.parseFloat(item.price.replace(/[₹,]/g, "")) * item.quantity).toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">MRP ₹{Number.parseFloat(item.price.replace(/[₹,]/g, "")).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => removeItem(item.variantId)}
                          aria-label={`Remove ${item.title} from cart`}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Address and Order Summary */}
              <div className="lg:col-span-2 space-y-6">
                {/* Address Section */}
                <Card className="bg-amber-50 border-amber-200 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Use This Address:
                    </h3>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="text-sm text-gray-700">
                        <p className="font-medium">House No.85, Tower No.- 42, 7th Floor,</p>
                        <p>Sandwoods Colony, Mathili, Punjab,</p>
                        <p>148307</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card className="bg-white shadow-sm border border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 text-center">ORDER SUMMARY</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Bag MRP ({cartItems.length} Item{cartItems.length !== 1 ? "s" : ""})
                        </span>
                        <span className="text-gray-800">₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bag Discount</span>
                        <span className="text-green-600">₹{bagDiscount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount</span>
                        <span className="text-orange-600">₹200.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Charges</span>
                        <span className="text-gray-800">₹{deliveryCharges.toLocaleString()}</span>
                      </div>
                      {subtotal < 2000 && (
                        <p className="text-xs text-gray-500">
                          Add ₹{(2000 - subtotal).toLocaleString()} more for free delivery
                        </p>
                      )}
                      <div className="border-t pt-3">
                        <div className="flex justify-between font-bold text-lg">
                          <span className="text-gray-800">YOU PAY:</span>
                          <span className="text-gray-800">₹{total.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-right">MRP ₹{subtotal.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-6 bg-red-800 hover:bg-red-900 text-white py-3 rounded-2xl font-lancelot text-lg">
                      Proceed Order
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}