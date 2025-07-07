import { type NextRequest, NextResponse } from "next/server"
import { sendCustomerOTP } from "@/lib/shopify-customer"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, message: "Valid email is required" }, { status: 400 })
    }

    const result = await sendCustomerOTP(email)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in send-otp API:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
