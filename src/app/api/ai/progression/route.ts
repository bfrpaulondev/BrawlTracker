import { NextRequest, NextResponse } from 'next/server';
import { progressionPlan, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { playerData } = await request.json();
    const context = `Jogador: ${playerData || 'Conta nova, começando do zero'}. Crie plano de 30 dias detalhado. Formato JSON: { weeks: [{ week, focus, goals[] }], days: [{ day, week, focus, brawlers[], modes[], goals[], resourceTip, estimatedTrophies }], milestones: [{ week, trophyTarget, brawlersUnlocked }], generalTips[] }`;
    const result = await progressionPlan(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro no plano de progressão' }, { status: 500 });
  }
}
