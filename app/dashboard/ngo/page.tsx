"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  TrendingUp,
  Activity,
  Heart,
  Stethoscope,
  Calendar,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Import dummy data
import dummyData from "@/lib/dummy-data.json"

export default function NGODashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedTimeframe, setSelectedTimeframe] = useState("week")

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const stats = {
    totalCases: 47,
    activeCases: 12,
    resolvedCases: 35,
    urgentCases: 3,
    todayConsultations: 8,
    weeklyGrowth: 15,
  }

  const chartData = [
    { name: "Mon", cases: 4, resolved: 3 },
    { name: "Tue", cases: 6, resolved: 4 },
    { name: "Wed", cases: 8, resolved: 6 },
    { name: "Thu", cases: 5, resolved: 7 },
    { name: "Fri", cases: 7, resolved: 5 },
    { name: "Sat", cases: 3, resolved: 2 },
    { name: "Sun", cases: 4, resolved: 3 },
  ]

  const severityData = [
    { name: "Mild", value: 25, color: "#10b981" },
    { name: "Moderate", value: 15, color: "#f59e0b" },
    { name: "Severe", value: 7, color: "#ef4444" },
  ]

  const recentCases = dummyData.refugeeRequests.slice(0, 5)

  const quickActions = [
    {
      title: "View All Cases",
      description: "Manage and track all refugee health requests",
      icon: Users,
      href: "/case-tracker",
      color: "bg-blue-500",
    },
    {
      title: "Service Map",
      description: "View and manage healthcare service locations",
      icon: MapPin,
      href: "/map",
      color: "bg-green-500",
    },
    {
      title: "Add New Service",
      description: "Register a new healthcare facility or service",
      icon: Stethoscope,
      href: "/services/new",
      color: "bg-purple-500",
    },
    {
      title: "Resource Hub",
      description: "Manage medical supplies and resources",
      icon: Heart,
      href: "/resources",
      color: "bg-orange-500",
    },
  ]

  return (
    <AuthGuard requiredRole="ngo">
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
        <Navigation userRole="ngo" />
        <div className="md:ml-64 p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-3xl font-bold text-foreground mb-2">NGO Dashboard</h1>
              <p className="text-muted-foreground">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </motion.div>
          </div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Cases</p>
                      <p className="text-2xl font-bold">{stats.totalCases}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+{stats.weeklyGrowth}% this week</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Cases</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.activeCases}</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="mt-2">
                    <Progress value={(stats.activeCases / stats.totalCases) * 100} className="h-1" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Resolved</p>
                      <p className="text-2xl font-bold text-green-600">{stats.resolvedCases}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="mt-2">
                    <Progress value={(stats.resolvedCases / stats.totalCases) * 100} className="h-1" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Urgent</p>
                      <p className="text-2xl font-bold text-red-600">{stats.urgentCases}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="mt-2">
                    <span className="text-xs text-red-500">Requires immediate attention</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Access your most-used management tools</CardDescription>
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

              {/* Analytics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Case Analytics
                        </CardTitle>
                        <CardDescription>Weekly case trends and resolution rates</CardDescription>
                      </div>
                      <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="quarter">This Quarter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="cases" fill="#3b82f6" name="New Cases" />
                          <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Cases */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Recent Cases
                    </CardTitle>
                    <CardDescription>Latest refugee health requests requiring attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentCases.map((case_item) => (
                        <div key={case_item.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <div
                            className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                              case_item.severity === "severe"
                                ? "bg-red-500"
                                : case_item.severity === "moderate"
                                  ? "bg-orange-500"
                                  : "bg-green-500"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{case_item.name}</h4>
                              <Badge
                                variant={
                                  case_item.severity === "severe"
                                    ? "destructive"
                                    : case_item.severity === "moderate"
                                      ? "default"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {case_item.severity}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {case_item.language}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Symptoms: {case_item.symptoms.join(", ")}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {case_item.location.address}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(case_item.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="bg-transparent">
                            Assign
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full bg-transparent">
                        View All Cases
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Case Severity Distribution */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Case Severity</CardTitle>
                    <CardDescription>Distribution of case urgency levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={severityData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {severityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-4">
                      {severityData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
                            <span>{item.name}</span>
                          </div>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Today's Schedule */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Today's Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="font-medium text-sm">Team Meeting</div>
                        <div className="text-xs text-muted-foreground">Case review and planning</div>
                        <div className="text-xs text-primary font-medium mt-1">9:00 AM - 10:00 AM</div>
                      </div>
                      <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
                        <div className="font-medium text-sm">Field Visit</div>
                        <div className="text-xs text-muted-foreground">Shatila Camp inspection</div>
                        <div className="text-xs text-orange-600 font-medium mt-1">2:00 PM - 4:00 PM</div>
                      </div>
                      <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                        <div className="font-medium text-sm">Resource Coordination</div>
                        <div className="text-xs text-muted-foreground">Medical supply distribution</div>
                        <div className="text-xs text-green-600 font-medium mt-1">5:00 PM - 6:00 PM</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Resource Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Status</CardTitle>
                    <CardDescription>Current medical supply levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>First Aid Kits</span>
                          <span>75/100</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Medications</span>
                          <span>45/80</span>
                        </div>
                        <Progress value={56} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Medical Equipment</span>
                          <span>12/20</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                      Request Supplies
                    </Button>
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
