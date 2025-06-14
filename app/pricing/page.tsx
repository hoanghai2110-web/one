
import { UpgradeButton } from "@/app/components/premium/upgrade-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Crown, User } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const freePlanFeatures = [
    "Trò chuyện AI cơ bản",
    "Giới hạn 20 tin nhắn/ngày",
    "Truy cập mô hình cơ bản",
    "Hỗ trợ cộng đồng"
  ]

  const premiumPlanFeatures = [
    "Trò chuyện AI không giới hạn",
    "Truy cập tất cả mô hình AI premium",
    "Hỗ trợ ưu tiên",
    "Tính năng agent nâng cao",
    "System prompts tùy chỉnh",
    "Giới hạn upload file cao hơn",
    "Xuất lịch sử hội thoại"
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Chọn gói phù hợp với bạn</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Bắt đầu miễn phí hoặc nâng cấp để trải nghiệm đầy đủ tính năng AI
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <Card className="relative">
          <CardHeader className="text-center pb-8 pt-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <CardTitle className="text-2xl">Miễn phí</CardTitle>
            <CardDescription>Hoàn hảo cho người mới bắt đầu</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">0₫</span>
              <span className="text-muted-foreground">/tháng</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              {freePlanFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full" asChild>
              <Link href="/">
                Bắt đầu miễn phí
              </Link>
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Không cần thẻ tín dụng
            </p>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="relative border-2 border-yellow-500">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge variant="secondary" className="bg-yellow-500 text-white">
              <Crown className="w-3 h-3 mr-1" />
              Phổ biến nhất
            </Badge>
          </div>
          
          <CardHeader className="text-center pb-8 pt-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
              <Crown className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <CardTitle className="text-2xl">Premium</CardTitle>
            <CardDescription>Dành cho người dùng chuyên nghiệp</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">99.999₫</span>
              <span className="text-muted-foreground">/tháng</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              {premiumPlanFeatures.map((feature, index) => (
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
              Hủy bất kỳ lúc nào. Không đặt câu hỏi.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-center mb-8">Câu hỏi thường gặp</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Tôi có thể hủy gói Premium bất kỳ lúc nào không?</h4>
            <p className="text-muted-foreground">Có, bạn có thể hủy gói Premium bất kỳ lúc nào mà không mất phí.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Sự khác biệt chính giữa gói Free và Premium là gì?</h4>
            <p className="text-muted-foreground">Gói Premium cung cấp trò chuyện không giới hạn, truy cập các mô hình AI cao cấp và nhiều tính năng nâng cao khác.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Dữ liệu của tôi có được bảo mật không?</h4>
            <p className="text-muted-foreground">Chúng tôi cam kết bảo vệ dữ liệu của bạn với các tiêu chuẩn bảo mật cao nhất.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
