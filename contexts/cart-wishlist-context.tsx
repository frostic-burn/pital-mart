"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Types
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
  id: string
  productId: string
  variantId: string
  title: string
  price: string
  image: string
  handle: string
  dateAdded: string
}

interface CartContextType {
  // Cart
  cartItems: CartItem[]
  cartCount: number
  cartTotal: number
  addToCart: (item: CartItem) => void
  removeFromCart: (variantId: string) => void
  updateCartQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  isInCart: (variantId: string) => boolean

  // Wishlist
  wishlistItems: WishlistItem[]
  wishlistCount: number
  addToWishlist: (item: Omit<WishlistItem, "id" | "dateAdded">) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  moveToCart: (productId: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Local storage functions
const getLocalCart = (): CartItem[] => {
  if (typeof window === "undefined") return []
  try {
    const cart = localStorage.getItem("pital-mart-cart")
    return cart ? JSON.parse(cart) : []
  } catch {
    return []
  }
}

const setLocalCart = (cart: CartItem[]) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem("pital-mart-cart", JSON.stringify(cart))
  } catch (error) {
    console.error("Error saving cart to localStorage:", error)
  }
}

const getLocalWishlist = (): WishlistItem[] => {
  if (typeof window === "undefined") return []
  try {
    const wishlist = localStorage.getItem("pital-mart-wishlist")
    return wishlist ? JSON.parse(wishlist) : []
  } catch {
    return []
  }
}

const setLocalWishlist = (wishlist: WishlistItem[]) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem("pital-mart-wishlist", JSON.stringify(wishlist))
  } catch (error) {
    console.error("Error saving wishlist to localStorage:", error)
  }
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartWishlistProvider")
  }
  return context
}

export function useWishlist() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a CartWishlistProvider")
  }
  return context
}

interface CartWishlistProviderProps {
  children: ReactNode
}

export function CartWishlistProvider({ children }: CartWishlistProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    setCartItems(getLocalCart())
    setWishlistItems(getLocalWishlist())
  }, [])

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => {
    const price = Number.parseFloat(item.price.replace(/[^\d.]/g, "")) || 0
    return total + price * item.quantity
  }, 0)

  // Cart functions
  const addToCart = (item: CartItem) => {
    const existingItem = cartItems.find((cartItem) => cartItem.variantId === item.variantId)

    let updatedCart: CartItem[]
    if (existingItem) {
      updatedCart = cartItems.map((cartItem) =>
        cartItem.variantId === item.variantId ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem,
      )
    } else {
      updatedCart = [...cartItems, item]
    }

    setCartItems(updatedCart)
    setLocalCart(updatedCart)
  }

  const removeFromCart = (variantId: string) => {
    const updatedCart = cartItems.filter((item) => item.variantId !== variantId)
    setCartItems(updatedCart)
    setLocalCart(updatedCart)
  }

  const updateCartQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId)
      return
    }

    const updatedCart = cartItems.map((item) => (item.variantId === variantId ? { ...item, quantity } : item))
    setCartItems(updatedCart)
    setLocalCart(updatedCart)
  }

  const clearCart = () => {
    setCartItems([])
    setLocalCart([])
  }

  const isInCart = (variantId: string): boolean => {
    return cartItems.some((item) => item.variantId === variantId)
  }

  // Wishlist functions
  const addToWishlist = (item: Omit<WishlistItem, "id" | "dateAdded">) => {
    const existingItem = wishlistItems.find((wishlistItem) => wishlistItem.productId === item.productId)

    if (!existingItem) {
      const newItem: WishlistItem = {
        ...item,
        id: Date.now().toString(),
        dateAdded: new Date().toISOString(),
      }
      const updatedWishlist = [...wishlistItems, newItem]
      setWishlistItems(updatedWishlist)
      setLocalWishlist(updatedWishlist)
    }
  }

  const removeFromWishlist = (productId: string) => {
    const updatedWishlist = wishlistItems.filter((item) => item.productId !== productId)
    setWishlistItems(updatedWishlist)
    setLocalWishlist(updatedWishlist)
  }

  const clearWishlist = () => {
    setWishlistItems([])
    setLocalWishlist([])
  }

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some((item) => item.productId === productId)
  }

  const moveToCart = (productId: string) => {
    const wishlistItem = wishlistItems.find((item) => item.productId === productId)
    if (wishlistItem) {
      const cartItem: CartItem = {
        id: wishlistItem.id,
        productId: wishlistItem.productId,
        variantId: wishlistItem.variantId,
        title: wishlistItem.title,
        price: wishlistItem.price,
        image: wishlistItem.image,
        handle: wishlistItem.handle,
        quantity: 1,
      }
      addToCart(cartItem)
      removeFromWishlist(productId)
    }
  }

  const value: CartContextType = {
    // Cart
    cartItems,
    cartCount: cartItems.reduce((count, item) => count + item.quantity, 0),
    cartTotal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    isInCart,

    // Wishlist
    wishlistItems,
    wishlistCount: wishlistItems.length,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    moveToCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// For backward compatibility, also export WishlistProvider
export function WishlistProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
