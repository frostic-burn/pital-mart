import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function VerificationDonePage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-8 max-w-md">
        <Card className="bg-white">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Verification Successful!</h1>
            <p className="text-gray-600 mb-8">
              Your mobile number has been verified successfully. You can now proceed with your order.
            </p>

            <Link href="/cart/payment">
              <Button className="w-full bg-red-700 hover:bg-red-800 text-white py-3">Continue to Payment</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
