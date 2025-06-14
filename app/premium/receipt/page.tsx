
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Receipt } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Order {
  order_id: string
  status: string
  total: number
  currency: string
  created_at: string
}

export default function PremiumReceiptPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <p>Loading receipts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold mb-2">Your Receipts</h1>
          <p className="text-muted-foreground">
            View your premium subscription receipts
          </p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">No receipts found</p>
              <Button asChild>
                <Link href="/premium">Upgrade to Premium</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.order_id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Zola Premium</span>
                    <span className="text-lg">
                      {formatCurrency(order.total, order.currency)}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Order #{order.order_id} • {formatDate(order.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Status: {order.status}
                    </span>
                    <Button variant="outline" size="sm">
                      Download Receipt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/">Back to Chat</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
