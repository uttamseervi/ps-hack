import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { NGOProfile } from '@/lib/models/NGOProfile';
import { generateUniqueId } from '@/lib/utils/countryUtils';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      email,
      password,
      organizationName,
      country,
      ngoType,
      services,
      contact,
      availability
    } = body;

    // Validate required fields
    if (!email || !password || !organizationName || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Generate unique ID
    const userCount = await User.countDocuments({ country });
    const uniqueId = generateUniqueId(country, userCount + 1);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      role: 'ngo',
      uniqueId,
      country
    });

    await user.save();

    // Create NGO profile
    const ngoProfile = new NGOProfile({
      userId: user._id,
      organizationName,
      servicesOffered: services || [],
      specializations: [ngoType] || [],
      contactPersonPhone: contact,
      address: availability // Using availability as a simple address field for now
    });

    await ngoProfile.save();

    return NextResponse.json({
      success: true,
      message: 'NGO registered successfully',
      uniqueId,
      user: {
        id: user._id,
        email: user.email,
        uniqueId: user.uniqueId,
        role: user.role,
        country: user.country
      }
    }, { status: 201 });

  } catch (error) {
    console.error('NGO registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
