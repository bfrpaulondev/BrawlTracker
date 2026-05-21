// =============================================
// BRAWLTRACKER v4 - CONFIGURAÇÃO CENTRAL
// Chaves de API hardcoded (repositório privado)
// =============================================

export const BRAWL_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjFhOTUwNWQxLWViMWQtNGZmOS05YjMyLTk2MWVkNjBiMzk5MyIsImlhdCI6MTc3OTM2Njk4Niwic3ViIjoiZGV2ZWxvcGVyL2EzMTYzN2VmLTI0NzgtNmYwMS00NjYxLTA2MmEzNmMwNjc0YSIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMTkzLjEyNi4xMS4yMjkiXSwidHlwZSI6ImNsaWVudCJ9XX0.pFDgJntHVBWXTIXBk5Wk1PMGYBrGI-mqgMiaPgfNtMkOSEo9TzGuxFvvxitmVvtmg3-NTUgX46FgYYoBVbRjYQ';
export const GROQ_API_KEY = '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';

export const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
export const GROQ_PRIMARY_MODEL = 'llama-3.3-70b-versatile';
export const GROQ_FALLBACK_MODEL = 'llama-3.1-8b-instant';
export const GROQ_CREATIVE_MODEL = 'mixtral-8x7b-32768';

export const APP_CONFIG = {
  appName: 'BrawlTracker',
  version: '4.0.0',
  author: 'Bruno Paulon',
  apiBaseUrl: 'https://api.brawlstars.com/v1',
  brawlerImageUrl: (id: number) => 'https://cdn.brawlstats.com/brawlers/' + id + '.png',
  regions: ['global', 'BR', 'US', 'GB', 'DE', 'ES', 'FR', 'IT', 'JP', 'KR', 'RU', 'MX', 'AR', 'CL', 'CO', 'PE'],
  defaultRegion: 'BR',
  trophyGoal: 100000,
  modeColors: {
    'gemGrab': 'from-emerald-500 to-green-600',
    'brawlBall': 'from-amber-500 to-orange-600',
    'soloShowdown': 'from-red-500 to-rose-600',
    'duoShowdown': 'from-red-400 to-rose-500',
    'hotZone': 'from-purple-500 to-pink-600',
    'knockout': 'from-blue-500 to-cyan-600',
    'bounty': 'from-yellow-500 to-amber-600',
    'heist': 'from-orange-500 to-red-600',
    'wipeout': 'from-cyan-500 to-blue-600',
  } as Record<string, string>,
  modeEmojis: {
    'gemGrab': '💎',
    'brawlBall': '⚽',
    'soloShowdown': '🥊',
    'duoShowdown': '👥',
    'hotZone': '🔥',
    'knockout': '🎯',
    'bounty': '⭐',
    'heist': '🏦',
    'wipeout': '💀',
  } as Record<string, string>,
} as const;

export const RANKED_MAPS = [
  'Super Estádio', 'Centro da Cidade', 'Covil do Dragão', 'Beira do Abismo',
  'Vale dos Dinossauros', 'Campo de Batalha', 'Fortaleza Solitária', 'Pirâmide Perdida',
  'Jardim de Pedra', 'Arena Polar', 'Desfiladeiro', 'Ruínas Antigas',
  'Estádio Municipal', 'Bastião', 'Ponto de Encontro', 'Caverna de Cristal'
];

export const RARITY_COLORS: Record<string, string> = {
  'Common': 'from-gray-500 to-gray-600',
  'Rare': 'from-blue-500 to-blue-600',
  'Super Rare': 'from-cyan-500 to-cyan-600',
  'Epic': 'from-purple-500 to-purple-600',
  'Mythic': 'from-red-500 to-red-600',
  'Legendary': 'from-yellow-400 to-amber-500',
  'Chromatic': 'from-pink-500 to-rose-600',
};

export const RARITY_ORDER = ['Common', 'Rare', 'Super Rare', 'Epic', 'Mythic', 'Legendary', 'Chromatic'];

export const POWER_POINT_COSTS: Record<number, { coins: number; points: number }> = {
  1: { coins: 20, points: 140 },
  2: { coins: 35, points: 140 },
  3: { coins: 75, points: 140 },
  4: { coins: 140, points: 140 },
  5: { coins: 290, points: 140 },
  6: { coins: 480, points: 140 },
  7: { coins: 800, points: 140 },
  8: { coins: 1250, points: 140 },
  9: { coins: 1250, points: 0 },
  10: { coins: 1250, points: 0 },
  11: { coins: 1250, points: 0 },
};

export const TROPHY_MILESTONES = [100, 250, 500, 750, 1000, 1250, 1500, 1750, 2000];

export const CONTENT_PLATFORMS = ['YouTube', 'TikTok', 'Instagram Reels', 'YouTube Shorts', 'Twitch'];
export const CONTENT_FORMATS = ['Vídeo Longo', 'Short', 'Reels', 'Live', 'Série', 'Tutorial'];
