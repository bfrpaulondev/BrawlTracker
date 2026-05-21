import { NextRequest, NextResponse } from 'next/server';
import { titleGenerator, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { topic, platform } = await request.json();
    const context = `Tópico: ${topic}. Plataforma: ${platform || 'YouTube'}. Gere 8 títulos clicáveis. Formato JSON: [{ title, thumbnail, ctr_estimate, style }]`;
    const result = await titleGenerator(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro ao gerar títulos' }, { status: 500 });
  }
}
