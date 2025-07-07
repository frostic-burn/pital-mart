"use client"

import { useState, useEffect } from "react"
import { Search, Heart, ShoppingCart, User, Menu, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { fetchShopifyProducts, searchProducts, getProductPrice, getProductMainImage, type ShopifyProduct } from "@/lib/shopify-products"
import Image from "next/image"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<ShopifyProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { totalItems } = useCart()

  // Load products for search
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      try {
        const productsData = await fetchShopifyProducts(100)
        const productsList = productsData?.edges?.map((edge: any) => edge.node) || []
        setProducts(productsList)
      } catch (error) {
        console.error("Error loading products for search:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isSearchOpen) {
      loadProducts()
    }
  }, [isSearchOpen])

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = searchProducts(products, searchTerm)
      setFilteredProducts(filtered.slice(0, 8)) // Limit to 8 results for better UX
    } else {
      setFilteredProducts([])
    }
  }, [searchTerm, products])

  const sidebarItems = [
    { name: "Home", href: "/" },
    { name: "Shop All", href: "/products" },
    { name: "Categories", href: "/category" },
    { name: "My Profile", href: "/profile" },
    { name: "Virasat", href: "/virasat" },
    { name: "My Orders", href: "/orders" },
    { name: "Gifting", href: "/gifting" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ]

  const collectionItems = [
    ["Dosa Tawa", "Tawa", "Kadai", "Prant", "Sauce Pan", "Patila", "Lagan", "Lassi Glass"],
    ["Glass", "Ghee Pot", "Kundi Sota", "Dinner Set", "Katori", "Spoons", "Masala Dani", "Cooker"],
    ["Thali", "Handi", "Kadhai", "Bowls"],
  ]

  const giftingItems = ["Corporate", "Wedding", "Personal"]

  // Function to close all menus
  const closeAllMenus = () => {
    setIsMobileMenuOpen(false)
    setIsMegaMenuOpen(false)
  }

  const handleSearchClose = () => {
    setIsSearchOpen(false)
    setSearchTerm("")
    setFilteredProducts([])
  }

  return (
    <>
      <header
        className="bg-[#ECE8DF] text-gray-800 sticky top-0 z-50 border-b border-gray-300/70"
        onMouseLeave={() => setIsMegaMenuOpen(false)}
      >
        <div className="container mx-auto px-4 h-32 flex items-center justify-between relative">
          {/* Left Side: Mobile Menu Toggle / Desktop Shop Button */}
          <div className="flex items-center lg:w-1/3">
            {/* Mobile hamburger menu */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-8 h-8 text-red-700" />
            </Button>

            {/* Desktop Shop Button */}
            <Button
              variant="ghost"
              className="hidden md:flex items-center space-x-3 text-red-700 hover:text-red-800 hover:bg-red-50 px-4 py-3 text-lg"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
            >
              <Menu className="rounded-lg h-9 w-9 py-0 my-0 mx-px px-0" />
              <span className="font-extrabold leading-9 text-right text-3xl">Shop</span>
            </Button>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8 ml-10">
              <Link href="/category" className="text-red-700 hover:text-red-800 font-medium text-lg">
                Categories
              </Link>
              <Link href="/products" className="text-red-700 hover:text-red-800 font-medium text-lg">
                Products
              </Link>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="text-center">
              <div className="flex flex-col items-center">
                <img src="https://i.ibb.co/vvPM0njt/Vector-1.png" alt="Logo Symbol" className="w-16 h-10 mb-2" />
                <h1 className="text-5xl font-lancelot text-[#a22020] leading-tight">PITAL MART</h1>
              </div>
            </Link>
          </div>

          {/* Right Side: Icons */}
          <div className="flex items-center justify-end space-x-6 lg:w-1/3 flex-row font-extrabold">
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="p-0">
                  <Search className="w-6 h-6 cursor-pointer text-red-700 hover:text-red-800" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-4">
                    <Search className="w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 border-0 focus-visible:ring-0 text-lg"
                      autoFocus
                    />
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
                      </div>
                    ) : searchTerm.trim() ? (
                      filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {filteredProducts.map((product) => {
                            const price = getProductPrice(product)
                            const mainImage = getProductMainImage(product)
                            
                            return (
                              <Link
                                key={product.id}
                                href={`/product/${product.handle}`}
                                onClick={handleSearchClose}
                                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={mainImage || "/placeholder.svg"}
                                    alt={product.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-medium text-gray-900 truncate">{product.title}</h3>
                                  <p className="text-sm text-gray-500 truncate">{product.description?.slice(0, 100)}</p>
                                  <p className="text-red-700 font-medium">{price}</p>
                                </div>
                              </Link>
                            )
                          })}
                          {filteredProducts.length === 8 && (
                            <div className="text-center py-4">
                              <Link
                                href={`/products?search=${encodeURIComponent(searchTerm)}`}
                                onClick={handleSearchClose}
                                className="text-red-700 hover:text-red-800 font-medium"
                              >
                                View all results →
                              </Link>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No products found for "{searchTerm}"</p>
                          <Link
                            href="/products"
                            onClick={handleSearchClose}
                            className="text-red-700 hover:text-red-800 font-medium mt-2 inline-block"
                          >
                            Browse all products
                          </Link>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-8">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Start typing to search products</p>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Link href="/wishlist">
              <Heart className="hidden md:block w-6 h-6 cursor-pointer text-red-700 hover:text-red-800" />
            </Link>
            <Link href="/cart" className="relative">
              <ShoppingCart className="hidden md:block w-6 h-6 cursor-pointer text-red-700 hover:text-red-800" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
            <Link href="/profile">
              <User className="hidden md:block w-6 h-6 cursor-pointer text-red-700 hover:text-red-800" />
            </Link>
          </div>
        </div>

        {/* Desktop Mega Menu */}
        {isMegaMenuOpen && (
          <div className="hidden md:block absolute left-0 right-0 top-full bg-white shadow-2xl z-[100] border-t-4 border-red-700">
            <div className="flex container mx-auto">
              <div className="w-80 bg-gray-50 p-6 border-r border-gray-200">
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={closeAllMenus}
                      className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors group"
                    >
                      <span className="font-medium">{item.name}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex-1 p-8">
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <h2 className="text-3xl font-lancelot text-red-700 mb-6">Our Collection</h2>
                    <div className="grid grid-cols-3 gap-x-8 gap-y-4">
                      {collectionItems.map((column, colIndex) => (
                        <div key={colIndex} className="space-y-3">
                          {column.map((item) => (
                            <Link
                              key={item}
                              href={`/category?filter=${item.toLowerCase().replace(/\s+/g, "-")}`}
                              onClick={closeAllMenus}
                              className="block text-gray-700 hover:text-red-700 transition-colors font-medium"
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-lancelot text-red-700 mb-6">Giftings</h2>
                    <div className="space-y-3">
                      {giftingItems.map((item) => (
                        <Link
                          key={item}
                          href={`/gifting?type=${item.toLowerCase()}`}
                          onClick={closeAllMenus}
                          className="block text-gray-700 hover:text-red-700 transition-colors font-medium"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-[100]" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#ECE8DF] p-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-lancelot text-red-700">Menu</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-red-700" />
              </Button>
            </div>
            <nav className="flex-grow">
              <ul className="space-y-2">
                {sidebarItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={closeAllMenus}
                      className="flex items-center justify-between p-4 text-lg font-medium text-gray-800 hover:bg-red-50 rounded-lg group"
                    >
                      {item.name}
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-700" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex items-center justify-around p-4 border-t border-gray-300/70">
              <Button variant="ghost" size="icon" onClick={() => { setIsSearchOpen(true); setIsMobileMenuOpen(false); }}>
                <Search className="w-6 h-6 text-red-700" />
              </Button>
              <Link href="/profile" onClick={closeAllMenus}>
                <User className="w-6 h-6 text-red-700" />
              </Link>
              <Link href="/wishlist" onClick={closeAllMenus}>
                <Heart className="w-6 h-6 text-red-700" />
              </Link>
              <Link href="/cart" onClick={closeAllMenus} className="relative">
                <ShoppingCart className="w-6 h-6 text-red-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}