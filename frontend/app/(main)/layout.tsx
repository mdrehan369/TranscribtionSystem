"use client"

import { authService } from "@/lib/auth"
import { login } from "@/redux/features/user/user.slice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import React from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const router = useRouter()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)
  const user = useAppSelector(state => state.user.user)

  useEffect(() => {
    (async () => {
      try {
        const response = await authService.getUser()

        if (!response || !response.success || !response.data) {
          router.replace("/login?redirect=true")
          return
        }

        const { user, role } = response.data
        dispatch(login({ user: user!, role }))
      } catch (error) {
        console.log(error)
        router.replace("/login?redirect=true")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleLogout = () => {
    router.push("/login")
  }

  if (loading) return null
  return (
    user &&
    <div className="min-h-screen bg-(--color-surface)">
      <nav className="bg-white border-b border-(--color-border)">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-(--color-primary)">Medical Transcription</h1>
            <p className="text-sm text-(--color-text-muted)">
              {user.firstName} {user.lastName}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  )
}

