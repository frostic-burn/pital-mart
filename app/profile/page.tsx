"use client"

import { useState, useEffect } from "react"
import { Mail, User, Package, Heart, LogOut, Edit2, Check, X } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { toast } from "react-toastify"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

const ProfilePage = () => {
  const { wishlistItems, removeFromWishlist, addItem } = useCart()
  const { user, loading: authLoading, updateProfile, logout } = useAuth()
  const router = useRouter()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Email verification state
  const [emailVerificationData, setEmailVerificationData] = useState({
    email: "",
    otp: "",
    isVerified: false,
    otpSent: false,
  })

  // User profile data
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    addresses: [],
    defaultAddress: null,
  })

  // Address form state
  const [addressForm, setAddressForm] = useState({
    address1: "",
    address2: "",
    city: "",
    province: "",
    country: "India",
    zip: "",
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    isDefault: false,
  })

  // Mock orders data
  const [orders, setOrders] = useState([
    {
      id: "1",
      order_number: "PM-001",
      created_at: "2024-01-15T10:30:00Z",
      total_price: 2450,
      fulfillment_status: "fulfilled",
      line_items: [
        {
          title: "Brass Singing Harmony Bowls",
          quantity: 1,
          price: 1200,
        },
      ],
    },
    {
      id: "2",
      order_number: "PM-002",
      created_at: "2024-01-10T14:20:00Z",
      total_price: 1850,
      fulfillment_status: "processing",
      line_items: [
        {
          title: "Brass Thal Gold Plated",
          quantity: 2,
          price: 925,
        },
      ],
    },
  ])

  // Mock Shopify Customer API calls
  const shopifyCustomerAPI = {
    // Check if customer is authenticated
    isAuthenticated: async () => {
      try {
        const response = await fetch("/api/customer/session", {
          credentials: "include",
        })
        return response.ok
      } catch (error) {
        return false
      }
    },

    // Get customer data
    getCustomer: async () => {
      try {
        const response = await fetch("/api/customer", {
          credentials: "include",
        })
        if (response.ok) {
          return await response.json()
        }
        return null
      } catch (error) {
        console.error("Error fetching customer:", error)
        return null
      }
    },

    // Send email verification
    sendEmailVerification: async (email: string) => {
      try {
        const response = await fetch("/api/customer/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
        return response.ok
      } catch (error) {
        console.error("Error sending verification:", error)
        return false
      }
    },

    // Verify email OTP
    verifyEmailOTP: async (email: string, otp: string) => {
      try {
        const response = await fetch("/api/customer/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        })
        return response.ok
      } catch (error) {
        console.error("Error verifying OTP:", error)
        return false
      }
    },

    // Update customer profile
    updateProfile: async (data: any) => {
      try {
        const response = await fetch("/api/customer/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        return response.ok
      } catch (error) {
        console.error("Error updating profile:", error)
        return false
      }
    },

    // Get customer orders
    getOrders: async () => {
      try {
        const response = await fetch("/api/customer/orders", {
          credentials: "include",
        })
        if (response.ok) {
          return await response.json()
        }
        return []
      } catch (error) {
        console.error("Error fetching orders:", error)
        return []
      }
    },

    // Get wishlist items (using metafields)
    getWishlist: async () => {
      try {
        const response = await fetch("/api/customer/wishlist", {
          credentials: "include",
        })
        if (response.ok) {
          return await response.json()
        }
        return []
      } catch (error) {
        console.error("Error fetching wishlist:", error)
        return []
      }
    },
  }

  // Initialize component
  useEffect(() => {
    initializeProfile()
  }, [])

  const initializeProfile = async () => {
    setIsLoading(true)

    // Check if user is authenticated via auth context
    if (!authLoading && user) {
      setIsAuthenticated(true)
      await loadUserData()
    } else if (!authLoading && !user) {
      setShowEmailVerification(true)
    }

    setIsLoading(false)
  }

  const loadUserData = async () => {
    try {
      if (user) {
        setProfileData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
          dateOfBirth: "",
          addresses: user.addresses || [],
          defaultAddress: null,
        })
      }

      // Load orders from mock data for now
      setOrders(orders)
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const handleEmailSubmit = async () => {
    const success = await shopifyCustomerAPI.sendEmailVerification(emailVerificationData.email)
    if (success) {
      setEmailVerificationData((prev) => ({ ...prev, otpSent: true }))
    }
  }

  const handleOTPVerification = async () => {
    const success = await shopifyCustomerAPI.verifyEmailOTP(emailVerificationData.email, emailVerificationData.otp)

    if (success) {
      setEmailVerificationData((prev) => ({ ...prev, isVerified: true }))
      setShowEmailVerification(false)
      setIsAuthenticated(true)
      await loadUserData()
    }
  }

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(profileData)
      setIsEditing(false)
      await loadUserData()
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddressUpdate = (address: any) => {
    setAddressForm(address)
  }

  const saveAddress = async () => {
    // Implementation for saving address to Shopify
    console.log("Saving address:", addressForm)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = (item: any) => {
    addItem(item.variantId, 1, {
      productId: item.productId,
      variantId: item.variantId,
      title: item.title,
      price: item.price,
      image: item.image,
      handle: item.handle,
    })
    toast.success(`${item.title} added to cart!`)
  }

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      await logout()
      router.push("/")
    }
  }

  // Email Verification Modal
  const EmailVerificationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter Your Email</h2>
          <p className="text-gray-600">
            {emailVerificationData.otpSent ? "Enter the OTP sent to your email" : "Already have an account? Sign In"}
          </p>
        </div>
        {!emailVerificationData.otpSent ? (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="xyz@gmail.com"
              value={emailVerificationData.email}
              onChange={(e) =>
                setEmailVerificationData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="text-center text-sm text-gray-600">I agree to the T&C of the Privacy Policy</div>
            <button
              onClick={handleEmailSubmit}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Generate OTP
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={emailVerificationData.otp}
              onChange={(e) =>
                setEmailVerificationData((prev) => ({
                  ...prev,
                  otp: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleOTPVerification}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </div>
  )

  // Profile Tab Component
  const ProfileTab = () => (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">First Name</label>
          <input
            type="text"
            value={profileData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 bg-transparent border-b border-gray-400 focus:border-red-600 focus:outline-none disabled:text-gray-600"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Last Name</label>
          <input
            type="text"
            value={profileData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 bg-transparent border-b border-gray-400 focus:border-red-600 focus:outline-none disabled:text-gray-600"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 bg-transparent border-b border-gray-400 focus:border-red-600 focus:outline-none disabled:text-gray-600"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email Address</label>
          <input
            type="email"
            value={profileData.email}
            disabled
            className="w-full px-3 py-2 bg-transparent border-b border-gray-400 focus:outline-none text-gray-600"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
          <input
            type="date"
            value={profileData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 bg-transparent border-b border-gray-400 focus:border-red-600 focus:outline-none disabled:text-gray-600"
          />
        </div>
      </div>
      {/* Address Section */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Addresses</h3>
        {profileData.addresses.map((address: any, index: number) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
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
          </div>
        ))}
      </div>
      {isEditing && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleProfileUpdate}
            className="px-8 py-3 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Changes
          </button>
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
          <div key={order.id} className="bg-white rounded-lg p-6 shadow-sm border">
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
                <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                  <Package className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Wishlist Tab Component
  const WishlistTab = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="relative mb-3">
              <Image
                src={item.image || "/placeholder.svg?height=200&width=200"}
                alt={item.title}
                width={200}
                height={200}
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => removeFromWishlist(item.productId)}
                className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <h3 className="text-gray-800 font-medium text-sm mb-2 line-clamp-2">{item.title}</h3>
            <p className="text-gray-800 font-bold mb-3">{item.price}</p>
            <button
              onClick={() => handleAddToCart(item)}
              className="w-full py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      {wishlistItems.length === 0 && (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-4">Save items you love to your wishlist</p>
          <Link href="/products">
            <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Browse Products
            </button>
          </Link>
        </div>
      )}
    </div>
  )

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-[#EEEAE1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#EEEAE1] p-6">
      {showEmailVerification && <EmailVerificationModal />}

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
                  className="text-gray-600 font-medium text-left w-full flex items-center gap-2 hover:text-red-600 transition-colors"
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

export default ProfilePage
