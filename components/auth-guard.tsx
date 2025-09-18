"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "refugee" | "ngo"
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Mock authentication check
    const checkAuth = () => {
      // In a real app, this would check JWT tokens, session storage, etc.
      const mockAuth = localStorage.getItem("healthbridge_auth")
      const mockRole = localStorage.getItem("healthbridge_role")

      if (mockAuth && mockRole) {
        setIsAuthenticated(true)
        setUserRole(mockRole)
      } else {
        // For demo purposes, auto-authenticate based on path
        if (pathname.includes("/dashboard/refugee")) {
          localStorage.setItem("healthbridge_auth", "true")
          localStorage.setItem("healthbridge_role", "refugee")
          setIsAuthenticated(true)
          setUserRole("refugee")
        } else if (pathname.includes("/dashboard/ngo")) {
          localStorage.setItem("healthbridge_auth", "true")
          localStorage.setItem("healthbridge_role", "ngo")
          setIsAuthenticated(true)
          setUserRole("ngo")
        } else {
          router.push("/auth/login")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 flex items-center justify-center">
        <Card className="w-64">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 animate-pulse">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  if (requiredRole && userRole !== requiredRole) {
    router.push("/auth/login")
    return null
  }

  return <>{children}</>
}
