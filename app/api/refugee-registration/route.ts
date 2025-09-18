import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Define types for the request body
type RegistrationData = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    countryOfOrigin: string;
    currentLocation: string;
    languages: string[];
    skills?: string[];
    bio?: string;
};

// This ensures the route is not statically generated
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const formData: RegistrationData = await request.json();

        // Basic validation
        if (!formData.email || !formData.password || !formData.firstName) {
            return NextResponse.json(
                { error: 'Email, password, and first name are required' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Password validation
        if (formData.password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        // Check if user already exists in auth.users (Supabase Auth)
        const { data: existingUser, error: userCheckError } = await supabase
            .from('users')
            .select('id')
            .eq('email', formData.email)
            .maybeSingle();

        if (userCheckError) {
            console.error('User check error:', userCheckError);
            throw userCheckError;
        }

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Hash the password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(formData.password, saltRounds);

        // Create user profile in a single table (simplified for now)
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert([{
                email: formData.email,
                password_hash: hashedPassword,
                first_name: formData.firstName,
                last_name: formData.lastName || '',
                phone: formData.phone || null,
                date_of_birth: formData.dateOfBirth || null,
                gender: formData.gender || 'prefer_not_to_say',
                country_of_origin: formData.countryOfOrigin,
                current_location: formData.currentLocation,
                languages: formData.languages || [],
                skills: formData.skills || [],
                bio: formData.bio || null,
                role: 'refugee',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_active: true
            }])
            .select()
            .single();

        if (userError) {
            console.error('User creation error:', userError);
            return NextResponse.json(
                {
                    error: 'Failed to create user',
                    details: userError.message
                },
                { status: 500 }
            );
        }

        // Return success response without sensitive data
        return NextResponse.json({
            success: true,
            message: 'Refugee registered successfully',
            user: {
                id: userData.id,
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name,
                role: 'refugee',
                created_at: userData.created_at
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}