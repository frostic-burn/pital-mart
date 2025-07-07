"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  fetchShopifyCollections,
  fetchShopifyProducts,
  getProductPrice,
  getProductMainImage,
  getProductRating,
  getProductReviewsCount,
  getFirstAvailableVariant,
  filterProductsByCollection,
  type ShopifyCollection,
  type ShopifyProduct,
} from "@/lib/shopify-products"
import { useCart } from "@/contexts/cart-context"
import { getFeaturedReviews } from "@/data/reviews"
import { toast } from "react-toastify"

// Add these safe utility functions at the top of the component, before the main component function:

const safeGetProductRating = (product: ShopifyProduct): number => {
  try {
    if (!product || typeof product !== "object") return 4.5
    return getProductRating(product) || 4.5
  } catch (error) {
    console.warn("Error getting product rating:", error)
    return 4.5
  }
}

const safeGetProductReviewsCount = (product: ShopifyProduct): number => {
  try {
    if (!product || typeof product !== "object") return 15
    return getProductReviewsCount(product) || 15
  } catch (error) {
    console.warn("Error getting product reviews count:", error)
    return 15
  }
}

const safeGetProductPrice = (product: ShopifyProduct): string => {
  try {
    if (!product || typeof product !== "object") return "Price not available"
    if (!product.priceRange || !product.priceRange.minVariantPrice) {
      return "Price not available"
    }
    return getProductPrice(product) || "Price not available"
  } catch (error) {
    console.warn("Error getting product price:", error)
    return "Price not available"
  }
}

const safeGetProductMainImage = (product: ShopifyProduct): string => {
  try {
    if (!product || typeof product !== "object") return "/placeholder.svg?height=400&width=400"
    return getProductMainImage(product) || "/placeholder.svg?height=400&width=400"
  } catch (error) {
    console.warn("Error getting product main image:", error)
    return "/placeholder.svg?height=400&width=400"
  }
}

const safeIsProductInStock = (product: ShopifyProduct): boolean => {
  try {
    if (!product || typeof product !== "object") return true
    // ALWAYS RETURN TRUE - Never show out of stock
    return true
  } catch (error) {
    console.warn("Error checking product stock:", error)
    return true
  }
}

const safeGetFirstAvailableVariant = (product: ShopifyProduct) => {
  try {
    if (!product || typeof product !== "object") return null
    if (!product.variants || !product.variants.edges || product.variants.edges.length === 0) return null
    return getFirstAvailableVariant(product)
  } catch (error) {
    console.warn("Error getting first available variant:", error)
    return null
  }
}

