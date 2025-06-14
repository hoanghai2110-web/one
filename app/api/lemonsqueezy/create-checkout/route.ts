
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    console.log("Creating checkout request started")
    
    const { variantId } = await request.json()
    console.log("Received variantId:", variantId)

    if (!variantId) {
      console.error("Missing variantId")
      return NextResponse.json(
        { error: "Variant ID is required" },
        { status: 400 }
      )
    }

    // Check environment variables
    const requiredEnvVars = [
      'LEMONSQUEEZY_API_KEY',
      'LEMONSQUEEZY_STORE_ID',
      'NEXT_PUBLIC_SITE_URL'
    ]

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.error(`Missing environment variable: ${envVar}`)
        return NextResponse.json(
          { error: `Server configuration error: Missing ${envVar}` },
          { status: 500 }
        )
      }
    }

    const supabase = await createClient()
    if (!supabase) {
      console.error("Supabase client creation failed")
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      )
    }

    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData?.user?.id) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized - Please login first" }, { status: 401 })
    }

    console.log("User authenticated:", authData.user.id)

    const checkoutData = {
      data: {
        type: "checkouts",
        attributes: {
          product_options: {
            name: "Zola Premium",
            description: "Upgrade to Zola Premium for unlimited access",
            media: [],
            redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium/success`,
            receipt_link_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium/receipt`,
          },
          checkout_options: {
            embed: false,
            media: false,
            logo: true,
          },
          checkout_data: {
            email: authData.user.email,
            custom: {
              user_id: authData.user.id,
            },
          },
          expires_at: null,
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMONSQUEEZY_STORE_ID?.toString(),
            },
          },
          variant: {
            data: {
              type: "variants",
              id: variantId.toString(),
            },
          },
        },
      },
    }

    console.log("Sending request to Lemon Squeezy API")
    console.log("Checkout data:", JSON.stringify(checkoutData, null, 2))

    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
        Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify(checkoutData),
    })

    console.log("Lemon Squeezy API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Lemon Squeezy API Error Status:", response.status)
      console.error("Lemon Squeezy API Error Data:", errorData)
      
      let errorMessage = "Failed to create checkout"
      try {
        const parsedError = JSON.parse(errorData)
        if (parsedError.errors && parsedError.errors[0]?.detail) {
          errorMessage = parsedError.errors[0].detail
        }
      } catch (e) {
        // Keep default message
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }

    const checkout = await response.json()
    console.log("Checkout created successfully:", checkout.data.id)
    console.log("Checkout URL:", checkout.data.attributes.url)
    
    return NextResponse.json({ 
      checkoutUrl: checkout.data.attributes.url 
    })

  } catch (error) {
    console.error("Error creating checkout:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
