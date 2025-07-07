"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star, Minus, Plus, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { toast } from "react-toastify"
import type { Product } from "@/data/products"

interface ProductDetailClientProps {
  product: Product
}

const featuredProducts = [
  {
    name: "Traditional Brass Thali Set",
    price: "₹2,490.00",
    image: "https://ik.imagekit.io/cacl2snorter/thali-set.jpg?updatedAt=1751597724141"
  },
  {
    name: "Brass Water Pitcher",
    price: "₹1,890.00",
    image: "https://ik.imagekit.io/cacl2snorter/water-pitcher.jpg?updatedAt=1751597724232"
  },
  {
    name: "Decorative Brass Bowl",
    price: "₹1,290.00",
    image: "https://ik.imagekit.io/cacl2snorter/brass-bowl.jpg?updatedAt=1751597724182"
  },
  {
    name: "Brass Serving Tray",
    price: "₹3,490.00",
    image: "https://ik.imagekit.io/cacl2snorter/serving-tray.jpg?updatedAt=1751597724152"
  }
]

const reviews = [
  {
    id: 1,
    name: "Shivam Raj",
    rating: 5,
    date: "15 Oct 2024",
    text: "I've been using these utensils from Pitalmart for over six months now, and I can confidently say they have transformed my cooking experience. The Ghunmol and traditional charm these utensils bring to my kitchen fascinates me in my grandmother's house.",
    avatar: "https://ik.imagekit.io/cacl2snorter/avatar-1.jpg?updatedAt=1751597724141"
  }
]

