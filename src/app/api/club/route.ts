/**
 * API Route - Club Info
 * @author Bruno Paulon
 */

import { NextRequest, NextResponse } from 'next/server';
import { BRAWL_API_KEY } from '@/lib/config';

const API_BASE_URL = 'https://api.brawlstars.com/v1';

function encodeTag(tag: string): string {
  let normalized = tag.trim().toUpperCase();
  if (!normalized.startsWith('#')) {
    normalized = '#' + normalized;
  }
  return encodeURIComponent(normalized);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tag = searchParams.get('tag');
  const members = searchParams.get('members') === 'true';

  if (!tag) {
    return NextResponse.json({ error: 'Tag is required' }, { status: 400 });
  }

  try {
    let endpoint = `${API_BASE_URL}/clubs/${encodeTag(tag)}`;
    if (members) {
      endpoint = `${API_BASE_URL}/clubs/${encodeTag(tag)}/members`;
    }

    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${BRAWL_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || 'Failed to fetch club' },
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
