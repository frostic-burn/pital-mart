import { formatPrice } from "./shopify"
import { getShopifyProducts, getShopifyCollections, getShopifyProductByHandle } from "./shopify-server"
import type { Product } from "./shopify"

export interface ShopifyProduct {
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
  metafields?: Array<{
    key: string
    value: string
  }>
}

export interface ShopifyCollection {
  id: string
  title: string
  handle: string
  description: string
  image?: {
    url: string
    altText: string | null
  }
  products?: ShopifyProduct[]
}

// API Functions that call server actions
export async function fetchShopifyProducts(first = 20, after?: string) {
  return await getShopifyProducts(first, after)
}

export async function fetchShopifyCollections(first = 10) {
  return await getShopifyCollections(first)
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  return await getShopifyProductByHandle(handle)
}

// Alias for compatibility
export async function getProduct(handle: string): Promise<Product | null> {
  return getProductByHandle(handle)
}

export function getProductVariants(product: Product) {
  return product.variants || []
}

export function getProductPrice(product: Product): string {
  return formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)
}

export function getProductCompareAtPrice(product: Product): string | null {
  if (product.compareAtPriceRange?.minVariantPrice) {
    return formatPrice(
      product.compareAtPriceRange.minVariantPrice.amount,
      product.compareAtPriceRange.minVariantPrice.currencyCode,
    )
  }
  return null
}

export function getProductMainImage(product: Product): string {
  try {
    if (product.images && product.images.length > 0) {
      const imageUrl = product.images[0]?.url
      if (imageUrl && typeof imageUrl === "string") {
        return imageUrl
      }
    }
    return "/placeholder.svg?height=400&width=400"
  } catch (error) {
    console.warn("Error getting product main image:", error)
    return "/placeholder.svg?height=400&width=400"
  }
}

export function getProductImages(product: Product): string[] {
  try {
    if (product.images && product.images.length > 0) {
      return product.images.map((image) => image.url).filter((url) => url && typeof url === "string")
    }
    return ["/placeholder.svg?height=400&width=400"]
  } catch (error) {
    console.warn("Error getting product images:", error)
    return ["/placeholder.svg?height=400&width=400"]
  }
}

// FIXED: Always show products as in stock - never show "Out of Stock"
export function isProductInStock(product: Product): boolean {
  try {
    console.log(`🔍 Checking stock for: ${product?.title || "Unknown Product"}`)
    console.log(`📦 Product availableForSale: ${product?.availableForSale}`)
    console.log(`📊 Total inventory: ${product?.totalInventory}`)
    console.log(
      `🏷️ Variants:`,
      product?.variants?.map((v) => ({
        title: v?.title,
        availableForSale: v?.availableForSale,
        quantityAvailable: v?.quantityAvailable,
      })) || [],
    )

    // ALWAYS RETURN TRUE - Never show out of stock
    console.log(`✅ Product ${product?.title || "Unknown"} - ALWAYS IN STOCK`)
    return true
  } catch (error) {
    console.warn("Error checking product stock:", error)
    return true // Even on error, show as in stock
  }
}

export function getFirstAvailableVariant(product: Product) {
  try {
    // Always return the first variant
    if (product?.variants && product.variants.length > 0) {
      return product.variants[0]
    }
    return product?.variants?.[0] || null
  } catch (error) {
    console.warn("Error getting first available variant:", error)
    return null
  }
}

export function getProductRating(product: Product): number {
  try {
    if (!product?.metafields || !Array.isArray(product.metafields)) {
      return 4.5 // Default rating
    }

    const ratingMetafield = product.metafields.find((field) => field && field.key === "rating")
    if (ratingMetafield && ratingMetafield.value) {
      const rating = Number.parseFloat(ratingMetafield.value)
      return isNaN(rating) ? 4.5 : Math.min(Math.max(rating, 0), 5) // Clamp between 0-5
    }
    return 4.5 // Default rating
  } catch (error) {
    console.warn("Error getting product rating:", error)
    return 4.5
  }
}

// FIXED: Static reviews count based on product ID - no more random changes
export function getProductReviewsCount(product: Product): number {
  try {
    if (!product?.metafields || !Array.isArray(product.metafields)) {
      // Generate static number based on product ID hash
      return getStaticReviewsCount(product?.id || "")
    }

    const reviewsMetafield = product.metafields.find((field) => field && field.key === "reviews_count")
    if (reviewsMetafield && reviewsMetafield.value) {
      const count = Number.parseInt(reviewsMetafield.value)
      return isNaN(count) ? getStaticReviewsCount(product?.id || "") : Math.max(count, 0)
    }
    return getStaticReviewsCount(product?.id || "")
  } catch (error) {
    console.warn("Error getting product reviews count:", error)
    return getStaticReviewsCount(product?.id || "")
  }
}

// Helper function to generate consistent review count based on product ID
function getStaticReviewsCount(productId: string): number {
  if (!productId) return 25

  // Create a simple hash from product ID to get consistent number
  let hash = 0
  for (let i = 0; i < productId.length; i++) {
    const char = productId.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Convert hash to number between 15-85
  const reviewsCount = Math.abs(hash % 71) + 15
  return reviewsCount
}

// FIXED: Safe filtering with proper null checks
export function filterProductsByCollection(products: Product[], collectionHandle: string): Product[] {
  try {
    return products.filter((product) => {
      if (!product) return false

      const tags = product.tags || []
      const productType = product.productType || ""

      return (
        tags.some((tag) => tag && tag.toLowerCase().includes(collectionHandle.toLowerCase())) ||
        productType.toLowerCase().includes(collectionHandle.toLowerCase())
      )
    })
  } catch (error) {
    console.warn("Error filtering products by collection:", error)
    return products
  }
}

export function searchProducts(products: Product[], searchTerm: string): Product[] {
  try {
    const term = searchTerm.toLowerCase()
    return products.filter((product) => {
      if (!product) return false

      const title = product.title || ""
      const description = product.description || ""
      const tags = product.tags || ""
      const productType = product.productType || ""

      return (
        title.toLowerCase().includes(term) ||
        description.toLowerCase().includes(term) ||
        tags.some((tag) => tag && tag.toLowerCase().includes(term)) ||
        productType.toLowerCase().includes(term)
      )
    })
  } catch (error) {
    console.warn("Error searching products:", error)
    return products
  }
}

export function sortProducts(products: Product[], sortBy: string): Product[] {
  try {
    const sorted = [...products]

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => {
          const priceA = Number.parseFloat(a?.priceRange?.minVariantPrice?.amount || "0")
          const priceB = Number.parseFloat(b?.priceRange?.minVariantPrice?.amount || "0")
          return priceA - priceB
        })
      case "price-high":
        return sorted.sort((a, b) => {
          const priceA = Number.parseFloat(a?.priceRange?.minVariantPrice?.amount || "0")
          const priceB = Number.parseFloat(b?.priceRange?.minVariantPrice?.amount || "0")
          return priceB - priceA
        })
      case "title-asc":
        return sorted.sort((a, b) => (a?.title || "").localeCompare(b?.title || ""))
      case "title-desc":
        return sorted.sort((a, b) => (b?.title || "").localeCompare(a?.title || ""))
      case "rating":
        return sorted.sort((a, b) => getProductRating(b) - getProductRating(a))
      case "newest":
        return sorted.reverse() // Assuming newer products come first from API
      default:
        return sorted
    }
  } catch (error) {
    console.warn("Error sorting products:", error)
    return products
  }
}
