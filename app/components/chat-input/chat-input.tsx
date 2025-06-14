"use client"

import { useAgentCommand } from "@/app/components/chat-input/use-agent-command"
import { ModelSelector } from "@/components/common/model-selector/base"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { Button } from "@/components/ui/button"
import { useAgent } from "@/lib/agent-store/provider"
import { getModelInfo } from "@/lib/models"
import { ArrowUp, Stop, Warning } from "@phosphor-icons/react"
import React, { useCallback, useEffect } from "react"
import { PromptSystem } from "../suggestions/prompt-system"
import { AgentCommand } from "./agent-command"
import { ButtonFileUpload } from "./button-file-upload"
import { ButtonSearch } from "./button-search"
import { FileList } from "./file-list"
import { SelectedAgent } from "./selected-agent"
import { SuggestionButtons } from "./suggestion-buttons"
import { useSearchAgent } from "./use-search-agent"

type ChatInputProps = {
  value: string
  onValueChange: (value: string) => void
  onSend: () => void
  isSubmitting?: boolean
  hasMessages?: boolean
  files: File[]
  onFileUpload: (files: File[]) => void
  onFileRemove: (file: File) => void
  onSuggestion: (suggestion: string) => void
  hasSuggestions?: boolean
  onSelectModel: (model: string) => void
  selectedModel: string
  isUserAuthenticated: boolean
  stop: () => void
  status?: "submitted" | "streaming" | "ready" | "error"
  onSearchToggle?: (enabled: boolean, agentId: string | null) => void
}

