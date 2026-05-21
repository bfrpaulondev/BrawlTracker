import { NextRequest, NextResponse } from 'next/server';
import { getPlayer, getBattleLog } from '@/services/brawl-api';

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag');
  if (!tag) return NextResponse.json({ error: 'Tag é obrigatória' }, { status: 400 });
  try {
    const [player, battleLog] = await Promise.all([getPlayer(tag), getBattleLog(tag)]);
    return NextResponse.json({ player, battleLog: battleLog.items || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
