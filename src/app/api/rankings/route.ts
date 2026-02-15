/**
 * API Route - Rankings
 * @author Bruno Paulon
 */

import { NextRequest, NextResponse } from 'next/server';
import { BRAWL_API_KEY } from '@/lib/config';

const API_BASE_URL = 'https://api.brawlstars.com/v1';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const region = searchParams.get('region') || 'global';
  const type = searchParams.get('type') || 'players';
  const brawlerId = searchParams.get('brawlerId');
  const limit = searchParams.get('limit') || '50';

  try {
    let endpoint = `${API_BASE_URL}/rankings/${region}/${type}`;
    if (brawlerId && type === 'brawlers') {
      endpoint = `${API_BASE_URL}/rankings/${region}/brawlers/${brawlerId}`;
    }
    endpoint += `?limit=${limit}`;

    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${BRAWL_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to fetch rankings' },
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
