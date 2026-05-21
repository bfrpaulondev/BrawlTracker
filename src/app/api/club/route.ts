import { NextRequest, NextResponse } from 'next/server';
import { getClub } from '@/services/brawl-api';

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag');
  if (!tag) return NextResponse.json({ error: 'Tag do clube é obrigatória' }, { status: 400 });
  try {
    const data = await getClub(tag);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
