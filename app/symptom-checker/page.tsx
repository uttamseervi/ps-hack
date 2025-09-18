"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  Phone,
  MapPin,
  Heart,
  Thermometer,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface Symptom {
  id: string
  name: string
  category: string
  severity: number
}

interface AssessmentResult {
  severity: "mild" | "moderate" | "severe"
  recommendation: string
  urgency: string
  nextSteps: string[]
  emergencyContacts?: string[]
}

export default function SymptomCheckerPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [duration, setDuration] = useState("")
  const [intensity, setIntensity] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [assessment, setAssessment] = useState<AssessmentResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const symptoms: Symptom[] = [
    { id: "fever", name: "Fever", category: "General", severity: 2 },
    { id: "cough", name: "Cough", category: "Respiratory", severity: 1 },
    { id: "headache", name: "Headache", category: "Neurological", severity: 1 },
    { id: "nausea", name: "Nausea", category: "Digestive", severity: 1 },
    { id: "fatigue", name: "Fatigue", category: "General", severity: 1 },
    { id: "chest_pain", name: "Chest Pain", category: "Cardiovascular", severity: 4 },
    { id: "difficulty_breathing", name: "Difficulty Breathing", category: "Respiratory", severity: 4 },
    { id: "severe_headache", name: "Severe Headache", category: "Neurological", severity: 3 },
    { id: "dizziness", name: "Dizziness", category: "Neurological", severity: 2 },
    { id: "vomiting", name: "Vomiting", category: "Digestive", severity: 2 },
    { id: "abdominal_pain", name: "Abdominal Pain", category: "Digestive", severity: 2 },
    { id: "back_pain", name: "Back Pain", category: "Musculoskeletal", severity: 1 },
    { id: "joint_pain", name: "Joint Pain", category: "Musculoskeletal", severity: 1 },
    { id: "skin_rash", name: "Skin Rash", category: "Dermatological", severity: 1 },
    { id: "sore_throat", name: "Sore Throat", category: "Respiratory", severity: 1 },
  ]

  const symptomCategories = [...new Set(symptoms.map((s) => s.category))]

  const calculateAssessment = (): AssessmentResult => {
    const selectedSymptomObjects = symptoms.filter((s) => selectedSymptoms.includes(s.id))
    const maxSeverity = Math.max(...selectedSymptomObjects.map((s) => s.severity))
    const avgSeverity = selectedSymptomObjects.reduce((sum, s) => sum + s.severity, 0) / selectedSymptomObjects.length

    // Emergency symptoms
    const emergencySymptoms = ["chest_pain", "difficulty_breathing"]
    const hasEmergencySymptom = selectedSymptoms.some((id) => emergencySymptoms.includes(id))

    if (hasEmergencySymptom || maxSeverity >= 4) {
      return {
        severity: "severe",
        recommendation: "Seek immediate medical attention",
        urgency: "URGENT - Within 1 hour",
        nextSteps: [
          "Call emergency services (112) immediately",
          "Go to the nearest emergency room",
          "Do not drive yourself - call for ambulance",
          "Stay calm and follow emergency operator instructions",
        ],
        emergencyContacts: ["Emergency Services: 112", "UNHCR Health Hotline: +961-1-123456"],
      }
    } else if (maxSeverity >= 3 || avgSeverity >= 2.5) {
      return {
        severity: "moderate",
        recommendation: "Schedule medical consultation within 24-48 hours",
        urgency: "Moderate - Within 1-2 days",
        nextSteps: [
          "Contact your nearest healthcare provider",
          "Monitor symptoms closely",
          "Rest and stay hydrated",
          "Seek immediate care if symptoms worsen",
        ],
      }
    } else {
      return {
        severity: "mild",
        recommendation: "Self-care and monitoring recommended",
        urgency: "Low - Monitor at home",
        nextSteps: [
          "Rest and get adequate sleep",
          "Stay hydrated with plenty of fluids",
          "Monitor symptoms for changes",
          "Contact healthcare provider if symptoms persist beyond 3-5 days",
        ],
      }
    }
  }

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId],
    )
  }

  const handleSubmitAssessment = () => {
    setIsLoading(true)
    setTimeout(() => {
      const result = calculateAssessment()
      setAssessment(result)
      setIsLoading(false)
      setCurrentStep(4)
    }, 2000)
  }

  const resetAssessment = () => {
    setCurrentStep(1)
    setSelectedSymptoms([])
    setDuration("")
    setIntensity("")
    setAdditionalInfo("")
    setAge("")
    setGender("")
    setAssessment(null)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "text-red-600 bg-red-50 border-red-200"
      case "moderate":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "mild":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                Step 1: Basic Information
              </CardTitle>
              <CardDescription>Tell us a bit about yourself to provide better recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setCurrentStep(2)} disabled={!age || !gender}>
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )

      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Step 2: Select Your Symptoms
              </CardTitle>
              <CardDescription>Choose all symptoms you are currently experiencing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {symptomCategories.map((category) => (
                <div key={category}>
                  <h4 className="font-medium text-sm text-muted-foreground mb-3">{category}</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {symptoms
                      .filter((symptom) => symptom.category === category)
                      .map((symptom) => (
                        <div key={symptom.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={symptom.id}
                            checked={selectedSymptoms.includes(symptom.id)}
                            onCheckedChange={() => handleSymptomToggle(symptom.id)}
                          />
                          <Label htmlFor={symptom.id} className="text-sm font-normal cursor-pointer">
                            {symptom.name}
                          </Label>
                          {symptom.severity >= 3 && (
                            <AlertTriangle className="w-4 h-4 text-orange-500" title="High severity symptom" />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button onClick={() => setCurrentStep(3)} disabled={selectedSymptoms.length === 0}>
                  Next Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )

      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Step 3: Additional Details
              </CardTitle>
              <CardDescription>Provide more information about your symptoms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="duration">How long have you had these symptoms?</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-day">Less than a day</SelectItem>
                    <SelectItem value="1-3-days">1-3 days</SelectItem>
                    <SelectItem value="4-7-days">4-7 days</SelectItem>
                    <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                    <SelectItem value="more-than-2-weeks">More than 2 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="intensity">How would you rate the intensity of your symptoms?</Label>
                <Select value={intensity} onValueChange={setIntensity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select intensity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild - Barely noticeable</SelectItem>
                    <SelectItem value="moderate">Moderate - Noticeable but manageable</SelectItem>
                    <SelectItem value="severe">Severe - Significantly affecting daily activities</SelectItem>
                    <SelectItem value="very-severe">Very Severe - Unable to perform normal activities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="additional">Additional information (optional)</Label>
                <Textarea
                  id="additional"
                  placeholder="Any other details about your symptoms, medical history, or concerns..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button onClick={handleSubmitAssessment} disabled={!duration || !intensity || isLoading}>
                  {isLoading ? "Analyzing..." : "Get Assessment"}
                  <Stethoscope className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )

      case 4:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Your Health Assessment
              </CardTitle>
              <CardDescription>Based on your symptoms, here's our recommendation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {assessment && (
                <>
                  {/* Severity Alert */}
                  <Alert className={`border-2 ${getSeverityColor(assessment.severity)}`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div>
                          <strong className="text-lg">
                            {assessment.severity.charAt(0).toUpperCase() + assessment.severity.slice(1)} Condition
                          </strong>
                          <p className="mt-1">{assessment.recommendation}</p>
                        </div>
                        <Badge variant={assessment.severity === "severe" ? "destructive" : "secondary"}>
                          {assessment.urgency}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>

                  {/* Emergency Contacts */}
                  {assessment.emergencyContacts && (
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader>
                        <CardTitle className="text-red-700 flex items-center gap-2">
                          <Phone className="w-5 h-5" />
                          Emergency Contacts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {assessment.emergencyContacts.map((contact, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                              <span className="text-sm font-medium">{contact}</span>
                              <Button size="sm" variant="destructive">
                                Call Now
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Next Steps */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ArrowRight className="w-5 h-5" />
                        Recommended Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2">
                        {assessment.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <span className="text-sm">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button asChild className="h-auto p-4">
                      <Link href="/map">
                        <div className="text-center">
                          <MapPin className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-medium">Find Nearby Services</div>
                          <div className="text-xs opacity-90">Locate healthcare facilities</div>
                        </div>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto p-4 bg-transparent">
                      <Link href="/chatbot">
                        <div className="text-center">
                          <Heart className="w-6 h-6 mx-auto mb-2" />
                          <div className="font-medium">Talk to AI Assistant</div>
                          <div className="text-xs opacity-90">Get more guidance</div>
                        </div>
                      </Link>
                    </Button>
                  </div>

                  <div className="flex justify-center">
                    <Button variant="outline" onClick={resetAssessment} className="bg-transparent">
                      Start New Assessment
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <Navigation userRole="refugee" />
      <div className="md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/refugee">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Thermometer className="w-8 h-8 text-primary" />
              Symptom Checker
            </h1>
            <p className="text-muted-foreground">Get personalized health assessments and recommendations</p>
          </motion.div>
        </div>

        {/* Progress Bar */}
        {currentStep < 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">Step {currentStep} of 3</span>
                </div>
                <Progress value={(currentStep / 3) * 100} className="h-2" />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          </Card>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6"
        >
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Medical Disclaimer:</strong> This symptom checker is for informational purposes only and should
              not replace professional medical advice. Always consult with a healthcare provider for accurate diagnosis
              and treatment.
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    </div>
  )
}
