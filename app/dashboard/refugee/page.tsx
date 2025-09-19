"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  MessageCircle,
  Stethoscope,
  MapPin,
  BookOpen,
  AlertTriangle,
  Clock,
  Heart,
  Phone,
  Calendar,
  TrendingUp,
  Pill,
  User,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface DashboardData {
  user: {
    name: string;
    uniqueId: string;
    country: string;
  };
  healthScore: number;
  stats: {
    consultations: number;
    daysActive: number;
    articlesRead: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    time: string;
    status: string;
  }>;
  medicationHistory: Array<{
    id: string;
    medication: string;
    doctor: string;
    date: string;
    reportId: string;
  }>;
  emergencyContacts: Array<{
    name: string;
    number: string;
    type: string;
  }>;
  nextAppointment: {
    clinic: string;
    type: string;
    date: string;
    location: string;
  };
  dailyHealthTip: {
    title: string;
    content: string;
  };
}

export default function RefugeeDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('healthbridge_token')
      if (!token) {
        setError('No authentication token found')
        setLoading(false)
        return
      }

      const response = await fetch('/api/dashboard/refugee', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const result = await response.json()
      if (result.success) {
        setDashboardData(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError(error instanceof Error ? error.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: "AI Health Assistant",
      description: "Chat with our multilingual AI for instant health guidance",
      icon: MessageCircle,
      href: "/chatbot",
      color: "bg-blue-500",
    },
    {
      title: "Check Symptoms",
      description: "Get personalized health assessments and recommendations",
      icon: Stethoscope,
      href: "/symptom-checker",
      color: "bg-green-500",
    },
    {
      title: "Find Services",
      description: "Locate nearby clinics, pharmacies, and medical facilities",
      icon: MapPin,
      href: "/map",
      color: "bg-purple-500",
    },
    {
      title: "Health Education",
      description: "Access vital health information and prevention tips",
      icon: BookOpen,
      href: "/health-hub",
      color: "bg-orange-500",
    },
  ]

  if (loading) {
    return (
      <AuthGuard requiredRole="refugee">
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (error) {
    return (
      <AuthGuard requiredRole="refugee">
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchDashboardData}>Try Again</Button>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!dashboardData) {
    return (
      <AuthGuard requiredRole="refugee">
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">No data available</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRole="refugee">
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
        <Navigation userRole="refugee" />
        <div className="md:ml-64 p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {dashboardData.user.name}</h1>
              <p className="text-muted-foreground">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                HealthBridge ID: {dashboardData.user.uniqueId} | {dashboardData.user.country}
              </p>
            </motion.div>
          </div>

          {/* Emergency Alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Alert className="mb-6 border-destructive/50 bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">
                <strong>Health Alert:</strong> Cholera outbreak reported in nearby areas. Please follow prevention
                guidelines and seek immediate care if you experience severe symptoms.
                <Button variant="link" className="p-0 h-auto text-destructive underline ml-2">
                  Learn More
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Health Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      Health Overview
                    </CardTitle>
                    <CardDescription>Your current health status and wellness score</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Overall Health Score</span>
                          <span className="text-2xl font-bold text-primary">{dashboardData.healthScore}%</span>
                        </div>
                        <Progress value={dashboardData.healthScore} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">Based on recent assessments and activities</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{dashboardData.stats.consultations}</div>
                          <div className="text-xs text-muted-foreground">Consultations</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{dashboardData.stats.daysActive}</div>
                          <div className="text-xs text-muted-foreground">Days Active</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{dashboardData.stats.articlesRead}</div>
                          <div className="text-xs text-muted-foreground">Articles Read</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Access your most-used health services instantly</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {quickActions.map((action, index) => {
                        const Icon = action.icon
                        return (
                          <motion.div
                            key={action.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 * index }}
                          >
                            <Button
                              asChild
                              variant="outline"
                              className="h-auto p-4 w-full justify-start bg-transparent"
                            >
                              <Link href={action.href}>
                                <div
                                  className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mr-4`}
                                >
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left">
                                  <div className="font-semibold">{action.title}</div>
                                  <div className="text-xs text-muted-foreground">{action.description}</div>
                                </div>
                              </Link>
                            </Button>
                          </motion.div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Your latest health-related activities and appointments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.recentActivity.length > 0 ? (
                        dashboardData.recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm">{activity.title}</h4>
                                <Badge
                                  variant={activity.status === "completed" ? "secondary" : "default"}
                                  className="text-xs"
                                >
                                  {activity.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No recent activity</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Emergency Contacts */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <Phone className="w-5 h-5" />
                      Emergency Contacts
                    </CardTitle>
                    <CardDescription>Important numbers for immediate assistance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dashboardData.emergencyContacts.map((contact) => (
                        <div
                          key={contact.name}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                        >
                          <div>
                            <div className="font-medium text-sm">{contact.name}</div>
                            <div className="text-xs text-muted-foreground">{contact.type}</div>
                          </div>
                          <Button size="sm" variant="outline" className="text-xs bg-transparent">
                            <Phone className="w-3 h-3 mr-1" />
                            {contact.number}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upcoming Appointments */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Next Appointment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="font-medium text-sm">{dashboardData.nextAppointment.clinic}</div>
                        <div className="text-sm text-muted-foreground">{dashboardData.nextAppointment.type}</div>
                        <div className="text-xs text-primary font-medium mt-2">{dashboardData.nextAppointment.date}</div>
                        <div className="text-xs text-muted-foreground">{dashboardData.nextAppointment.location}</div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <MapPin className="w-3 h-3 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Health Tips */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Daily Health Tip
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-accent/10">
                        <h4 className="font-medium text-sm mb-2">{dashboardData.dailyHealthTip.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {dashboardData.dailyHealthTip.content}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        View More Tips
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Medication History Column */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="w-5 h-5" />
                      Medication History
                    </CardTitle>
                    <CardDescription>Your recent prescriptions and medications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dashboardData.medicationHistory.length > 0 ? (
                        dashboardData.medicationHistory.slice(0, 5).map((medication) => (
                          <div key={medication.id} className="p-3 rounded-lg bg-muted/50 border">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-primary">{medication.medication}</h4>
                                <p className="text-xs text-muted-foreground">Dr. {medication.doctor}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {medication.date}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Report ID: {medication.reportId}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Pill className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No medication history</p>
                          <p className="text-xs">Medications will appear here after doctor visits</p>
                        </div>
                      )}
                    </div>
                    {dashboardData.medicationHistory.length > 5 && (
                      <Button variant="ghost" size="sm" className="w-full text-xs mt-3">
                        View All Medications
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* User Profile Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">HealthBridge ID</span>
                        <span className="text-sm font-mono font-medium">{dashboardData.user.uniqueId}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Country</span>
                        <span className="text-sm font-medium">{dashboardData.user.country}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Reports</span>
                        <span className="text-sm font-medium">{dashboardData.stats.consultations}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Health Score</span>
                        <span className="text-sm font-medium text-primary">{dashboardData.healthScore}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
