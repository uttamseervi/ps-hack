"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    organization: "",
    languages: "",
    location: "",
    specialization: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const roleParam = searchParams.get("role")
    if (roleParam) {
      setFormData((prev) => ({ ...prev, role: roleParam }))
    }
  }, [searchParams])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate signup process
    setTimeout(() => {
      // Mock registration - redirect based on role
      if (formData.role === "refugee") {
        router.push("/dashboard/refugee")
      } else if (formData.role === "ngo") {
        router.push("/dashboard/ngo")
      }
      setIsLoading(false)
    }, 2000)
  }

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
            <CardTitle className="text-2xl">Join HealthBridge</CardTitle>
            <CardDescription>Create your account to access healthcare services</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
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
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="refugee">Refugee seeking healthcare</SelectItem>
                    <SelectItem value="ngo">Healthcare provider / NGO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.role === "ngo" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      placeholder="Your organization name"
                      value={formData.organization}
                      onChange={(e) => handleInputChange("organization", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Medical Specialization</Label>
                    <Select
                      value={formData.specialization}
                      onValueChange={(value) => handleInputChange("specialization", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Medicine</SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="emergency">Emergency Medicine</SelectItem>
                        <SelectItem value="mental">Mental Health</SelectItem>
                        <SelectItem value="maternal">Maternal Health</SelectItem>
                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="languages">Languages Spoken</Label>
                <Input
                  id="languages"
                  placeholder="e.g., Arabic, English, French"
                  value={formData.languages}
                  onChange={(e) => handleInputChange("languages", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Current Location</Label>
                <Input
                  id="location"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Sign in
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
