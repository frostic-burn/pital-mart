import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone } from "lucide-react"

export default function NumberVerificationPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-8 max-w-md">
        <Card className="bg-white">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-red-700" />
            </div>

            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Verify Your Number</h1>
            <p className="text-gray-600 mb-6">We've sent a 6-digit verification code to your mobile number</p>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-4">Enter the 6-digit code</p>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg font-semibold bg-gray-50"
                  />
                ))}
              </div>
            </div>

            <Button className="w-full bg-red-700 hover:bg-red-800 text-white py-3 mb-4">Verify & Continue</Button>

            <div className="text-sm text-gray-600">
              <p>Didn't receive the code?</p>
              <Button variant="link" className="text-red-700 p-0 h-auto">
                Resend Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
