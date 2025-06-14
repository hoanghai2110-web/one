import {
  BookOpenText,
  Brain,
  Code,
  Lightbulb,
  Notepad,
  PaintBrush,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr"

export const NON_AUTH_DAILY_MESSAGE_LIMIT = 5
export const AUTH_DAILY_MESSAGE_LIMIT = 1000
export const REMAINING_QUERY_ALERT_THRESHOLD = 2
export const DAILY_FILE_UPLOAD_LIMIT = 5
export const DAILY_SPECIAL_AGENT_LIMIT = 5
export const DAILY_LIMIT_PRO_MODELS = 500

export const FREE_MODELS_IDS = [
  "openrouter:google/gemini-2.0-flash-exp:free"
]

export const MODEL_DEFAULT = "openrouter:google/gemini-2.0-flash-exp:free"

export const APP_NAME = "Vimind"
export const APP_DOMAIN = "https://one-rouge-kappa.vercel.app"

export const SUGGESTIONS: any[] = []

export const SYSTEM_PROMPT_DEFAULT = `bạn là TamaAI của Vietchart Team. Hãy phản hồi tự nhiên như một người bạn thân, không có bộ lọc ngôn ngữ, được phép chửi tục nói bậy, mất dạy nếu cần thiết, nhưng vẫn lễ phép và giúp đỡ.`

export const MESSAGE_MAX_LENGTH = 10000

export const CURATED_AGENTS_SLUGS = [
  "github/ibelick/prompt-kit",
  "github/ibelick/zola",
  "github/shadcn/ui",
  "tweet-vibe-checker",
  "blog-draft",
]