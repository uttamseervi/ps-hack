import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';
import bcrypt from 'bcryptjs';

// This ensures the route is not statically generated
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const formData = await request.json();

        // Basic validation
        if (!formData.email || !formData.password || !formData.name) {
            return NextResponse.json(
                { error: 'Email, password, and name are required' },
                { status: 400 }
            );
        }
        console.log("the data", formData)
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

        // Check if user already exists
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

        // Start transaction by creating user first
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert([{
                email: formData.email,
                password_hash: hashedPassword,
                name: formData.name,
                role: 'refugee',
                languages: formData.languages || [],
                location: formData.location || {},
                profile_picture_url: formData.profilePictureUrl || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_active: true
            }])
            .select()
            .single();
        console.log("the userData is ", userData)
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

        // Create refugee profile
        const { data: refugeeData, error: refugeeError } = await supabase
            .from('refugees')
            .insert([{
                user_id: userData.id,
                date_of_birth: formData.dateOfBirth || null,
                gender: formData.gender || null,
                phone_number: formData.phoneNumber || null,
                emergency_contact: formData.emergencyContact || {},
                current_address: formData.currentAddress || null,
                identification_number: formData.identificationNumber || null,
                medical_conditions: formData.medicalConditions || [],
                blood_type: formData.bloodType || null,
                allergies: formData.allergies || [],
                disabilities: formData.disabilities || [],
                family_members: formData.familyMembers || [],
                registration_date: new Date().toISOString().split('T')[0], // Current date
                status: 'active'
            }])
            .select()
            .single();

        if (refugeeError) {
            console.error('Refugee profile creation error:', refugeeError);

            // Cleanup: Delete the user record if refugee profile creation failed
            await supabase
                .from('users')
                .delete()
                .eq('id', userData.id);

            return NextResponse.json(
                {
                    error: 'Failed to create refugee profile',
                    details: refugeeError.message
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
                name: userData.name,
                role: userData.role,
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