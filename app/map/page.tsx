"use client";
import { useState, useEffect, useRef } from "react";
import {
    GoogleMap,
    Marker,
    useJsApiLoader,
} from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Phone, Clock, MapPin, Navigation, Star, Grid, List, Menu } from "lucide-react";

type HealthService = {
    id: number;
    name: string;
    lat: number;
    lng: number;
    type: string;
    services: string[];
    contact?: string;
    availability?: string;
    hours?: string;
    distance?: string;
    rating?: number;
    waitTime?: number;
};

// Expanded dummy data with various health services
const healthServices: HealthService[] = [
    // NGOs
    {
        id: 1,
        name: "Red Cross Clinic",
        lat: 12.975,
        lng: 77.605,
        type: "ngo",
        services: ["medical aid", "antibiotics", "emergency care"],
        contact: "+91-80-1234567",
        availability: "24/7",
        hours: "24 hours",
        distance: "0.8 km",
        rating: 4.5,
        waitTime: 15
    },
    {
        id: 2,
        name: "City Hospital NGO Wing",
        lat: 12.961,
        lng: 77.601,
        type: "ngo",
        services: ["surgery", "emergency", "trauma care"],
        contact: "+91-80-3456789",
        availability: "24/7 Emergency",
        hours: "24 hours",
        distance: "1.2 km",
        rating: 4.2,
        waitTime: 25
    },
    {
        id: 3,
        name: "Mission Health NGO",
        lat: 12.972,
        lng: 77.585,
        type: "ngo",
        services: ["ambulance", "trauma care", "counseling"],
        contact: "+91-80-5678901",
        availability: "24/7 Trauma",
        hours: "24 hours",
        distance: "1.5 km",
        rating: 4.7,
        waitTime: 20
    },

    // Hospitals
    {
        id: 4,
        name: "Apollo Hospital",
        lat: 12.965,
        lng: 77.610,
        type: "hospital",
        services: ["surgery", "cardiology", "oncology", "emergency"],
        contact: "+91-80-2345678",
        availability: "24/7",
        hours: "24 hours",
        distance: "2.1 km",
        rating: 4.8,
        waitTime: 45
    },
    {
        id: 5,
        name: "Fortis Healthcare",
        lat: 12.980,
        lng: 77.590,
        type: "hospital",
        services: ["neurology", "orthopedics", "pediatrics"],
        contact: "+91-80-3456789",
        availability: "24/7",
        hours: "24 hours",
        distance: "1.8 km",
        rating: 4.6,
        waitTime: 30
    },

    // Clinics
    {
        id: 6,
        name: "Community Health Clinic",
        lat: 12.968,
        lng: 77.595,
        type: "clinic",
        services: ["general medicine", "vaccinations", "health checkups"],
        contact: "+91-80-4567890",
        availability: "Mon-Sat 9AM-6PM",
        hours: "9 AM - 6 PM",
        distance: "0.9 km",
        rating: 4.3,
        waitTime: 20
    },
    {
        id: 7,
        name: "Family Care Center",
        lat: 12.978,
        lng: 77.600,
        type: "clinic",
        services: ["family medicine", "women's health", "pediatrics"],
        contact: "+91-80-5678901",
        availability: "Mon-Fri 8AM-8PM",
        hours: "8 AM - 8 PM",
        distance: "1.3 km",
        rating: 4.4,
        waitTime: 15
    },

    // Dental
    {
        id: 8,
        name: "Smile Dental Care",
        lat: 12.970,
        lng: 77.608,
        type: "dental",
        services: ["teeth cleaning", "fillings", "root canal", "orthodontics"],
        contact: "+91-80-6789012",
        availability: "Mon-Sat 9AM-7PM",
        hours: "9 AM - 7 PM",
        distance: "1.1 km",
        rating: 4.5,
        waitTime: 25
    },
    {
        id: 9,
        name: "Perfect Teeth Clinic",
        lat: 12.963,
        lng: 77.588,
        type: "dental",
        services: ["dental surgery", "implants", "cosmetic dentistry"],
        contact: "+91-80-7890123",
        availability: "Tue-Sun 10AM-6PM",
        hours: "10 AM - 6 PM",
        distance: "1.6 km",
        rating: 4.7,
        waitTime: 35
    },

    // Pharmacy
    {
        id: 10,
        name: "HealthPlus Pharmacy",
        lat: 12.976,
        lng: 77.592,
        type: "pharmacy",
        services: ["prescription drugs", "over-the-counter", "medical supplies"],
        contact: "+91-80-8901234",
        availability: "24/7",
        hours: "24 hours",
        distance: "0.7 km",
        rating: 4.2,
        waitTime: 5
    },
    {
        id: 11,
        name: "MedLife Pharmacy",
        lat: 12.967,
        lng: 77.603,
        type: "pharmacy",
        services: ["medicines", "health products", "consultation"],
        contact: "+91-80-9012345",
        availability: "Mon-Sun 7AM-11PM",
        hours: "7 AM - 11 PM",
        distance: "1.0 km",
        rating: 4.0,
        waitTime: 8
    },

    // Mental Health
    {
        id: 12,
        name: "Mind Wellness Center",
        lat: 12.973,
        lng: 77.598,
        type: "mental-health",
        services: ["counseling", "therapy", "psychiatric care", "group sessions"],
        contact: "+91-80-0123456",
        availability: "Mon-Sat 9AM-6PM",
        hours: "9 AM - 6 PM",
        distance: "1.2 km",
        rating: 4.6,
        waitTime: 40
    }
];

