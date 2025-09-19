import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, reportId, patientName, reportUrl } = await request.json();

    if (!phoneNumber || !reportId || !patientName || !reportUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Twilio is configured
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      return NextResponse.json(
        { error: 'Twilio not configured properly' },
        { status: 500 }
      );
    }

    // Check if we have a valid Account SID (starts with AC)
    if (!accountSid.startsWith('AC')) {
      // Demo mode - simulate SMS sending
      console.log('Demo Mode: SMS would be sent to +919731957518');
      console.log('Message:', `🏥 HealthBridge Alert\n\nPatient: ${patientName}\nReport ID: ${reportId}\n\nView full medical report: ${reportUrl}\n\nThis is an urgent medical case requiring immediate attention.`);
      
      return NextResponse.json({
        success: true,
        messageSid: 'demo_message_' + Date.now(),
        status: 'queued',
        message: 'SMS sent successfully to doctor (Demo Mode)'
      });
    }

    // Initialize Twilio client for real SMS
    const client = twilio(accountSid, authToken);
    
    // Create the SMS message (shortened for trial account)
    const message = `Hi! Medical report ${reportId} for ${patientName}: ${reportUrl}`;

    // Send SMS to both numbers
    const phoneNumbers = ['+919353926018', '+919731957518'];
    const results = [];

    for (const phoneNumber of phoneNumbers) {
      try {
        const messageResponse = await client.messages.create({
          body: message,
          from: fromNumber,
          to: phoneNumber,
        });

        console.log(`SMS Details for ${phoneNumber}:`, {
          messageSid: messageResponse.sid,
          status: messageResponse.status,
          to: phoneNumber,
          from: fromNumber,
          errorCode: messageResponse.errorCode,
          errorMessage: messageResponse.errorMessage
        });

        results.push({
          phoneNumber,
          messageSid: messageResponse.sid,
          status: messageResponse.status,
          success: true,
          errorCode: messageResponse.errorCode,
          errorMessage: messageResponse.errorMessage
        });
      } catch (error) {
        console.error(`SMS Error for ${phoneNumber}:`, error);
        results.push({
          phoneNumber,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    return NextResponse.json({
      success: successCount > 0,
      message: `SMS sent to ${successCount}/${totalCount} numbers`,
      results: results,
      details: {
        from: fromNumber,
        totalSent: successCount,
        totalAttempted: totalCount
      }
    });

  } catch (error) {
    console.error('Twilio SMS Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send SMS',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}