"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authService, type LoginRequest } from "@/lib/auth"
import { useAppDispatch } from "@/redux/hooks"
import { login } from "@/redux/features/user/user.slice"

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [role, setRole] = useState<"doctor" | "admin">("doctor")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      dispatch(login({ user: data.data.user, role: data.data.role }))
      router.push(role === "doctor" ? "/doctor/consultations" : "/admin/dashboard")
    },
    onError: (err: Error) => {
      setError(err.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    loginMutation.mutate({ phoneNumber, password, role })
  }

  return (
    <div className="min-h-screen bg-(--color-surface) flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">User Type</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={role === "doctor" ? "default" : "outline"}
                  onClick={() => setRole("doctor")}
                  className="flex-1"
                >
                  Doctor
                </Button>
                <Button
                  type="button"
                  variant={role === "admin" ? "default" : "outline"}
                  onClick={() => setRole("admin")}
                  className="flex-1"
                >
                  Admin
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="text-sm text-(--color-error)">{error}</div>}

            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span className="text-(--color-text-muted)">New institution? </span>
            <Link href="/register" className="text-(--color-primary) hover:underline">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
