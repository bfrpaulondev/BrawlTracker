import { NextRequest, NextResponse } from 'next/server';
import { pushPlanner, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { playerData, battleLogData, availableTime, targetTrophies } = await request.json();
    const context = `Jogador: ${playerData || 'Não disponível'}. Tempo: ${availableTime || 60} min. Meta: ${targetTrophies || 50} troféus. Formato JSON: { sessions: [{ brawler, mode, map, duration, reason, estimatedTrophies }], totalEstimatedTrophies, tiltWarning, tiltAdvice, generalTips[] }`;
    const result = await pushPlanner(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro no planejamento' }, { status: 500 });
  }
}
