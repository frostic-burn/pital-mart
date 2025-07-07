"use server"

import { cookies } from "next/headers"
import { signToken, verifyToken } from "./jwt"

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN
const API_VERSION = process.env.SHOPIFY_API_VERSION || "2024-01"

interface ShopifyCustomer {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  created_at: string
  updated_at: string
  addresses: ShopifyAddress[]
  default_address: ShopifyAddress | null
  orders_count: number
  total_spent: string
  tags: string
  state: string
  verified_email: boolean
}

interface ShopifyAddress {
  id: string
  customer_id: string
  first_name: string
  last_name: string
  company: string
  address1: string
  address2: string
  city: string
  province: string
  country: string
  zip: string
  phone: string
  name: string
  province_code: string
  country_code: string
  country_name: string
  default: boolean
}

interface ShopifyOrder {
  id: string
  order_number: string
  created_at: string
  updated_at: string
  total_price: string
  subtotal_price: string
  total_tax: string
  currency: string
  financial_status: string
  fulfillment_status: string
  line_items: Array<{
    id: string
    product_id: string
    variant_id: string
    title: string
    quantity: number
    price: string
    total_discount: string
    fulfillment_status: string
    product_exists: boolean
    variant_title: string
  }>
  shipping_address: ShopifyAddress
  billing_address: ShopifyAddress
  customer: {
    id: string
    email: string
    first_name: string
    last_name: string
  }
}

async function shopifyAdminFetch(endpoint: string, options: RequestInit = {}) {
  const url = `https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      "X-Shopify-Access-Token": ADMIN_API_TOKEN!,
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Shopify Admin API Error: ${response.status} - ${errorText}`)
    throw new Error(`Shopify API error: ${response.status}`)
  }

  return response.json()
}

// Customer Authentication
export async function sendCustomerOTP(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // First, check if customer exists
    const existingCustomer = await getCustomerByEmail(email)

    if (!existingCustomer) {
      // Create new customer
      const response = await shopifyAdminFetch("customers.json", {
        method: "POST",
        body: JSON.stringify({
          customer: {
            email,
            verified_email: false,
            send_email_welcome: false,
            send_email_invite: true, // This triggers Shopify's account invitation
          },
        }),
      })

      if (response.customer) {
        return { success: true, message: "Account invitation sent to your email" }
      }
    } else {
      // For existing customers, we'll use a custom OTP system
      const otp = Math.floor(100000 + Math.random() * 900000).toString()

      // Store OTP in customer metafields (temporary)
      await shopifyAdminFetch(`customers/${existingCustomer.id}/metafields.json`, {
        method: "POST",
        body: JSON.stringify({
          metafield: {
            namespace: "auth",
            key: "otp",
            value: otp,
            type: "single_line_text_field",
          },
        }),
      })

      // Store OTP expiry (5 minutes from now)
      const expiryTime = new Date(Date.now() + 5 * 60 * 1000).toISOString()
      await shopifyAdminFetch(`customers/${existingCustomer.id}/metafields.json`, {
        method: "POST",
        body: JSON.stringify({
          metafield: {
            namespace: "auth",
            key: "otp_expiry",
            value: expiryTime,
            type: "single_line_text_field",
          },
        }),
      })

      // Here you would send the OTP via email service
      // For now, we'll return success (in production, integrate with your email service)
      console.log(`OTP for ${email}: ${otp}`) // Remove in production

      return { success: true, message: "OTP sent to your email" }
    }

    return { success: false, message: "Failed to send OTP" }
  } catch (error) {
    console.error("Error sending OTP:", error)
    return { success: false, message: "Failed to send OTP" }
  }
}

