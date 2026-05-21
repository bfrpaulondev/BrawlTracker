import { NextRequest, NextResponse } from 'next/server';
import { counterPick, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { enemies, mode } = await request.json();
    if (!enemies) {
      return NextResponse.json({ error: 'Brawlers inimigos são obrigatórios' }, { status: 400 });
    }
    const context = `Brawlers inimigos: ${enemies}. Modo de jogo: ${mode || 'Geral'}. Para cada brawler inimigo, indique os melhores counters. Formato JSON: { enemies: [{ brawler, counters: [{ name, effectiveness, reason, tips }] }], bestOverallPicks: [{ brawler, reason, countersHowMany }], teamComposition: { recommendation, reason }, strategyTips: [] }`;
    const result = await counterPick(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro ao gerar counters', details: e.message }, { status: 500 });
  }
}
