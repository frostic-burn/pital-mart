import { type NextRequest, NextResponse } from "next/server"
import { verifyRazorpaySignature, getRazorpayPayment } from "@/lib/razorpay"
import { createShopifyOrder } from "@/lib/shopify-customer"

export async function POST(request: NextRequest) {
  try {
    const { payment, orderData } = await request.json()

    // Verify Razorpay signature
    const isValidSignature = verifyRazorpaySignature(payment)

    if (!isValidSignature) {
      return NextResponse.json({ success: false, message: "Invalid payment signature" }, { status: 400 })
    }

    // Get payment details from Razorpay
    const paymentDetails = await getRazorpayPayment(payment.razorpay_payment_id)

    if (!paymentDetails || paymentDetails.status !== "captured") {
      return NextResponse.json({ success: false, message: "Payment not captured" }, { status: 400 })
    }

    // Create Shopify order
    const shopifyOrderData = {
      ...orderData,
      total_price: (paymentDetails.amount / 100).toString(), // Convert from paise to rupees
      currency: paymentDetails.currency.toUpperCase(),
      financial_status: "paid",
      payment_gateway_names: ["razorpay"],
      transactions: [
        {
          kind: "sale",
          status: "success",
          amount: (paymentDetails.amount / 100).toString(),
          currency: paymentDetails.currency.toUpperCase(),
          gateway: "razorpay",
          source_name: "web",
        },
      ],
    }

    const shopifyOrder = await createShopifyOrder(shopifyOrderData)

    if (shopifyOrder) {
      return NextResponse.json({
        success: true,
        order: shopifyOrder,
        payment_id: payment.razorpay_payment_id,
      })
    } else {
      return NextResponse.json({ success: false, message: "Failed to create order" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
