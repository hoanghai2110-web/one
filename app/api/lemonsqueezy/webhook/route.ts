import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createServerClient } from "@supabase/ssr"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-signature")

    console.log("=== WEBHOOK STARTED ===")
    console.log("Received signature:", signature)

    if (!signature) {
      console.error("Missing signature in webhook")
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
    if (!secret) {
      console.error("LEMONSQUEEZY_WEBHOOK_SECRET not configured")
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      )
    }

    const hmac = crypto.createHmac("sha256", secret)
    hmac.update(body, "utf8")
    const digest = Buffer.from(hmac.digest("hex"), "utf8")
    const signatureBuffer = Buffer.from(signature, "utf8")

    if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
      console.error("Invalid webhook signature")
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)
    const eventName = event.meta.event_name

    console.log("=== WEBHOOK DATA ===")
    console.log("Event name:", eventName)
    console.log("User email from webhook:", event.data?.attributes?.user_email)
    console.log("Order status:", event.data?.attributes?.status)
    console.log("Order ID:", event.data?.id)

    if (eventName === "subscription_created" || eventName === "order_created") {
      const orderData = event.data
      const userEmail = orderData.attributes.user_email
      const orderStatus = orderData.attributes.status

      console.log("=== PROCESSING PAYMENT ===")
      console.log("User email:", userEmail)
      console.log("Order status:", orderStatus)

      if (!userEmail) {
        console.error("❌ No user email found in webhook data")
        return NextResponse.json({ error: "No user email" }, { status: 400 })
      }

      // Only process paid orders
      if (orderStatus !== "paid") {
        console.log("⏳ Order not paid yet, status:", orderStatus)
        return NextResponse.json({ message: "Order not paid yet" }, { status: 200 })
      }

      // Use service role key for webhook to bypass RLS
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE!,
        {
          cookies: {
            getAll: () => [],
            setAll: () => {},
          },
        }
      )

      if (!supabase) {
        console.error("❌ Supabase not available")
        return NextResponse.json(
          { error: "Supabase not available" },
          { status: 500 }
        )
      }

      // Find user by email
      console.log("🔍 Finding user with email:", userEmail)

      // Also try to get all users with similar email to debug
      const { data: allUsers, error: allUsersError } = await supabase
        .from("users")
        .select("id, email")
        .ilike("email", `%${userEmail}%`)

      console.log("📧 Users with similar email:", allUsers, "Error:", allUsersError)
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, email, premium")
        .eq("email", userEmail)
        .single()

      if (userError || !userData) {
        console.error("❌ User not found in database:", { 
          userEmail, 
          error: userError,
          errorCode: userError?.code,
          message: "User must login to the website at least once before purchasing premium"
        })
        return NextResponse.json({ 
          error: "User not found", 
          message: `Email ${userEmail} chưa đăng nhập vào website. Vui lòng đăng nhập ít nhất 1 lần trước khi mua premium.`,
          userEmail 
        }, { status: 404 })
      }

      console.log("✅ User found:", { 
        id: userData.id, 
        email: userData.email, 
        currentPremium: userData.premium 
      })

      const userId = userData.id

      // Update user to premium
      console.log("🔄 Updating user to premium...")
      const { data: updateData, error: updateError } = await supabase
        .from("users")
        .update({
          premium: true,
        })
        .eq("id", userId)
        .select()

      if (updateError) {
        console.error("❌ Error updating user subscription:", updateError)
        return NextResponse.json(
          { error: "Failed to update subscription" },
          { status: 500 }
        )
      }

      console.log("✅ User updated successfully:", updateData)

      // Store order information (optional, might fail if table doesn't exist)
      try {
        const { error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: userId,
            order_id: orderData.id,
            status: orderData.attributes.status,
            total: orderData.attributes.total,
            currency: orderData.attributes.currency,
            created_at: orderData.attributes.created_at,
          })

        if (orderError) {
          console.warn("⚠️ Could not store order (table might not exist):", orderError)
        } else {
          console.log("✅ Order stored successfully")
        }
      } catch (orderStoreError) {
        console.warn("⚠️ Order storage failed:", orderStoreError)
      }

      console.log(`🎉 SUCCESS: User ${userId} (${userEmail}) upgraded to premium`)

      return NextResponse.json({ 
        success: true, 
        message: `User ${userEmail} upgraded to premium`,
        userId: userId
      })
    }

    console.log("ℹ️ Event not relevant for premium upgrade:", eventName)
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    )
  }
}