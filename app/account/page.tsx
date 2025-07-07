"use client"

import { useState, useEffect } from "react"
import { User, Package, Heart, LogOut, Edit2, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/contexts/cart-context"

interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  created_at: string
  addresses: Address[]
  default_address: Address | null
}

interface Address {
  id: string
  first_name: string
  last_name: string
  address1: string
  address2: string
  city: string
  province: string
  country: string
  zip: string
  phone: string
  default: boolean
}

interface Order {
  id: string
  order_number: string
  created_at: string
  total_price: string
  financial_status: string
  fulfillment_status: string
  line_items: Array<{
    title: string
    quantity: number
    price: string
  }>
}

export default function AccountPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  })

  const router = useRouter()
  const { items: cart, wishlistItems, removeFromWishlist, addItem } = useCart()

  useEffect(() => {
    loadCustomerData()
  }, [])

  const loadCustomerData = async () => {
    try {
      setIsLoading(true)

      // Load customer profile
      const profileResponse = await fetch("/api/customer/profile")
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        if (profileData.success) {
          setCustomer(profileData.customer)
          setProfileData({
            first_name: profileData.customer.first_name || "",
            last_name: profileData.customer.last_name || "",
            phone: profileData.customer.phone || "",
          })
        }
      }

      // Load customer orders
      const ordersResponse = await fetch("/api/customer/orders")
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        if (ordersData.success) {
          setOrders(ordersData.orders)
        }
      }
    } catch (error) {
      console.error("Error loading customer data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setCustomer(data.customer)
          setIsEditing(false)
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? Number.parseFloat(price) : price
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(numPrice)
  }

  const handleAddToCartFromWishlist = (item: any) => {
    addItem(item.variantId, 1, {
      productId: item.productId,
      variantId: item.variantId,
      title: item.title,
      price: item.price,
      image: item.image,
      handle: item.handle,
    })
  }

  // Profile Tab Component
  const ProfileTab = () => (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        <Button onClick={() => setIsEditing(!isEditing)} variant="outline" className="flex items-center gap-2">
          {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">First Name</label>
          <Input
            value={profileData.first_name}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
            disabled={!isEditing}
            className="bg-transparent border-b border-gray-400 focus:border-red-600"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Last Name</label>
          <Input
            value={profileData.last_name}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
            disabled={!isEditing}
            className="bg-transparent border-b border-gray-400 focus:border-red-600"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
          <Input
            type="tel"
            value={profileData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            disabled={!isEditing}
            className="bg-transparent border-b border-gray-400 focus:border-red-600"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email Address</label>
          <Input
            type="email"
            value={customer?.email || ""}
            disabled
            className="bg-transparent border-b border-gray-400 text-gray-600"
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Addresses</h3>
        {customer?.addresses?.map((address, index) => (
          <Card key={index} className="mb-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">
                    {address.first_name} {address.last_name}
                  </p>
                  <p className="text-gray-600">{address.address1}</p>
                  {address.address2 && <p className="text-gray-600">{address.address2}</p>}
                  <p className="text-gray-600">
                    {address.city}, {address.province} {address.zip}
                  </p>
                  <p className="text-gray-600">{address.country}</p>
                  {address.phone && <p className="text-gray-600">{address.phone}</p>}
                </div>
                {address.default && <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Default</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isEditing && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleProfileUpdate}
            className="px-8 py-3 bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  )

  // Orders Tab Component
  const OrdersTab = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Order Date:</p>
                  <p className="text-gray-800 font-medium">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 text-sm">Order ID:</p>
                  <p className="text-gray-800 font-medium">#{order.order_number}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-800 font-medium mb-1">{order.line_items?.length || 0} items</p>
                  <p className="text-gray-600 text-sm mb-1">Status: {order.fulfillment_status || "Processing"}</p>
                  <p className="text-gray-800 font-medium">{formatPrice(order.total_price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.fulfillment_status === "fulfilled"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.fulfillment_status === "fulfilled" ? "Delivered" : "Processing"}
                  </span>
                  <Button size="sm" variant="outline">
                    <Package className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-8">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders found</p>
            <Button onClick={() => router.push("/products")} className="mt-4 bg-red-600 hover:bg-red-700">
              Start Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  // Wishlist Tab Component
  const WishlistTab = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <Card key={item.productId}>
            <CardContent className="p-4">
              <div className="relative mb-3">
                <img
                  src={item.image || "/placeholder.svg?height=200&width=200"}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  onClick={() => removeFromWishlist(item.productId)}
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 w-6 h-6 p-0 bg-white hover:bg-gray-100 shadow-md"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
              <h3 className="text-gray-800 font-medium text-sm mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-gray-800 font-bold mb-3">{formatPrice(item.price)}</p>
              <Button
                onClick={() => handleAddToCartFromWishlist(item)}
                className="w-full bg-red-600 hover:bg-red-700"
                size="sm"
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {wishlistItems.length === 0 && (
        <div className="text-center py-8">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Your wishlist is empty</p>
          <Button onClick={() => router.push("/products")} className="mt-4 bg-red-600 hover:bg-red-700">
            Browse Products
          </Button>
        </div>
      )}
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EEEAE1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#EEEAE1] p-6">
      <div className="max-w-6xl mx-auto bg-gray-200 rounded-lg shadow-lg overflow-hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-80 bg-gray-300 p-6">
            <div className="space-y-4">
              <div className={`border-l-4 ${activeTab === "profile" ? "border-red-600" : "border-transparent"} pl-4`}>
                <button
                  className={`font-medium text-left w-full flex items-center gap-2 ${
                    activeTab === "profile" ? "text-gray-800" : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="w-4 h-4" />
                  My Profile
                </button>
              </div>

              <div className={`border-l-4 ${activeTab === "orders" ? "border-red-600" : "border-transparent"} pl-4`}>
                <button
                  className={`font-medium text-left w-full flex items-center gap-2 ${
                    activeTab === "orders" ? "text-gray-800" : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <Package className="w-4 h-4" />
                  My Orders
                </button>
              </div>

              <div className={`border-l-4 ${activeTab === "wishlist" ? "border-red-600" : "border-transparent"} pl-4`}>
                <button
                  className={`font-medium text-left w-full flex items-center gap-2 ${
                    activeTab === "wishlist" ? "text-gray-800" : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("wishlist")}
                >
                  <Heart className="w-4 h-4" />
                  My Wishlist
                </button>
              </div>

              <div className="pl-4">
                <button
                  onClick={handleLogout}
                  className="text-gray-600 font-medium text-left w-full flex items-center gap-2 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "wishlist" && <WishlistTab />}
          </div>
        </div>
      </div>
    </div>
  )
}
