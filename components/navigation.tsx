"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Heart, Menu, LogOut, User, Home, MessageCircle, MapPin, BookOpen, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

interface NavigationProps {
  userRole: "refugee" | "ngo"
}

export function Navigation({ userRole }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("healthbridge_auth")
    localStorage.removeItem("healthbridge_role")
    router.push("/")
  }

  const refugeeNavItems = [
    { href: "/dashboard/refugee", label: "Dashboard", icon: Home },
    { href: "/chatbot", label: "AI Assistant", icon: MessageCircle },
    { href: "/symptom-checker", label: "Symptom Checker", icon: User },
    { href: "/map", label: "Find Services", icon: MapPin },
    { href: "/health-hub", label: "Health Education", icon: BookOpen },
  ]

  const ngoNavItems = [
    { href: "/dashboard/ngo", label: "Dashboard", icon: Home },
    { href: "/case-tracker", label: "Case Management", icon: BarChart3 },
    { href: "/map", label: "Service Map", icon: MapPin },
    { href: "/health-hub", label: "Resources", icon: BookOpen },
  ]

  const navItems = userRole === "refugee" ? refugeeNavItems : ngoNavItems

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-4 border-b">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Heart className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold">HealthBridge</span>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-card border-r">
        <NavContent />
      </div>
    </>
  )
}
