import { NextRequest, NextResponse } from 'next/server';
import { contentCreator, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { playerData, platform, topic } = await request.json();
    const context = `Jogador: ${playerData || 'Não disponível'}. Plataforma: ${platform || 'YouTube'}. Tópico: ${topic || 'Geral'}. Gere 5-8 ideias de conteúdo. Formato JSON: [{ title, platform, format, description, hooks[], estimatedViews, difficulty }]`;
    const result = await contentCreator(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro ao gerar conteúdo' }, { status: 500 });
  }
}
