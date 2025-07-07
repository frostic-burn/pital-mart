"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  fetchShopifyProducts,
  fetchShopifyCollections,
  filterProductsByCollection,
  searchProducts,
  sortProducts,
  getProductPrice,
  getProductCompareAtPrice,
  getProductMainImage,
  getProductRating,
  getProductReviewsCount,
  getFirstAvailableVariant,
  type ShopifyProduct,
  type ShopifyCollection,
} from "@/lib/shopify-products"
import { useCart } from "@/contexts/cart-context"
import { getFeaturedReviews } from "@/data/reviews"
import { toast } from "react-toastify"

// Safe wrapper functions for product data
const safeGetProductRating = (product: ShopifyProduct): number => {
  try {
    return product.rating || 4.5
  } catch (error) {
    console.warn("Error getting product rating:", error)
    return 4.5
  }
}

const safeGetProductReviewsCount = (product: ShopifyProduct): number => {
  try {
    return product.reviewsCount || 0
  } catch (error) {
    console.warn("Error getting product reviews count:", error)
    return 0
  }
}

const safeGetProductPrice = (product: ShopifyProduct): string => {
  try {
    if (product.priceRange?.minVariantPrice) {
      const amount = Number.parseFloat(product.priceRange.minVariantPrice.amount)
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: product.priceRange.minVariantPrice.currencyCode || "INR",
        minimumFractionDigits: 0,
      }).format(amount)
    }
    return "₹0"
  } catch (error) {
    console.warn("Error getting product price:", error)
    return "₹0"
  }
}

const safeGetProductCompareAtPrice = (product: ShopifyProduct): string | null => {
  try {
    if (product.compareAtPriceRange?.minVariantPrice) {
      const amount = Number.parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: product.compareAtPriceRange.minVariantPrice.currencyCode || "INR",
        minimumFractionDigits: 0,
      }).format(amount)
    }
    return null
  } catch (error) {
    console.warn("Error getting product compare at price:", error)
    return null
  }
}

const safeGetProductMainImage = (product: ShopifyProduct): string => {
  try {
    if (product.images && product.images.length > 0) {
      return product.images[0].url
    }
    return "/placeholder.svg?height=400&width=400"
  } catch (error) {
    console.warn("Error getting product main image:", error)
    return "/placeholder.svg?height=400&width=400"
  }
}

const safeIsProductInStock = (product: ShopifyProduct): boolean => {
  try {
    return product.availableForSale || false
  } catch (error) {
    console.warn("Error checking product stock:", error)
    return false
  }
}

