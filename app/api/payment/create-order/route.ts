import { type NextRequest, NextResponse } from "next/server"
import { createRazorpayOrder } from "@/lib/razorpay"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, receipt } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, message: "Valid amount is required" }, { status: 400 })
    }

    const order = await createRazorpayOrder(amount, currency, receipt)

    if (order) {
      return NextResponse.json({ success: true, order })
    } else {
      return NextResponse.json({ success: false, message: "Failed to create payment order" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error creating payment order:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
