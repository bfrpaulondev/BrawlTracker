import { NextRequest, NextResponse } from 'next/server';
import { trendAnalysis, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { platform } = await request.json();
    const context = `Plataforma: ${platform || 'Todas'}. Analise as tendências atuais de conteúdo de Brawl Stars no Brasil em YouTube, TikTok e Instagram. Formato JSON: { trends: [{ trend, description, contentAngle, urgency, platforms: [] }], viralFormats: [], seasonalOpportunities: [], algorithmTips: [{ platform, tip }] }`;
    const result = await trendAnalysis(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro ao analisar tendências', details: e.message }, { status: 500 });
  }
}