const safeGetFirstAvailableVariant = (product: ShopifyProduct) => {
  try {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0]
    }
    return null
  } catch (error) {
    console.warn("Error getting first available variant:", error)
    return null
  }
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [collections, setCollections] = useState<ShopifyCollection[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("featured")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentReview, setCurrentReview] = useState(0)
  const [cartLoading, setCartLoading] = useState(false)

  const { addItem, addToWishlist, isInWishlist } = useCart()

  const featuredReviews = getFeaturedReviews(4)

  // Fetch products and collections from Shopify with instant display
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load data in background without showing loading state
        const [productsData, collectionsData] = await Promise.all([
          fetchShopifyProducts(100), // Fetch up to 100 products
          fetchShopifyCollections(20),
        ])

        // More robust data extraction
        const productsList = productsData?.edges?.map((edge: any) => edge.node) || []

        // Filter out gifting collections
        const filteredCollections = (collectionsData || []).filter((collection: ShopifyCollection) => {
          const title = collection.title?.toLowerCase() || ''
          const handle = collection.handle?.toLowerCase() || ''
          return !title.includes('gift') && !handle.includes('gift') && !title.includes('gifting') && !handle.includes('gifting')
        })
        
        setProducts(productsList)
        setCollections(filteredCollections)
        setFilteredProducts(productsList)
      } catch (error) {
        console.error("Error loading products:", error)
        // Data will remain as empty arrays, which is handled gracefully
      }
    }

    loadData()
  }, [])

  // Auto-scroll for reviews
  useEffect(() => {
    if (featuredReviews.length > 0) {
      const interval = setInterval(() => {
        setCurrentReview((prev) => (prev + 1) % featuredReviews.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [featuredReviews.length])

  // Filter and sort products
  useEffect(() => {
    let filtered = products

    // Filter by collection
    if (selectedCollection !== "all") {
      try {
        filtered = filterProductsByCollection(products, selectedCollection)
      } catch (error) {
        console.warn("Error filtering by collection:", error)
      }
    }

    // Filter by search term
    if (searchTerm) {
      try {
        filtered = searchProducts(filtered, searchTerm)
      } catch (error) {
        console.warn("Error searching products:", error)
      }
    }

    // Sort products
    try {
      filtered = sortProducts(filtered, sortBy)
    } catch (error) {
      console.warn("Error sorting products:", error)
    }

    setFilteredProducts(filtered)
  }, [products, selectedCollection, sortBy, searchTerm])

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = safeGetFirstAvailableVariant(product)
    if (!variant) {
      // alert("No variants available for this product.")
      toast.error("No variants available for this product.")
      return
    }

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
      // alert(`${product.title} added to cart!`)

      // Optionally trigger a cart update event
      window.dispatchEvent(new Event("cart-updated"))
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add item to cart. Please try again.")
      // alert("Failed to add item to cart. Please try again.")
    } finally {
      setCartLoading(false)
    }
  }

  const handleAddToWishlist = (product: ShopifyProduct) => {
    const variant = safeGetFirstAvailableVariant(product)
    if (variant) {
      try {
        addToWishlist({
          productId: product.id,
          variantId: variant.id,
          title: product.title,
          price: safeGetProductPrice(product),
          image: safeGetProductMainImage(product),
          handle: product.handle,
        })
        toast.success(`${product.title} added to wishlist!`)
        // alert(`${product.title} added to wishlist!`)
      } catch (error) {
        console.error("Error adding to wishlist:", error)
        toast.error("Failed to add item to wishlist. Please try again.")
        // alert("Failed to add item to wishlist. Please try again.")
      }
    }
  }

  const scrollToProducts = () => {
    const productsSection = document.getElementById("handpicked-products")
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner Section */}
      <section className="relative h-[587px] bg-gray-100 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://ik.imagekit.io/cacl2snorter/Products%20Page.jpg?updatedAt=1751550177327"
            alt="Traditional brass utensils collection showcasing authentic Indian cookware"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 container mx-auto px-8 h-full flex items-center">
          <div className="text-white max-w-md">
            <h1 className="text-4xl font-lancelot text-white mb-4">
              Cook the Healthy Way
              <br />
              With Pure Brass
            </h1>
            <p className="text-lg text-white mb-6">
              Make Every Meal Healthier —<br />
              Switch to Brass Today
            </p>
            <button
              onClick={scrollToProducts}
              className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
              <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Collections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Collections</SelectItem>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.handle}>
                      {collection.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="title-asc">Name: A to Z</SelectItem>
                <SelectItem value="title-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="handpicked-products" className="py-16 bg-gray-50">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-lancelot text-red-700 mb-4">
              {selectedCollection === "all"
                ? "Handpicked Brass Essentials"
                : collections.find((c) => c.handle === selectedCollection)?.title || "Products"}
            </h2>
            <p className="text-gray-600">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => {
              const inStock = safeIsProductInStock(product)
              const rating = safeGetProductRating(product)
              const reviewsCount = safeGetProductReviewsCount(product)
              const price = safeGetProductPrice(product)
              const compareAtPrice = safeGetProductCompareAtPrice(product)
              const mainImage = safeGetProductMainImage(product)

              console.log(`🛍️ Rendering product: ${product.title}, inStock: ${inStock}`)

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square bg-gray-200 relative group">
                    <Link href={`/product/${product.handle}`}>
                      <Image
                        src={mainImage || "/placeholder.svg"}
                        alt={`${product.title} - ${product.description?.slice(0, 100) || "Brass cookware"}`}
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
                    {!inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-medium">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <Link href={`/product/${product.handle}`}>
                      <h3 className="font-medium text-gray-800 mb-2 text-sm hover:text-red-700 transition-colors line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-gray-600 font-medium">{price}</span>
                      {compareAtPrice && <span className="text-gray-400 text-sm line-through">{compareAtPrice}</span>}
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
                      disabled={!inStock || cartLoading}
                      className="w-full bg-red-700 hover:bg-red-800 text-white text-sm py-2 rounded-full disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                      {cartLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          {inStock ? "Add To Cart" : "Out of Stock"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Show loading skeleton when no products yet */}
          {filteredProducts.length === 0 && products.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-square bg-gray-300"></div>
                  <div className="p-4 text-center">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-16 mx-auto mb-2"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && products.length > 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <Button
                onClick={() => {
                  setSelectedCollection("all")
                  setSearchTerm("")
                  setSortBy("featured")
                }}
                className="mt-4 bg-red-700 hover:bg-red-800 text-white"
              >
                Clear Filters
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
                    alt="Cultural heritage icon representing traditional brass craftsmanship"
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
                    alt="Eco-friendly icon representing sustainable brass products"
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
                  alt="Premium brass cookware showcasing traditional Indian kitchen utensils"
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
                  alt="Health benefits icon representing nutritional advantages of brass cookware"
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
          {featuredReviews.length > 0 && (
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(-${currentReview * 100}%)` }}
              >
                {featuredReviews.map((review, index) => (
                  <div key={review.id} className="w-full flex-shrink-0 px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Show 4 review cards */}
                      {[...Array(4)].map((_, cardIndex) => (
                        <div key={cardIndex} className="bg-white rounded-lg overflow-hidden shadow-md">
                          <div className="aspect-square bg-gray-300 relative">
                            <Image
                              src={review.image || "/placeholder.svg"}
                              alt={`Customer photo of ${review.name} who reviewed ${review.product}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{review.text}</p>
                            <p className="font-medium text-gray-800">-{review.name}</p>
                            {review.verified && <span className="text-xs text-green-600">✓ Verified Purchase</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Final Brand Section - Join Channel Now */}
      <section className="relative py-16 bg-gray-100">
        <div className="container mx-auto px-8 text-center relative z-10">
          <div className="mb-8">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <Image
                src="https://i.ibb.co/XfxKCSnF/Vector-2.png"
                alt="PitalMart decorative logo element"
                width={63}
                height={37}
              />
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
          alt="Traditional Indian kolam pattern decoration"
          width={144}
          height={85}
          className="absolute left-[5%] top-1/2 transform -translate-y-1/2"
        />

        {/* Right Decorative Image */}
        <Image
          src="https://i.ibb.co/0RXhg84X/Kolam-022.png"
          alt="Traditional Indian kolam pattern decoration"
          width={144}
          height={85}
          className="absolute right-[5%] top-1/2 transform -translate-y-1/2"
        />
      </section>
    </div>
  )
}
