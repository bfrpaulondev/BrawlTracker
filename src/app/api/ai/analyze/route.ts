import { NextRequest, NextResponse } from 'next/server';
import { analyzePlayer, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { playerData, battleLogData } = await request.json();
    const context = `Dados do jogador: ${playerData || 'Não disponível'}. Histórico: ${battleLogData || 'Não disponível'}. Formato JSON: { summary, strengths[], weaknesses[], recommendations: [{ type, priority, title, description, actionable, estimatedImpact }], dailyPlan: [{ brawler, mode, map, reason, estimatedTrophies, priority }], metaInsights[], trueSkillEstimate: { rating, level, percentile, trend } }`;
    const result = await analyzePlayer(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro na análise' }, { status: 500 });
  }
}
