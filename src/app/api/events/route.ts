/**
 * API Route - Events Rotation
 * @author Bruno Paulon
 */

import { NextResponse } from 'next/server';
import { BRAWL_API_KEY } from '@/lib/config';

const API_BASE_URL = 'https://api.brawlstars.com/v1';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/events/rotation`, {
      headers: {
        'Authorization': `Bearer ${BRAWL_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to fetch events' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
