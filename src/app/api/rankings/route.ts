import { NextRequest, NextResponse } from 'next/server';
import { getRankings, getBrawlerRankings } from '@/services/brawl-api';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const region = searchParams.get('region') || 'global';
  const type = searchParams.get('type') || 'players';
  const brawlerId = searchParams.get('brawlerId');
  try {
    if (brawlerId) {
      const data = await getBrawlerRankings(region, parseInt(brawlerId));
      return NextResponse.json(data);
    }
    const data = await getRankings(region, type as 'players' | 'clubs');
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
