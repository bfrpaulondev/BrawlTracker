import { NextRequest, NextResponse } from 'next/server';
import { metaInsights, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { playerData } = await request.json();
    const context = `Jogador: ${playerData || 'Não disponível'}. Gere 4-6 insights sobre o meta atual. Formato JSON: [{ title, description, relevance, actionable }]`;
    const result = await metaInsights(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro nos insights' }, { status: 500 });
  }
}
