export interface Review {
  id: number
  shopifyOrderId?: string
  name: string
  text: string
  rating: number
  location?: string
  product?: string
  productId?: number
  image?: string
  date: string
  verified: boolean
  helpful: number
}

export const reviews: Review[] = [
  {
    id: 1,
    shopifyOrderId: "gid://shopify/Order/1",
    name: "Manish Ahuja",
    text: "Using PitalMart's utensils reminded me of my dad's kitchen—full of warmth, flavor, and stories. The brass kadai he used to make the most delicious parathas, committed to our meals, gifted it as it to my sister last year, and now it's a part of her daily cooking.",
    rating: 5,
    location: "Delhi",
    product: "Brass Kadai Set",
    productId: 5,
    image: "https://www.reddit.com/media?url=https%3A%2F%2Fi.redd.it%2Fv1e07b27izie1.jpeg",
    date: "2024-01-15",
    verified: true,
    helpful: 12,
  },
  {
    id: 2,
    shopifyOrderId: "gid://shopify/Order/2",
    name: "Priya Sharma",
    text: "The quality of these brass utensils is exceptional. They have transformed my cooking experience and added such elegance to my kitchen. My guests always compliment the beautiful serving dishes.",
    rating: 5,
    location: "Mumbai",
    product: "Traditional Brass Thali Set",
    productId: 3,
    image: "/placeholder.svg?height=80&width=80",
    date: "2024-01-12",
    verified: true,
    helpful: 8,
  },
  {
    id: 3,
    shopifyOrderId: "gid://shopify/Order/3",
    name: "Rajesh Kumar",
    text: "Traditional craftsmanship at its finest. These utensils connect me to my roots and make every meal special. The durability is outstanding - feels like they'll last generations.",
    rating: 5,
    location: "Chandigarh",
    product: "Brass Water Pitcher",
    productId: 4,
    image: "/placeholder.svg?height=80&width=80",
    date: "2024-01-10",
    verified: true,
    helpful: 15,
  },
  {
    id: 4,
    shopifyOrderId: "gid://shopify/Order/4",
    name: "Deepika Patel",
    text: "Every piece tells a story of heritage and quality. My mother was amazed by the authentic feel and finish. Now our family dinners feel more special and meaningful.",
    rating: 4,
    location: "Ahmedabad",
    product: "Brass Serving Bowl Set",
    productId: 6,
    image: "/placeholder.svg?height=80&width=80",
    date: "2024-01-08",
    verified: true,
    helpful: 6,
  },
  {
    id: 5,
    name: "Vikram Singh",
    text: "Outstanding customer service and genuine brass products. Highly recommended for anyone looking for authentic kitchenware!",
    rating: 5,
    location: "Amritsar",
    product: "Brass Mortar and Pestle",
    productId: 2,
    image: "/placeholder.svg?height=80&width=80",
    date: "2024-01-05",
    verified: false,
    helpful: 4,
  },
  {
    id: 6,
    name: "Anita Gupta",
    text: "Beautiful packaging and fast delivery. Perfect for gifting during festivals. The brass quality is top-notch.",
    rating: 4,
    location: "Jaipur",
    product: "Antique Gold Brass Roti Box",
    productId: 1,
    image: "/placeholder.svg?height=80&width=80",
    date: "2024-01-03",
    verified: true,
    helpful: 9,
  },
]

// Helper functions for review management
export const getReviewsByProduct = (productId: number): Review[] => {
  return reviews.filter((review) => review.productId === productId)
}

export const getVerifiedReviews = (): Review[] => {
  return reviews.filter((review) => review.verified)
}

export const getFeaturedReviews = (limit = 4): Review[] => {
  return reviews.slice(0, limit)
}

export const getAverageRating = (productId?: number): number => {
  const relevantReviews = productId ? getReviewsByProduct(productId) : reviews
  if (relevantReviews.length === 0) return 0
  const sum = relevantReviews.reduce((acc, review) => acc + review.rating, 0)
  return Math.round((sum / relevantReviews.length) * 10) / 10
}
