import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { GlobeIcon } from "@phosphor-icons/react"
import React from "react"
import { PopoverContentAuth } from "./popover-content-auth"

type ButtonSearchProps = {
  isSelected?: boolean
  onToggle?: (isSelected: boolean) => void
  isAuthenticated: boolean
}

export function ButtonSearch({
  isSelected = false,
  onToggle,
  isAuthenticated,
}: ButtonSearchProps) {
  const handleClick = () => {
    const newState = !isSelected
    onToggle?.(newState)
  }

  if (!isAuthenticated) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            className="dark:bg-secondary rounded-lg bg-gray-100/80 hover:bg-gray-200/80 border-0 shadow-none text-gray-600 hover:text-gray-800"
          >
            <GlobeIcon className="size-4" weight="regular" />
            <span className="hidden md:block text-sm">Search</span>
          </Button>
        </PopoverTrigger>
        <PopoverContentAuth />
      </Popover>
    )
  }

  return (
    <Button
      variant="secondary"
      className={cn(
        "dark:bg-secondary rounded-lg bg-gray-100/80 hover:bg-gray-200/80 border-0 shadow-none transition-all duration-150 has-[>svg]:px-1.75 md:has-[>svg]:px-3 text-gray-600 hover:text-gray-800",
        isSelected &&
          "bg-[#E5F3FE] text-[#0091FF] hover:bg-[#E5F3FE] hover:text-[#0091FF]"
      )}
      onClick={handleClick}
    >
      <GlobeIcon className="size-4" weight="regular" />
      <span className="hidden md:block text-sm">Search</span>
    </Button>
  )
}
