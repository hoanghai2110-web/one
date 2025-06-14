
import { ApiKeyPoolManager, ApiKeyPoolConfig, ApiKeyStatus } from './manager'

// Cấu hình từ environment variables
const getPoolConfig = (): ApiKeyPoolConfig => {
  const keys = process.env.OPENROUTER_API_KEYS?.split(',').map(k => k.trim()).filter(Boolean) || []
  
  // Fallback to single key if pool not configured
  if (keys.length === 0 && process.env.OPENROUTER_API_KEY) {
    keys.push(process.env.OPENROUTER_API_KEY)
  }

  return {
    keys,
    maxRetries: parseInt(process.env.API_KEY_MAX_RETRIES || '3'),
    errorCooldownMinutes: parseInt(process.env.API_KEY_COOLDOWN_MINUTES || '15'),
    useUserAffinity: process.env.API_KEY_USER_AFFINITY === 'true'
  }
}

// Singleton instance
let poolManager: ApiKeyPoolManager | null = null

export const getApiKeyPool = (): ApiKeyPoolManager => {
  if (!poolManager) {
    poolManager = new ApiKeyPoolManager(getPoolConfig())
    
    // Auto-reset error keys mỗi 5 phút
    setInterval(() => {
      poolManager?.resetErrorKeys()
    }, 5 * 60 * 1000)
  }
  return poolManager
}

// Utility function để retry request với different keys
export async function executeWithKeyRetry<T>(
  operation: (apiKey: string) => Promise<T>,
  userId?: string,
  maxAttempts: number = 3
): Promise<T> {
  const pool = getApiKeyPool()
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const apiKey = pool.getApiKey(userId)
    
    if (!apiKey) {
      throw new Error('No API keys available')
    }

    try {
      const result = await operation(apiKey)
      return result
    } catch (error) {
      lastError = error as Error
      const errorMessage = lastError.message

      // Kiểm tra các lỗi cần retry
      const shouldRetry = isRetryableError(errorMessage)
      
      if (shouldRetry) {
        pool.reportKeyError(apiKey, errorMessage)
        console.warn(`Attempt ${attempt} failed with key ${apiKey.substring(0, 8)}..., retrying...`)
        continue
      } else {
        // Lỗi không retry được, throw ngay
        throw lastError
      }
    }
  }

  throw lastError || new Error('All retry attempts failed')
}

function isRetryableError(errorMessage: string): boolean {
  const retryablePatterns = [
    /rate.?limit/i,
    /quota.*exceeded/i,
    /too many requests/i,
    /401/,
    /403/,
    /429/,
    /insufficient.*credits/i,
    /exceeded.*limit/i
  ]

  return retryablePatterns.some(pattern => pattern.test(errorMessage))
}

export { ApiKeyPoolManager, type ApiKeyStatus, type ApiKeyPoolConfig }
