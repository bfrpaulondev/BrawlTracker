import { NextRequest, NextResponse } from 'next/server';
import { scheduleGenerator, extractJSON } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { platform, daysPerWeek, hoursPerDay } = await request.json();
    const context = `Plataforma: ${platform || 'YouTube'}. Dias por semana: ${daysPerWeek || 4}. Horas por dia: ${hoursPerDay || 2}. Crie uma programação semanal otimizada para criador de conteúdo de Brawl Stars. Formato JSON: { platform, schedule: [{ day, slots: [{ time, content, format, duration, reason }] }], weeklyGoals: [], tips: [], bestTimes: { explanation, peakHours: [] }, contentMix: { percentageBreakdown: [{ type, percentage, reason }] } }`;
    const result = await scheduleGenerator(context);
    const json = extractJSON(result);
    return NextResponse.json(JSON.parse(json));
  } catch (e: any) {
    return NextResponse.json({ error: 'Erro ao gerar programação', details: e.message }, { status: 500 });
  }
}
