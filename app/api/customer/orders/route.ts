import { NextResponse } from "next/server"
import { getCurrentCustomer, getCustomerOrders } from "@/lib/shopify-customer"

export async function GET() {
  try {
    const customer = await getCurrentCustomer()

    if (!customer) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    const orders = await getCustomerOrders(customer.id)

    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error("Error fetching customer orders:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
