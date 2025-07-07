import { type NextRequest, NextResponse } from "next/server"
import { getPincodeData } from "@/lib/pincode-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pincode = searchParams.get("pincode")

    if (!pincode) {
      return NextResponse.json({ success: false, message: "Pincode is required" }, { status: 400 })
    }

    const result = await getPincodeData(pincode)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in pincode API:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
