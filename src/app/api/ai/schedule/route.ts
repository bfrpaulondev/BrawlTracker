import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { platform } = await request.json();
    return NextResponse.json({
      platform: platform || 'YouTube',
      recommendations: [
        { day: 'Segunda', time: '18:00-20:00', reason: 'Pico de acesso após escola/trabalho' },
        { day: 'Quarta', time: '19:00-21:00', reason: 'Meio da semana, público ativo' },
        { day: 'Sexta', time: '17:00-19:00', reason: 'Início do fim de semana' },
        { day: 'Sábado', time: '14:00-16:00', reason: 'Maior público online' },
        { day: 'Domingo', time: '15:00-17:00', reason: 'Último dia para postar' },
      ],
      frequency: platform === 'TikTok' ? '1-2x por dia' : '3-4x por semana',
      tips: [
        'Poste consistentemente no mesmo horário',
        'TikTok: priorize vídeos curtos (15-60s)',
        'YouTube: vídeos de 8-15 min performam melhor',
        'Instagram Reels: 30-90s com hook nos primeiros 3s',
        'Use trending sounds e hashtags do Brawl Stars',
        'Quinta e sexta são os melhores dias para YouTube BR',
      ],
    });
  } catch {
    return NextResponse.json({ error: 'Erro' }, { status: 500 });
  }
}
