import { Card, CardContent } from "@/components/ui/card"
import { Award, Users, Globe, Heart } from "lucide-react"
import Image from "next/image"

export default function AboutUsPage() {
  const values = [
    {
      icon: <Award className="w-8 h-8 text-red-700" />,
      title: "Quality Craftsmanship",
      description:
        "Every piece is handcrafted by skilled artisans using traditional techniques passed down through generations.",
    },
    {
      icon: <Users className="w-8 h-8 text-red-700" />,
      title: "Community Support",
      description: "We support local artisan communities and help preserve traditional brass-making skills.",
    },
    {
      icon: <Globe className="w-8 h-8 text-red-700" />,
      title: "Global Reach",
      description:
        "Bringing authentic Punjabi brass utensils to customers worldwide while maintaining quality standards.",
    },
    {
      icon: <Heart className="w-8 h-8 text-red-700" />,
      title: "Customer Care",
      description: "Dedicated to providing exceptional customer service and ensuring complete satisfaction.",
    },
  ]

  const team = [
    {
      name: "Harpreet Singh",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=200&width=200",
      description: "Third-generation brass craftsman with 30+ years of experience",
    },
    {
      name: "Simran Kaur",
      role: "Head of Design",
      image: "/placeholder.svg?height=200&width=200",
      description: "Expert in traditional Punjabi designs and modern adaptations",
    },
    {
      name: "Manjeet Singh",
      role: "Master Craftsman",
      image: "/placeholder.svg?height=200&width=200",
      description: "40+ years of experience in brass utensil manufacturing",
    },
  ]

  return (
    <div className="py-16">
      <div className="container mx-auto px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif text-red-700 mb-6">About PITAL MART</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            For over seven decades, PITAL MART has been the guardian of Punjab's rich tradition of brass craftsmanship.
            We are more than just a business—we are custodians of culture, preserving the ancient art of brass-making
            while adapting to modern needs.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-serif text-red-700 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in 1950 by Master Gurbachan Singh in the heart of Amritsar, PITAL MART began as a small family
                workshop dedicated to creating authentic brass utensils using time-honored techniques.
              </p>
              <p>
                What started as a local craft has grown into a globally recognized brand, yet we remain true to our
                roots. Every piece that leaves our workshop carries the soul of Punjab—the warmth of our culture, the
                strength of our traditions, and the love of our craftsmen.
              </p>
              <p>
                Today, under the leadership of the third generation, we continue to honor our heritage while embracing
                innovation, ensuring that the art of brass-making thrives for generations to come.
              </p>
            </div>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Traditional brass workshop"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif text-red-700 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-white text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif text-red-700 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="bg-white text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-red-700 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <Card className="bg-red-50">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-serif text-red-700 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              To preserve and promote the rich heritage of Punjabi brass craftsmanship while providing authentic,
              high-quality products that bring tradition, health, and beauty to modern homes around the world.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
