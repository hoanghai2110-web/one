import { Chat } from "@/lib/chat-store/types"
import { SidebarItem } from "./sidebar-item"

type SidebarListProps = {
  title: string
  items: Chat[]
  currentChatId: string
}

export function SidebarList({ title, items, currentChatId }: SidebarListProps) {
  return (
    <div>
      {title && (
        <h3 className="overflow-hidden px-3 py-2 text-xs font-medium text-muted-foreground break-all text-ellipsis">
          {title}
        </h3>
      )}
      <div className="space-y-0.5">
        {items.map((chat) => (
          <SidebarItem
            key={chat.id}
            chat={chat}
            currentChatId={currentChatId}
          />
        ))}
      </div>
    </div>
  )
}
