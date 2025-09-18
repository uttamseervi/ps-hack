"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Phone, Clock, MapPin, Navigation, Star, Grid, List } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import dummyData from "@/lib/dummy-data.json"

export default function FindServicesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [serviceFilter, setServiceFilter] = useState("all")
    const [locationFilter, setLocationFilter] = useState("all")
    const [sortBy, setSortBy] = useState("distance")
    const [viewMode, setViewMode] = useState("grid")
    const [selectedService, setSelectedService] = useState<any>(null)

    const locations = ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"]
    const serviceTypes = ["clinic", "pharmacy", "hospital", "mental-health", "dental", "emergency"]

    const filteredServices = dummyData.healthServices.filter((service) => {
        const matchesSearch =
            service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesType = serviceFilter === "all" || service.type === serviceFilter
        const matchesLocation = locationFilter === "all" || service.location?.area === locationFilter
        return matchesSearch && matchesType && matchesLocation
    })

    const getServiceIcon = (type: string) => {
        switch (type) {
            case "clinic":
                return "🏥"
            case "pharmacy":
                return "💊"
            case "hospital":
                return "🏨"
            case "mental-health":
                return "🧠"
            case "dental":
                return "🦷"
            case "emergency":
                return "🚨"
            default:
                return "📍"
        }
    }

    const getServiceTypeLabel = (type: string) => {
        switch (type) {
            case "mental-health":
                return "Mental Health"
            default:
                return type.charAt(0).toUpperCase() + type.slice(1)
        }
    }

    const getRating = () => (Math.random() * 2 + 3).toFixed(1)
    const getWaitTime = () => Math.floor(Math.random() * 60) + 10

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border/40 bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard/refugee">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Link>
                            </Button>
                            <div className="flex items-center space-x-2">
                                <Search className="h-6 w-6 text-primary" />
                                <h1 className="text-2xl font-bold font-poppins">Find Health Services</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/map">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Map View
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6">
                {/* Search and Filters */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="relative lg:col-span-2">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search services, doctors, or conditions..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <Select value={serviceFilter} onValueChange={setServiceFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Service Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Services</SelectItem>
                                    {serviceTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {getServiceTypeLabel(type)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={locationFilter} onValueChange={setLocationFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Areas</SelectItem>
                                    {locations.map((location) => (
                                        <SelectItem key={location} value={location}>
                                            {location}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="distance">Distance</SelectItem>
                                    <SelectItem value="rating">Rating</SelectItem>
                                    <SelectItem value="wait-time">Wait Time</SelectItem>
                                    <SelectItem value="name">Name</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold font-poppins">{filteredServices.length} Services Found</h2>
                        <p className="text-muted-foreground">Showing health services near you</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Service Categories */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {serviceTypes.map((type) => (
                            <motion.div key={type} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Card
                                    className={`cursor-pointer transition-colors ${serviceFilter === type ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                                        }`}
                                    onClick={() => setServiceFilter(type)}
                                >
                                    <CardContent className="p-4 text-center">
                                        <div className="text-3xl mb-2">{getServiceIcon(type)}</div>
                                        <h4 className="font-medium text-sm">{getServiceTypeLabel(type)}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {dummyData.healthServices.filter((s) => s.type === type).length} available
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Services List */}
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                    {filteredServices.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Card
                                className={`h-full hover:shadow-lg transition-shadow cursor-pointer ${viewMode === "list" ? "flex" : ""
                                    }`}
                            >
                                <CardContent className={`p-6 ${viewMode === "list" ? "flex items-center space-x-6 flex-1" : ""}`}>
                                    <div className={viewMode === "list" ? "flex-1" : ""}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-2xl">{getServiceIcon(service.type)}</span>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{service.name}</h3>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <Badge variant="secondary">{getServiceTypeLabel(service.type)}</Badge>
                                                        <div className="flex items-center space-x-1">
                                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                            <span className="text-sm">{getRating()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                <MapPin className="h-4 w-4" />
                                                <span>{service.distance}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>
                                                    {service.hours} • Wait: ~{getWaitTime()} min
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="font-medium text-sm mb-2">Services Available</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {service.services.slice(0, 3).map((s, i) => (
                                                    <Badge key={i} variant="outline" className="text-xs">
                                                        {s}
                                                    </Badge>
                                                ))}
                                                {service.services.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{service.services.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`flex space-x-2 ${viewMode === "list" ? "flex-col space-x-0 space-y-2" : ""}`}>
                                        <Button size="sm" className="flex-1">
                                            <Phone className="h-4 w-4 mr-2" />
                                            Call
                                        </Button>
                                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                            <Navigation className="h-4 w-4 mr-2" />
                                            Directions
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1 bg-transparent"
                                            onClick={() => setSelectedService(service)}
                                        >
                                            Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Emergency Services Banner */}
                <Card className="mt-8 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="text-4xl">🚨</div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Emergency Services</h3>
                                <p className="text-red-700 dark:text-red-300 text-sm mb-3">
                                    For life-threatening emergencies, call 911 immediately or visit the nearest emergency room.
                                </p>
                                <div className="flex space-x-2">
                                    <Button size="sm" variant="destructive">
                                        <Phone className="h-4 w-4 mr-2" />
                                        Call 911
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Find ER
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Service Details Modal */}
            {selectedService && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <span className="text-3xl">{getServiceIcon(selectedService.type)}</span>
                                    <div>
                                        <h2 className="text-2xl font-bold font-poppins">{selectedService.name}</h2>
                                        <Badge variant="secondary">{getServiceTypeLabel(selectedService.type)}</Badge>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedService(null)}>
                                    ×
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">Contact Information</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span>(555) 123-4567</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <span>{selectedService.distance}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span>{selectedService.hours}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Languages Spoken</h3>
                                        <div className="flex flex-wrap gap-1">
                                            {["English", "Spanish", "Arabic", "French"].map((lang) => (
                                                <Badge key={lang} variant="outline" className="text-xs">
                                                    {lang}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">Services Available</h3>
                                        <div className="space-y-1">
                                            {selectedService.services.map((service: string, i: number) => (
                                                <div key={i} className="flex items-center space-x-2 text-sm">
                                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                    <span>{service}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Insurance Accepted</h3>
                                        <div className="flex flex-wrap gap-1">
                                            {["Medicaid", "Medicare", "Private Insurance", "Uninsured Welcome"].map((insurance) => (
                                                <Badge key={insurance} variant="outline" className="text-xs">
                                                    {insurance}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-2 mt-6 pt-4 border-t">
                                <Button className="flex-1">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Call Now
                                </Button>
                                <Button variant="outline" className="flex-1 bg-transparent">
                                    <Navigation className="h-4 w-4 mr-2" />
                                    Get Directions
                                </Button>
                                <Button variant="outline" className="flex-1 bg-transparent">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Book Appointment
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
