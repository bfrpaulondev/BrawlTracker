import { NextRequest, NextResponse } from 'next/server';
import { coachChat } from '@/services/groq-service';

export async function POST(request: NextRequest) {
  try {
    const { message, playerData, battleLogData, history } = await request.json();
    if (!message) return NextResponse.json({ error: 'Mensagem é obrigatória' }, { status: 400 });
    const response = await coachChat(message, playerData || null, battleLogData || null, history || []);
    return NextResponse.json({ response });
  } catch (e: any) {
    return NextResponse.json({ response: 'Estou com dificuldades técnicas. Tente novamente em instantes! 🔧' });
  }
}
