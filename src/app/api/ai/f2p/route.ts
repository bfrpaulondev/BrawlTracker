import { NextRequest, NextResponse } from 'next/server';
import { f2pGuide, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { playerData } = await request.json();
    const context = `Dados do jogador: ${playerData || 'Não disponível'}. Gere um guia completo F2P (Free-to-Play) para Brawl Stars, maximizando recursos gratuitos e progressão eficiente. Formato JSON: { summary, gemGuide: { prioritySpends: [], avoidSpends: [], monthlyEstimate }, coinGuide: { prioritySpends: [], savingStrategy }, starrDrops: { strategy, bestTimes }, brawlerPriority: [{ brawler, reason, investmentCost }], dailyRoutine: [{ action, timeEstimate, reward }], progressionTips: [], f2pMilestones: [{ milestone, estimatedTime, requirements }], resourceCalendar: { events: [{ event, rewards, frequency }] } }`;
    const result = await f2pGuide(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro ao gerar guia F2P', details: e.message }, { status: 500 });
  }
}
