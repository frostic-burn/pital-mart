"use client"

// Types
export interface Product {
  id: string
  title: string
  handle: string
  description: string
  images: Array<{
    url: string
    altText: string | null
  }>
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
    maxVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  variants: Array<{
    id: string
    title: string
    availableForSale: boolean
    quantityAvailable?: number
    priceV2: {
      amount: string
      currencyCode: string
    }
    compareAtPriceV2?: {
      amount: string
      currencyCode: string
    }
    selectedOptions?: Array<{
      name: string
      value: string
    }>
  }>
  availableForSale: boolean
  totalInventory?: number
  tags: string[]
  productType: string
  vendor: string
  createdAt?: string
  updatedAt?: string
  metafields?: Array<{
    key: string
    value: string
  }>
}

export interface CartItem {
  id: string
  productId: string
  variantId: string
  title: string
  price: string
  image: string
  handle: string
  quantity: number
}

export interface WishlistItem {
  productId: string
  variantId: string
  title: string
  price: string
  image: string
  handle: string
}

// Utility Functions
export function formatPrice(amount: string | number, currencyCode = "INR"): string {
  const numericAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount

  if (isNaN(numericAmount)) {
    return "₹0"
  }

  if (currencyCode === "INR") {
    return `₹${numericAmount.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericAmount)
}

// Local Storage Functions
export function getLocalCart(): CartItem[] {
  if (typeof window === "undefined") return []
  try {
    const cart = localStorage.getItem("pitalmart_cart")
    return cart ? JSON.parse(cart) : []
  } catch (error) {
    console.error("Error getting local cart:", error)
    return []
  }
}

export function setLocalCart(cart: CartItem[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem("pitalmart_cart", JSON.stringify(cart))
    // Dispatch custom event for cart updates
    window.dispatchEvent(new CustomEvent("cart-updated", { detail: cart }))
  } catch (error) {
    console.error("Error setting local cart:", error)
  }
}

export function addToLocalCart(item: CartItem): void {
  const cart = getLocalCart()
  const existingItemIndex = cart.findIndex((cartItem) => cartItem.variantId === item.variantId)

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += item.quantity
  } else {
    cart.push(item)
  }

  setLocalCart(cart)
}

export function removeFromLocalCart(variantId: string): void {
  const cart = getLocalCart()
  const updatedCart = cart.filter((item) => item.variantId !== variantId)
  setLocalCart(updatedCart)
}

export function updateLocalCartQuantity(variantId: string, quantity: number): void {
  const cart = getLocalCart()
  const itemIndex = cart.findIndex((item) => item.variantId === variantId)

  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1)
    } else {
      cart[itemIndex].quantity = quantity
    }
    setLocalCart(cart)
  }
}

export function clearLocalCart(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem("pitalmart_cart")
    window.dispatchEvent(new CustomEvent("cart-updated", { detail: [] }))
  } catch (error) {
    console.error("Error clearing local cart:", error)
  }
}

// Wishlist Functions
export function getLocalWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return []
  try {
    const wishlist = localStorage.getItem("pitalmart_wishlist")
    return wishlist ? JSON.parse(wishlist) : []
  } catch (error) {
    console.error("Error getting local wishlist:", error)
    return []
  }
}

export function setLocalWishlist(wishlist: WishlistItem[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem("pitalmart_wishlist", JSON.stringify(wishlist))
    // Dispatch custom event for wishlist updates
    window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: wishlist }))
  } catch (error) {
    console.error("Error setting local wishlist:", error)
  }
}

export function addToLocalWishlist(item: WishlistItem): void {
  const wishlist = getLocalWishlist()
  const existingItem = wishlist.find((wishlistItem) => wishlistItem.productId === item.productId)

  if (!existingItem) {
    wishlist.push(item)
    setLocalWishlist(wishlist)
  }
}

export function removeFromLocalWishlist(productId: string): void {
  const wishlist = getLocalWishlist()
  const updatedWishlist = wishlist.filter((item) => item.productId !== productId)
  setLocalWishlist(updatedWishlist)
}

export function isInWishlist(productId: string): boolean {
  const wishlist = getLocalWishlist()
  return wishlist.some((item) => item.productId === productId)
}

export function clearLocalWishlist(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem("pitalmart_wishlist")
    window.dispatchEvent(new CustomEvent("wishlist-updated", { detail: [] }))
  } catch (error) {
    console.error("Error clearing local wishlist:", error)
  }
}

// Cart Calculation Functions
export function calculateCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => {
    const price = Number.parseFloat(item.price.replace(/[₹,]/g, ""))
    return total + price * item.quantity
  }, 0)
}

export function calculateCartItemCount(cart: CartItem[]): number {
  return cart.reduce((count, item) => count + item.quantity, 0)
}

// Validation Functions
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[+]?[\d\s\-()]{10,}$/
  return phoneRegex.test(phone)
}

// Image Optimization
export function optimizeImageUrl(url: string, width?: number, height?: number): string {
  if (!url || url.includes("placeholder.svg")) {
    return url
  }

  try {
    const urlObj = new URL(url)
    if (width) urlObj.searchParams.set("width", width.toString())
    if (height) urlObj.searchParams.set("height", height.toString())
    return urlObj.toString()
  } catch (error) {
    console.warn("Error optimizing image URL:", error)
    return url
  }
}

// URL Helpers
export function createProductUrl(handle: string): string {
  return `/product/${handle}`
}

export function createCollectionUrl(handle: string): string {
  return `/products?collection=${handle}`
}

// Error Handling
export function handleApiError(error: any): string {
  if (error?.message) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "An unexpected error occurred"
}

// Date Formatting
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    console.warn("Error formatting date:", error)
    return dateString
  }
}

// Debounce Function
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }) as T
}

// Local Storage Helpers
export function safeLocalStorageGet(key: string, defaultValue: any = null): any {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error)
    return defaultValue
  }
}

export function safeLocalStorageSet(key: string, value: any): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error)
  }
}

export function safeLocalStorageRemove(key: string): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error)
  }
}
