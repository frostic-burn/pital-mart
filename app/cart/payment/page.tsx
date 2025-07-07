import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CreditCard, Smartphone, Banknote } from "lucide-react"

export default function PaymentOptionsPage() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-8 max-w-2xl">
        <h1 className="text-3xl font-serif text-red-700 mb-8 text-center">Choose Payment Method</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <CardContent className="p-6">
                <RadioGroup defaultValue="card" className="space-y-4">
                  {/* Credit/Debit Card */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                        <CreditCard className="w-5 h-5 text-red-700" />
                        <span>Credit/Debit Card</span>
                      </Label>
                    </div>
                    <div className="space-y-4 ml-6">
                      <Input placeholder="Card Number" className="bg-gray-50" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="MM/YY" className="bg-gray-50" />
                        <Input placeholder="CVV" className="bg-gray-50" />
                      </div>
                      <Input placeholder="Cardholder Name" className="bg-gray-50" />
                    </div>
                  </div>

                  {/* UPI */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center space-x-2 cursor-pointer">
                        <Smartphone className="w-5 h-5 text-red-700" />
                        <span>UPI</span>
                      </Label>
                    </div>
                    <div className="ml-6">
                      <Input placeholder="Enter UPI ID" className="bg-gray-50" />
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center space-x-2 cursor-pointer">
                        <Banknote className="w-5 h-5 text-red-700" />
                        <span>Cash on Delivery</span>
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600 ml-6 mt-2">Pay when your order is delivered to your doorstep</p>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-white">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹8,013</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹400</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₹8,512</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-red-700 hover:bg-red-800 text-white py-3">Place Order</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
