"use client";
import { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";

type NGO = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  ngoType: string; // e.g. "Medical Aid", "Emergency Response"
  services: string[];
  contact?: string;
  availability?: string;
};

const ngos: NGO[] = [
  { 
    id: 1, 
    name: "Red Cross Clinic", 
    lat: 12.975, 
    lng: 77.605, 
    ngoType: "International NGO",
    services: ["medical aid", "antibiotics"], 
    contact: "+91-80-1234567",
    availability: "24/7"
  },
  { 
    id: 2, 
    name: "City Hospital NGO Wing", 
    lat: 12.961, 
    lng: 77.601, 
    ngoType: "Local NGO",
    services: ["surgery", "emergency"], 
    contact: "+91-80-3456789",
    availability: "24/7 Emergency"
  },
  { 
    id: 3, 
    name: "Mission Health NGO", 
    lat: 12.972, 
    lng: 77.585, 
    ngoType: "Faith-based NGO",
    services: ["ambulance", "trauma care"], 
    contact: "+91-80-5678901",
    availability: "24/7 Trauma"
  },
];

const containerStyle = { width: "100%", height: "100%" };
const center: google.maps.LatLngLiteral = { lat: 12.9716, lng: 77.5946 };

export default function MapView() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  
  const mapRef = useRef<google.maps.Map | null>(null);

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

  const showDirections = (ngo: NGO) => {
    if (!mapRef.current) return;
    if (!userLocation) {
      alert("Please enable location first using 'Find My Location'");
      return;
    }

    setSelectedNGO(ngo);

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
        destination: { lat: ngo.lat, lng: ngo.lng },
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
    setSelectedNGO(null);
    setRouteInfo(null);
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
          <p className="text-lg text-gray-600">Loading NGO Health Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            🌍 Refugee Health NGO Map
          </h1>
          <div className="flex gap-3">
            <button
              onClick={detectMyLocation}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              📍 Find My Location
            </button>
            <button
              onClick={clearDirections}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Clear Route
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-screen">
        {/* Sidebar */}
        <div className="lg:w-96 bg-white shadow-xl overflow-y-auto">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">🏥 Nearby NGOs</h3>
          </div>
          <div className="p-6 space-y-3">
            {ngos.map((ngo) => (
              <div
                key={ngo.id}
                onClick={() => showDirections(ngo)}
                className={`p-4 rounded-lg border cursor-pointer transition ${
                  selectedNGO?.id === ngo.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <h4 className="font-semibold text-gray-900">{ngo.name}</h4>
                <p className="text-sm text-gray-600">{ngo.ngoType}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {ngo.services.map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-2">{ngo.contact}</div>
                <div className="text-sm text-green-600">{ngo.availability}</div>
              </div>
            ))}
          </div>

          {/* Active Route Info */}
          {selectedNGO && routeInfo && (
            <div className="p-6 bg-yellow-50 border-t border-yellow-300">
              <h3 className="text-md font-semibold text-gray-900 mb-2">
                🚑 Route to {selectedNGO.name}
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

        {/* Map */}
        <div className="flex-1 relative">
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
            {/* NGO Markers */}
            {ngos.map((ngo) => (
              <Marker
                key={ngo.id}
                position={{ lat: ngo.lat, lng: ngo.lng }}
                label="🏥"
                onClick={() => showDirections(ngo)}
              />
            ))}

            {/* User Location */}
            {userLocation && (
              <Marker position={userLocation} label="📍" />
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
}
