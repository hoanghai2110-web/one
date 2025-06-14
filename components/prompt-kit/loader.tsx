
"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type LoaderVariant = 
  | "circular"
  | "classic" 
  | "pulse"
  | "pulse-dot"
  | "dots"
  | "typing"
  | "wave"
  | "bars"
  | "terminal"
  | "text-blink"
  | "text-shimmer"
  | "loading-dots"

type LoaderSize = "sm" | "md" | "lg"

interface LoaderProps {
  variant?: LoaderVariant
  size?: LoaderSize
  className?: string
}

const sizeConfig = {
  sm: { dot: "size-1", bar: "h-3", text: "text-xs" },
  md: { dot: "size-2", bar: "h-4", text: "text-sm" },
  lg: { dot: "size-3", bar: "h-6", text: "text-base" }
}

const ANIMATION_DURATION = 0.6
const WAVE_DELAYS = [0, 0.1, 0.2]
const DOTS_DELAYS = [0, 0.2, 0.4]

export function Loader({ variant = "wave", size = "md", className }: LoaderProps) {
  const sizeClasses = sizeConfig[size]

  const renderVariant = () => {
    switch (variant) {
      case "circular":
        return (
          <motion.div
            className={cn("border-2 border-primary/30 border-t-primary rounded-full", sizeClasses.dot)}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )

      case "classic":
        return (
          <motion.div
            className={cn("border-2 border-gray-300 border-t-primary rounded-full", sizeClasses.dot)}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        )

      case "pulse":
        return (
          <motion.div
            className={cn("bg-primary rounded-full", sizeClasses.dot)}
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )

      case "pulse-dot":
        return (
          <motion.div
            className={cn("bg-primary/60 rounded-full", sizeClasses.dot)}
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )

      case "dots":
        return (
          <div className="flex items-center gap-1">
            {DOTS_DELAYS.map((delay, i) => (
              <motion.div
                key={i}
                className={cn("bg-primary/60 rounded-full", sizeClasses.dot)}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )

      case "typing":
        return (
          <div className="flex items-center gap-1">
            {[0, 0.15, 0.3].map((delay, i) => (
              <motion.div
                key={i}
                className={cn("bg-primary/60 rounded-full", sizeClasses.dot)}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )

      case "wave":
        return (
          <div className="flex items-center gap-1">
            {WAVE_DELAYS.map((delay, i) => (
              <motion.div
                key={i}
                className={cn("bg-primary/60 rounded-full", sizeClasses.dot)}
                animate={{
                  y: ["0%", "-60%", "0%"],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: ANIMATION_DURATION,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay
                }}
              />
            ))}
          </div>
        )

      case "bars":
        return (
          <div className="flex items-end gap-1">
            {[0, 0.1, 0.2, 0.3].map((delay, i) => (
              <motion.div
                key={i}
                className={cn("bg-primary/60 w-1 rounded-full", sizeClasses.bar)}
                animate={{ scaleY: [0.3, 1, 0.3] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )

      case "terminal":
        return (
          <div className="flex items-center">
            <span className={cn("font-mono", sizeClasses.text)}>Loading</span>
            <motion.span
              className={cn("font-mono", sizeClasses.text)}
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              |
            </motion.span>
          </div>
        )

      case "text-blink":
        return (
          <motion.span
            className={cn("font-medium", sizeClasses.text)}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading...
          </motion.span>
        )

      case "text-shimmer":
        return (
          <motion.span
            className={cn("font-medium bg-gradient-to-r from-primary/50 via-primary to-primary/50 bg-clip-text text-transparent", sizeClasses.text)}
            animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ backgroundSize: "200% 100%" }}
          >
            Loading...
          </motion.span>
        )

      case "loading-dots":
        return (
          <div className="flex items-center">
            <span className={cn("font-medium", sizeClasses.text)}>Loading</span>
            <div className="flex ml-1">
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.span
                  key={i}
                  className={sizeClasses.text}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay
                  }}
                >
                  .
                </motion.span>
              ))}
            </div>
          </div>
        )

      default:
        return renderVariant()
    }
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {renderVariant()}
    </div>
  )
}