export async function verifyCustomerOTP(
  email: string,
  otp: string,
): Promise<{ success: boolean; token?: string; customer?: ShopifyCustomer }> {
  try {
    const customer = await getCustomerByEmail(email)
    if (!customer) {
      return { success: false }
    }

    // Get stored OTP and expiry from metafields
    const metafields = await shopifyAdminFetch(`customers/${customer.id}/metafields.json`)
    const otpMetafield = metafields.metafields?.find((m: any) => m.namespace === "auth" && m.key === "otp")
    const expiryMetafield = metafields.metafields?.find((m: any) => m.namespace === "auth" && m.key === "otp_expiry")

    if (!otpMetafield || !expiryMetafield) {
      return { success: false }
    }

    // Check if OTP is expired
    const expiryTime = new Date(expiryMetafield.value)
    if (new Date() > expiryTime) {
      return { success: false }
    }

    // Verify OTP
    if (otpMetafield.value !== otp) {
      return { success: false }
    }

    // Clear OTP metafields
    await shopifyAdminFetch(`customers/${customer.id}/metafields/${otpMetafield.id}.json`, {
      method: "DELETE",
    })
    await shopifyAdminFetch(`customers/${customer.id}/metafields/${expiryMetafield.id}.json`, {
      method: "DELETE",
    })

    // Generate JWT token
    const token = await signToken({ customerId: customer.id, email: customer.email }, "30d")

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set("customer_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return { success: true, token, customer }
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return { success: false }
  }
}

export async function getCustomerByEmail(email: string): Promise<ShopifyCustomer | null> {
  try {
    const response = await shopifyAdminFetch(`customers/search.json?query=email:${encodeURIComponent(email)}`)
    return response.customers?.[0] || null
  } catch (error) {
    console.error("Error fetching customer by email:", error)
    return null
  }
}

export async function getCurrentCustomer(): Promise<ShopifyCustomer | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("customer_token")?.value

    if (!token) {
      return null
    }

    const decoded = await verifyToken(token)
    const response = await shopifyAdminFetch(`customers/${decoded.customerId}.json`)

    return response.customer || null
  } catch (error) {
    console.error("Error getting current customer:", error)
    return null
  }
}

export async function getCustomerOrders(customerId: string): Promise<ShopifyOrder[]> {
  try {
    const response = await shopifyAdminFetch(`customers/${customerId}/orders.json?status=any&limit=50`)
    return response.orders || []
  } catch (error) {
    console.error("Error fetching customer orders:", error)
    return []
  }
}

export async function updateCustomer(
  customerId: string,
  customerData: Partial<ShopifyCustomer>,
): Promise<ShopifyCustomer | null> {
  try {
    const response = await shopifyAdminFetch(`customers/${customerId}.json`, {
      method: "PUT",
      body: JSON.stringify({ customer: customerData }),
    })
    return response.customer || null
  } catch (error) {
    console.error("Error updating customer:", error)
    return null
  }
}

export async function createCustomerAddress(
  customerId: string,
  address: Partial<ShopifyAddress>,
): Promise<ShopifyAddress | null> {
  try {
    const response = await shopifyAdminFetch(`customers/${customerId}/addresses.json`, {
      method: "POST",
      body: JSON.stringify({ address }),
    })
    return response.customer_address || null
  } catch (error) {
    console.error("Error creating customer address:", error)
    return null
  }
}

export async function updateCustomerAddress(
  customerId: string,
  addressId: string,
  address: Partial<ShopifyAddress>,
): Promise<ShopifyAddress | null> {
  try {
    const response = await shopifyAdminFetch(`customers/${customerId}/addresses/${addressId}.json`, {
      method: "PUT",
      body: JSON.stringify({ address }),
    })
    return response.customer_address || null
  } catch (error) {
    console.error("Error updating customer address:", error)
    return null
  }
}

export async function deleteCustomerAddress(customerId: string, addressId: string): Promise<boolean> {
  try {
    await shopifyAdminFetch(`customers/${customerId}/addresses/${addressId}.json`, {
      method: "DELETE",
    })
    return true
  } catch (error) {
    console.error("Error deleting customer address:", error)
    return false
  }
}

export async function logoutCustomer(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("customer_token")
}

// Create Shopify Order
export async function createShopifyOrder(orderData: {
  customer: { email: string; first_name: string; last_name: string; phone?: string }
  line_items: Array<{ variant_id: string; quantity: number; price: string }>
  shipping_address: ShopifyAddress
  billing_address?: ShopifyAddress
  total_price: string
  currency: string
  financial_status: string
  payment_gateway_names: string[]
  transactions: Array<{
    kind: string
    status: string
    amount: string
    currency: string
    gateway: string
    source_name: string
  }>
}): Promise<ShopifyOrder | null> {
  try {
    const response = await shopifyAdminFetch("orders.json", {
      method: "POST",
      body: JSON.stringify({
        order: {
          ...orderData,
          billing_address: orderData.billing_address || orderData.shipping_address,
          send_receipt: true,
          send_fulfillment_receipt: true,
        },
      }),
    })
    return response.order || null
  } catch (error) {
    console.error("Error creating Shopify order:", error)
    return null
  }
}
