
export async function checkPremiumStatus(): Promise<boolean> {
  try {
    const response = await fetch("/api/subscription-status")
    if (!response.ok) return false
    
    const data = await response.json()
    return data.is_premium || false
  } catch (error) {
    console.error("Error checking premium status:", error)
    return false
  }
}

export async function getSubscriptionStatus() {
  try {
    const response = await fetch("/api/subscription-status")
    if (!response.ok) {
      return {
        subscription_status: "inactive",
        subscription_tier: "free",
        is_premium: false
      }
    }
    
    return await response.json()
  } catch (error) {
    console.error("Error getting subscription status:", error)
    return {
      subscription_status: "inactive", 
      subscription_tier: "free",
      is_premium: false
    }
  }
}