const containerStyle = { width: "100%", height: "100%" };
const center: google.maps.LatLngLiteral = { lat: 12.9716, lng: 77.5946 };

export default function IntegratedHealthMap() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY",
    });

    // Map states
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [selectedService, setSelectedService] = useState<HealthService | null>(null);
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
    const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

    // UI states
    const [viewMode, setViewMode] = useState<"list" | "map">("list");
    const [searchQuery, setSearchQuery] = useState("");
    const [serviceFilter, setServiceFilter] = useState("all");
    const [sortBy, setSortBy] = useState("distance");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showServiceDetail, setShowServiceDetail] = useState<HealthService | null>(null);

    const mapRef = useRef<google.maps.Map | null>(null);

    const serviceTypes = [
        { value: "ngo", label: "NGO", icon: "🏥" },
        { value: "hospital", label: "Hospital", icon: "🏨" },
        { value: "clinic", label: "Clinic", icon: "🩺" },
        { value: "dental", label: "Dental", icon: "🦷" },
        { value: "pharmacy", label: "Pharmacy", icon: "💊" },
        { value: "mental-health", label: "Mental Health", icon: "🧠" }
    ];

    // Detect user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                () => console.log("Location access denied"),
                { enableHighAccuracy: true }
            );
        }
    }, []);

    const detectMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                },
                () => alert("Location access denied. Please enable location services."),
                { enableHighAccuracy: true }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const showDirections = (service: HealthService) => {
        if (!mapRef.current) return;
        if (!userLocation) {
            alert("Please enable location first using 'Find My Location'");
            return;
        }

        setSelectedService(service);
        setViewMode("map");

        if (directionsRenderer) {
            directionsRenderer.setMap(null);
        }

        const directionsService = new google.maps.DirectionsService();
        const newRenderer = new google.maps.DirectionsRenderer({
            polylineOptions: {
                strokeColor: "#3B82F6",
                strokeWeight: 4,
                strokeOpacity: 0.8
            },
            suppressMarkers: false
        });

        newRenderer.setMap(mapRef.current);

        directionsService.route(
            {
                origin: userLocation,
                destination: { lat: service.lat, lng: service.lng },
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === "OK" && result) {
                    newRenderer.setDirections(result);
                    setDirectionsRenderer(newRenderer);

                    const leg = result.routes[0].legs[0];
                    setRouteInfo({
                        distance: leg.distance?.text || "N/A",
                        duration: leg.duration?.text || "N/A"
                    });
                } else {
                    console.error("Directions request failed:", status);
                    alert("Could not calculate directions.");
                }
            }
        );
    };

    const clearDirections = () => {
        if (directionsRenderer) {
            directionsRenderer.setMap(null);
            setDirectionsRenderer(null);
        }
        setSelectedService(null);
        setRouteInfo(null);
    };

    const filteredServices = healthServices.filter((service) => {
        const matchesSearch =
            service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = serviceFilter === "all" || service.type === serviceFilter;
        return matchesSearch && matchesType;
    });

    const getServiceIcon = (type: string) => {
        const serviceType = serviceTypes.find(st => st.value === type);
        return serviceType?.icon || "📍";
    };

    const getServiceTypeLabel = (type: string) => {
        const serviceType = serviceTypes.find(st => st.value === type);
        return serviceType?.label || type.charAt(0).toUpperCase() + type.slice(1);
    };

    const onLoad = (map: google.maps.Map) => {
        mapRef.current = map;
    };

    const onUnmount = () => {
        mapRef.current = null;
    };

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading Health Services Map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen ">
            {/* Header */}
            <div className="bg-white shadow-lg  ">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden"
                            >
                                <Menu className="h-2 w-4" />
                            </Button>
                            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                                Refugee Health Services Map
                            </h1>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
                                variant="outline"
                            >
                                {viewMode === "list" ? (
                                    <>
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Map View
                                    </>
                                ) : (
                                    <>
                                        <List className="h-4 w-4 mr-2" />
                                        List View
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={detectMyLocation}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                📍 Find My Location
                            </Button>
                            {selectedService && (
                                <Button
                                    onClick={clearDirections}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Clear Route
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex h-screen">
                {/* Sidebar */}
                <div className={`${sidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 bg-white shadow-xl overflow-hidden`}>
                    <div className="h-full overflow-y-auto">
                        {/* Search and Filters */}
                        <div className="p-6 border-b">
                            <div className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search services..."
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
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.icon} {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Service Categories */}
                        <div className="p-6 border-b">
                            <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {serviceTypes.map((type) => {
                                    const count = healthServices.filter(s => s.type === type.value).length;
                                    return (
                                        <Card
                                            key={type.value}
                                            className={`cursor-pointer transition-colors ${serviceFilter === type.value ? "bg-blue-50 border-blue-500" : "hover:bg-gray-50"
                                                }`}
                                            onClick={() => setServiceFilter(type.value)}
                                        >
                                            <CardContent className="p-3 text-center">
                                                <div className="text-2xl mb-1">{type.icon}</div>
                                                <h4 className="font-medium text-sm">{type.label}</h4>
                                                <p className="text-xs text-gray-500">{count} available</p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Services List */}
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {filteredServices.length} Services Found
                            </h3>
                            <div className="space-y-3">
                                {filteredServices.map((service) => (
                                    <Card
                                        key={service.id}
                                        className={`cursor-pointer transition-colors ${selectedService?.id === service.id
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        onClick={() => showDirections(service)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-2xl">{getServiceIcon(service.type)}</span>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{service.name}</h4>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {getServiceTypeLabel(service.type)}
                                                            </Badge>
                                                            {service.rating && (
                                                                <div className="flex items-center space-x-1">
                                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                                    <span className="text-xs">{service.rating}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1 mb-3">
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{service.distance}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{service.hours} • Wait: ~{service.waitTime} min</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {service.services.slice(0, 2).map((s, i) => (
                                                    <Badge key={i} variant="outline" className="text-xs">
                                                        {s}
                                                    </Badge>
                                                ))}
                                                {service.services.length > 2 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{service.services.length - 2} more
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex space-x-2">
                                                <Button size="sm" className="flex-1 text-xs">
                                                    <Phone className="h-3 w-3 mr-1" />
                                                    Call
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 text-xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowServiceDetail(service);
                                                    }}
                                                >
                                                    Details
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Active Route Info */}
                        {selectedService && routeInfo && (
                            <div className="p-6 bg-yellow-50 border-t border-yellow-300">
                                <h3 className="text-md font-semibold text-gray-900 mb-2">
                                    🚑 Route to {selectedService.name}
                                </h3>
                                <p className="text-sm text-gray-700">
                                    Distance: <span className="font-semibold">{routeInfo.distance}</span>
                                </p>
                                <p className="text-sm text-gray-700">
                                    Estimated Time: <span className="font-semibold">{routeInfo.duration}</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Toggle Sidebar Button */}
                {!sidebarOpen && (
                    <Button
                        onClick={() => setSidebarOpen(true)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        size="sm"
                    >
                        <Menu className="h-4 w-4" />
                    </Button>
                )}

                {/* Main Content */}
                <div className="flex-1 relative">
                    {viewMode === "map" ? (
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={13}
                            onLoad={onLoad}
                            onUnmount={onUnmount}
                            options={{
                                streetViewControl: false,
                                mapTypeControl: false,
                                styles: [
                                    {
                                        featureType: "poi",
                                        elementType: "labels",
                                        stylers: [{ visibility: "off" }]
                                    }
                                ]
                            }}
                        >
                            {/* Service Markers */}
                            {filteredServices.map((service) => (
                                <Marker
                                    key={service.id}
                                    position={{ lat: service.lat, lng: service.lng }}
                                    label={getServiceIcon(service.type)}
                                    onClick={() => showDirections(service)}
                                />
                            ))}

                            {/* User Location */}
                            {userLocation && (
                                <Marker position={userLocation} label="📍" />
                            )}
                        </GoogleMap>
                    ) : (
                        <div className="p-8 bg-white min-h-full">
                            <div className="max-w-4xl mx-auto">
                                {/* Services Grid View */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredServices.map((service) => (
                                        <Card key={service.id} className="h-full hover:shadow-lg transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-3xl">{getServiceIcon(service.type)}</span>
                                                        <div>
                                                            <h3 className="font-semibold text-lg">{service.name}</h3>
                                                            <div className="flex items-center space-x-2 mt-1">
                                                                <Badge variant="secondary">{getServiceTypeLabel(service.type)}</Badge>
                                                                {service.rating && (
                                                                    <div className="flex items-center space-x-1">
                                                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                                        <span className="text-sm">{service.rating}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{service.distance}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{service.hours} • Wait: ~{service.waitTime} min</span>
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

                                                <div className="flex space-x-2">
                                                    <Button size="sm" className="flex-1">
                                                        <Phone className="h-4 w-4 mr-2" />
                                                        Call
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="flex-1"
                                                        onClick={() => showDirections(service)}
                                                    >
                                                        <Navigation className="h-4 w-4 mr-2" />
                                                        Directions
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Emergency Banner */}
                                <Card className="mt-8 bg-red-50 border-red-200">
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-4xl">🚨</div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-red-800 mb-2">Emergency Services</h3>
                                                <p className="text-red-700 text-sm mb-3">
                                                    For life-threatening emergencies, call emergency services immediately.
                                                </p>
                                                <div className="flex space-x-2">
                                                    <Button size="sm" variant="destructive">
                                                        <Phone className="h-4 w-4 mr-2" />
                                                        Call 108
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
                        </div>
                    )}
                </div>
            </div>

            {/* Service Details Modal */}
            {showServiceDetail && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <span className="text-3xl">{getServiceIcon(showServiceDetail.type)}</span>
                                    <div>
                                        <h2 className="text-2xl font-bold">{showServiceDetail.name}</h2>
                                        <Badge variant="secondary">{getServiceTypeLabel(showServiceDetail.type)}</Badge>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setShowServiceDetail(null)}>
                                    ×
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">Services Available</h3>
                                        <div className="space-y-1">
                                            {showServiceDetail.services.map((service: string, i: number) => (
                                                <div key={i} className="flex items-center space-x-2 text-sm">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    <span>{service}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold mb-2">Insurance Accepted</h3>
                                        <div className="flex flex-wrap gap-1">
                                            {["ESI", "CGHS", "Private Insurance", "Cash Payment"].map((insurance) => (
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
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        showDirections(showServiceDetail);
                                        setShowServiceDetail(null);
                                    }}
                                >
                                    <Navigation className="h-4 w-4 mr-2" />
                                    Get Directions
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Book Appointment
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}