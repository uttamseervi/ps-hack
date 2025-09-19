import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { RefugeeProfile } from '@/lib/models/RefugeeProfile';
import { NGOProfile } from '@/lib/models/NGOProfile';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Get user profile based on role
    let profile = null;
    if (user.role === 'refugee') {
      profile = await RefugeeProfile.findOne({ userId: user._id });
    } else if (user.role === 'ngo') {
      profile = await NGOProfile.findOne({ userId: user._id });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role,
        uniqueId: user.uniqueId 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        uniqueId: user.uniqueId,
        country: user.country,
        profile: profile ? {
          name: user.role === 'refugee' 
            ? `${profile.firstName} ${profile.lastName}`
            : profile.organizationName
        } : null
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
