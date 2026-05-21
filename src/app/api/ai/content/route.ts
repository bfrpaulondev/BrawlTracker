import { NextRequest, NextResponse } from 'next/server';
import { contentCreator, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, format } = await request.json();
    const context = `Tópico: ${topic || 'Brawl Stars geral'}. Plataforma: ${platform || 'YouTube'}. Formato: ${format || 'Vídeo'}. Gere ideias de conteúdo criativas para criador de Brawl Stars. Formato JSON: { ideas: [{ title, platform, format, description, hooks: [], estimatedViews, difficulty, trendingScore }], contentStrategy: { bestPostingTimes: [], frequencyTip, engagementTip } }`;
    const result = await contentCreator(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro ao gerar ideias de conteúdo', details: e.message }, { status: 500 });
  }
}
