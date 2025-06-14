
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Crown } from "lucide-react"
import Link from "next/link"

export default function PremiumSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Welcome to Premium!</CardTitle>
            <CardDescription>
              Your payment was successful and your account has been upgraded.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center space-x-2 text-yellow-600">
              <Crown className="h-5 w-5" />
              <span className="font-medium">Premium Account Active</span>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>You now have access to:</p>
              <ul className="space-y-1">
                <li>• Unlimited AI conversations</li>
                <li>• Premium AI models</li>
                <li>• Priority support</li>
                <li>• Advanced features</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/">Start Chatting</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/premium/receipt">View Receipt</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
