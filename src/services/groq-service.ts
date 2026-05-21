import { GROQ_API_KEY, GROQ_BASE_URL, GROQ_PRIMARY_MODEL, GROQ_FALLBACK_MODEL, GROQ_CREATIVE_MODEL } from '@/lib/config';

async function callGroq(messages: { role: string; content: string }[], temperature = 0.4, maxTokens = 2048, useCreative = false): Promise<string> {
  const models = useCreative
    ? [GROQ_CREATIVE_MODEL, GROQ_PRIMARY_MODEL, GROQ_FALLBACK_MODEL]
    : [GROQ_PRIMARY_MODEL, GROQ_FALLBACK_MODEL];

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

// ============ COACH CHAT ============
export async function coachChat(message: string, playerData: string | null, battleLogData: string | null, history: { role: string; content: string }[]): Promise<string> {
  const systemPrompt = 'Você é o "BrawlTracker Coach", um treinador brasileiro de Brawl Stars com expertise profissional. Responda SEMPRE em português brasileiro. Seja direto, motivador e com conselhos práticos e detalhados. Use emojis moderadamente. Considere o meta atual e dê estratégias específicas. Dados do jogador: ' + (playerData || 'Não disponível') + '. Histórico de batalhas: ' + (battleLogData || 'Não disponível');
  const messages = [{ role: 'system', content: systemPrompt }, ...history.slice(-8), { role: 'user', content: message }];
  return callGroq(messages, 0.6, 1500);
}

// ============ DRAFT ASSISTANT ============
export async function draftAssistant(context: string): Promise<string> {
  const systemPrompt = 'Você é um especialista em draft ranqueado de Brawl Stars com conhecimento profundo do meta atual. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). Inclua análise detalhada de counters, sinergias, e estratégias por posição. ' + context;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Analise o draft e forneça sugestões detalhadas para as 6 posições com counters, sinergias, alternativas com nome e razão.' }], 0.3, 4096);
}

// ============ BRAWLER ADVISOR ============
export async function brawlerAdvisor(context: string): Promise<string> {
  const systemPrompt = 'Você é um especialista em brawlers de Brawl Stars com conhecimento do meta atual. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). Inclua loadout ideal, estratégia, posicionamento, dicas, counters e sinergias. ' + context;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Forneça conselhos detalhados para este brawler.' }], 0.3, 2048);
}

// ============ PLAYER ANALYSIS ============
export async function analyzePlayer(context: string): Promise<string> {
  const systemPrompt = 'Você é um analista especialista de Brawl Stars com visão estratégica. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). Inclua análise completa: forças, fraquezas, recomendações prioritárias, plano diário e estimativa de true skill. ' + context;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Analise detalhadamente este jogador.' }], 0.3, 4096);
}

// ============ PUSH PLANNER ============
export async function pushPlanner(context: string): Promise<string> {
  const systemPrompt = 'Você é um planejador de sessão de Brawl Stars focado em eficiência. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). Crie sessões otimizadas considerando horários, modos e brawlers ideais. ' + context;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Crie um plano de sessão otimizado para push de troféus.' }], 0.4, 2048);
}

// ============ META INSIGHTS ============
export async function metaInsights(context: string): Promise<string> {
  const systemPrompt = 'Você é um analista de meta de Brawl Stars com dados atualizados. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). Inclua top brawlers, melhores composições, bans prioritários e tendências. ' + context;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Gere um relatório completo do meta atual.' }], 0.5, 3000);
}

// ============ CONTENT CREATOR ============
export async function contentCreator(context: string): Promise<string> {
  const systemPrompt = 'Você é um especialista em criação de conteúdo para Brawl Stars no Brasil. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). Gere ideias criativas, hooks virais e estratégias para crescer como criador. ' + context;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Gere ideias de conteúdo para criador de Brawl Stars.' }], 0.7, 2048, true);
}

// ============ TITLE GENERATOR ============
export async function titleGenerator(context: string): Promise<string> {
  const systemPrompt = 'Você é um especialista em títulos e thumbnails para vídeos de Brawl Stars no Brasil. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). Gere títulos clicáveis com gatilhos mentais, curiosidade e urgência. ' + context;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Gere 10 títulos clicáveis para vídeos de Brawl Stars.' }], 0.7, 1024, true);
}

// ============ VIDEO SCRIPT ============
export async function videoScript(context: string): Promise<string> {
  const systemPrompt = 'Você é um roteirista profissional de vídeos de Brawl Stars. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). Crie roteiros completos com intro, desenvolvimento, clímax e CTA. ' + context;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Crie um roteiro de vídeo completo.' }], 0.6, 2048);
}

// ============ TREND ANALYSIS ============
export async function trendAnalysis(context: string): Promise<string> {
  const systemPrompt = 'Você é um analista de tendências de conteúdo de Brawl Stars no Brasil. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). Analise tendências atuais em YouTube, TikTok e Instagram. ' + context;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Analise as tendências atuais de conteúdo de Brawl Stars.' }], 0.5, 2048);
}

// ============ PROGRESSION PLAN ============
export async function progressionPlan(context: string): Promise<string> {
  const systemPrompt = 'Você é um planejador de progressão de Brawl Stars para contas novas. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). Crie um plano detalhado de 30 dias com foco em conta nova, maximizando recursos F2P e subida de troféus. ' + context;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Crie um plano de progressão de 30 dias para conta nova.' }], 0.5, 4096);
}

// ============ F2P GUIDE ============
export async function f2pGuide(context: string): Promise<string> {
  const systemPrompt = 'Você é um especialista em otimização F2P de Brawl Stars. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). Foque em maximizar recursos gratuitos, priorizar gastos e progressão eficiente. ' + context;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Gere um guia F2P completo.' }], 0.4, 2048);
}

// ============ BATTLE ANALYSIS ============
export async function battleAnalysis(context: string): Promise<string> {
  const systemPrompt = 'Você é um analista de batalhas de Brawl Stars. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). Analise cada batalha detalhadamente: o que deu certo, o que deu errado, e como melhorar. ' + context;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Analise estas batalhas detalhadamente.' }], 0.4, 2048);
}

// ============ COUNTER PICK ============
export async function counterPick(context: string): Promise<string> {
  const systemPrompt = 'Você é um especialista em counters de Brawl Stars. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). Para cada brawler inimigo, indique os melhores counters com nível de eficácia. ' + context;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Gere counters para estes brawlers inimigos.' }], 0.3, 2048);
}

// ============ SCHEDULE GENERATOR ============
export async function scheduleGenerator(context: string): Promise<string> {
  const systemPrompt = 'Você é um planejador de conteúdo para criadores de Brawl Stars. Responda SEMPRE em português brasileiro. Responda APENAS com JSON válido (sem markdown). Crie uma programação semanal otimizada para maximizar engagement e crescimento. ' + context;
  return callGroq([{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Crie uma programação semanal de conteúdo.' }], 0.5, 2048);
}

export { extractJSON };
