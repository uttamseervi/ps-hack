import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { RefugeeProfile } from '@/lib/models/RefugeeProfile';
import { generateUniqueId, validateGovernmentId, getCountryConfig } from '@/lib/utils/countryUtils';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      country,
      governmentId,
      phone,
      address,
      languages
    } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !country || !governmentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate government ID format
    if (!validateGovernmentId(country, governmentId)) {
      const config = getCountryConfig(country);
      return NextResponse.json(
        { error: `Invalid ${config?.idType || 'government ID'} format` },
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

    // Check if government ID already exists
    const existingProfile = await RefugeeProfile.findOne({ governmentId });
    if (existingProfile) {
      return NextResponse.json(
        { error: 'User already exists with this government ID' },
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
      role: 'refugee',
      uniqueId,
      country
    });

    await user.save();

    // Create refugee profile
    const refugeeProfile = new RefugeeProfile({
      userId: user._id,
      firstName,
      lastName,
      governmentId,
      governmentIdType: getCountryConfig(country)?.idType,
      phone,
      address,
      languages: languages || []
    });

    await refugeeProfile.save();

    return NextResponse.json({
      success: true,
      message: 'Refugee registered successfully',
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
    console.error('Refugee registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
