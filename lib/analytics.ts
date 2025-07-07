"use client"

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
  }
}

export function trackPageView(url: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_path: url,
    })
  }
}

export function trackAddToCart(
  items: Array<{
    item_id: string
    item_name: string
    category: string
    quantity: number
    price: number
  }>,
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "add_to_cart", {
      currency: "INR",
      value: items.reduce((total, item) => total + item.price * item.quantity, 0),
      items: items,
    })
  }
}

export function trackBeginCheckout(
  items: Array<{
    item_id: string
    item_name: string
    category: string
    quantity: number
    price: number
  }>,
  value: number,
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "begin_checkout", {
      currency: "INR",
      value: value,
      items: items,
    })
  }
}

export function trackPurchase(
  transactionId: string,
  items: Array<{
    item_id: string
    item_name: string
    category: string
    quantity: number
    price: number
  }>,
  value: number,
) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "purchase", {
      transaction_id: transactionId,
      currency: "INR",
      value: value,
      items: items,
    })
  }
}

export function trackViewItem(item: {
  item_id: string
  item_name: string
  category: string
  price: number
}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "view_item", {
      currency: "INR",
      value: item.price,
      items: [item],
    })
  }
}
