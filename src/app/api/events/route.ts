import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/services/brawl-api';

export async function GET() {
  try {
    const data = await getEvents();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
