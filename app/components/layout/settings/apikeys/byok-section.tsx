"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { UpgradeButton } from "@/app/components/premium/upgrade-button"
import { useUser } from "@/lib/user-store/provider"
import { Crown, Eye, EyeOff, Key, Star } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

export function ByokSection() {
  const { user } = useUser()

  const isPremium = user?.premium === true

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
          <div className="border rounded-xl p-5 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/10 dark:via-orange-900/10 dark:to-red-900/10 border-yellow-200 dark:border-yellow-800 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                    Nâng cấp lên Premium
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Trò chuyện AI không giới hạn, các mô hình premium và tính năng nâng cao chỉ với <strong>99.999 VND/tháng</strong>
                  </p>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/pricing">
                    Xem các gói nâng cấp
                  </Link>
                </Button>
              </div>
            </div>
          </div>
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