export default function ProductDetailPage({ product }: ProductDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("Medium")
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)
  const [currentReview, setCurrentReview] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)
  const { addItem, addToWishlist, removeFromWishlist, isInWishlist } = useCart()

  // Debug: Log product data
  console.log("Product data:", product)
  console.log("Product images:", product.images)
  console.log("Selected image index:", selectedImageIndex)

  const handleAddToCart = async () => {
    setAddingToCart(true)
    try {
      addItem(product.id.toString(), quantity, {
        productId: product.id.toString(),
        variantId: product.id.toString(),
        title: product.name,
        price: product.price,
        image: product.image,
        handle: product.slug,
      })
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast.error("Failed to add item to cart. Please try again.")
    } finally {
      setAddingToCart(false)
    }
  }

  const handleAddToWishlist = () => {
    const productId = product.id.toString()
    if (isInWishlist(productId)) {
      removeFromWishlist(productId)
      toast.success(`${product.name} removed from wishlist!`)
    } else {
      addToWishlist({
        productId: productId,
        variantId: product.id.toString(),
        title: product.name,
        price: product.price,
        image: product.image,
        handle: product.slug,
      })
      toast.success(`${product.name} added to wishlist!`)
    }
  }

  const openFullscreen = (index) => {
    setFullscreenImageIndex(index)
    setIsFullscreenOpen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreenOpen(false)
  }

  const nextFullscreenImage = () => {
    const maxIndex = Math.max(product.images.length - 1, 0)
    setFullscreenImageIndex((prev) => (prev + 1) % (maxIndex + 1))
  }

  const prevFullscreenImage = () => {
    const maxIndex = Math.max(product.images.length - 1, 0)
    setFullscreenImageIndex((prev) => (prev - 1 + (maxIndex + 1)) % (maxIndex + 1))
  }

  const nextImage = () => {
    const maxIndex = Math.max(product.images.length - 1, 0)
    setSelectedImageIndex((prev) => (prev + 1) % (maxIndex + 1))
  }

  const prevImage = () => {
    const maxIndex = Math.max(product.images.length - 1, 0)
    setSelectedImageIndex((prev) => (prev - 1 + (maxIndex + 1)) % (maxIndex + 1))
  }

  // Auto-slide reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ECE8DF' }}>
      {/* Fullscreen Image Modal */}
      {isFullscreenOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <button onClick={closeFullscreen} className="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
              <X className="w-8 h-8" />
            </button>
            <button onClick={prevFullscreenImage} className="absolute left-4 text-white hover:text-gray-300 z-10">
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button onClick={nextFullscreenImage} className="absolute right-4 text-white hover:text-gray-300 z-10">
              <ChevronRight className="w-8 h-8" />
            </button>
            <img
              src={(product.images.length > 0 ? product.images[fullscreenImageIndex] : product.image) || product.image}
              alt={`${product.name} - Image ${fullscreenImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=400&width=400"
              }}
            />
          </div>
        </div>
      )}

      {/* Main Product Section */}
      <div className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-lg h-96 bg-white rounded-lg shadow-lg overflow-hidden relative">
              {/* Expand Icon */}
              <button 
                onClick={() => openFullscreen(selectedImageIndex)}
                className="absolute top-4 left-4 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center cursor-pointer z-10 hover:bg-green-700"
              >
                <Maximize2 className="w-4 h-4 text-white" />
              </button>
              
              {/* Loading state */}
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
                </div>
              )}
              
              <img
                src={(product.images.length > 0 ? product.images[selectedImageIndex] : product.image) || product.image}
                alt={product.name}
                className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                onLoad={() => setImageLoading(false)}
                onError={(e) => {
                  console.error("Image failed to load:", e.currentTarget.src)
                  e.currentTarget.src = "/placeholder.svg?height=400&width=400"
                  setImageLoading(false)
                }}
              />
            </div>
            
            {/* Thumbnail Images with Navigation */}
            <div className="flex items-center mt-6 gap-4">
              <button 
                onClick={prevImage}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex gap-3">
                {(product.images.length > 0 ? product.images : [product.image]).slice(0, 5).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 bg-white rounded-lg shadow cursor-pointer overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-green-600' : 'border-transparent hover:border-green-600'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=400&width=400"
                      }}
                    />
                  </button>
                ))}
              </div>
              
              <button 
                onClick={nextImage}
                className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="max-w-md bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-2">
              <span className="text-xs text-gray-500 mr-2">{product.category}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>

            <h1 className="text-center text-3xl font-lancelot text-red-700 mb-4">{product.name}</h1>

            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-4">
              <span className="text-2xl font-bold text-red-700">{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 ml-2 line-through">M.R.P {product.originalPrice}</span>
              )}
            </div>

            {product.originalPrice && (
              <p className="text-sm text-green-600 font-medium mb-4">
                You save ₹
                {(
                  parseFloat(product.originalPrice.replace(/[₹,]/g, "")) -
                  parseFloat(product.price.replace(/[₹,]/g, ""))
                ).toLocaleString()}
              </p>
            )}

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border rounded">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-1 border-x">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <select 
                value={selectedSize} 
                onChange={(e) => setSelectedSize(e.target.value)}
                className="border rounded px-3 py-1"
              >
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </div>

            <div className="flex gap-3 mb-4">
              <Button 
                onClick={handleAddToCart}
                disabled={addingToCart || !product.inStock}
                className="bg-red-700 hover:bg-red-800 text-white px-8 py-2 rounded-full flex-1"
              >
                {addingToCart ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </div>
                ) : (
                  "Add To Cart"
                )}
              </Button>
              <Button 
                onClick={handleAddToWishlist}
                variant="outline" 
                className="bg-white border-gray-300 w-12 h-10 rounded-full p-0"
              >
                <Heart className={`w-4 h-4 ${isInWishlist(product.id.toString()) ? 'text-red-500 fill-current' : ''}`} />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                <span className="text-xs text-gray-600 font-medium">PRODUCT DETAILS</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
                <span className="text-xs text-gray-600 font-medium">PRODUCT DISCLOSURE</span>
                <ChevronRight className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating & Reviews Section */}
      <div className="container mx-auto px-8 py-16">
        <h2 className="text-center text-4xl font-lancelot text-gray-800 mb-8">Rating & Reviews</h2>
        
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-start gap-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-800 mb-2">{product.rating}</div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">Based on {product.reviews} reviews</p>
              </div>
              
              <div className="flex-1">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-sm w-2">{stars}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 5}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-80">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full mr-3 overflow-hidden">
                      <img src={reviews[0].avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{reviews[0].name}</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 ml-auto">{reviews[0].date}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {reviews[0].text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Icons Section */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-8 bg-yellow-100 rounded-lg p-4">
            {[
              "https://ik.imagekit.io/cacl2snorter/Group%201686.png?updatedAt=1751597724141",
              "https://ik.imagekit.io/cacl2snorter/Group%201675.png?updatedAt=1751597724232",
              "https://ik.imagekit.io/cacl2snorter/Group%201673.png?updatedAt=1751597724182",
              "https://ik.imagekit.io/cacl2snorter/Group%201672.png?updatedAt=1751597724152",
              "https://ik.imagekit.io/cacl2snorter/Group%201674.png?updatedAt=1751597724136",
            ].map((src, i) => (
              <div key={i} className="w-36 h-5">
                <img
                  src={src}
                  alt={`Service ${i + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-lancelot text-gray-800">
            <span className="text-red-700">Best Sellers</span>
            <span className="mx-4 text-gray-400">•</span>
            <span className="text-red-700">New Arrivals</span>
            <span className="mx-4 text-gray-400">•</span>
            <span className="text-red-700">Combos</span>
          </h2>
        </div>
        
  {/* Extra space after section (approx. 2 lines) */}
  <div className="h-12 md:h-16" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-0">
                <div className="aspect-square relative bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-lancelot text-sm text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-red-700 font-semibold mb-3">{product.price}</p>
                  <Button className="w-full bg-red-700 hover:bg-red-800 text-white text-sm py-2" size="sm">
                    Add To Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Health Benefits Section */}
      <section className="py-16 bg-gray-200">
        <div className="container mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left side - Benefits */}
            <div className="lg:w-1/3 space-y-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <img
                    src="https://ik.imagekit.io/cacl2snorter/Group%201201.png?updatedAt=1751542984480"
                    alt="Icon"
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="text-lg font-lancelot font-medium mb-2">Rooted in Culture</h3>
                <p className="text-sm text-gray-600">
                  For generations, Punjabi homes have trusted pital for pure taste.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <img
                    src="https://ik.imagekit.io/cacl2snorter/Group%201202.png?updatedAt=1751542984418"
                    alt="Icon"
                    className="w-8 h-8"
                  />
                </div>
                <h3 className="text-lg font-lancelot font-medium mb-2">Durable Eco Beauty</h3>
                <p className="text-sm text-gray-600">
                  Long-lasting and aesthetically rich with 100% recyclable and sustainable.
                </p>
              </div>
            </div>
            {/* Center - Product Image */}
            <div className="lg:w-1/3 relative">
              <div className="mx-auto w-full max-w-md">
                <img
                  src="https://ik.imagekit.io/cacl2snorter/USP.png?updatedAt=1751541877736"
                  alt="Brass Product"
                  className="object-contain w-full h-auto"
                />
              </div>
            </div>
            {/* Right side - Health Stats */}
            <div className="lg:w-1/3 text-center">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <img
                  src="https://ik.imagekit.io/cacl2snorter/Group.png?updatedAt=1751542984420"
                  alt="Heart Icon"
                  className="w-8 h-8"
                />
              </div>
              <h3 className="text-lg font-lancelot font-medium mb-2">Health First</h3>
              <div className="text-4xl font-bold text-gray-800 mb-2">93%</div>
              <p className="text-sm text-gray-600">of nutrients, improves digestion, and boosts immunity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Brand Section - Join Channel Now */}
      <section className="relative py-16 bg-gray-100">
        <div className="container mx-auto px-8 text-center relative z-10">
          <div className="mb-8">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <img
                src="https://i.ibb.co/XfxKCSnF/Vector-2.png"
                alt="Decorative Pattern"
                className="w-16 h-9"
              />
            </div>
          </div>

          <h2 className="text-4xl font-lancelot text-gray-800 mb-4">PITAL MART</h2>
          <p className="text-gray-600 mb-8">Join our WhatsApp channel for new launches and festive combos!</p>

          <Button className="text-white px-8 py-3 rounded-full mb-8 font-semibold text-2xl bg-red-700 hover:bg-red-800">
            Join Channel Now
          </Button>
        </div>

        {/* Left Decorative Image */}
        <img
          src="https://i.ibb.co/0RXhg84X/Kolam-022.png"
          alt="Left Decorative Pattern"
          className="absolute left-5 top-1/2 transform -translate-y-1/2 w-36 h-20 opacity-50"
        />

        {/* Right Decorative Image */}
        <img
          src="https://i.ibb.co/0RXhg84X/Kolam-022.png"
          alt="Right Decorative Pattern"
          className="absolute right-5 top-1/2 transform -translate-y-1/2 w-36 h-20 opacity-50"
        />
      </section>
    </div>
  )
}