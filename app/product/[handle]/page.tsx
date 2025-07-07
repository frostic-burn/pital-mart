import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { products, getProductBySlug } from "@/data/products"
import ProductDetailClient from "./ProductDetailClient"

interface ProductPageProps {
  params: {
    handle: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProductBySlug(params.handle)

  if (!product) {
    return {
      title: "Product Not Found - PITAL MART",
      description: "The requested product could not be found.",
    }
  }

  return {
    title: `${product.name} - PITAL MART`,
    description: product.description || `Shop ${product.name} at PITAL MART`,
    openGraph: {
      title: product.name,
      description: product.description || `Shop ${product.name} at PITAL MART`,
      images: product.image ? [product.image] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.handle)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
