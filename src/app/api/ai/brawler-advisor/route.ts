import { NextRequest, NextResponse } from 'next/server';
import { brawlerAdvisor, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { brawler, mode, map, power, trophies } = await request.json();
    const context = `Brawler: ${brawler}, Modo: ${mode || 'Geral'}, Mapa: ${map || 'Geral'}, Poder: ${power || 11}, Troféus: ${trophies || 0}. Formato JSON: { optimalLoadout: { gadget, starPower, gears[] }, strategy, positioning, tips[], counters[], synergies[], keyMechanics[] }`;
    const result = await brawlerAdvisor(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro no conselho de brawler' }, { status: 500 });
  }
}
