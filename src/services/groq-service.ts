import { GROQ_API_KEY, GROQ_BASE_URL, GROQ_PRIMARY_MODEL, GROQ_FALLBACK_MODEL } from '@/lib/config';

async function callGroq(messages: { role: string; content: string }[], temperature = 0.4, maxTokens = 2048): Promise<string> {
  const models = [GROQ_PRIMARY_MODEL, GROQ_FALLBACK_MODEL];
  for (const model of models) {
    try {
      const res = await fetch(GROQ_BASE_URL + '/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + GROQ_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages, temperature, max_tokens: maxTokens }),
      });
      if (res.status === 429) { await new Promise(r => setTimeout(r, 2000)); continue; }
      if (!res.ok) continue;
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) return content;
    } catch { continue; }
  }
  throw new Error('Todos os modelos Groq falharam');
}

function extractJSON(text: string): string {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  return match ? match[0] : cleaned;
}

export async function coachChat(message: string, playerData: string | null, battleLogData: string | null, history: { role: string; content: string }[]): Promise<string> {
  const systemPrompt = 'Você é o "BrawlTracker Coach", um treinador brasileiro de Brawl Stars. Responda SEMPRE em português brasileiro. Seja direto, motivador e com conselhos práticos. Use emojis moderadamente. Dados do jogador: ' + (playerData || 'Não disponível') + '. Histórico: ' + (battleLogData || 'Não disponível');
  const messages = [{ role: 'system', content: systemPrompt }, ...history.slice(-6), { role: 'user', content: message }];
  return callGroq(messages, 0.6, 1024);
}

export async function draftAssistant(context: string): Promise<string> {
  const systemPrompt = `Você é um especialista em draft ranqueado de Brawl Stars. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). ${context}`;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Analise o draft e forneça sugestões para as 6 posições com counters, sinergias, alternativas com nome e razão.' }], 0.3, 4096);
}

export async function brawlerAdvisor(context: string): Promise<string> {
  const systemPrompt = `Você é um especialista em brawlers de Brawl Stars. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). ${context}`;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Forneça conselhos detalhados para este brawler.' }], 0.3, 2048);
}

export async function analyzePlayer(context: string): Promise<string> {
  const systemPrompt = `Você é um analista especialista de Brawl Stars. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). ${context}`;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Analise detalhadamente este jogador.' }], 0.3, 4096);
}

export async function pushPlanner(context: string): Promise<string> {
  const systemPrompt = `Você é um planejador de sessão de Brawl Stars. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). ${context}`;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Crie um plano de sessão otimizado.' }], 0.4, 2048);
}

export async function metaInsights(context: string): Promise<string> {
  const systemPrompt = `Você é um analista de meta de Brawl Stars. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). ${context}`;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Gere insights sobre o meta atual.' }], 0.5, 2048);
}

export async function contentCreator(context: string): Promise<string> {
  const systemPrompt = `Você é um especialista em criação de conteúdo para Brawl Stars. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). ${context}`;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Gere ideias de conteúdo.' }], 0.7, 2048);
}

export async function titleGenerator(context: string): Promise<string> {
  const systemPrompt = `Você é um especialista em títulos e thumbnails para vídeos de Brawl Stars. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). ${context}`;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Gere títulos clicáveis.' }], 0.7, 1024);
}

export async function videoScript(context: string): Promise<string> {
  const systemPrompt = `Você é um roteirista de vídeos de Brawl Stars. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). ${context}`;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Crie um roteiro de vídeo.' }], 0.6, 2048);
}

export async function trendAnalysis(context: string): Promise<string> {
  const systemPrompt = `Você é um analista de tendências de conteúdo de Brawl Stars. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). ${context}`;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Analise as tendências atuais.' }], 0.5, 2048);
}

export async function progressionPlan(context: string): Promise<string> {
  const systemPrompt = `Você é um planejador de progressão de Brawl Stars para contas novas. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). ${context}`;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Crie um plano de progressão de 30 dias.' }], 0.5, 4096);
}

export { extractJSON };
