export interface Product {
  id: number
  shopifyId?: string
  name: string
  price: string
  originalPrice?: string
  image: string
  category: string
  description: string
  features: string[]
  inStock: boolean
  rating: number
  reviews: number
  images: string[]
  slug: string
  tags: string[]
  vendor?: string
  weight?: string
  dimensions?: string
  material: string
  careInstructions: string[]
  seoTitle?: string
  seoDescription?: string
}

export const products: Product[] = [
  {
    id: 1,
    shopifyId: "gid://shopify/Product/1",
    name: "Antique Gold Brass Roti Box",
    price: "₹2,457",
    originalPrice: "₹3,200",
    image: "https://i.ibb.co/y1024bf/image.png",
    category: "Storage",
    description:
      "Handcrafted brass roti box with intricate traditional designs. Perfect for storing rotis and keeping them warm.",
    features: ["Handcrafted", "Food Safe", "Easy to Clean", "Traditional Design"],
    inStock: true,
    rating: 4.5,
    reviews: 23,
    images: [
      "https://i.ibb.co/y1024bf/image.png",
      "https://ik.imagekit.io/cacl2snorter/image%2045.png?updatedAt=1751598401461",
      "/placeholder.svg?height=400&width=400",
    ],
    slug: "antique-gold-brass-roti-box",
    tags: ["brass", "storage", "traditional", "handcrafted"],
    vendor: "PitalMart",
    weight: "1.2 kg",
    dimensions: "25cm x 25cm x 8cm",
    material: "Pure Brass",
    careInstructions: ["Hand wash only", "Dry immediately", "Polish regularly"],
    seoTitle: "Antique Gold Brass Roti Box - Traditional Storage | PitalMart",
    seoDescription:
      "Handcrafted brass roti box with traditional designs. Perfect for storing rotis and keeping them warm. Shop authentic brass utensils at PitalMart.",
  },
  {
    id: 2,
    shopifyId: "gid://shopify/Product/2",
    name: "Brass Mortar and Pestle (Okhli)",
    price: "₹2,457",
    originalPrice: "₹3,100",
    image: "https://i.ibb.co/1YQswV9r/image-1.png",
    category: "Cookware",
    description:
      "Traditional brass mortar and pestle for grinding spices and making chutneys. Essential for authentic Indian cooking.",
    features: ["Heavy Duty", "Non-Slip Base", "Easy to Clean", "Durable"],
    inStock: true,
    rating: 4.8,
    reviews: 45,
    images: [
      "https://i.ibb.co/1YQswV9r/image-1.png",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    slug: "brass-mortar-pestle-okhli",
    tags: ["brass", "cookware", "grinding", "traditional"],
    vendor: "PitalMart",
    weight: "2.5 kg",
    dimensions: "15cm diameter x 12cm height",
    material: "Pure Brass",
    careInstructions: ["Hand wash only", "Season before first use", "Dry thoroughly"],
    seoTitle: "Brass Mortar and Pestle (Okhli) - Traditional Cookware | PitalMart",
    seoDescription:
      "Traditional brass mortar and pestle for authentic Indian cooking. Perfect for grinding spices and making chutneys. Shop at PitalMart.",
  },
  {
    id: 3,
    shopifyId: "gid://shopify/Product/3",
    name: "Traditional Brass Thali Set",
    price: "₹3,299",
    originalPrice: "₹4,100",
    image: "https://i.ibb.co/HTM6YCXM/image-2.png",
    category: "Serveware",
    description:
      "Complete brass thali set for traditional dining experience. Includes thali, bowls, and serving spoons.",
    features: ["Complete Set", "Traditional Design", "Food Safe", "Easy Maintenance"],
    inStock: true,
    rating: 4.7,
    reviews: 32,
    images: [
      "https://i.ibb.co/HTM6YCXM/image-2.png",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    slug: "traditional-brass-thali-set",
    tags: ["brass", "serveware", "thali", "dining"],
    vendor: "PitalMart",
    weight: "1.8 kg",
    dimensions: "30cm diameter thali with 6 bowls",
    material: "Pure Brass",
    careInstructions: ["Hand wash with mild soap", "Dry immediately", "Polish monthly"],
    seoTitle: "Traditional Brass Thali Set - Complete Dining Set | PitalMart",
    seoDescription:
      "Complete brass thali set for traditional dining. Includes thali, bowls, and serving spoons. Authentic brass dinnerware at PitalMart.",
  },
  {
    id: 4,
    shopifyId: "gid://shopify/Product/4",
    name: "Brass Water Pitcher",
    price: "₹1,899",
    originalPrice: "₹2,400",
    image: "https://i.ibb.co/603wv1vC/image-3.png",
    category: "Drinkware",
    description: "Elegant brass water pitcher with health benefits. Keeps water cool and adds essential minerals.",
    features: ["Health Benefits", "Temperature Control", "Elegant Design", "Easy Pour"],
    inStock: true,
    rating: 4.6,
    reviews: 28,
    images: [
      "https://i.ibb.co/603wv1vC/image-3.png",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    slug: "brass-water-pitcher",
    tags: ["brass", "drinkware", "health", "water"],
    vendor: "PitalMart",
    weight: "0.8 kg",
    dimensions: "20cm height x 12cm diameter",
    material: "Pure Brass",
    careInstructions: ["Rinse before first use", "Clean with lemon and salt", "Dry completely"],
    seoTitle: "Brass Water Pitcher - Healthy Drinking Vessel | PitalMart",
    seoDescription:
      "Elegant brass water pitcher with health benefits. Keeps water cool and adds essential minerals. Shop authentic brass drinkware.",
  },
  {
    id: 5,
    shopifyId: "gid://shopify/Product/5",
    name: "Brass Kadai Set",
    price: "₹4,299",
    originalPrice: "₹5,200",
    image: "https://i.ibb.co/k28K5LKg/image-4.png",
    category: "Cookware",
    description: "Heavy-duty brass kadai perfect for deep frying and cooking. Comes with matching ladle.",
    features: ["Heavy Duty", "Even Heat Distribution", "Includes Ladle", "Professional Grade"],
    inStock: true,
    rating: 4.9,
    reviews: 67,
    images: [
      "https://i.ibb.co/k28K5LKg/image-4.png",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    slug: "brass-kadai-set",
    tags: ["brass", "cookware", "kadai", "frying"],
    vendor: "PitalMart",
    weight: "3.2 kg",
    dimensions: "28cm diameter x 12cm depth",
    material: "Pure Brass",
    careInstructions: ["Season before use", "Hand wash only", "Oil lightly after cleaning"],
    seoTitle: "Brass Kadai Set - Professional Cookware | PitalMart",
    seoDescription:
      "Heavy-duty brass kadai perfect for deep frying and cooking. Includes matching ladle. Professional grade brass cookware.",
  },
  {
    id: 6,
    shopifyId: "gid://shopify/Product/6",
    name: "Brass Serving Bowl Set",
    price: "₹2,899",
    originalPrice: "₹3,500",
    image: "https://i.ibb.co/939095h6/image-5.png",
    category: "Serveware",
    description: "Set of brass serving bowls in different sizes. Perfect for serving curries, dal, and rice.",
    features: ["Multiple Sizes", "Stackable", "Easy to Clean", "Versatile Use"],
    inStock: true,
    rating: 4.4,
    reviews: 19,
    images: [
      "https://i.ibb.co/939095h6/image-5.png",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    slug: "brass-serving-bowl-set",
    tags: ["brass", "serveware", "bowls", "serving"],
    vendor: "PitalMart",
    weight: "1.5 kg",
    dimensions: "Set of 5 bowls (8cm to 16cm diameter)",
    material: "Pure Brass",
    careInstructions: ["Hand wash with warm water", "Dry immediately", "Stack carefully"],
    seoTitle: "Brass Serving Bowl Set - Traditional Serveware | PitalMart",
    seoDescription:
      "Set of brass serving bowls in different sizes. Perfect for serving curries, dal, and rice. Traditional brass serveware.",
  },
]

export const categories = [
  { name: "Cookware", slug: "cookware", description: "Traditional brass cooking utensils" },
  { name: "Serveware", slug: "serveware", description: "Elegant brass serving items" },
  { name: "Storage", slug: "storage", description: "Brass storage containers and boxes" },
  { name: "Drinkware", slug: "drinkware", description: "Brass water vessels and drinking items" },
  { name: "Cutlery", slug: "cutlery", description: "Traditional brass cutlery sets" },
  { name: "Pooja", slug: "pooja", description: "Brass items for religious ceremonies" },
  { name: "Decor", slug: "decor", description: "Decorative brass items for home" },
]

// Helper functions for Shopify integration
export const getProductById = (id: number): Product | undefined => {
  return products.find((product) => product.id === id)
}

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((product) => product.slug === slug)
}

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((product) => product.category.toLowerCase() === category.toLowerCase())
}

export const getFeaturedProducts = (limit = 4): Product[] => {
  return products.slice(0, limit)
}

export const getProductsByTag = (tag: string): Product[] => {
  return products.filter((product) => product.tags.includes(tag.toLowerCase()))
}
