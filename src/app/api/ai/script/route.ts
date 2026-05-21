import { NextRequest, NextResponse } from 'next/server';
import { videoScript, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { topic, platform, duration } = await request.json();
    if (!topic) {
      return NextResponse.json({ error: 'Tópico é obrigatório' }, { status: 400 });
    }
    const context = `Tópico: ${topic}. Plataforma: ${platform || 'YouTube'}. Duração: ${duration || '8-12 min'}. Crie um roteiro completo de vídeo. Formato JSON: { title, duration, sections: [{ name, duration, content, tips: [] }], thumbnailIdea, tags: [], cta, hookLine, outroScript }`;
    const result = await videoScript(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro ao criar roteiro', details: e.message }, { status: 500 });
  }
}
