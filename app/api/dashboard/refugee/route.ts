import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { RefugeeProfile } from '@/lib/models/RefugeeProfile';
import { MedicalReport, ReportEntry } from '@/lib/models/MedicalReport';
import { ChatSession, ChatMessage } from '@/lib/models/ChatSession';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Get user and profile
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'refugee') {
      return NextResponse.json({ error: 'User not found or invalid role' }, { status: 404 });
    }

    const profile = await RefugeeProfile.findOne({ userId: user._id });
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get medical reports
    const reports = await MedicalReport.find({ userId: user._id }).sort({ createdAt: -1 });
    const reportEntries = await ReportEntry.find({ 
      reportId: { $in: reports.map(r => r.reportId) } 
    }).sort({ createdAt: -1 });

    // Get chat sessions
    const chatSessions = await ChatSession.find({ userId: user._id }).sort({ createdAt: -1 });
    const recentChats = await ChatMessage.find({
      sessionId: { $in: chatSessions.map(s => s._id) }
    }).sort({ createdAt: -1 }).limit(5);

    // Calculate health score based on recent activity
    const daysSinceLastReport = reports.length > 0 
      ? Math.floor((Date.now() - new Date(reports[0].createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 30;
    
    const healthScore = Math.max(60, 100 - (daysSinceLastReport * 2));

    // Get recent activity
    const recentActivity = [];
    
    // Add recent chat activity
    recentChats.forEach(chat => {
      if (chat.role === 'user') {
        recentActivity.push({
          id: `chat_${chat._id}`,
          type: 'chat',
          title: 'Consulted AI Assistant',
          description: chat.content.substring(0, 50) + (chat.content.length > 50 ? '...' : ''),
          time: new Date(chat.createdAt).toLocaleString(),
          status: 'completed'
        });
      }
    });

    // Add recent medical reports
    reports.slice(0, 3).forEach(report => {
      recentActivity.push({
        id: `report_${report._id}`,
        type: 'report',
        title: 'Medical Report Created',
        description: `Report ID: ${report.reportId}`,
        time: new Date(report.createdAt).toLocaleString(),
        status: 'completed'
      });
    });

    // Get medication history from report entries
    const medicationHistory = reportEntries
      .filter(entry => entry.prescription)
      .map(entry => ({
        id: entry._id,
        medication: entry.prescription,
        doctor: entry.doctorName || 'Unknown Doctor',
        date: new Date(entry.createdAt).toLocaleDateString(),
        reportId: entry.reportId
      }))
      .slice(0, 10); // Last 10 medications

    // Get emergency contacts from profile
    const emergencyContacts = [
      { name: "Emergency Services", number: "112", type: "emergency" },
      { name: "UNHCR Health Hotline", number: "+961-1-123456", type: "health" },
      { name: "Mental Health Support", number: "+961-1-234567", type: "mental" },
    ];

    // Get next appointment (mock data for now)
    const nextAppointment = {
      clinic: "UNHCR Primary Health Clinic",
      type: "General Checkup",
      date: "Tomorrow at 10:00 AM",
      location: "Ras Beirut, Lebanon"
    };

    // Get daily health tip (mock data for now)
    const dailyHealthTip = {
      title: "Stay Hydrated",
      content: "Drink at least 8 glasses of clean water daily to maintain good health and prevent dehydration, especially in hot climates."
    };

    return NextResponse.json({
      success: true,
      data: {
        user: {
          name: `${profile.firstName} ${profile.lastName}`,
          uniqueId: user.uniqueId,
          country: user.country
        },
        healthScore,
        stats: {
          consultations: reports.length,
          daysActive: Math.min(30, Math.max(1, 30 - daysSinceLastReport)),
          articlesRead: Math.floor(Math.random() * 20) + 5 // Mock data
        },
        recentActivity: recentActivity.slice(0, 5),
        medicationHistory,
        emergencyContacts,
        nextAppointment,
        dailyHealthTip
      }
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
