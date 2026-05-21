import { NextRequest, NextResponse } from 'next/server';
import { draftAssistant, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { mapa, modo, brawlers, inimigos, aliados, bans, situacao } = await request.json();
    const context = `Contexto do Draft:\n- Mapa: ${mapa}\n- Modo: ${modo}\n- Brawlers disponíveis: ${brawlers}\n- Inimigos: ${inimigos || 'Nenhum'}\n- Aliados: ${aliados || 'Nenhum'}\n- Bans: ${bans || 'Nenhum'}\n- Situação: ${situacao || 'Nenhuma'}\n\nForneça sugestões para 6 posições de pick com counters e sinergias. Formato JSON: { mapa, modo, resumo, banSugerido, banRazao, picksPorPosicao: [{ posicao, titulo, pickRecomendado, razao, alternativas: [{ nome, razao }] }], composicaoTime, countersInimigos, sinergiasAliados, dicasGeral, dicasMapa, estrategiaGeral }`;
    const result = await draftAssistant(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro ao analisar draft', details: e.message }, { status: 500 });
  }
}
