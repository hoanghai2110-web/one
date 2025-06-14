export interface ApiKeyStatus {
  key: string
  isActive: boolean
  lastError?: string
  errorCount: number
  lastErrorTime?: number
  assignedUsers?: Set<string>
}

export interface ApiKeyPoolConfig {
  keys: string[]
  maxRetries: number
  errorCooldownMinutes: number
  useUserAffinity: boolean
}

export class ApiKeyPoolManager {
  private keyPool: Map<string, ApiKeyStatus> = new Map()
  private currentIndex: number = 0
  private config: ApiKeyPoolConfig
  private userKeyMap: Map<string, string> = new Map()

  constructor(config: ApiKeyPoolConfig) {
    this.config = config
    this.initializePool()
  }

  private initializePool() {
    this.config.keys.forEach(key => {
      this.keyPool.set(key, {
        key,
        isActive: true,
        errorCount: 0,
        assignedUsers: new Set()
      })
    })
  }

  // Lấy key cho user cụ thể (với user affinity hoặc round-robin)
  getApiKey(userId?: string): string | null {
    const activeKeys = Array.from(this.keyPool.values()).filter(status => status.isActive)

    if (activeKeys.length === 0) {
      console.error('No active API keys available')
      return null
    }

    // Nếu bật user affinity và có userId
    if (this.config.useUserAffinity && userId) {
      const assignedKey = this.getUserAffinityKey(userId, activeKeys)
      if (assignedKey) return assignedKey
    }

    // Round-robin selection
    const selectedKey = activeKeys[this.currentIndex % activeKeys.length]
    this.currentIndex = (this.currentIndex + 1) % activeKeys.length

    return selectedKey.key
  }

  private getUserAffinityKey(userId: string, activeKeys: ApiKeyStatus[]): string | null {
    // Kiểm tra xem user đã có key được gán chưa
    if (this.userKeyMap.has(userId)) {
      const assignedKey = this.userKeyMap.get(userId)!
      const keyStatus = this.keyPool.get(assignedKey)
      if (keyStatus?.isActive) {
        return assignedKey
      }
    }

    // Gán key mới dựa trên hash của userId
    const hash = this.hashUserId(userId)
    const selectedKey = activeKeys[hash % activeKeys.length]

    this.userKeyMap.set(userId, selectedKey.key)
    selectedKey.assignedUsers?.add(userId)

    return selectedKey.key
  }

  private hashUserId(userId: string): number {
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  // Báo lỗi cho một key
  reportKeyError(key: string, error: string) {
    const keyStatus = this.keyPool.get(key)
    if (!keyStatus) return

    keyStatus.errorCount++
    keyStatus.lastError = error
    keyStatus.lastErrorTime = Date.now()

    console.warn(`API Key error reported: ${error} (Count: ${keyStatus.errorCount})`)

    // Vô hiệu hóa key nếu vượt quá số lần thử
    if (keyStatus.errorCount >= this.config.maxRetries) {
      keyStatus.isActive = false
      console.error(`API Key deactivated due to excessive errors: ${key.substring(0, 8)}...`)
    }
  }

  // Reset key bị lỗi sau thời gian cooldown
  resetErrorKeys() {
    const now = Date.now()
    const cooldownMs = this.config.errorCooldownMinutes * 60 * 1000

    this.keyPool.forEach((status, key) => {
      if (!status.isActive && status.lastErrorTime) {
        if (now - status.lastErrorTime >= cooldownMs) {
          status.isActive = true
          status.errorCount = 0
          status.lastError = undefined
          status.lastErrorTime = undefined
          console.info(`API Key reactivated after cooldown: ${key.substring(0, 8)}...`)
        }
      }
    })
  }

  // Lấy trạng thái tất cả keys
  getKeyStatuses(): ApiKeyStatus[] {
    return Array.from(this.keyPool.values())
  }

  // Thêm key mới
  addKey(key: string) {
    if (!this.keyPool.has(key)) {
      this.keyPool.set(key, {
        key,
        isActive: true,
        errorCount: 0,
        assignedUsers: new Set()
      })
    }
  }

  // Xóa key
  removeKey(key: string) {
    this.keyPool.delete(key)
    // Xóa user assignments cho key này
    this.userKeyMap.forEach((assignedKey, userId) => {
      if (assignedKey === key) {
        this.userKeyMap.delete(userId)
      }
    })
  }
}