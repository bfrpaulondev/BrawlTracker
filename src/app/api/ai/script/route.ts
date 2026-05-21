import { NextRequest, NextResponse } from 'next/server';
import { videoScript, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { topic, duration, platform } = await request.json();
    const context = `Tópico: ${topic}. Duração: ${duration || '8-12 min'}. Plataforma: ${platform || 'YouTube'}. Formato JSON: { title, duration, sections: [{ name, duration, content, tips[] }], thumbnailIdea, tags[], cta }`;
    const result = await videoScript(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro ao criar roteiro' }, { status: 500 });
  }
}
