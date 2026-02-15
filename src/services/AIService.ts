/**
 * Brawl Stars AI Analysis Service
 * Uses intelligent rule-based analysis (works locally without external AI)
 */

// Types for AI analysis
export interface PlayerAnalysis {
  overallProgress: {
    trophyProgress: number;
    brawlerProgress: number;
    resourceEfficiency: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: AIRecommendation[];
  brawlerAnalysis: BrawlerAnalysis[];
  metaInsights: string[];
  dailyPlan: DailyPlan[];
}

export interface AIRecommendation {
  type: 'trophy' | 'brawler' | 'resource' | 'strategy' | 'mode';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionable: string;
  estimatedImpact: string;
}

export interface BrawlerAnalysis {
  name: string;
  trophies: number;
  targetProgress: number;
  winRate?: number;
  bestMaps: string[];
  bestModes: string[];
  tips: string[];
  priority: 'focus' | 'maintain' | 'improve';
}

export interface DailyPlan {
  brawler: string;
  recommendedMode: string;
  recommendedMap: string;
  reason: string;
  estimatedTrophies: number;
}

// Meta data for brawlers (current meta)
const BRAWLER_META: Record<string, { tier: 'S' | 'A' | 'B' | 'C' | 'D'; bestModes: string[]; bestMaps: string[]; tips: string[] }> = {
  // S-Tier Brawlers
  'Kenji': { tier: 'S', bestModes: ['Gem Grab', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Super Stadium'], tips: ['Use o super para engajar e escapar rapidamente', 'Ótimo para flanquear inimigos'] },
  'Berry': { tier: 'S', bestModes: ['Hot Zone', 'Gem Grab'], bestMaps: ['Dueling Beetles', 'Hard Rock Mine'], tips: ['Posicione-se bem para curar aliados', 'Use o ataque para zonear'] },
  'Draco': { tier: 'S', bestModes: ['Brawl Ball', 'Knockout'], bestMaps: ['Super Stadium', 'Goldarm Gulch'], tips: ['Acumule super antes de engajar', 'Ótimo para finalizar inimigos baixos'] },
  'Clancy': { tier: 'S', bestModes: ['Gem Grab', 'Brawl Ball'], bestMaps: ['Deep Mine', 'Super Stadium'], tips: ['Use as trilhas para rotacionar', 'Mantenha distância de assassinos'] },
  'Melodie': { tier: 'S', bestModes: ['Showdown', 'Brawl Ball'], bestMaps: ['Cavern Churn', 'Super Stadium'], tips: ['Use notas para ganhar velocidade', 'Kite os inimigos usando sua velocidade'] },
  
  // A-Tier Brawlers
  'Spike': { tier: 'A', bestModes: ['Gem Grab', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Super Stadium'], tips: ['Use o super para zonear', 'Ataques carregados são mais efetivos'] },
  'Crow': { tier: 'A', bestModes: ['Showdown', 'Brawl Ball'], bestMaps: ['Cavern Churn', 'Super Stadium'], tips: ['Aplique veneno constante', 'Use a velocidade para escapar'] },
  'Leon': { tier: 'A', bestModes: ['Showdown', 'Brawl Ball'], bestMaps: ['Cavern Churn', 'Super Stadium'], tips: ['Use invisibilidade para flanquear', 'Engaje quando o inimigo estiver baixo'] },
  'Sandy': { tier: 'A', bestModes: ['Gem Grab', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles'], tips: ['Use o super para dar visão e proteção', 'Ótimo para controlar área'] },
  'Amber': { tier: 'A', bestModes: ['Hot Zone', 'Gem Grab'], bestMaps: ['Dueling Beetles', 'Hard Rock Mine'], tips: ['Espalhe fogo para zonear', 'Use o super em grupos de inimigos'] },
  'Buzz': { tier: 'A', bestModes: ['Brawl Ball', 'Knockout'], bestMaps: ['Super Stadium', 'Goldarm Gulch'], tips: ['Acumule super rapidamente', 'Stun é chave para kills'] },
  'Fang': { tier: 'A', bestModes: ['Brawl Ball', 'Knockout'], bestMaps: ['Super Stadium', 'Goldarm Gulch'], tips: ['Use o super para finalizar', 'Ótimo contra brawlers de vida baixa'] },
  'Belle': { tier: 'A', bestModes: ['Bounty', 'Gem Grab'], bestMaps: ['Snake Prairie', 'Hard Rock Mine'], tips: ['Marque alvos prioritários', 'Mantenha distância máxima'] },
  'Gus': { tier: 'A', bestModes: ['Gem Grab', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles'], tips: ['Use escudos para proteção do time', 'Posicione-se bem atrás'] },
  'Mico': { tier: 'A', bestModes: ['Brawl Ball', 'Knockout'], bestMaps: ['Super Stadium', 'Goldarm Gulch'], tips: ['Use a mobilidade para flanquear', 'Ataque rápido e recue'] },
  'Kit': { tier: 'A', bestModes: ['Brawl Ball', 'Gem Grab'], bestMaps: ['Super Stadium', 'Hard Rock Mine'], tips: ['Use o super para CC', 'Ótimo suporte para o time'] },
  
  // B-Tier Brawlers (popular ones)
  'Shelly': { tier: 'B', bestModes: ['Brawl Ball', 'Showdown'], bestMaps: ['Super Stadium', 'Cavern Churn'], tips: ['Use o super em distância média', 'Bush camping funciona bem'] },
  'Colt': { tier: 'B', bestModes: ['Brawl Ball', 'Gem Grab'], bestMaps: ['Super Stadium', 'Hard Rock Mine'], tips: ['Preveja o movimento inimigo', 'Use o super para quebrar paredes'] },
  'Bull': { tier: 'B', bestModes: ['Showdown', 'Brawl Ball'], bestMaps: ['Cavern Churn', 'Super Stadium'], tips: ['Use o super para escapar ou engajar', 'Bush camping é muito efetivo'] },
  'Jessie': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles'], tips: ['Posicione a torre bem', 'Use o super em grupos'] },
  'Nita': { tier: 'B', bestModes: ['Gem Grab', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Super Stadium'], tips: ['Use o urso para pressionar', 'Mantenha o urso vivo'] },
  'Dynamike': { tier: 'B', bestModes: ['Brawl Ball', 'Gem Grab'], bestMaps: ['Super Stadium', 'Hard Rock Mine'], tips: ['Preveja movimentos inimigos', 'Use o super para controle de área'] },
  'El Primo': { tier: 'B', bestModes: ['Showdown', 'Brawl Ball'], bestMaps: ['Cavern Churn', 'Super Stadium'], tips: ['Use o super para engajar', 'Bush camping funciona bem'] },
  'Brock': { tier: 'B', bestModes: ['Bounty', 'Gem Grab'], bestMaps: ['Snake Prairie', 'Hard Rock Mine'], tips: ['Mantenha distância', 'Use o super para quebrar cobertura'] },
  'Rico': { tier: 'B', bestModes: ['Brawl Ball', 'Gem Grab'], bestMaps: ['Super Stadium', 'Hard Rock Mine'], tips: ['Use paredes para ricochetear', 'Ataques carregados são mais fortes'] },
  'Penny': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles'], tips: ['Posicione o canhão bem', 'Use o super em grupos'] },
  'Piper': { tier: 'B', bestModes: ['Bounty', 'Knockout'], bestMaps: ['Snake Prairie', 'Goldarm Gulch'], tips: ['Mantenha distância máxima', 'Use o super para escapar ou finalizar'] },
  'Pam': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles'], tips: ['Posicione a torre de cura', 'Apoie seu time'] },
  'Frank': { tier: 'B', bestModes: ['Gem Grab', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Super Stadium'], tips: ['Use o stun para controle', 'Cuidado com CC inimigo'] },
  'Bibi': { tier: 'B', bestModes: ['Brawl Ball', 'Gem Grab'], bestMaps: ['Super Stadium', 'Hard Rock Mine'], tips: ['Use a bola de borracha para KB', 'Mova-se constantemente'] },
  'Tara': { tier: 'B', bestModes: ['Gem Grab', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Super Stadium'], tips: ['Use o super para puxar grupos', 'Mantenha pressão constante'] },
  'Gene': { tier: 'B', bestModes: ['Gem Grab', 'Bounty'], bestMaps: ['Hard Rock Mine', 'Snake Prairie'], tips: ['Use a mão para puxar alvos', 'Lata de cura ajuda o time'] },
  'Max': { tier: 'B', bestModes: ['Gem Grab', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Super Stadium'], tips: ['Use speed boosts para o time', 'Mantenha-se móvel'] },
  'Mr. P': { tier: 'B', bestModes: ['Gem Grab', 'Bounty'], bestMaps: ['Hard Rock Mine', 'Snake Prairie'], tips: ['Posicione os pinguins bem', 'Use o super para pressão extra'] },
  'Sprout': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles'], tips: ['Use a parede para bloquear', 'Controle de área é chave'] },
  'Byron': { tier: 'B', bestModes: ['Gem Grab', 'Bounty'], bestMaps: ['Hard Rock Mine', 'Snake Prairie'], tips: ['Cure aliados e dane inimigos', 'Mantenha distância'] },
  'Squeak': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles'], tips: ['Use as bombas para zonear', 'Controle de área constante'] },
  'Lou': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles'], tips: ['Use o slow para controle', 'Mantenha pressão constante'] },
  'Ruffs': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles'], tips: ['Buff seus aliados', 'Use os power-ups estrategicamente'] },
  'Griff': { tier: 'B', bestModes: ['Gem Grab', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Super Stadium'], tips: ['Use o super para burst damage', 'Gerencie suas moedas'] },
  'Bonne': { tier: 'B', bestModes: ['Gem Grab', 'Showdown'], bestMaps: ['Hard Rock Mine', 'Cavern Churn'], tips: ['Use os ratos para coletar', 'Mantenha distância'] },
  'Grom': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles'], tips: ['Use as bombas para controle', 'Mantenha distância'] },
  'Colette': { tier: 'B', bestModes: ['Showdown', 'Gem Grab'], bestMaps: ['Cavern Churn', 'Hard Rock Mine'], tips: ['Dano baseado em % de vida', 'Ótima contra tanks'] },
  'Edgar': { tier: 'B', bestModes: ['Brawl Ball', 'Showdown'], bestMaps: ['Super Stadium', 'Cavern Churn'], tips: ['Use o super para engajar', 'Cuidado com brawlers de range'] },
  'Stu': { tier: 'B', bestModes: ['Brawl Ball', 'Gem Grab'], bestMaps: ['Super Stadium', 'Hard Rock Mine'], tips: ['Use o dash para mobilidade', 'Acerte o super para burn'] },
  'Maisie': { tier: 'B', bestModes: ['Gem Grab', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Super Stadium'], tips: ['Use o super para controle', 'Mantenha distância'] },
  'Pearl': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles'], tips: ['Use o super quando carregado', 'Controle de área constante'] },
  'Chuck': { tier: 'B', bestModes: ['Brawl Ball', 'Gem Grab'], bestMaps: ['Super Stadium', 'Hard Rock Mine'], tips: ['Use as placas para mobilidade', 'Mantenha-se móvel'] },
  'Charlie': { tier: 'B', bestModes: ['Gem Grab', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Super Stadium'], tips: ['Use o cocoon para isolar', 'Controle de área'] },
  'Willow': { tier: 'B', bestModes: ['Gem Grab', 'Showdown'], bestMaps: ['Hard Rock Mine', 'Cavern Churn'], tips: ['Use o controle mental estrategicamente', 'Mantenha distância'] },
  'L&L': { tier: 'B', bestModes: ['Gem Grab', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Super Stadium'], tips: ['Coordene Larry e Lawrie', 'Use ambos estrategicamente'] },
};

// Default meta for unknown brawlers
const DEFAULT_META = {
  tier: 'C' as const,
  bestModes: ['Gem Grab', 'Brawl Ball'],
  bestMaps: ['Hard Rock Mine', 'Super Stadium'],
  tips: ['Pratique no modo treinamento', 'Conheça os pontos fortes do brawler']
};

/**
 * Generate comprehensive player analysis using rule-based intelligence
 */
export async function analyzePlayer(playerData: {
  name: string;
  tag: string;
  trophies: number;
  highestTrophies: number;
  victories: { trio: number; solo: number; duo: number };
  brawlers: Array<{
    name: string;
    power: number;
    rank: number;
    trophies: number;
    highestTrophies: number;
  }>;
  battleHistory?: Array<{
    mode: string;
    map: string;
    result: string;
    brawler: string;
    trophyChange: number;
  }>;
}): Promise<PlayerAnalysis> {
  const brawlersUnder1000 = playerData.brawlers.filter(b => b.trophies < 1000);
  const brawlersOver1000 = playerData.brawlers.filter(b => b.trophies >= 1000);
  const brawlersOver500 = playerData.brawlers.filter(b => b.trophies >= 500);
  
  // Calculate battle stats if available
  let winRate = 50;
  let recentBrawlers: string[] = [];
  if (playerData.battleHistory && playerData.battleHistory.length > 0) {
    const wins = playerData.battleHistory.filter(b => b.result === 'victory').length;
    winRate = Math.round((wins / playerData.battleHistory.length) * 100);
    recentBrawlers = [...new Set(playerData.battleHistory.slice(0, 10).map(b => b.brawler))];
  }
  
  // Analyze strengths
  const strengths: string[] = [];
  if (brawlersOver1000.length >= 10) strengths.push(`${brawlersOver1000.length} brawlers acima de 1000 troféus - diversidade sólida`);
  if (winRate >= 60) strengths.push(`Win rate de ${winRate}% - desempenho acima da média`);
  if (playerData.victories.trio >= 5000) strengths.push(`${playerData.victories.trio.toLocaleString()} vitórias 3v3 - experiência em equipe`);
  if (playerData.victories.solo + playerData.victories.duo >= 1000) strengths.push(`Experiência em Showdown (${(playerData.victories.solo + playerData.victories.duo).toLocaleString()} vitórias)`);
  if (playerData.trophies >= 50000) strengths.push(`${playerData.trophies.toLocaleString()} troféus - jogador experiente`);
  if (brawlersOver500.length >= playerData.brawlers.length * 0.8) strengths.push(`${brawlersOver500.length} brawlers acima de 500 troféus - boa distribuição`);
  
  if (strengths.length === 0) {
    strengths.push(`Possui ${playerData.brawlers.length} brawlers desbloqueados`);
    strengths.push(`Nível de experiência: ${playerData.highestTrophies.toLocaleString()} troféus de recorde`);
  }
  
  // Analyze weaknesses
  const weaknesses: string[] = [];
  if (brawlersUnder1000.length > 50) weaknesses.push(`${brawlersUnder1000.length} brawlers precisam chegar a 1000 troféus`);
  if (winRate < 45) weaknesses.push(`Win rate de ${winRate}% - precisa melhorar estratégias`);
  if (playerData.trophies < playerData.highestTrophies * 0.9) weaknesses.push(`Troféus atuais abaixo do recorde (${(playerData.highestTrophies - playerData.trophies).toLocaleString()} de diferença)`);
  
  const lowPowerBrawlers = playerData.brawlers.filter(b => b.power < 9);
  if (lowPowerBrawlers.length > 10) weaknesses.push(`${lowPowerBrawlers.length} brawlers com poder abaixo de 9`);
  
  if (weaknesses.length === 0) {
    weaknesses.push('Continue praticando para melhorar consistência');
  }
  
  // Generate recommendations
  const recommendations: AIRecommendation[] = [];
  
  // Trophy recommendation
  if (playerData.trophies < 100000) {
    const progress = Math.round((playerData.trophies / 100000) * 100);
    recommendations.push({
      type: 'trophy',
      priority: 'high',
      title: 'Meta de 100k Troféus',
      description: `Você está em ${progress}% do objetivo. Faltam ${(100000 - playerData.trophies).toLocaleString()} troféus.`,
      actionable: `Jogue 3-5 partidas por dia com brawlers entre 600-900 troféus para ganho eficiente`,
      estimatedImpact: '+50-100 troféus/dia'
    });
  }
  
  // Brawler recommendations
  const brawlersToFocus = playerData.brawlers
    .filter(b => b.trophies >= 600 && b.trophies < 1000)
    .sort((a, b) => b.trophies - a.trophies)
    .slice(0, 5);
  
  if (brawlersToFocus.length > 0) {
    recommendations.push({
      type: 'brawler',
      priority: 'high',
      title: 'Foque em Brawlers Próximos de 1000',
      description: `${brawlersToFocus.length} brawlers estão entre 600-1000 troféus, prontos para push`,
      actionable: `Priorize: ${brawlersToFocus.map(b => b.name).join(', ')}`,
      estimatedImpact: '+200-500 troféus totais'
    });
  }
  
  // Resource recommendation
  const lowPowerBrawlersSorted = lowPowerBrawlers
    .filter(b => b.trophies >= 500)
    .sort((a, b) => b.trophies - a.trophies)
    .reverse()
    .slice(0, 5);
  
  if (lowPowerBrawlersSorted.length > 0) {
    recommendations.push({
      type: 'resource',
      priority: 'medium',
      title: 'Upar Poder de Brawlers',
      description: `${lowPowerBrawlersSorted.length} brawlers com troféus altos precisam de mais poder`,
      actionable: `Priorize: ${lowPowerBrawlersSorted.map(b => `${b.name} (Poder ${b.power})`).join(', ')}`,
      estimatedImpact: '+5-10% win rate'
    });
  }
  
  // Mode recommendation based on victories
  if (playerData.victories.trio > playerData.victories.solo + playerData.victories.duo) {
    recommendations.push({
      type: 'mode',
      priority: 'medium',
      title: 'Foque em Modos 3v3',
      description: `Você tem mais vitórias 3v3 (${playerData.victories.trio.toLocaleString()}) - é seu ponto forte`,
      actionable: 'Jogue Gem Grab e Brawl Ball para ganho eficiente de troféus',
      estimatedImpact: '+3-5% win rate'
    });
  } else if (playerData.victories.solo + playerData.victories.duo > playerData.victories.trio) {
    recommendations.push({
      type: 'mode',
      priority: 'medium',
      title: 'Foque em Showdown',
      description: `Você tem mais vitórias SD (${(playerData.victories.solo + playerData.victories.duo).toLocaleString()}) - é seu ponto forte`,
      actionable: 'Showdown Duo é ótimo para farmar troféus consistentemente',
      estimatedImpact: '+3-5% win rate'
    });
  }
  
  // Strategy recommendation
  recommendations.push({
    type: 'strategy',
    priority: 'low',
    title: 'Rotação de Brawlers',
    description: 'Alternar brawlers evita perder troféus em um único personagem',
    actionable: 'Use 3-5 brawlers diferentes por sessão de jogo',
    estimatedImpact: 'Progresso mais consistente'
  });
  
  // Generate brawler analysis
  const brawlerAnalysis: BrawlerAnalysis[] = playerData.brawlers
    .sort((a, b) => b.trophies - a.trophies)
    .slice(0, 30)
    .map(brawler => {
      const meta = BRAWLER_META[brawler.name] || DEFAULT_META;
      const targetProgress = Math.round((brawler.trophies / 1000) * 100);
      
      let priority: 'focus' | 'maintain' | 'improve';
      if (brawler.trophies >= 1000) {
        priority = 'maintain';
      } else if (brawler.trophies >= 600 && meta.tier !== 'D') {
        priority = 'focus';
      } else {
        priority = 'improve';
      }
      
      return {
        name: brawler.name,
        trophies: brawler.trophies,
        targetProgress,
        bestMaps: meta.bestMaps,
        bestModes: meta.bestModes,
        tips: meta.tips,
        priority
      };
    });
  
  // Generate daily plan
  const todayBrawlers = playerData.brawlers
    .filter(b => b.trophies >= 500 && b.trophies < 1100)
    .sort((a, b) => {
      // Prioritize S and A tier brawlers with high trophies
      const metaA = BRAWLER_META[a.name] || DEFAULT_META;
      const metaB = BRAWLER_META[b.name] || DEFAULT_META;
      const tierOrder = { 'S': 0, 'A': 1, 'B': 2, 'C': 3, 'D': 4 };
      if (tierOrder[metaA.tier] !== tierOrder[metaB.tier]) {
        return tierOrder[metaA.tier] - tierOrder[metaB.tier];
      }
      return b.trophies - a.trophies;
    })
    .slice(0, 5);
  
  const dailyPlan: DailyPlan[] = todayBrawlers.map(brawler => {
    const meta = BRAWLER_META[brawler.name] || DEFAULT_META;
    return {
      brawler: brawler.name,
      recommendedMode: meta.bestModes[0],
      recommendedMap: meta.bestMaps[0],
      reason: meta.tier === 'S' || meta.tier === 'A' 
        ? `${brawler.name} é tier ${meta.tier} no meta atual - forte escolha!`
        : `Foque em subir ${brawler.name} até 1000 troféus`,
      estimatedTrophies: Math.round((1000 - brawler.trophies) * 0.1) + 5
    };
  });
  
  // Meta insights
  const metaInsights = [
    `Meta atual favorece brawlers com mobilidade e burst damage`,
    `Brawlers tier S: Kenji, Berry, Draco, Clancy, Melodie`,
    `Gem Grab e Brawl Ball são os melhores modos para subir troféus`,
    `Showdown Duo é ótimo para farmar consistentemente`,
    `Eventos especiais rodam diariamente - não perca!`
  ];
  
  return {
    overallProgress: {
      trophyProgress: Math.round((playerData.trophies / 100000) * 100),
      brawlerProgress: Math.round((brawlersOver1000.length / playerData.brawlers.length) * 100),
      resourceEfficiency: Math.round(100 - (lowPowerBrawlers.length / playerData.brawlers.length) * 100)
    },
    strengths,
    weaknesses,
    recommendations,
    brawlerAnalysis,
    metaInsights,
    dailyPlan
  };
}

/**
 * Get quick tips for a specific situation
 */
export async function getQuickTip(context: {
  brawler: string;
  mode: string;
  map: string;
  situation: string;
}): Promise<string> {
  const meta = BRAWLER_META[context.brawler] || DEFAULT_META;
  return meta.tips[0] || 'Continue praticando!';
}
