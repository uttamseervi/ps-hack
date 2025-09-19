"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("") // Clear error when user types
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.post('/api/auth/login', formData)

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('healthbridge_token', response.data.token)
        localStorage.setItem('healthbridge_user', JSON.stringify(response.data.user))
        localStorage.setItem('healthbridge_auth', 'true')
        localStorage.setItem('healthbridge_role', response.data.user.role)

        // Redirect based on role
        if (response.data.user.role === 'refugee') {
          router.push('/dashboard/refugee')
        } else if (response.data.user.role === 'ngo') {
          router.push('/dashboard/ngo')
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const registered = searchParams.get("registered")
  const role = searchParams.get("role")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">HealthBridge</span>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              {registered 
                ? `Your ${role === 'refugee' ? 'refugee' : 'NGO'} account has been created successfully. Please sign in.`
                : 'Sign in to your account to continue'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 text-center">
          <Button variant="ghost" asChild>
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}