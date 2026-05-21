import { NextRequest, NextResponse } from 'next/server';
import { titleGenerator, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { topic, platform } = await request.json();
    if (!topic) {
      return NextResponse.json({ error: 'Tópico é obrigatório' }, { status: 400 });
    }
    const context = `Tópico: ${topic}. Plataforma: ${platform || 'YouTube'}. Gere 10 títulos clicáveis e virais para conteúdo de Brawl Stars. Formato JSON: { titles: [{ title, thumbnail, ctr_estimate, style, hook }] }`;
    const result = await titleGenerator(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro ao gerar títulos', details: e.message }, { status: 500 });
  }
}
