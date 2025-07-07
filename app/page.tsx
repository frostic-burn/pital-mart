"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { products } from "@/data/products"
import { reviews } from "@/data/reviews"
import { useCart } from "@/contexts/cart-context"
import { toast } from "react-toastify"

export default function HomePage() {
  const [currentReview, setCurrentReview] = useState(0)
  const { addItem } = useCart()

  // Get first 4 products for display
  const featuredProducts = products.slice(0, 4)
  const favoriteProducts = products.slice(4, 8)

  // Auto-scroll for reviews
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleAddToCart = (product: any) => {
    addItem(product.id.toString(), 1, {
      productId: product.id.toString(),
      variantId: product.id.toString(),
      title: product.name,
      price: product.price,
      image: product.image,
      handle: product.slug,
    })
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="py-8 relative bg-white overflow-hidden">
        {/* Top Center Red Vector */}
        <div className="flex justify-center mb-1">
          
        </div>

        {/* Title */}
        <Link href="/" className="block">
          
        </Link>

        {/* Description */}
        <p className="text-lg text-center text-gray-700 max-w-4xl mx-auto leading-relaxed mb-6 px-4">
          Experience the true essence of Punjab through our exquisitely handcrafted brass utensils—each piece a tribute
          to time-honoured traditions, rooted in health, and crafted to be passed down through generations. These aren't
          just kitchen tools—they're that carry the flavour of culture
        </p>

        {/* Center Utensil Image */}
        <div className="relative mb-6 px-4">
          <img
            src="https://ik.imagekit.io/cacl2snorter/Utensils.png?updatedAt=1751538751530"
            alt="Brass Utensils"
            width="1057"
            height="413"
            className="mx-auto object-contain"
          />
        </div>

        {/* Faded Kolam Left */}
        <img
          src="https://i.ibb.co/0RXhg84X/Kolam-022.png"
          alt="Kolam Left"
          width="179"
          height="106"
          className="absolute left-4 lg:left-20 top-[50%] transform -translate-y-1/2 opacity-90 hidden md:block"
        />

        {/* Faded Kolam Right */}
        <img
          src="https://i.ibb.co/0RXhg84X/Kolam-022.png"
          alt="Kolam Right"
          width="179"
          height="106"
          className="absolute right-4 lg:right-20 top-[50%] transform -translate-y-1/2 opacity-90 hidden md:block"
        />

        {/* Black Kolam Left & Right (bottom corner) */}
        <img
          src="https://i.ibb.co/tMCQgk3W/Kolam-02.png"
          alt="Black Kolam Left"
          width="56"
          height="36"
          className="absolute bottom-4 left-4 hidden md:block"
        />
        <img
          src="https://i.ibb.co/tMCQgk3W/Kolam-02.png"
          alt="Black Kolam Right"
          width="56"
          height="36"
          className="absolute bottom-4 right-4 hidden md:block"
        />

        {/* Brand Partner Logos */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-4">
          <img src="https://i.ibb.co/wZdRbk4B/hot.png" alt="Hot" className="h-9" />
          <img src="https://i.ibb.co/ZRg1tt11/Group.png" alt="ISO" className="h-9" />
          <img src="https://i.ibb.co/CK4jKtsk/Group-1.png" alt="CC" className="h-9" />
          <img src="https://i.ibb.co/FbHCTDFn/Group-2.png" alt="Inc42" className="h-9" />
          <img src="https://i.ibb.co/nqrmcjqf/Group-3.png" alt="Vogue" className="h-9" />
        </div>
      </section>

      {/* Tradition & Categories Section */}
      <section className="bg-[#ECE8DF] py-16">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-lancelot text-[#8C1B1B] mb-4">Bringing Tradition to the Table</h2>
            <p className="text-gray-700 max-w-2xl mx-auto text-lg">
              In every textured detail lies a purpose— Each piece lovingly crafted to grace every corner of your home
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Promo Card Column */}
            <div
              className="relative w-full max-w-[337px] h-[412px] rounded-2xl overflow-hidden justify-self-center lg:justify-self-end"
              style={{
                backgroundImage: "url('https://i.ibb.co/gMv29bvF/Pital-Mart-Categories.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-between items-center text-white text-center p-6">
                <div>
                  <h3 className="text-4xl font-lancelot mb-2 tracking-widest">PITAL MART</h3>
                  <div className="w-12 h-[2px] bg-white mx-auto mb-6" />
                  <p className="text-sm leading-relaxed">
                    Celebrate tradition with a gift that's meaningful, memorable, and rooted in timeless health
                    benefits.
                  </p>
                </div>
                <Link
                  href="/category"
                  className="mt-4 inline-block px-6 py-2 border-2 border-white text-white text-sm rounded-full hover:bg-white hover:text-[#8C1B1B] transition"
                >
                  Shop All Categories
                </Link>
              </div>
            </div>

            {/* Category Grid Column */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              <Link href="/category?filter=cookware">
                <img
                  src="https://i.ibb.co/rRZ8qpW9/Category-01.png"
                  alt="Cookware"
                  className="rounded-xl w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </Link>
              <Link href="/category?filter=serveware">
                <img
                  src="https://i.ibb.co/wNCk5TfZ/Category-02.png"
                  alt="Serveware"
                  className="rounded-xl w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </Link>
              <Link href="/category?filter=storage">
                <img
                  src="https://i.ibb.co/cXpkbp65/Category-03.png"
                  alt="Storage"
                  className="rounded-xl w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </Link>
              <Link href="/category?filter=tools">
                <img
                  src="https://i.ibb.co/ymQ8KCpq/Category-04.png"
                  alt="Tools"
                  className="rounded-xl w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-lancelot">
              <span className="text-gray-400">Best Sellers</span>
              <span className="text-gray-400 mx-2">.</span>
              <span className="text-red-700">New Arrivals</span>
              <span className="text-gray-400 mx-2">.</span>
              <span className="text-gray-400">Combos</span>
            </h2>
          </div>
          
  {/* Extra space after section (approx. 2 lines) */}
  <div className="h-12 md:h-16" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col"
              >
                <CardContent className="p-0 flex flex-col flex-grow">
                  <Link href={`/product/${product.slug}`} className="flex flex-col flex-grow cursor-pointer">
                    <div className="aspect-square relative bg-gray-100">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-medium text-gray-800 mb-2 text-sm leading-tight flex-grow">{product.name}</h3>
                      <p className="text-gray-600 mb-3">{product.price}</p>
                    </div>
                  </Link>
                  <div className="p-4 pt-0">
                    <Button 
                      className="w-full bg-red-700 hover:bg-red-800 text-white text-sm py-2" 
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add To Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/products">
              <Button className="bg-red-700 hover:bg-red-800 text-white px-8 py-3">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Virasat Section */}
      <section className="relative bg-[#ECE8DF] py-16 overflow-hidden">
        <div className="container mx-auto px-8 flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
          <div className="max-w-xl relative z-10 text-center md:text-left px-4 md:px-0">
            <h2 className="text-4xl md:text-6xl font-lancelot text-[#8C1B1B] mb-2">VIRASAT</h2>
            <p className="text-xl md:text-2xl font-lancelot text-black mb-6">Pind di rasoi, har shehar vich!</p>
            <p className="text-gray-800 text-lg leading-relaxed mb-8">
              Looking to stock up for your store or gift clients with something rooted in heritage? Join hands with
              PitalMart for wholesale and bulk orders across India and overseas.
            </p>
            <Link href="/contact">
              <button className="bg-[#8C1B1B] text-white text-lg font-medium px-8 py-4 rounded-full border border-white hover:bg-[#721616] transition">
                Request a Catalog
              </button>
            </Link>
          </div>

          <div className="w-full max-w-md lg:max-w-xl xl:w-[600px] relative z-10">
            <img
              src="https://i.ibb.co/gZWL1bTy/Cooking-Lady.png"
              alt="Main Cooking Lady"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        <img
          src="https://i.ibb.co/YFtQDk1Z/Cooking-Lady-Background.png"
          alt="Faded Cooking Lady"
          className="absolute left-0 top-0 w-full max-w-[600px] opacity-10 z-0 pointer-events-none select-none"
          style={{ transform: "translateY(20px)" }}
        />
        
  {/* Extra space after section (approx. 2 lines) */}
  <div className="h-12 md:h-16" />
      </section>

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
                <h3 className="text-lg font-medium mb-2">Rooted in Culture</h3>
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
                <h3 className="text-lg font-medium mb-2">Durable Eco Beauty</h3>
                <p className="text-sm text-gray-600">
                  Long-lasting and aesthetically rich with 100% recyclable and sustainable.
                </p>
              </div>
            </div>

            {/* Center - Product Image */}
            <div className="lg:w-1/3 relative">
              <div className="mx-auto w-full max-w-[500px]">
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
              <h3 className="text-lg font-medium mb-2">Health First</h3>
              <div className="text-4xl font-bold text-gray-800 mb-2">93%</div>
              <p className="text-sm text-gray-600">of nutrients, improves digestion, and boosts immunity.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <h2 className="text-3xl font-lancelot mb-4 text-[rgba(147,14,19,1)]">More Than a Gift - It's a</h2>
            <h3 className="text-3xl font-lancelot mb-6 text-[rgba(147,14,19,1)]">Blessing of Health & Care</h3>
            <p className="text-gray-600 mb-8">Shaadi ho ya grihapravesh, brass ka tohfa kare dil se pravesh.</p>
            <Link href="/gifting">
              <Button className="text-white px-8 py-3 rounded-full border-[rgba(147,14,19,1)] bg-[rgba(147,14,19,1)] text-3xl font-semibold">
                Find All Gift Categories
              </Button>
            </Link>
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
            <Link href="/contact">
              <Button className="mt-6 text-white px-8 py-3 rounded-full bg-[rgba(147,14,19,1)]">
                Write Us a Little Note
              </Button>
            </Link>
          </div>

          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
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
                            alt="Customer Photo"
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

      {/* Don't Miss These Favourites Section */}
      <section className="py-16">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-lancelot text-gray-800 mb-8">Don't Miss These Favourite!</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col"
              >
                <CardContent className="p-0 flex flex-col flex-grow">
                  <Link href={`/product/${product.slug}`}>
                    <div className="aspect-square relative bg-gray-100">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-medium text-gray-800 mb-2 text-sm leading-tight flex-grow">{product.name}</h3>
                    <p className="text-gray-600 mb-3">{product.price}</p>
                    <Button 
                      className="w-full bg-black text-white text-sm py-2" 
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add To Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Quality Section */}
      <section className="py-16 bg-[#ECE8DF]">
        <div className="container mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-lancelot mb-4 text-[rgba(147,14,19,1)]">Bringing Premium Quality</h2>
            <p className="text-gray-700 mb-1">To every corner of your home—</p>
            <p className="text-gray-700">because your home deserves the best</p>
          </div>

          {/* Flex container with even spacing */}
          <div className="mx-auto max-w-[924px] flex flex-wrap justify-between items-center gap-y-6">
            <img src="https://i.ibb.co/TxPvMzTQ/Group-1235.png" alt="" className="h-[119px] object-contain" />
            <img src="https://i.ibb.co/DHXRpDvG/Group-1236.png" alt="" className="h-[119px] object-contain" />
            <img src="https://i.ibb.co/20DC1HmJ/Group-1237.png" alt="" className="h-[119px] object-contain" />
            <img src="https://i.ibb.co/84n1jmGS/Group-1238.png" alt="" className="h-[119px] object-contain" />
            <img src="https://i.ibb.co/DgLBQh46/Group-1239.png" alt="" className="h-[119px] object-contain" />
            <img src="https://i.ibb.co/CKv4kmpS/Group-1234.png" alt="" className="h-[119px] object-contain" />
            <img src="https://i.ibb.co/kgKWnfzz/Group-1233.png" alt="" className="h-[119px] object-contain" />
          </div>
        </div>
      </section>

      {/* Singh saab section */}
      <section className="py-12 bg-[#ECE8DF]">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <img
              src="https://i.ibb.co/DH3TN6wm/Group-1244.png"
              alt="Singh saab doing kirt, wjkkjkf"
              width={931}
              height={340}
              className="w-[931px] h-[340px] object-contain"
            />
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
                className="w-[63px] h-[37px]"
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
        <img
          src="https://i.ibb.co/0RXhg84X/Kolam-022.png"
          alt="Left Decorative Pattern"
          className="absolute left-[5%] top-1/2 transform -translate-y-1/2 w-[144px] h-[85px]"
        />

        {/* Right Decorative Image */}
        <img
          src="https://i.ibb.co/0RXhg84X/Kolam-022.png"
          alt="Right Decorative Pattern"
          className="absolute right-[5%] top-1/2 transform -translate-y-1/2 w-[144px] h-[85px]"
        />
      </section>
    </div>
  )
}
