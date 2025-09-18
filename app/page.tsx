"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, MapPin, Shield, Users, Stethoscope, Globe, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">HealthBridge</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge variant="secondary" className="mb-4">
              AI-Powered Healthcare Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Healthcare Access for Everyone, Everywhere
            </h1>
            <p className="text-xl text-muted-foreground text-balance mb-8 leading-relaxed">
              Connecting refugees with essential healthcare services through AI-powered assistance, multilingual
              support, and real-time medical guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/auth/signup?role=refugee">Get Healthcare Support</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Link href="/auth/signup?role=ngo">Join as Healthcare Provider</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Healthcare Solutions</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Bridging language barriers and distance to provide immediate healthcare access and support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <MessageCircle className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Multilingual AI Chatbot</CardTitle>
                  <CardDescription>
                    Get instant medical guidance in your native language with AI-powered health assistance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Support for Arabic, French, English</li>
                    <li>• 24/7 availability</li>
                    <li>• Voice and text input</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Stethoscope className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Smart Symptom Checker</CardTitle>
                  <CardDescription>
                    Advanced triage system to assess symptoms and provide appropriate care recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Intelligent symptom analysis</li>
                    <li>• Risk level assessment</li>
                    <li>• Emergency detection</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <MapPin className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Healthcare Locator</CardTitle>
                  <CardDescription>
                    Find nearby clinics, pharmacies, and medical services with real-time availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Interactive map interface</li>
                    <li>• Distance and directions</li>
                    <li>• Service availability</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <AlertTriangle className="w-10 h-10 text-destructive mb-2" />
                  <CardTitle>Emergency Alerts</CardTitle>
                  <CardDescription>
                    Immediate emergency detection and rapid response coordination with local services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Automatic emergency detection</li>
                    <li>• Direct emergency contacts</li>
                    <li>• Location sharing</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Globe className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Health Education Hub</CardTitle>
                  <CardDescription>
                    Access vital health information, prevention tips, and educational resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Multilingual resources</li>
                    <li>• Prevention guidelines</li>
                    <li>• First aid instructions</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Users className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>NGO Coordination</CardTitle>
                  <CardDescription>
                    Healthcare providers can manage cases, track patients, and coordinate resources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Case management dashboard</li>
                    <li>• Resource allocation</li>
                    <li>• Real-time coordination</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Healthcare is a Human Right</h2>
            <p className="text-xl text-muted-foreground text-balance mb-8 leading-relaxed">
              Join thousands of refugees and healthcare providers using HealthBridge to ensure no one is left without
              access to essential medical care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/auth/signup">Start Your Journey</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Link href="#about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">HealthBridge</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Connecting refugees with healthcare services through AI-powered assistance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Refugees</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/chatbot" className="hover:text-foreground transition-colors">
                    AI Health Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/symptom-checker" className="hover:text-foreground transition-colors">
                    Symptom Checker
                  </Link>
                </li>
                <li>
                  <Link href="/map" className="hover:text-foreground transition-colors">
                    Find Services
                  </Link>
                </li>
                <li>
                  <Link href="/health-hub" className="hover:text-foreground transition-colors">
                    Health Education
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Providers</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/dashboard/ngo" className="hover:text-foreground transition-colors">
                    NGO Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/case-tracker" className="hover:text-foreground transition-colors">
                    Case Management
                  </Link>
                </li>
                <li>
                  <Link href="/map" className="hover:text-foreground transition-colors">
                    Service Map
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 HealthBridge. Built with compassion for global health equity.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
