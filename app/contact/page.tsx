"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-toastify"

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Contact form submitted:", formData)
    toast.success("Thank you for your message! We will get back to you soon.")
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-[#f6f4ef]">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-lancelot text-red-800 mb-4">Contact Us</h1>
          </div>

          {/* Contact Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* General Inquiries */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">General Inquiries</h3>
              <div className="space-y-2 text-gray-600">
                <p>Pitalmart@workforyou.in</p>
                <p>+91 456 7234 578</p>
              </div>
            </div>

            {/* Careers */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Careers</h3>
              <div className="space-y-2 text-gray-600">
                <p>Hr@pitalmart.work</p>
              </div>
            </div>

            {/* Collaborations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Collaborations</h3>
              <div className="space-y-2 text-gray-600">
                <p>Pitalmart@collabforyou.in</p>
                <p>+91 456 7234 578</p>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Address</h3>
              <div className="space-y-2 text-gray-600">
                <p>181/86, Shastri Nagar,</p>
                <p>near bada bazar, No.-234</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="w-full h-64 md:h-80 relative rounded-lg overflow-hidden">
              <Image
                src="https://ik.imagekit.io/cacl2snorter/Local%20Image.png?updatedAt=1751612093124"
                alt="Traditional brass utensils workshop showcasing authentic craftsmanship"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-8 mb-12">
            <a href="#" className="text-gray-700 hover:text-red-800 transition font-medium">
              Instagram
            </a>
            <a href="#" className="text-gray-700 hover:text-red-800 transition font-medium">
              Facebook
            </a>
            <a href="#" className="text-gray-700 hover:text-red-800 transition font-medium">
              Twitter
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}