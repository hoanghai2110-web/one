import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not available" },
        { status: 500 }
      )
    }

    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from("users")
      .select("premium")
      .eq("id", authData.user.id)
      .single()

    // Debug log để kiểm tra dữ liệu từ database
    console.log("User data from database:", {
      user_id: authData.user.id,
      premium: userData?.premium
    })

    const isPremium = userData?.premium === true

    console.log("Calculated is_premium:", isPremium)

    return NextResponse.json({
      subscription_status: isPremium ? "active" : "inactive",
      subscription_tier: isPremium ? "premium" : "free",
      is_premium: isPremium
    })

  } catch (error) {
    console.error("Error fetching subscription status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}