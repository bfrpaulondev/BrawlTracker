export const BRAWL_API_KEY = process.env.BRAWL_API_KEY || '';
export const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
export const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
export const GROQ_PRIMARY_MODEL = 'llama-3.3-70b-versatile';
export const GROQ_FALLBACK_MODEL = 'llama-3.1-8b-instant';

export const APP_CONFIG = {
  appName: 'BrawlTracker',
  version: '3.0.0',
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
  'Jardim de Pedra', 'Arena Polar', 'Desfiladeiro', 'Ruínas Antigas'
];
