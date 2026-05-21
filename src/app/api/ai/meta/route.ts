import { NextRequest, NextResponse } from 'next/server';
import { metaInsights, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { playerData } = await request.json();
    const context = `Dados do jogador: ${playerData || 'Não disponível'}. Gere um relatório completo do meta atual de Brawl Stars. Formato JSON: { topBrawlers: [{ name, tier, mode, reason }], bestCompositions: [{ name, brawlers, mode, strategy }], priorityBans: [{ brawler, reason, mode }], trends: [{ trend, description, impact }], playerMetaAlignment: { summary, recommendations: [] } }`;
    const result = await metaInsights(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro ao gerar relatório de meta', details: e.message }, { status: 500 });
  }
}
