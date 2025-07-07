"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import Image from "next/image"
import { reviews, getFeaturedReviews } from "@/data/reviews"
import { toast } from "react-toastify"

export default function TestimonialsPage() {
  const [currentReview, setCurrentReview] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    message: "",
    product: "",
  })
  const [getInTouchData, setGetInTouchData] = useState({
    email: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const featuredReviews = getFeaturedReviews(6)

  useEffect(() => {
    if (featuredReviews.length > 0) {
      const interval = setInterval(() => {
        setCurrentReview((prev) => (prev + 1) % featuredReviews.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [featuredReviews.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingReview(true)

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwP-jcbGlQWjh3QbL3p5dtR7elCMudaEznRF89AolY56O0Z1J6PPG9Ouf7CdO5la3uuPw/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            product: formData.product,
            rating: formData.rating,
            review: formData.message, // Note: using 'review' to match your Google Apps Script
          }),
        }
      )

      if (response.ok) {
        const result = await response.json()
        if (result.result === "Success") {
          toast.success("Thank you for your review! We appreciate your feedback.")
          setFormData({ name: "", email: "", rating: 5, message: "", product: "" })
        } else {
          throw new Error("Failed to submit review")
        }
      } else {
        throw new Error("Failed to submit review")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleGetInTouchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbw_e25nbapafGWjuhexAuM4IeZiX3Lq3H9XQmZ4-iPE60Fyps8C97UAwFn0IRquVWJeFA/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formType: "get-in-touch",
            email: getInTouchData.email,
          }),
        }
      )

      if (response.ok) {
        toast.success("Thank you! We'll get back to you soon.")
        setGetInTouchData({ email: "" })
      } else {
        throw new Error("Failed to submit form")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGetInTouchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGetInTouchData({ email: e.target.value })
  }

  // Early return if no reviews to prevent render errors
  if (!featuredReviews || featuredReviews.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-8 py-16">
          <p className="text-center text-gray-600">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Cooked with Love - Reviews Section */}
      <section className="py-16 bg-gray-100">
        
  {/* Extra space after section (approx. 2 lines) */}
  <div className="h-12 md:h-16" />
  <div className="max-w-6xl mx-auto px-4 md:px-8">
    <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
      {/* Left Side - Heading */}
      <div className="md:w-5/12">
        <h2 className="text-5xl md:text-6xl font-lancelot text-red-800 mb-2 leading-snug">
          Cooked with Love,
        </h2>
        <h3 className="text-5xl md:text-6xl font-lancelot text-red-800 leading-snug">
          Praised with Heart
        </h3>
      </div>

      {/* Right Side - Paragraph */}
      <div className="md:w-7/12 text-gray-700 leading-relaxed text-base">
        <p>
          Was it a gift? A memory? Share what made your purchase special. To share a moment, a memory, or a simple smile
          our products brought to your kitchen. From one family to another, your words inspire us to keep the legacy alive.
          <br />
          Write to us below — we're listening with love.
        </p>
      </div>
    </div>
  </div>
  
  {/* Extra space after section (approx. 2 lines) */}
  <div className="h-12 md:h-16" />
  {/* Extra space after section (approx. 2 lines) */}
  <div className="h-12 md:h-16" />
  {/* Extra space after section (approx. 2 lines) */}
  <div className="h-12 md:h-16" />

        <div className="container mx-auto px-8">
          <div className="relative overflow-hidden mb-12">
            <div
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentReview * 100}%)` }}
            >
              {featuredReviews.map((review, index) => (
                <div key={review.id || index} className="w-full flex-shrink-0 px-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, cardIndex) => (
                      <div key={cardIndex} className="bg-white rounded-lg overflow-hidden shadow-md">
                        <div className="aspect-square bg-gray-300 relative">
                          <Image
                            src={review.image || "/placeholder.svg"}
                            alt={`Customer photo of ${review.name || 'customer'} who reviewed ${review.product || 'product'}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{review.text || 'No review text'}</p>
                          <p className="font-medium text-gray-800">-{review.name || 'Anonymous'}</p>
                          {review.verified && <span className="text-xs text-green-600">✓ Verified Purchase</span>}
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

      {/* Write Review Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-lancelot text-red-800 mb-4">Share Your Experience</h2>
              <p className="text-gray-600">
                We'd love to hear about your experience with our brass utensils. Your feedback helps us serve you
                better.
              </p>
            </div>

            <Card className="bg-gray-50">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className="w-full"
                        disabled={isSubmittingReview}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="w-full"
                        disabled={isSubmittingReview}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">
                      Product Purchased
                    </label>
                    <Input
                      id="product"
                      name="product"
                      type="text"
                      value={formData.product}
                      onChange={handleInputChange}
                      placeholder="Which product did you purchase?"
                      className="w-full"
                      disabled={isSubmittingReview}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                          className="focus:outline-none disabled:opacity-50"
                          disabled={isSubmittingReview}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= formData.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {formData.rating} star{formData.rating !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Share your experience with our products..."
                      rows={5}
                      className="w-full resize-none"
                      disabled={isSubmittingReview}
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-red-700 hover:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 font-medium"
                    disabled={isSubmittingReview}
                  >
                    {isSubmittingReview ? "Submitting Review..." : "Submit Review"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final Brand Section */}
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

        {/* Decorative Images */}
        <Image
          src="https://i.ibb.co/0RXhg84X/Kolam-022.png"
          alt="Traditional Indian kolam pattern decoration"
          width={144}
          height={85}
          className="absolute left-[5%] top-1/2 transform -translate-y-1/2"
        />
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