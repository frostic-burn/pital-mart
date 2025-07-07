import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function BrandSections() {
  return (
    <div>
      {/* Virasat Section */}
      <section className="relative bg-[#ECE8DF] py-16 overflow-hidden">
        <div className="container mx-auto px-8 flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
          {/* Text Content */}
          <div className="max-w-xl relative z-10 text-center md:text-left px-4 md:px-0">
            <h2 className="text-4xl md:text-6xl font-lancelot text-[#8C1B1B] mb-2">VIRASAT</h2>
            <p className="text-xl md:text-2xl font-lancelot text-black mb-6">
              Pind di rasoi, har shehar vich!
            </p>
            <p className="text-gray-800 text-lg leading-relaxed mb-8">
              Looking to stock up for your store or gift clients with something rooted in heritage? Join hands with
              PitalMart for wholesale and bulk orders across India and overseas.
            </p>
            <Link href="/contact">
              <Button className="bg-[#8C1B1B] text-white text-lg font-medium px-8 py-4 rounded-full border border-white hover:bg-[#721616] transition">
                Request a Catalog
              </Button>
            </Link>
          </div>

          {/* Image */}
          <div className="w-full max-w-md lg:max-w-xl xl:w-[600px] relative z-10">
            <img
              src="https://i.ibb.co/gZWL1bTy/Cooking-Lady.png"
              alt="Main Cooking Lady"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Background Image */}
        <img
          src="https://i.ibb.co/YFtQDk1Z/Cooking-Lady-Background.png"
          alt="Faded Cooking Lady"
          className="absolute left-0 top-0 w-full max-w-[600px] opacity-10 z-0 pointer-events-none select-none"
          style={{ transform: "translateY(20px)" }}
        />
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
          <p className="text-gray-600 mb-8">
            Join our WhatsApp channel for new launches and festive combos!
          </p>

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
