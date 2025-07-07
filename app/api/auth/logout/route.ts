import { type NextRequest, NextResponse } from "next/server"
import { logoutCustomer } from "@/lib/shopify-customer"

export async function POST(request: NextRequest) {
  try {
    await logoutCustomer()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in logout API:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
