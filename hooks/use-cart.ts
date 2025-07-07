"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import {
  addToLocalCart,
  getLocalCart,
  updateLocalCartQuantity,
  removeFromLocalCart,
  clearLocalCart,
  type CartItem,
} from "@/lib/shopify"

interface CartContextType {
  items: CartItem[]
  addItem: (variantId: string, quantity: number, productData?: Partial<CartItem>) => Promise<void>
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    setItems(getLocalCart())
  }, [])

  const addItem = async (variantId: string, quantity: number, productData?: Partial<CartItem>) => {
    setLoading(true)
    try {
      const newItem: CartItem = {
        id: Date.now().toString(),
        productId: productData?.productId || "",
        variantId,
        quantity,
        title: productData?.title || "Product",
        price: productData?.price || "₹0",
        image: productData?.image || "/placeholder.svg",
        handle: productData?.handle || "",
      }

      addToLocalCart(newItem)
      setItems(getLocalCart())
    } catch (error) {
      console.error("Error adding item to cart:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const removeItem = (variantId: string) => {
    removeFromLocalCart(variantId)
    setItems(getLocalCart())
  }

  const updateQuantity = (variantId: string, quantity: number) => {
    updateLocalCartQuantity(variantId, quantity)
    setItems(getLocalCart())
  }

  const clearCart = () => {
    clearLocalCart()
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => {
    const price = Number.parseFloat(item.price.replace(/[₹,]/g, ""))
    return sum + price * item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
