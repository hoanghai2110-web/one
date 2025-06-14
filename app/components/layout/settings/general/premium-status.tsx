
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UpgradeButton } from "@/app/components/premium/upgrade-button"
import { useUser } from "@/lib/user-store/provider"
import { Crown, Star } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

interface PremiumStatusProps {
  monochrome?: boolean
}

export function PremiumStatus({ monochrome = false }: PremiumStatusProps) {
  const { user } = useUser()
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkPremiumStatus() {
      try {
        const response = await fetch("/api/subscription-status")
        if (response.ok) {
          const data = await response.json()
          setIsPremium(data.is_premium)
        }
      } catch (error) {
        console.error("Error checking premium status:", error)
      } finally {
        setLoading(false)
      }
    }

    checkPremiumStatus()
  }, [user])

  if (loading) {
    return (
      <div>
        <h3 className="mb-3 text-sm font-medium">Subscription</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse">
              </div>
              <div>
                <p className="text-sm font-medium">Loading...</p>
                <p className="text-xs text-muted-foreground">Checking status</p>
              </div>
            </div>
            <Badge variant="secondary">...</Badge>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium">Subscription</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isPremium ? (
              <>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                  <Crown className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Premium Plan</p>
                  <p className="text-xs text-muted-foreground">All features unlocked</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800">
                  <Star className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Free Plan</p>
                  <p className="text-xs text-muted-foreground">Limited features</p>
                </div>
              </>
            )}
          </div>
          <Badge variant={isPremium ? "default" : "secondary"}>
            {isPremium ? "Premium" : "Free"}
          </Badge>
        </div>

        

        {!isPremium && (
          <Button variant="outline" className="w-full" asChild>
            <Link href="/pricing">
              Xem các gói nâng cấp
            </Link>
          </Button>
        )}

        {isPremium && (
          <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <Crown className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Premium Active
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Thank you for supporting Zola!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
