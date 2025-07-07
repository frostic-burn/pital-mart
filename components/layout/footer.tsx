import Link from "next/link"
import { Twitter, Linkedin, Instagram, Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#ECE8DF] py-12">
      {/* Top border line */}
      <div className="border-t-2 border-black mb-8"></div>

      <div className="container mx-auto px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Design Centre */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Design Centre</h3>
            <div className="text-gray-600 space-y-1">
              <p>123 Elite Avenue, Luxora</p>
              <p>Heights, New Delhi, India</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Contact</h3>
            <div className="text-gray-600 space-y-1">
              <p>+91 876 646 8907</p>
              <p>+91 876 646 8907</p>
            </div>
          </div>

          {/* E-mail */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">E-mail</h3>
            <div className="text-gray-600">
              <p>pitalmart@gmail.com</p>
            </div>
          </div>

          {/* Navigation Links and Social Media */}
          <div className="space-y-6">
            {/* Navigation Links */}
            <div className="flex flex-wrap gap-6 text-black font-semibold">
              <Link href="/products" className="hover:text-red-700 transition-colors">
                SHOP
              </Link>
              <Link href="/category" className="hover:text-red-700 transition-colors">
                COLLECTION
              </Link>
              <Link href="/about" className="hover:text-red-700 transition-colors">
                ABOUT
              </Link>
              <Link href="/virasat" className="hover:text-red-700 transition-colors">
                IN PITALMART
              </Link>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <Link href="#" className="text-black hover:text-red-700 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-black hover:text-red-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-black hover:text-red-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-black hover:text-red-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t-2 border-black">
          <div className="text-gray-600 mb-4 md:mb-0">@2025 All Rights Are Reserved By Pitalmart</div>
          <div className="flex space-x-8 text-gray-600">
            <Link href="/privacy" className="hover:text-red-700 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-red-700 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
