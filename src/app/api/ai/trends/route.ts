import { NextRequest, NextResponse } from 'next/server';
import { trendAnalysis, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { playerData } = await request.json();
    const context = `Jogador: ${playerData || 'Conta nova'}. Analise tendências de conteúdo Brawl Stars 2026. Formato JSON: [{ trend, description, contentAngle, urgency, platforms[] }]`;
    const result = await trendAnalysis(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro nas tendências' }, { status: 500 });
  }
}