function CategoriesPageContent() {
  const [currentReview, setCurrentReview] = useState(0)
  const [collections, setCollections] = useState<ShopifyCollection[]>([])
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string>("all")
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([])
  const [cartLoading, setCartLoading] = useState(false)
  const { addItem, addToWishlist, isInWishlist } = useCart()

  const reviews = getFeaturedReviews(4)

  // Load collections and products from Shopify with instant display
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load data in background without showing loading state
        const [collectionsData, productsData] = await Promise.all([
          fetchShopifyCollections(20),
          fetchShopifyProducts(50),
        ])

        // Filter out gifting collections
        const filteredCollections = collectionsData.filter((collection: ShopifyCollection) => {
          const title = collection.title?.toLowerCase() || ''
          const handle = collection.handle?.toLowerCase() || ''
          return !title.includes('gift') && !handle.includes('gift') && !title.includes('gifting') && !handle.includes('gifting')
        })
        
        setCollections(filteredCollections)
        const productsList = productsData.edges.map((edge: any) => edge.node)
        setProducts(productsList)
        setFilteredProducts(productsList)
      } catch (error) {
        console.error("Error loading data:", error)
        // Data will remain as empty arrays, which is handled gracefully
      }
    }

    loadData()
  }, [])

  // Filter products when collection changes
  useEffect(() => {
    if (selectedCollection === "all") {
      setFilteredProducts(products)
    } else {
      const filtered = filterProductsByCollection(products, selectedCollection)
      setFilteredProducts(filtered)
    }
  }, [selectedCollection, products])

  // Auto-scroll for reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [reviews.length])

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = safeGetFirstAvailableVariant(product)
    if (variant) {
      setCartLoading(true)
      try {
        addItem(variant.id, 1, {
          productId: product.id,
          variantId: variant.id,
          title: product.title,
          price: safeGetProductPrice(product),
          image: safeGetProductMainImage(product),
          handle: product.handle,
        })
        toast.success(`${product.title} added to cart!`)
      } catch (error) {
        console.error("Error adding to cart:", error)
        toast.error("Failed to add item to cart. Please try again.")
      } finally {
        setCartLoading(false)
      }
    }
  }

  const handleAddToWishlist = (product: ShopifyProduct) => {
    const variant = safeGetFirstAvailableVariant(product)
    if (variant) {
      addToWishlist({
        productId: product.id,
        variantId: variant.id,
        title: product.title,
        price: safeGetProductPrice(product),
        image: safeGetProductMainImage(product),
        handle: product.handle,
      })
      toast.success(`${product.title} added to wishlist!`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-lancelot text-red-700 mb-8">Discover Exclusive Categories</h1>

            {/* Collection Navigation */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <button
                onClick={() => setSelectedCollection("all")}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                  selectedCollection === "all"
                    ? "text-red-700 border-red-700"
                    : "text-gray-600 border-transparent hover:text-red-700"
                }`}
              >
                All Products
              </button>
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => setSelectedCollection(collection.handle)}
                  className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                    selectedCollection === collection.handle
                      ? "text-red-700 border-red-700"
                      : "text-gray-600 border-transparent hover:text-red-700"
                  }`}
                >
                  {collection.title}
                </button>
              ))}
            </div>
          </div>

          {/* Collections Grid */}
          {collections.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
              {collections.map((collection) => (
                <Link key={collection.id} href={`/products?collection=${collection.handle}`}>
                  <div className="relative group cursor-pointer">
                    <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={collection.image?.url || "/placeholder.svg?height=400&width=400"}
                        alt={collection.image?.altText || collection.title}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Overlay with collection name */}
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4">
                        <div className="text-white">
                          <h3 className="font-medium text-lg mb-1">{collection.title}</h3>
                          {collection.description && <p className="text-sm opacity-90">{collection.description}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-lancelot text-red-700 text-center mb-8">
                {selectedCollection === "all"
                  ? "All Products"
                  : collections.find((c) => c.handle === selectedCollection)?.title || "Products"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.slice(0, 12).map((product) => {
                  const inStock = safeIsProductInStock(product)
                  const rating = safeGetProductRating(product)
                  const reviewsCount = safeGetProductReviewsCount(product)
                  const price = safeGetProductPrice(product)
                  const mainImage = safeGetProductMainImage(product)

                  return (
                    <Card
                      key={product.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col"
                    >
                      <CardContent className="p-0 flex flex-col flex-grow">
                        <div className="aspect-square bg-gray-200 relative group">
                          <Link href={`/product/${product.handle}`}>
                            <Image
                              src={mainImage || "/placeholder.svg"}
                              alt={`${product.title} - ${product.description.slice(0, 100)}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </Link>
                          <button
                            onClick={() => handleAddToWishlist(product)}
                            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                              isInWishlist(product.id)
                                ? "bg-red-100 text-red-600"
                                : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-600"
                            }`}
                            aria-label={`Add ${product.title} to wishlist`}
                          >
                            <Heart className="w-4 h-4" fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                          </button>
                          {/* REMOVED OUT OF STOCK OVERLAY - Never show out of stock */}
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <Link href={`/product/${product.handle}`}>
                            <h3 className="font-medium text-gray-800 mb-2 text-sm hover:text-red-700 transition-colors line-clamp-2 flex-grow">
                              {product.title}
                            </h3>
                          </Link>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-gray-600 font-medium">{price}</span>
                          </div>
                          {reviewsCount > 0 && (
                            <div className="flex items-center justify-center gap-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-xs ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
                                >
                                  ★
                                </span>
                              ))}
                              <span className="text-xs text-gray-500 ml-1">({reviewsCount})</span>
                            </div>
                          )}
                          <Button
                            onClick={() => handleAddToCart(product)}
                            disabled={cartLoading}
                            className="w-full bg-red-700 hover:bg-red-800 text-white text-sm py-2 rounded-full flex items-center justify-center gap-2"
                          >
                            {cartLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4" />
                                Add To Cart
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              {filteredProducts.length > 12 && (
                <div className="text-center mt-8">
                  <Link href={`/products${selectedCollection !== "all" ? `?collection=${selectedCollection}` : ""}`}>
                    <Button className="bg-red-700 hover:bg-red-800 text-white px-8 py-3">View All Products</Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {filteredProducts.length === 0 && products.length === 0 && (
            <div className="text-center py-12">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
              </div>
            </div>
          )}

          {filteredProducts.length === 0 && products.length > 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No products found in this category.</p>
              <Button onClick={() => setSelectedCollection("all")} className="bg-red-700 hover:bg-red-800 text-white">
                View All Products
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Health Benefits Section */}
      <section className="py-16 bg-gray-200">
        <div className="container mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left side - Benefits */}
            <div className="lg:w-1/3 space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Image
                    src="https://ik.imagekit.io/cacl2snorter/Group%201201.png?updatedAt=1751542984480"
                    alt="Cultural heritage icon"
                    width={32}
                    height={32}
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">Rooted in Culture</h3>
                <p className="text-sm text-gray-600">
                  For generations, Punjabi homes have trusted pital for pure taste.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Image
                    src="https://ik.imagekit.io/cacl2snorter/Group%201202.png?updatedAt=1751542984418"
                    alt="Eco-friendly icon"
                    width={32}
                    height={32}
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">Durable Eco Beauty</h3>
                <p className="text-sm text-gray-600">
                  Long-lasting and aesthetically rich with 100% recyclable and sustainable.
                </p>
              </div>
            </div>
            {/* Center - Product Image */}
            <div className="lg:w-1/3 relative">
              <div className="mx-auto w-full max-w-[500px]">
                <Image
                  src="https://ik.imagekit.io/cacl2snorter/USP.png?updatedAt=1751541877736"
                  alt="Brass Product"
                  width={500}
                  height={400}
                  className="object-contain w-full h-auto"
                />
              </div>
            </div>
            {/* Right side - Health Stats */}
            <div className="lg:w-1/3 text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Image
                  src="https://ik.imagekit.io/cacl2snorter/Group.png?updatedAt=1751542984420"
                  alt="Health Icon"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="text-lg font-medium mb-2">Health First</h3>
              <div className="text-4xl font-bold text-gray-800 mb-2">93%</div>
              <p className="text-sm text-gray-600">of nutrients, improves digestion, and boosts immunity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cooked with Love - Reviews Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-lancelot text-gray-800 mb-4">Cooked with Love,</h2>
            <h3 className="text-4xl font-lancelot text-gray-800 mb-6">Praised with Heart</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our utensils don't just serve—they inspire the inner chef in every home. Discover how real people bring
              out their best with our handcrafted essentials.
            </p>
            <Link href="/testimonials">
              <Button className="mt-6 text-white px-8 py-3 rounded-full bg-[rgba(147,14,19,1)]">
                Write Us a Little Note
              </Button>
            </Link>
          </div>
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div key={review.id} className="w-full flex-shrink-0 px-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Show 4 review cards */}
                    {[...Array(4)].map((_, cardIndex) => (
                      <div key={cardIndex} className="bg-white rounded-lg overflow-hidden shadow-md">
                        <div className="aspect-square bg-gray-300 relative">
                          <Image
                            src={review.image || "/placeholder.svg"}
                            alt={`Customer Photo of ${review.name}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{review.text}</p>
                          <p className="font-medium text-gray-800">-{review.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final Brand Section - Join Channel Now */}
      <section className="relative py-16 bg-gray-100">
        <div className="container mx-auto px-8 text-center relative z-10">
          <div className="mb-8">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <Image src="https://i.ibb.co/XfxKCSnF/Vector-2.png" alt="Decorative Pattern" width={63} height={37} />
            </div>
          </div>

          <h2 className="text-4xl font-lancelot text-gray-800 mb-4">PITAL MART</h2>
          <p className="text-gray-600 mb-8">Join our WhatsApp channel for new launches and festive combos!</p>

          <a href="https://wa.me/your-whatsapp-number" target="_blank" rel="noopener noreferrer">
            <Button className="text-white px-8 py-3 rounded-full mb-8 font-semibold text-2xl bg-[rgba(147,14,19,1)]">
              Join Channel Now
            </Button>
          </a>
        </div>

        {/* Left Decorative Image */}
        <Image
          src="https://i.ibb.co/0RXhg84X/Kolam-022.png"
          alt="Left Decorative Pattern"
          width={144}
          height={85}
          className="absolute left-[5%] top-1/2 transform -translate-y-1/2"
        />

        {/* Right Decorative Image */}
        <Image
          src="https://i.ibb.co/0RXhg84X/Kolam-022.png"
          alt="Right Decorative Pattern"
          width={144}
          height={85}
          className="absolute right-[5%] top-1/2 transform -translate-y-1/2"
        />
      </section>
    </div>
  )
}

// Main component export
export default function CategoriesPage() {
  return <CategoriesPageContent />
}
