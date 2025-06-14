"use client"

import { groupChatsByDate } from "@/app/components/history/utils"
import { useBreakpoint } from "@/app/hooks/use-breakpoint"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { UpgradeButton } from "@/app/components/premium/upgrade-button"
import { useChats } from "@/lib/chat-store/chats/provider"
import { useUser } from "@/lib/user-store/provider"
import {
  ChatTeardropText,
  MagnifyingGlass,
  NotePencilIcon,
  X,
  Users,
  QuestionMark,
  Crown,
} from "@phosphor-icons/react"
import { useParams, useRouter } from "next/navigation"
import { useMemo } from "react"
import { HistoryTrigger } from "../../history/history-trigger"
import { SidebarList } from "./sidebar-list"

export function AppSidebar() {
  const isMobile = useBreakpoint(768)
  const { setOpenMobile } = useSidebar()
  const { chats, isLoading } = useChats()
  const { user } = useUser()
  const params = useParams<{ chatId: string }>()
  const currentChatId = params.chatId

  const groupedChats = useMemo(() => groupChatsByDate(chats, ""), [chats])
  const hasChats = chats.length > 0
  const router = useRouter()
  const isPremium = user?.premium === true

  return (
    <Sidebar collapsible="offcanvas" variant="sidebar" className="border-none">
      <SidebarHeader className="h-14 pl-3">
        <div className="flex justify-between">
          {isMobile ? (
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-9 items-center justify-center rounded-md bg-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <X size={24} />
            </button>
          ) : (
            <div className="h-full" />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="mask-t-from-98% mask-t-to-100% mask-b-from-98% mask-b-to-100% px-3">
        <ScrollArea className="flex h-full [&>div>div]:!block">
          <div className="flex flex-col h-full">
          {/* New Chat Button */}
          <div className="mb-3">
            <button
              className="hover:bg-accent/80 hover:text-foreground text-primary group/new-chat relative inline-flex w-full items-center rounded-md bg-transparent px-3 py-2.5 text-sm font-medium transition-colors border border-gray-200 dark:border-gray-700"
              type="button"
              onClick={() => router.push("/")}
            >
              <div className="flex items-center gap-3">
                <NotePencilIcon size={18} className="text-gray-900 dark:text-white" />
                <span className="font-semibold">New Chat</span>
              </div>
            </button>
          </div>

          {/* Main Navigation */}
          <div className="space-y-1 mb-4">
            <button
              className={`hover:bg-accent/80 hover:text-foreground group/chat relative inline-flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                window.location.pathname === "/" || window.location.pathname.startsWith("/c/") 
                  ? "bg-orange-50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-300 border-l-4 border-orange-500"
                  : "text-primary bg-transparent"
              }`}
              type="button"
              onClick={() => router.push("/")}
            >
              <div className="flex items-center gap-3">
                <ChatTeardropText size={18} className="text-gray-900 dark:text-white" />
                <span className="font-medium">Chat</span>
              </div>
            </button>

            <button
              className={`hover:bg-accent/80 hover:text-foreground group/agents relative inline-flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                window.location.pathname.startsWith("/agents")
                  ? "bg-orange-50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-300 border-l-4 border-orange-500"
                  : "text-primary bg-transparent"
              }`}
              type="button"
              onClick={() => router.push("/agents")}
            >
              <div className="flex items-center gap-3 w-full">
                <Users size={18} className="text-gray-900 dark:text-white" />
                <span className="font-medium">Agents</span>
                <Badge variant="secondary" className="ml-auto text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  Beta
                </Badge>
              </div>
            </button>
          </div>

          {/* Search Section */}
          <div className="mb-4">
            <HistoryTrigger
              hasSidebar={false}
              classNameTrigger="bg-transparent hover:bg-accent/80 hover:text-foreground text-muted-foreground relative inline-flex w-full items-center rounded-md px-3 py-2.5 text-sm transition-colors group/search"
              icon={<MagnifyingGlass size={18} className="mr-3 text-gray-900 dark:text-white" />}
              label={
                <div className="flex w-full items-center justify-between">
                  <span className="font-medium">Rechercher</span>
                  <div className="text-muted-foreground text-xs">
                    Ctrl+K
                  </div>
                </div>
              }
              hasPopover={false}
            />
          </div>

          {/* Chat History */}
          {isLoading ? (
            <div className="flex-1" />
          ) : hasChats ? (
            <div className="space-y-1 flex-1">
              <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Lịch sử Chat
              </h3>
              {groupedChats?.map((group) => (
                <SidebarList
                  key={group.name}
                  title={group.name}
                  items={group.chats}
                  currentChatId={currentChatId}
                />
              ))}
            </div>
          ) : (
            <div className="flex-1" />
          )}
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-3">
        {/* Premium Upgrade Button */}
        {!isPremium && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-900">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-gray-900 dark:text-white" />
              <span className="text-gray-900 dark:text-white text-sm font-medium">Nâng cấp Premium</span>
            </div>
            <button
              onClick={() => router.push("/pricing")}
              className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-sm py-2 px-4 rounded-md font-medium transition-colors"
            >
              Xem gói Premium
            </button>
          </div>
        )}

        {isPremium && (
          <div className="border rounded-lg p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs font-medium text-green-800 dark:text-green-200">
                  Premium Active
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Help Center */}
        <button className="hover:bg-muted flex items-center gap-2 rounded-md p-2 w-full text-left">
          <div className="rounded-full border p-1">
            <QuestionMark className="size-4 text-gray-900 dark:text-white" />
          </div>
          <div className="flex flex-col">
            <div className="text-sidebar-foreground text-sm font-medium">
              Learn more 
            </div>
          </div>
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}