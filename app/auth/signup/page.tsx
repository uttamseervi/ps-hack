"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { motion } from "framer-motion"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "refugee",
    country: "",
    governmentId: "",
    
    // Refugee specific fields
    phone: "",
    address: "",
    languages: "",
    
    // NGO specific fields
    organizationName: "",
    ngoType: "",
    services: "",
    contact: "",
    availability: "",
  })
  
  const [countries, setCountries] = useState<any[]>([])
  const [selectedCountry, setSelectedCountry] = useState<any>(null)
  const [showUniqueId, setShowUniqueId] = useState(false)
  const [generatedUniqueId, setGeneratedUniqueId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const roleParam = searchParams.get("role")
    if (roleParam) {
      setFormData((prev) => ({ ...prev, role: roleParam }))
    }
    
    // Fetch countries list
    fetchCountries()
  }, [searchParams])
  
  const fetchCountries = async () => {
    try {
      const response = await fetch('/api/countries')
      const data = await response.json()
      if (data.success) {
        setCountries(data.countries)
      }
    } catch (error) {
      console.error('Error fetching countries:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    // If role is changing, clear role-specific fields
    if (field === 'role') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        // Reset all role-specific fields
        organizationName: '',
        ngoType: '',
        services: '',
        contact: '',
        availability: '',
        phone: '',
        address: '',
        governmentId: '',
        languages: ''
      }));
      setSelectedCountry(null)
      return;
    }
    
    // Handle country selection
    if (field === 'country') {
      const country = countries.find(c => c.code === value)
      setSelectedCountry(country)
      setFormData(prev => ({ ...prev, [field]: value }))
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

    if (!formData.country) {
      alert("Please select a country")
      setIsLoading(false)
      return
    }

    if (!formData.governmentId && formData.role === "refugee") {
      alert("Please enter your government ID")
      setIsLoading(false)
      return
    }

    try {
      if (formData.role === "refugee") {
        // Prepare refugee registration data
        const registrationData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          country: formData.country,
          governmentId: formData.governmentId,
          phone: formData.phone || null,
          address: formData.address || null,
          languages: formData.languages ? formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0) : []
        }

        // Call the refugee registration API
        const response = await axios.post('/api/auth/register/refugee', registrationData)

        if (response.status !== 201 && response.status !== 200) {
          throw new Error(response.data.error || 'Registration failed')
        }

        // Show unique ID to user
        setGeneratedUniqueId(response.data.uniqueId)
        setShowUniqueId(true)

      } else if (formData.role === "ngo") {
        // Prepare NGO registration data
        const registrationData = {
          email: formData.email,
          password: formData.password,
          organizationName: formData.organizationName,
          country: formData.country,
          ngoType: formData.ngoType,
          services: formData.services ? formData.services.split(',').map(service => service.trim()).filter(service => service.length > 0) : [],
          contact: formData.contact || null,
          availability: formData.availability || null
        }

        // Call the NGO registration API
        const response = await axios.post('/api/auth/register/ngo', registrationData)

        if (response.status !== 201 && response.status !== 200) {
          throw new Error(response.data.error || 'Registration failed')
        }

        // Show unique ID to user
        setGeneratedUniqueId(response.data.uniqueId)
        setShowUniqueId(true)
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
        className="w-full max-w-2xl"
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
                  {/* Common Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="country">Country</Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="governmentId">
                      {selectedCountry ? selectedCountry.idType : 'Government ID'}
                    </Label>
                    <Input
                      id="governmentId"
                      placeholder={selectedCountry ? selectedCountry.placeholder : 'Enter your government ID'}
                      value={formData.governmentId}
                      onChange={(e) => handleInputChange("governmentId", e.target.value)}
                      required
                    />
                    {selectedCountry && (
                      <p className="text-xs text-muted-foreground">
                        Enter your {selectedCountry.idType} number
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Your current address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="languages">Languages Spoken</Label>
                    <Input
                      id="languages"
                      placeholder="e.g., Arabic, English, French (comma-separated)"
                      value={formData.languages}
                      onChange={(e) => handleInputChange("languages", e.target.value)}
                      required
                    />
                  </div>

                  {formData.role === "refugee" && (
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="text-lg font-semibold">Additional Information</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="languages">Languages Spoken</Label>
                        <Input
                          id="languages"
                          placeholder="English, Arabic, French (comma-separated)"
                          value={formData.languages}
                          onChange={(e) => handleInputChange("languages", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {formData.role === "ngo" && (
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="text-lg font-semibold">Organization Information</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="organizationName">Organization Name</Label>
                        <Input
                          id="organizationName"
                          placeholder="Your organization name"
                          value={formData.organizationName}
                          onChange={(e) => handleInputChange("organizationName", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ngoType">NGO Type</Label>
                        <Select value={formData.ngoType} onValueChange={(value) => handleInputChange("ngoType", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select NGO type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="International NGO">International NGO</SelectItem>
                            <SelectItem value="Local NGO">Local NGO</SelectItem>
                            <SelectItem value="Faith-based NGO">Faith-based NGO</SelectItem>
                            <SelectItem value="Government NGO">Government NGO</SelectItem>
                            <SelectItem value="Private NGO">Private NGO</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="services">Services Offered</Label>
                        <Input
                          id="services"
                          placeholder="medical aid, emergency response, trauma care (comma-separated)"
                          value={formData.services}
                          onChange={(e) => handleInputChange("services", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contact">Contact Number</Label>
                        <Input
                          id="contact"
                          type="tel"
                          placeholder="+91-80-1234567"
                          value={formData.contact}
                          onChange={(e) => handleInputChange("contact", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="availability">Availability</Label>
                        <Input
                          id="availability"
                          placeholder="24/7, Mon-Fri 9AM-5PM, Emergency only"
                          value={formData.availability}
                          onChange={(e) => handleInputChange("availability", e.target.value)}
                        />
                      </div>
                    </div>
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

      {/* Unique ID Modal */}
      {showUniqueId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
              <p className="text-gray-600 mb-4">
                Your unique HealthBridge ID has been generated. Please save this ID safely as it will be used for all your medical records.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 font-medium mb-2">Your Unique HealthBridge ID:</p>
                <p className="text-2xl font-bold text-blue-900 font-mono">{generatedUniqueId}</p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Please save this ID in a safe place. You'll need it to access your medical records and for all future healthcare services.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedUniqueId);
                    alert('ID copied to clipboard!');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Copy ID
                </Button>
                <Button
                  onClick={() => {
                    setShowUniqueId(false);
                    router.push('/auth/login?registered=true&role=' + formData.role);
                  }}
                  className="flex-1"
                >
                  Continue to Login
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}