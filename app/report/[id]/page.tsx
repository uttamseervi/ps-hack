'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Phone, Mail, MapPin, User, Heart, Thermometer, Activity } from 'lucide-react';
import Image from 'next/image';
import dummyData from '@/lib/dummy-data.json';

interface ReportData {
  id: string;
  userName: string;
  contactNumber: string;
  email: string;
  age: number;
  gender: string;
  address: string;
  emergencyContact: string;
  history: Array<{
    title: string;
    description: string;
    woundImages: string[];
    scannedImages: string[];
    prescription: string;
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    oxygenSaturation: string;
    timestamp: string;
    doctor: string;
  }>;
}

export default function ReportPage({ params }: { params: { id: string } }) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data directly from dummy data instead of API
    const findReportData = () => {
      try {
        const report = dummyData.reports.find(r => r.id === params.id);
        setReportData(report || null);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setReportData(null);
      } finally {
        setLoading(false);
      }
    };

    findReportData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Report Not Found</h1>
          <p className="text-gray-600">The requested report could not be found.</p>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Report #{reportData.id}</h1>
          <p className="text-gray-600">Patient Medical History and Treatment Records</p>
        </div>

        {/* Patient Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Name</h3>
                <p className="text-gray-600">{reportData.userName}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Age</h3>
                <p className="text-gray-600">{reportData.age} years</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Gender</h3>
                <p className="text-gray-600">{reportData.gender}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Contact
                </h3>
                <p className="text-gray-600">{reportData.contactNumber}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </h3>
                <p className="text-gray-600">{reportData.email}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Address
                </h3>
                <p className="text-gray-600">{reportData.address}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Emergency Contact</h3>
                <p className="text-gray-600">{reportData.emergencyContact}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical History */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Medical History</h2>
          
          {reportData.history.map((entry, index) => (
            <Card key={index} className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{entry.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{formatDate(entry.timestamp)}</span>
                  </div>
                </div>
                <CardDescription>Attending Doctor: {entry.doctor}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{entry.description}</p>
                </div>

                {/* Vital Signs */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Vital Signs</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                      <Thermometer className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Temperature</p>
                        <p className="font-semibold text-blue-900">{entry.temperature}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                      <Heart className="h-4 w-4 text-red-600" />
                      <div>
                        <p className="text-sm text-gray-600">Blood Pressure</p>
                        <p className="font-semibold text-red-900">{entry.bloodPressure}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <Activity className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Heart Rate</p>
                        <p className="font-semibold text-green-900">{entry.heartRate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                      <div className="h-4 w-4 bg-purple-600 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-600">Oxygen Sat.</p>
                        <p className="font-semibold text-purple-900">{entry.oxygenSaturation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prescription */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Prescription</h3>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-gray-700">{entry.prescription}</p>
                  </div>
                </div>

                {/* Images */}
                {(entry.woundImages.length > 0 || entry.scannedImages.length > 0) && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Medical Images</h3>
                    <div className="space-y-4">
                      {entry.woundImages.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Wound Images</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {entry.woundImages.map((image, imgIndex) => (
                              <div key={imgIndex} className="relative aspect-square rounded-lg overflow-hidden border">
                                <Image
                                  src={image}
                                  alt={`Wound image ${imgIndex + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {entry.scannedImages.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Scanned Images</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {entry.scannedImages.map((image, imgIndex) => (
                              <div key={imgIndex} className="relative aspect-square rounded-lg overflow-hidden border">
                                <Image
                                  src={image}
                                  alt={`Scanned image ${imgIndex + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {index < reportData.history.length - 1 && <Separator className="my-6" />}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}