export function ChatInput({
  value,
  onValueChange,
  onSend,
  isSubmitting,
  files,
  onFileUpload,
  onFileRemove,
  onSuggestion,
  hasSuggestions,
  hasMessages,
  onSelectModel,
  selectedModel,
  isUserAuthenticated,
  stop,
  status,
  onSearchToggle,
}: ChatInputProps) {
  const { currentAgent, curatedAgents, userAgents } = useAgent()
  const { isSearchEnabled, toggleSearch } = useSearchAgent()

  const agentCommand = useAgentCommand({
    value,
    onValueChange,
    agents: [...(curatedAgents || []), ...(userAgents || [])],
    defaultAgent: currentAgent,
  })

  const selectModelConfig = getModelInfo(selectedModel)
  const hasToolSupport = Boolean(selectModelConfig?.tools)
  const isOnlyWhitespace = (text: string) => !/[^\s]/.test(text)

  // Handle search toggle
  const handleSearchToggle = useCallback(
    (enabled: boolean) => {
      toggleSearch(enabled)
      const agentId = enabled ? "search" : null
      onSearchToggle?.(enabled, agentId)
    },
    [toggleSearch, onSearchToggle]
  )

  const handleSend = useCallback(() => {
    if (isSubmitting) {
      return
    }

    if (status === "streaming") {
      stop()
      return
    }

    onSend()
  }, [isSubmitting, onSend, status, stop])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // First process agent command related key handling
      agentCommand.handleKeyDown(e)

      if (isSubmitting) {
        e.preventDefault()
        return
      }

      if (e.key === "Enter" && status === "streaming") {
        e.preventDefault()
        return
      }

      if (e.key === "Enter" && !e.shiftKey && !agentCommand.showAgentCommand) {
        if (isOnlyWhitespace(value)) {
          return
        }

        e.preventDefault()
        onSend()
      }
    },
    [agentCommand, isSubmitting, onSend, status, value]
  )

  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      const hasImageContent = Array.from(items).some((item) =>
        item.type.startsWith("image/")
      )

      if (!isUserAuthenticated && hasImageContent) {
        e.preventDefault()
        return
      }

      if (isUserAuthenticated && hasImageContent) {
        const imageFiles: File[] = []

        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile()
            if (file) {
              const newFile = new File(
                [file],
                `pasted-image-${Date.now()}.${file.type.split("/")[1]}`,
                { type: file.type }
              )
              imageFiles.push(newFile)
            }
          }
        }

        if (imageFiles.length > 0) {
          onFileUpload(imageFiles)
        }
      }
      // Text pasting will work by default for everyone
    },
    [isUserAuthenticated, onFileUpload]
  )

  useEffect(() => {
    const el = agentCommand.textareaRef.current
    if (!el) return
    el.addEventListener("paste", handlePaste)
    return () => el.removeEventListener("paste", handlePaste)
  }, [agentCommand.textareaRef, handlePaste])

  return (
    <div className="relative flex w-full flex-col gap-4">
      {hasSuggestions && (
        <PromptSystem
          onValueChange={onValueChange}
          onSuggestion={onSuggestion}
          value={value}
        />
      )}
      
      <div className="relative mx-0 px-0 pb-0 sm:pb-0 md:mx-0 md:px-0">
        <PromptInput
          className="bg-gray-50/90 relative z-10 p-0 pt-2 backdrop-blur-xl rounded-[14px] border border-gray-200/30 shadow-[0_2px_8px_rgba(0,0,0,0.03)] w-full max-w-full"
          maxHeight={200}
          value={value}
          onValueChange={agentCommand.handleValueChange}
        >
          {agentCommand.showAgentCommand && (
            <div className="absolute bottom-full left-0 w-full">
              <AgentCommand
                isOpen={agentCommand.showAgentCommand}
                searchTerm={agentCommand.agentSearchTerm}
                onSelect={agentCommand.handleAgentSelect}
                onClose={agentCommand.closeAgentCommand}
                activeIndex={agentCommand.activeAgentIndex}
                onActiveIndexChange={agentCommand.setActiveAgentIndex}
                curatedAgents={curatedAgents || []}
                userAgents={userAgents || []}
              />
            </div>
          )}
          <SelectedAgent
            selectedAgent={agentCommand.selectedAgent}
            removeSelectedAgent={agentCommand.removeSelectedAgent}
          />
          <FileList files={files} onFileRemove={onFileRemove} />
          <PromptInputTextarea
            placeholder="Hỏi bất kỳ điều gì"
            onKeyDown={handleKeyDown}
            className="min-h-[56px] pt-3 pl-4 pr-4 pb-2 text-base leading-[1.4] sm:text-base md:text-base resize-none border-0 focus:ring-0 w-full"
            ref={agentCommand.textareaRef}
          />
          <PromptInputActions className="mt-0 w-full justify-between px-4 pb-4 pt-2">
            <div className="flex gap-2 flex-wrap items-center">
              <ButtonFileUpload
                onFileUpload={onFileUpload}
                isUserAuthenticated={isUserAuthenticated}
                model={selectedModel}
              />
              <ButtonSearch
                isSelected={isSearchEnabled}
                onToggle={handleSearchToggle}
                isAuthenticated={isUserAuthenticated}
              />
              {currentAgent && !hasToolSupport && (
                <div className="flex items-center gap-1 max-w-[200px] sm:max-w-none">
                  <Warning className="size-4 flex-shrink-0" />
                  <p className="line-clamp-2 text-xs">
                    {selectedModel} does not support tools. Agents may not work
                    as expected.
                  </p>
                </div>
              )}
            </div>
            <PromptInputAction
              tooltip={status === "streaming" ? "Dừng" : "Gửi"}
            >
              <Button
                size="sm"
                className="size-8 rounded-lg bg-gray-900 hover:bg-gray-800 transition-all duration-200 ease-out flex-shrink-0"
                disabled={!value || isSubmitting || isOnlyWhitespace(value)}
                type="button"
                onClick={handleSend}
                aria-label={status === "streaming" ? "Dừng tin nhắn" : "Gửi tin nhắn"}
              >
                {status === "streaming" ? (
                  <Stop className="size-4" />
                ) : (
                  <ArrowUp className="size-4" />
                )}
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      </div>
      
      {/* Show custom suggestion system when no messages - below input */}
      {!hasMessages && (
        <div className="w-full mt-4">
          <SuggestionButtons onValueChange={onValueChange} />
        </div>
      )}
    </div>
  )
}