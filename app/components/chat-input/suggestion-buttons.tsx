"use client"

import { useState } from "react"

interface SuggestionButtonsProps {
  onValueChange: (value: string) => void
}

export function SuggestionButtons({ onValueChange }: SuggestionButtonsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const suggestionCategories = [
    {
      id: "write",
      label: "Viết",
      emoji: "✏️",
      items: [
        "Viết một bài thơ về cuộc sống",
        "Viết một câu chuyện ngắn thú vị",
        "Viết email chuyên nghiệp",
        "Viết bài thuyết trình",
        "Viết nội dung marketing"
      ]
    },
    {
      id: "learn",
      label: "Học",
      emoji: "📚", 
      items: [
        "Giải thích một khái niệm khoa học",
        "Học từ vựng tiếng Anh mới",
        "Tìm hiểu về lịch sử thế giới",
        "Học toán cơ bản",
        "Hiểu về công nghệ AI"
      ]
    },
    {
      id: "code",
      label: "Code",
      emoji: "💻",
      items: [
        "Viết code Python để xử lý dữ liệu",
        "Tạo component React đơn giản",
        "Debug lỗi JavaScript",
        "Tối ưu hiệu suất website",
        "Thiết kế database"
      ]
    },
    {
      id: "daily",
      label: "Cuộc sống",
      emoji: "☕",
      items: [
        "Gợi ý hoạt động cuối tuần thú vị",
        "Lên kế hoạch du lịch",
        "Tìm công thức nấu ăn",
        "Lời khuyên sức khỏe",
        "Quản lý thời gian hiệu quả"
      ]
    },
    {
      id: "claude",
      label: "Lựa chọn của Claude",
      emoji: "🎯",
      items: [
        "Tôi muốn được tư vấn về một chủ đề",
        "Phân tích một vấn đề phức tạp",
        "Brainstorm ý tưởng sáng tạo",
        "Giải quyết tranh luận",
        "Đưa ra quan điểm khách quan"
      ]
    }
  ]

  const handleCategoryClick = (categoryId: string) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null)
    } else {
      setActiveCategory(categoryId)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onValueChange(suggestion)
    setActiveCategory(null)
  }

  const handleCloseList = () => {
    setActiveCategory(null)
  }

  return (
    <div className="w-full space-y-3">
      {/* Show buttons only when no active category */}
      {!activeCategory && (
        <>
          {/* Top row - 3 buttons */}
          <div className="grid grid-cols-3 gap-2 px-2">
            {suggestionCategories.slice(0, 3).map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors border min-h-[40px] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              >
                <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{category.emoji}</span>
                <span className="text-center leading-tight text-xs sm:text-sm">{category.label}</span>
              </button>
            ))}
          </div>

          {/* Bottom row - 2 buttons taking equal width */}
          <div className="grid grid-cols-2 gap-2 px-2">
            {suggestionCategories.slice(3, 5).map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors border min-h-[40px] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              >
                <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{category.emoji}</span>
                <span className="text-center leading-tight text-xs sm:text-sm">{category.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Expanded sub-items list with close button */}
      {activeCategory && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200 px-2">
          {/* Header with close button */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {suggestionCategories.find(cat => cat.id === activeCategory)?.label}
            </h3>
            <button
              onClick={handleCloseList}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Đóng danh sách"
            >
              <span className="text-gray-500 dark:text-gray-400 text-lg">×</span>
            </button>
          </div>

          {/* List items - only show first 4 items */}
          {suggestionCategories
            .find(cat => cat.id === activeCategory)
            ?.items.slice(0, 4).map((item, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(item)}
                className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-xs sm:text-sm text-gray-700 dark:text-gray-300 transition-colors leading-relaxed"
              >
                {item}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}