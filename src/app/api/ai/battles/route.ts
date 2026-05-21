import { NextRequest, NextResponse } from 'next/server';
import { battleAnalysis, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { battles, playerTag } = await request.json();
    if (!battles) {
      return NextResponse.json({ error: 'Dados de batalhas são obrigatórios' }, { status: 400 });
    }
    const context = `Tag do jogador: ${playerTag || 'Não especificada'}\nBatalhas: ${battles}\n\nAnalise cada batalha detalhadamente. Formato JSON: { analyses: [{ battleIndex, result, mode, map, playedBrawler, whatWentRight: [], whatWentWrong: [], improvementTips: [], grade }] , overallTips: [], winRateObservation, brawlerRecommendations: [] }`;
    const result = await battleAnalysis(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro ao analisar batalhas', details: e.message }, { status: 500 });
  }
}
