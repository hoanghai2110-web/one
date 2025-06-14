
"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { Crown, Loader2 } from "lucide-react"
import { useState } from "react"

interface UpgradeButtonProps {
  variantId: string
  className?: string
}

export function UpgradeButton({ variantId, className }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    try {
      setLoading(true)

      // Validate variantId
      if (!variantId) {
        toast({
          title: "Lỗi cấu hình",
          description: "Variant ID chưa được thiết lập. Vui lòng liên hệ admin.",
          status: "error",
        })
        return
      }

      console.log("Creating checkout with variantId:", variantId)

      const response = await fetch("/api/lemonsqueezy/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ variantId }),
      })

      const responseData = await response.json()
      console.log("API Response:", responseData)

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to create checkout")
      }

      const { checkoutUrl } = responseData
      
      if (!checkoutUrl) {
        throw new Error("Không nhận được URL thanh toán")
      }

      console.log("Redirecting to:", checkoutUrl)
      
      // Redirect to Lemon Squeezy checkout
      window.location.href = checkoutUrl

    } catch (error) {
      console.error("Error creating checkout:", error)
      toast({
        title: "Lỗi thanh toán",
        description: error instanceof Error ? error.message : "Không thể tạo thanh toán. Vui lòng thử lại.",
        status: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleUpgrade}
      disabled={loading}
      className={`bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Đang tạo thanh toán...
        </>
      ) : (
        <>
          <Crown className="mr-2 h-4 w-4" />
          Nâng cấp Premium
        </>
      )}
    </Button>
  )
}
