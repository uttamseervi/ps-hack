import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { MedicalReport, ReportEntry } from '@/lib/models/MedicalReport';

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

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'refugee') {
      return NextResponse.json({ error: 'User not found or invalid role' }, { status: 404 });
    }

    // Get medical reports
    const reports = await MedicalReport.find({ userId: user._id }).sort({ createdAt: -1 });
    const reportEntries = await ReportEntry.find({ 
      reportId: { $in: reports.map(r => r.reportId) } 
    }).sort({ createdAt: -1 });

    // Get medication history
    const medicationHistory = reportEntries
      .filter(entry => entry.prescription)
      .map(entry => {
        const report = reports.find(r => r.reportId === entry.reportId);
        return {
          id: entry._id,
          medication: entry.prescription,
          doctor: entry.doctorName || report?.doctorName || 'Unknown Doctor',
          date: new Date(entry.createdAt).toLocaleDateString(),
          reportId: entry.reportId,
          reportTitle: entry.title,
          description: entry.description,
          vitalSigns: entry.vitalSigns
        };
      });

    // Get current medications (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const currentMedications = medicationHistory.filter(med => 
      new Date(med.date) >= thirtyDaysAgo
    );

    // Get medication summary
    const medicationSummary = {
      totalMedications: medicationHistory.length,
      currentMedications: currentMedications.length,
      lastMedication: medicationHistory[0] || null,
      mostRecentDoctor: medicationHistory[0]?.doctor || null
    };

    return NextResponse.json({
      success: true,
      data: {
        medicationHistory,
        currentMedications,
        summary: medicationSummary
      }
    });

  } catch (error) {
    console.error('Medication history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
