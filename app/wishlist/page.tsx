"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { toast } from "react-toastify"

export default function WishlistPage() {
  const { wishlistItems, addItem, removeFromWishlist, clearWishlist } = useCart()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId)
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

  const handleMoveToCart = (item: any) => {
    handleAddToCart(item)
    handleRemoveFromWishlist(item.productId)
  }

  const handleAddAllToCart = () => {
    wishlistItems.forEach((item) => {
      addItem(item.variantId, 1, {
        productId: item.productId,
        variantId: item.variantId,
        title: item.title,
        price: item.price,
        image: item.image,
        handle: item.handle,
      })
    })
    toast.success("All items added to cart!")
  }

  const handleClearWishlist = () => {
    clearWishlist()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b py-8">
        <div className="container mx-auto px-8">
          <div className="text-center">
            <h1 className="text-3xl font-lancelot text-red-700 mb-2">My Wishlist</h1>
            <p className="text-gray-600">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved for later
            </p>
          </div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-lancelot text-gray-800 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8">Save items you love to your wishlist and shop them later.</p>
              <Link href="/products">
                <Button className="bg-red-700 hover:bg-red-800 text-white px-8 py-3">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Wishlist Actions */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h2 className="text-xl font-medium text-gray-800 mb-4 md:mb-0">Saved Items ({wishlistItems.length})</h2>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handleAddAllToCart}
                    className="border-red-700 text-red-700 hover:bg-red-50"
                  >
                    Add All to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClearWishlist}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Clear Wishlist
                  </Button>
                </div>
              </div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                  <Card key={item.id} className="bg-white hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="aspect-square bg-gray-100 relative">
                          <Link href={`/product/${item.handle}`}>
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={`${item.title} - Wishlist item`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </Link>
                          <button
                            onClick={() => handleRemoveFromWishlist(item.productId)}
                            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                            aria-label={`Remove ${item.title} from wishlist`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-4">
                          <Link href={`/product/${item.handle}`}>
                            <h3 className="font-medium text-gray-800 mb-2 text-sm hover:text-red-700 transition-colors line-clamp-2">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-gray-600 font-medium mb-3">{item.price}</p>
                          <div className="space-y-2">
                            <Button
                              onClick={() => handleMoveToCart(item)}
                              className="w-full bg-red-700 hover:bg-red-800 text-white text-sm py-2"
                            >
                              Move to Cart
                            </Button>
                            <Button
                              onClick={() => handleAddToCart(item)}
                              variant="outline"
                              className="w-full border-red-700 text-red-700 hover:bg-red-50 text-sm py-2"
                            >
                              Add to Cart
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Added {new Date(item.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="text-center mt-12">
                <Link href="/products">
                  <Button
                    variant="outline"
                    className="border-red-700 text-red-700 hover:bg-red-50 px-8 py-3 bg-transparent"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-lancelot text-gray-800 mb-4">You Might Also Like</h2>
            <p className="text-gray-600">Discover more beautiful brass items</p>
          </div>
          <div className="text-center">
            <Link href="/products">
              <Button className="bg-red-700 hover:bg-red-800 text-white px-8 py-3">Explore All Products</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
