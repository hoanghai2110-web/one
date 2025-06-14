
import { UpgradeButton } from "@/app/components/premium/upgrade-button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Crown, Zap } from "lucide-react"

export default function PremiumPage() {
  const features = [
    "Unlimited AI conversations",
    "Access to premium AI models",
    "Priority support",
    "Advanced agent features",
    "Custom system prompts",
    "Enhanced file upload limits",
    "Export conversation history",
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <Crown className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
        <h1 className="text-4xl font-bold mb-4">Upgrade to Zola Premium</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock the full potential of AI-powered conversations with premium features
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="relative border-2 border-yellow-500">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge variant="secondary" className="bg-yellow-500 text-white">
              <Zap className="w-3 h-3 mr-1" />
              Most Popular
            </Badge>
          </div>
          
          <CardHeader className="text-center pb-8 pt-8">
            <CardTitle className="text-2xl">Premium Plan</CardTitle>
            <CardDescription>Perfect for power users</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">99.999 VND</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <UpgradeButton 
              variantId={process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID || ""}
              className="w-full"
            />

            <p className="text-xs text-muted-foreground text-center">
              Cancel anytime. No questions asked.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
