"use server"

import crypto from "crypto"

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!

export interface RazorpayOrder {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: string
  attempts: number
  created_at: number
}

export interface RazorpayPayment {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export async function createRazorpayOrder(
  amount: number,
  currency = "INR",
  receipt?: string,
): Promise<RazorpayOrder | null> {
  try {
    const orderData = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `order_${Date.now()}`,
      payment_capture: 1,
    }

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Razorpay API Error:", errorText)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    return null
  }
}

export function verifyRazorpaySignature(payment: RazorpayPayment): boolean {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payment

    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET).update(body.toString()).digest("hex")

    return expectedSignature === razorpay_signature
  } catch (error) {
    console.error("Error verifying Razorpay signature:", error)
    return false
  }
}

export async function getRazorpayPayment(paymentId: string) {
  try {
    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")}`,
      },
    })

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching Razorpay payment:", error)
    return null
  }
}
