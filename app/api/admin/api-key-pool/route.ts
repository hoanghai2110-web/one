
import { createClient } from "@/lib/supabase/server"
import { getApiKeyPool } from "@/lib/api-key-pool"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 500 }
      )
    }

    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Kiểm tra quyền admin (có thể kiểm tra trong database hoặc env)
    const adminUsers = process.env.ADMIN_USER_IDS?.split(',') || []
    if (!adminUsers.includes(authData.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const pool = getApiKeyPool()
    const keyStatuses = pool.getKeyStatuses()

    // Ẩn key thật, chỉ hiện prefix
    const safeStatuses = keyStatuses.map(status => ({
      ...status,
      key: status.key.substring(0, 8) + "...",
      assignedUsers: status.assignedUsers ? status.assignedUsers.size : 0
    }))

    return NextResponse.json({
      keyStatuses: safeStatuses,
      totalKeys: keyStatuses.length,
      activeKeys: keyStatuses.filter(s => s.isActive).length
    })

  } catch (error) {
    console.error("Error getting key pool status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, key } = await request.json()

    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 500 }
      )
    }

    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Kiểm tra quyền admin
    const adminUsers = process.env.ADMIN_USER_IDS?.split(',') || []
    if (!adminUsers.includes(authData.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const pool = getApiKeyPool()

    switch (action) {
      case 'reset_errors':
        pool.resetErrorKeys()
        return NextResponse.json({ success: true, message: 'Error keys reset' })

      case 'add_key':
        if (!key) {
          return NextResponse.json({ error: 'Key is required' }, { status: 400 })
        }
        pool.addKey(key)
        return NextResponse.json({ success: true, message: 'Key added' })

      case 'remove_key':
        if (!key) {
          return NextResponse.json({ error: 'Key is required' }, { status: 400 })
        }
        pool.removeKey(key)
        return NextResponse.json({ success: true, message: 'Key removed' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error("Error managing key pool:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
