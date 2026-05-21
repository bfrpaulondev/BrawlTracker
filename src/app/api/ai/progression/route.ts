import { NextRequest, NextResponse } from 'next/server';
import { progressionPlan, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { playerData, accountType } = await request.json();
    const context = `Dados do jogador: ${playerData || 'Conta nova, começando do zero'}. Tipo de conta: ${accountType || 'Nova'}. Crie um plano de progressão de 30 dias detalhado para conta de Brawl Stars. Formato JSON: { accountType, weeks: [{ week, focus, goals: [] }], days: [{ day, week, focus, brawlers: [], modes: [], goals: [], resourceTip, estimatedTrophies }], milestones: [{ week, trophyTarget, brawlersUnlocked }], generalTips: [], resourceManagement: { gems: [], coins: [], tokens: [] } }`;
    const result = await progressionPlan(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro no plano de progressão', details: e.message }, { status: 500 });
  }
}
