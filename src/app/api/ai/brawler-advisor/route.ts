import { NextRequest, NextResponse } from 'next/server';
import { brawlerAdvisor, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { brawler, mode } = await request.json();
    if (!brawler) {
      return NextResponse.json({ error: 'Brawler é obrigatório' }, { status: 400 });
    }
    const context = `Brawler: ${brawler}, Modo: ${mode || 'Geral'}. Formato JSON: { brawler, mode, optimalLoadout: { gadget, starPower, gears: [{ name, reason }] }, strategy, positioning, tips: [], counters: [{ brawler, reason, effectiveness }] , synergies: [{ brawler, reason }], keyMechanics: [] }`;
    const result = await brawlerAdvisor(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro no conselho de brawler', details: e.message }, { status: 500 });
  }
}
