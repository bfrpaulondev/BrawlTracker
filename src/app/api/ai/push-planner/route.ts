import { NextRequest, NextResponse } from 'next/server';
import { pushPlanner, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { playerData, targetTrophies } = await request.json();
    if (!playerData) {
      return NextResponse.json({ error: 'Dados do jogador são obrigatórios' }, { status: 400 });
    }
    const context = `Dados do jogador: ${playerData}. Meta de troféus: ${targetTrophies || 50}. Formato JSON: { targetTrophies, sessions: [{ brawler, mode, map, duration, reason, estimatedTrophies }], totalEstimatedTrophies, tiltWarning, tiltAdvice, generalTips: [], schedule: [{ time, brawler, mode, reason }] }`;
    const result = await pushPlanner(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro no planejamento de push', details: e.message }, { status: 500 });
  }
}
