"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface CartItem {
  id: string
  productId: string
  variantId: string
  quantity: number
  title: string
  price: string
  image: string
  handle: string
}

export interface WishlistItem {
  id: string
  productId: string
  variantId: string
  title: string
  price: string
  image: string
  handle: string
  addedAt: string
}

interface CartContextType {
  // Cart
  items: CartItem[]
  addItem: (variantId: string, quantity: number, productData: Partial<CartItem>) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  totalPrice: number
  totalItems: number
  loading: boolean

  // Wishlist
  wishlistItems: WishlistItem[]
  addToWishlist: (productData: Omit<WishlistItem, "id" | "addedAt">) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("pital-mart-cart")
      const savedWishlist = localStorage.getItem("pital-mart-wishlist")

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setItems(Array.isArray(parsedCart) ? parsedCart : [])
      }

      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist)
        setWishlistItems(Array.isArray(parsedWishlist) ? parsedWishlist : [])
      }
    } catch (error) {
      console.error("Error loading cart/wishlist from localStorage:", error)
      setItems([])
      setWishlistItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem("pital-mart-cart", JSON.stringify(items))
      } catch (error) {
        console.error("Error saving cart to localStorage:", error)
      }
    }
  }, [items, loading])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem("pital-mart-wishlist", JSON.stringify(wishlistItems))
      } catch (error) {
        console.error("Error saving wishlist to localStorage:", error)
      }
    }
  }, [wishlistItems, loading])

  // Cart functions
  const addItem = (variantId: string, quantity: number, productData: Partial<CartItem>) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.variantId === variantId)

      if (existingItem) {
        return prevItems.map((item) =>
          item.variantId === variantId ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }

      const newItem: CartItem = {
        id: `${variantId}-${Date.now()}`,
        productId: productData.productId || "",
        variantId,
        quantity,
        title: productData.title || "",
        price: productData.price || "₹0",
        image: productData.image || "",
        handle: productData.handle || "",
      }

      return [...prevItems, newItem]
    })
  }

  const removeItem = (variantId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.variantId !== variantId))
  }

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.variantId === variantId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  // Wishlist functions
  const addToWishlist = (productData: Omit<WishlistItem, "id" | "addedAt">) => {
    setWishlistItems((prevItems) => {
      const exists = prevItems.some((item) => item.productId === productData.productId)
      if (exists) return prevItems

      const newItem: WishlistItem = {
        ...productData,
        id: `wishlist-${productData.productId}-${Date.now()}`,
        addedAt: new Date().toISOString(),
      }

      return [...prevItems, newItem]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
  }

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.productId === productId)
  }

  const clearWishlist = () => {
    setWishlistItems([])
  }

  // Calculate totals
  const totalPrice = items.reduce((total, item) => {
    const price = Number.parseFloat(item.price.replace(/[₹,]/g, "")) || 0
    return total + price * item.quantity
  }, 0)

  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  const value: CartContextType = {
    // Cart
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
    loading,

    // Wishlist
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
