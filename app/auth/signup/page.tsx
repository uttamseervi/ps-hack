"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    role: "refugee",
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
    // If role is changing, clear role-specific fields
    if (field === 'role') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        organization: '',
        specialization: '',
        languages: '',
        location: ''
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      if (formData.role === "refugee") {
        // Prepare refugee registration data
        const registrationData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.name.split(' ')[0],
          lastName: formData.name.split(' ').slice(1).join(' ') || ' ',
          phone: '', // Add phone field to your form if needed
          dateOfBirth: '', // Add date of birth field if needed
          gender: 'prefer_not_to_say', // Add gender field if needed
          countryOfOrigin: formData.location,
          currentLocation: formData.location,
          languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0),
          skills: [], // Add skills field if needed
          bio: '' // Add bio field if needed
        }

        // Call the refugee registration API
        const response = await fetch('/api/refugee-registration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed')
        }

        // Redirect to login with success message
        router.push('/auth/login?registered=true')
      } else if (formData.role === "ngo") {
        // Handle NGO registration here if needed
        // const response = await fetch('/api/ngo-registration', {...})
        router.push("/dashboard/ngo")
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert(error instanceof Error ? error.message : 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
            <Tabs 
              value={formData.role} 
              onValueChange={(value) => handleInputChange("role", value)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="refugee">Refugee</TabsTrigger>
                <TabsTrigger value="ngo">Healthcare/NGO</TabsTrigger>
              </TabsList>
              
              <TabsContent value={formData.role}>
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

              {formData.role === "refugee" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="languages">Languages Spoken</Label>
                    <Input
                      id="languages"
                      placeholder="e.g., Arabic, English, French"
                      value={formData.languages}
                      onChange={(e) => handleInputChange("languages", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Current Location</Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

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


                  <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : `Sign up as ${formData.role === 'refugee' ? 'Refugee' : 'Healthcare Provider'}`}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
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
