/**
 * API Route - Player Data
 * Server-side fetch to avoid CORS issues
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
  
  if (!tag) {
    return NextResponse.json({ error: 'Tag is required' }, { status: 400 });
  }

  try {
    // Fetch player data
    const playerResponse = await fetch(`${API_BASE_URL}/players/${encodeTag(tag)}`, {
      headers: {
        'Authorization': `Bearer ${BRAWL_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    if (!playerResponse.ok) {
      const error = await playerResponse.json();
      return NextResponse.json(
        { error: error.message || 'Failed to fetch player' },
        { status: playerResponse.status }
      );
    }

    const player = await playerResponse.json();

    // Fetch battle log
    const battleLogResponse = await fetch(`${API_BASE_URL}/players/${encodeTag(tag)}/battlelog`, {
      headers: {
        'Authorization': `Bearer ${BRAWL_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    const battleLog = battleLogResponse.ok ? await battleLogResponse.json() : { items: [] };

    return NextResponse.json({
      player,
      battleLog,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
