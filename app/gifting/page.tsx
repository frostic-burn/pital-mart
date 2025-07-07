"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function GiftingPage() {
  const [selectedGift, setSelectedGift] = useState(0)

  const giftSets = [
    {
      id: 1,
      title: "Traditional Brass Dinner Set",
      price: "₹2,999",
      originalPrice: "₹3,999",
      image: "https://ik.imagekit.io/cacl2snorter/USP.png?updatedAt=1751541877736",
      description: "Complete brass dinner set with thali, bowls, and glasses",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 2,
      title: "Brass Cookware Combo",
      price: "₹4,499",
      originalPrice: "₹5,999",
      image: "https://ik.imagekit.io/cacl2snorter/Products%20Page.jpg?updatedAt=1751550177327",
      description: "Essential brass cookware set for healthy cooking",
      rating: 4.9,
      reviews: 89,
    },
    {
      id: 3,
      title: "Festive Brass Collection",
      price: "₹1,899",
      originalPrice: "₹2,499",
      image: "https://ik.imagekit.io/cacl2snorter/USP.png?updatedAt=1751541877736",
      description: "Beautiful brass items perfect for festivals and celebrations",
      rating: 4.7,
      reviews: 156,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-red-50 to-orange-50 overflow-hidden">
        <div className="container mx-auto px-8 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-5xl font-lancelot text-red-700 leading-tight">
                More Than a Gift —<br />
                It's a Blessing of Health & Care
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Give the gift of tradition, health, and love with our handcrafted brass collections. Perfect for
                weddings, festivals, and special occasions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 text-lg">Explore Gift Sets</Button>
                <Button
                  variant="outline"
                  className="border-red-700 text-red-700 hover:bg-red-50 px-8 py-3 text-lg bg-transparent"
                >
                  Custom Gifting
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative w-full h-[400px]">
                <Image
                  src="https://ik.imagekit.io/cacl2snorter/USP.png?updatedAt=1751541877736"
                  alt="Beautiful brass gift collection"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-lancelot text-red-700 mb-4">Perfect Gifts for Every Occasion</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From intimate family gatherings to grand celebrations, find the perfect brass gift that speaks from the
              heart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Wedding Gifts",
                image: "https://ik.imagekit.io/cacl2snorter/Products%20Page.jpg?updatedAt=1751550177327",
                description: "Bless the new couple with traditional brass sets",
              },
              {
                title: "Festival Specials",
                image: "https://ik.imagekit.io/cacl2snorter/USP.png?updatedAt=1751541877736",
                description: "Celebrate festivals with authentic brass items",
              },
              {
                title: "Housewarming",
                image: "https://ik.imagekit.io/cacl2snorter/Products%20Page.jpg?updatedAt=1751550177327",
                description: "Welcome prosperity with brass essentials",
              },
              {
                title: "Corporate Gifts",
                image: "https://ik.imagekit.io/cacl2snorter/USP.png?updatedAt=1751541877736",
                description: "Elegant brass gifts for business relationships",
              },
            ].map((category, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-200 relative overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-medium text-lg mb-2">{category.title}</h3>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gift Sets */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-lancelot text-red-700 mb-4">Curated Gift Collections</h2>
            <p className="text-gray-600">Thoughtfully assembled sets that make gifting effortless and meaningful.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {giftSets.map((gift, index) => (
              <Card key={gift.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-200 relative group">
                    <Image
                      src={gift.image || "/placeholder.svg"}
                      alt={gift.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors">
                      <Heart className="w-4 h-4 text-gray-600 hover:text-red-600" />
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="font-medium text-lg mb-2">{gift.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{gift.description}</p>

                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(gift.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-1">({gift.reviews})</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-red-700">{gift.price}</span>
                      <span className="text-sm text-gray-500 line-through">{gift.originalPrice}</span>
                    </div>

                    <Button className="w-full bg-red-700 hover:bg-red-800 text-white flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Gifts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-lancelot text-red-700 mb-4">Why Our Gifts Are Special</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🎁",
                title: "Beautiful Packaging",
                description: "Each gift comes in elegant traditional packaging",
              },
              {
                icon: "✨",
                title: "Handcrafted Quality",
                description: "Made by skilled artisans with attention to detail",
              },
              {
                icon: "💝",
                title: "Personal Touch",
                description: "Add custom messages and gift cards",
              },
              {
                icon: "🚚",
                title: "Safe Delivery",
                description: "Secure packaging ensures gifts arrive perfect",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-medium text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {giftSets.map((product, index) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-200 relative group">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-lancelot text-xl text-red-700 mb-2">Heart, Loved by All</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-lg font-bold text-red-700">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    </div>
                    <Button className="w-full bg-red-700 hover:bg-red-800 text-white">Shop Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-red-700">
        <div className="container mx-auto px-8 text-center">
          <h2 className="text-3xl font-lancelot text-white mb-4">Ready to Give the Perfect Gift?</h2>
          <p className="text-red-100 mb-8 max-w-2xl mx-auto">
            Browse our complete collection of brass gifts and find something special for your loved ones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="bg-white text-red-700 hover:bg-gray-100 px-8 py-3 text-lg">Shop All Gifts</Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-700 px-8 py-3 text-lg bg-transparent"
              >
                Custom Orders
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
