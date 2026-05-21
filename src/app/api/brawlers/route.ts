import { NextResponse } from 'next/server';
import { getBrawlers } from '@/services/brawl-api';

export async function GET() {
  try {
    const data = await getBrawlers();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
