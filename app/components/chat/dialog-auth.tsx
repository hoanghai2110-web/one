"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { signInWithGoogle } from "@/lib/api"
import { createClient } from "@/lib/supabase/client"
import { isSupabaseEnabled } from "@/lib/supabase/config"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { useState } from "react"

type DialogAuthProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function DialogAuth({ open, setOpen }: DialogAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  if (!isSupabaseEnabled) {
    return null
  }

  const supabase = createClient()

  if (!supabase) {
    return null
  }

  const handleSignInWithGoogle = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await signInWithGoogle(supabase)

      // Redirect to the provider URL
      if (data?.url) {
        window.location.href = data.url
      }
    } catch (err: unknown) {
      console.error("Error signing in with Google:", err)
      setError(
        (err as Error).message ||
          "An unexpected error occurred. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailAuth = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (authMode === "signin") {
        // Sign in with email and password
        const { error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) {
          throw error;
        }
      } else {
        // Sign up with email and password
        const { error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });

        if (error) {
          throw error;
        }
      }
    } catch (err: unknown) {
      console.error("Error signing in with Email:", err)
      setError(
        (err as Error).message ||
          "An unexpected error occurred. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {authMode === "signin" ? "Đăng nhập" : "Đăng ký tài khoản"}
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            {authMode === "signin"
              ? "Đăng nhập để tiếp tục sử dụng dịch vụ."
              : "Tạo tài khoản mới để bắt đầu."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email/Password Form */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleEmailAuth}
              disabled={isLoading || !email || !password}
              className="w-full text-base"
              size="lg"
            >
              {isLoading ? "Đang xử lý..." : authMode === "signin" ? "Đăng nhập" : "Đăng ký"}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Hoặc
              </span>
            </div>
          </div>

          {/* Google Auth */}
          <Button
            onClick={handleSignInWithGoogle}
            disabled={isLoading}
            variant="outline"
            className="w-full text-base"
            size="lg"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google logo"
              width={20}
              height={20}
              className="mr-2 size-4"
            />
            {isLoading ? "Đang xử lý..." : "Đăng nhập với Google"}
          </Button>

          {/* Toggle between signin/signup */}
          <div className="text-center text-sm">
            {authMode === "signin" ? (
              <span>
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("signup")}
                  className="text-primary hover:underline"
                  disabled={isLoading}
                >
                  Đăng ký ngay
                </button>
              </span>
            ) : (
              <span>
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("signin")}
                  className="text-primary hover:underline"
                  disabled={isLoading}
                >
                  Đăng nhập
                </button>
              </span>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}