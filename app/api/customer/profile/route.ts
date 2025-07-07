import { type NextRequest, NextResponse } from "next/server"
import { getCurrentCustomer, updateCustomer } from "@/lib/shopify-customer"

export async function GET() {
  try {
    const customer = await getCurrentCustomer()

    if (!customer) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({ success: true, customer })
  } catch (error) {
    console.error("Error fetching customer profile:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const customer = await getCurrentCustomer()

    if (!customer) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    const updateData = await request.json()
    const updatedCustomer = await updateCustomer(customer.id, updateData)

    if (updatedCustomer) {
      return NextResponse.json({ success: true, customer: updatedCustomer })
    } else {
      return NextResponse.json({ success: false, message: "Failed to update profile" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error updating customer profile:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
