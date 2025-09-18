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
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "refugee",
    
    // Refugee specific fields
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    currentAddress: "",
    identificationNumber: "",
    languages: "",
    location: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalConditions: "",
    bloodType: "",
    allergies: "",
    disabilities: "",
    
    // NGO specific fields
    organization: "",
    specialization: "",
    registrationNumber: "",
    website: "",
    description: "",
    contactPersonName: "",
    contactPersonPhone: "",
    servicesOffered: "",
    yearsOfOperation: "",
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
        // Reset all role-specific fields
        organization: '',
        specialization: '',
        registrationNumber: '',
        website: '',
        description: '',
        contactPersonName: '',
        contactPersonPhone: '',
        servicesOffered: '',
        yearsOfOperation: '',
        dateOfBirth: '',
        gender: '',
        phoneNumber: '',
        currentAddress: '',
        identificationNumber: '',
        languages: '',
        location: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        medicalConditions: '',
        bloodType: '',
        allergies: '',
        disabilities: ''
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
          name: formData.name,
          languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0),
          location: {
            address: formData.currentAddress,
            city: formData.location
          },
          dateOfBirth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          phoneNumber: formData.phoneNumber || null,
          currentAddress: formData.currentAddress || null,
          identificationNumber: formData.identificationNumber || null,
          emergencyContact: {
            name: formData.emergencyContactName || null,
            phone: formData.emergencyContactPhone || null
          },
          medicalConditions: formData.medicalConditions.split(',').map(condition => condition.trim()).filter(condition => condition.length > 0),
          bloodType: formData.bloodType || null,
          allergies: formData.allergies.split(',').map(allergy => allergy.trim()).filter(allergy => allergy.length > 0),
          disabilities: formData.disabilities.split(',').map(disability => disability.trim()).filter(disability => disability.length > 0),
          familyMembers: [] // Can be extended later
        }


        // Call the refugee registration API using axios
        const response = await axios.post('/api/register/refugee', registrationData)

        if (response.status !== 201 && response.status !== 200) {
          throw new Error(response.data.error || 'Registration failed')
        }

        // Redirect to login with success message
        router.push('/auth/login?registered=true&role=refugee')
      } else if (formData.role === "ngo") {
        // Prepare NGO registration data
        const registrationData = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0),
          location: {
            address: formData.currentAddress,
            city: formData.location
          },
          organizationName: formData.organization,
          registrationNumber: formData.registrationNumber || null,
          description: formData.description || null,
          website: formData.website || null,
          phoneNumber: formData.phoneNumber || null,
          address: {
            street: formData.currentAddress || '',
            city: formData.location || ''
          },
          contactPerson: {
            name: formData.contactPersonName || formData.name,
            phone: formData.contactPersonPhone || formData.phoneNumber || ''
          },
          servicesOffered: formData.servicesOffered.split(',').map(service => service.trim()).filter(service => service.length > 0),
          specializations: formData.specialization ? [formData.specialization] : [],
          yearsOfOperation: formData.yearsOfOperation ? parseInt(formData.yearsOfOperation) : null
        }


        // Call the NGO registration API using axios
        const response = await axios.post('/api/auth/register/ngo', registrationData)

        if (response.status !== 201 && response.status !== 200) {
          throw new Error(response.data.error || 'Registration failed')
        }

        // Redirect to login with success message
        router.push('/auth/login?registered=true&role=ngo')
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location (City)</Label>
                      <Input
                        id="location"
                        placeholder="City, Country"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentAddress">Current Address</Label>
                    <Textarea
                      id="currentAddress"
                      placeholder="Your current address"
                      value={formData.currentAddress}
                      onChange={(e) => handleInputChange("currentAddress", e.target.value)}
                      rows={2}
                    />
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
                      <h3 className="text-lg font-semibold">Refugee Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={formData.gender}
                            onValueChange={(value) => handleInputChange("gender", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="identificationNumber">Identification Number</Label>
                        <Input
                          id="identificationNumber"
                          placeholder="Government ID or refugee registration number"
                          value={formData.identificationNumber}
                          onChange={(e) => handleInputChange("identificationNumber", e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                          <Input
                            id="emergencyContactName"
                            placeholder="Emergency contact person"
                            value={formData.emergencyContactName}
                            onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                          <Input
                            id="emergencyContactPhone"
                            type="tel"
                            placeholder="Emergency contact phone"
                            value={formData.emergencyContactPhone}
                            onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bloodType">Blood Type</Label>
                          <Select
                            value={formData.bloodType}
                            onValueChange={(value) => handleInputChange("bloodType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A-">A-</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B-">B-</SelectItem>
                              <SelectItem value="AB+">AB+</SelectItem>
                              <SelectItem value="AB-">AB-</SelectItem>
                              <SelectItem value="O+">O+</SelectItem>
                              <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="medicalConditions">Medical Conditions</Label>
                          <Input
                            id="medicalConditions"
                            placeholder="Diabetes, Hypertension, etc. (comma-separated)"
                            value={formData.medicalConditions}
                            onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="allergies">Allergies</Label>
                          <Input
                            id="allergies"
                            placeholder="Food, medication allergies (comma-separated)"
                            value={formData.allergies}
                            onChange={(e) => handleInputChange("allergies", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="disabilities">Disabilities</Label>
                          <Input
                            id="disabilities"
                            placeholder="Physical, mental disabilities (comma-separated)"
                            value={formData.disabilities}
                            onChange={(e) => handleInputChange("disabilities", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.role === "ngo" && (
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="text-lg font-semibold">Organization Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="organization">Organization Name</Label>
                          <Input
                            id="organization"
                            placeholder="Your organization name"
                            value={formData.organization}
                            onChange={(e) => handleInputChange("organization", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="registrationNumber">Registration Number</Label>
                          <Input
                            id="registrationNumber"
                            placeholder="Official registration number"
                            value={formData.registrationNumber}
                            onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            type="url"
                            placeholder="https://yourorganization.com"
                            value={formData.website}
                            onChange={(e) => handleInputChange("website", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="yearsOfOperation">Years of Operation</Label>
                          <Input
                            id="yearsOfOperation"
                            type="number"
                            min="0"
                            placeholder="Number of years in operation"
                            value={formData.yearsOfOperation}
                            onChange={(e) => handleInputChange("yearsOfOperation", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Organization Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Brief description of your organization and mission"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactPersonName">Contact Person Name</Label>
                          <Input
                            id="contactPersonName"
                            placeholder="Primary contact person"
                            value={formData.contactPersonName}
                            onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactPersonPhone">Contact Person Phone</Label>
                          <Input
                            id="contactPersonPhone"
                            type="tel"
                            placeholder="Contact person phone"
                            value={formData.contactPersonPhone}
                            onChange={(e) => handleInputChange("contactPersonPhone", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialization">Primary Specialization</Label>
                        <Select
                          value={formData.specialization}
                          onValueChange={(value) => handleInputChange("specialization", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select primary specialization" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Medicine</SelectItem>
                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="emergency">Emergency Medicine</SelectItem>
                            <SelectItem value="mental">Mental Health</SelectItem>
                            <SelectItem value="maternal">Maternal Health</SelectItem>
                            <SelectItem value="pharmacy">Pharmacy</SelectItem>
                            <SelectItem value="dental">Dental Care</SelectItem>
                            <SelectItem value="surgery">Surgery</SelectItem>
                            <SelectItem value="rehabilitation">Rehabilitation</SelectItem>
                            <SelectItem value="nutrition">Nutrition</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="servicesOffered">Services Offered</Label>
                        <Textarea
                          id="servicesOffered"
                          placeholder="List services offered (comma-separated): e.g., Primary care, Vaccinations, Health education"
                          value={formData.servicesOffered}
                          onChange={(e) => handleInputChange("servicesOffered", e.target.value)}
                          rows={2}
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
    </div>
  )
}