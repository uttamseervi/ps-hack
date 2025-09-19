import { NextResponse } from 'next/server';
import { getCountriesList } from '@/lib/utils/countryUtils';

export async function GET() {
  try {
    const countries = getCountriesList();
    
    return NextResponse.json({
      success: true,
      countries
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
