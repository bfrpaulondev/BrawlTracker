/**
 * BrawlTracker ULTIMATE - Configuration
 * @author Bruno Paulon
 */

// Your pre-configured Brawl Stars API Key
// Registered with IP: 213.22.190.252
export const BRAWL_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjhiNGNhNThkLWVlZTgtNDYxOS05ZmFmLWMzZjBlN2Q4YTJhOCIsImlhdCI6MTc3MTA3MDIzMywic3ViIjoiZGV2ZWxvcGVyL2EzMTYzN2VmLTI0NzgtNmYwMS00NjYxLTA2MmEzNmMwNjc0YSIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMjEzLjIyLjE5MC4yNTIiXSwidHlwZSI6ImNsaWVudCJ9XX0.-efUSGrXf_Dko9WzGk1GG96_DKmNKVUb2weGvno7M3_tMDf-e9ZshIbvUWlJiq-szUWTfOuOKIGdj87BWhcc4Q';

// Your registered IP address
export const REGISTERED_IP = '213.22.190.252';

// App Configuration
export const APP_CONFIG = {
  // Goals
  trophyGoal: 100000,
  brawlerTrophyGoal: 1000,
  
  // App info
  appName: 'BrawlTracker',
  appSubtitle: 'ULTIMATE',
  version: '2.0.0',
  
  // Author
  author: 'Bruno Paulon',
  authorGithub: 'bfrpaulondev',
  
  // Social
  github: 'https://github.com/bfrpaulondev/BrawlTracker',
  
  // API
  apiBaseUrl: 'https://api.brawlstars.com/v1',
  
  // Regions for rankings
  regions: ['BR', 'global', 'US', 'GB', 'DE', 'ES', 'FR', 'IT', 'JP', 'KR', 'RU'],
  
  // Default region
  defaultRegion: 'BR',
  
  // Cache duration (ms)
  cacheDuration: 5 * 60 * 1000, // 5 minutes
  
  // Brawler tiers
  tiers: ['S', 'A', 'B', 'C', 'D'] as const,
  
  // Priority levels
  priorities: ['focus', 'improve', 'maintain'] as const,
  
  // Mode colors
  modeColors: {
    'Gem Grab': 'from-emerald-500 to-green-600',
    'Brawl Ball': 'from-amber-500 to-orange-600',
    'Showdown': 'from-red-500 to-rose-600',
    'Hot Zone': 'from-purple-500 to-pink-600',
    'Knockout': 'from-blue-500 to-cyan-600',
    'Bounty': 'from-yellow-500 to-amber-600',
    'Heist': 'from-orange-500 to-red-600',
    'Siege': 'from-indigo-500 to-purple-600',
    'Wipeout': 'from-cyan-500 to-blue-600',
    'Last Stand': 'from-rose-500 to-pink-600',
  } as Record<string, string>,
} as const;

// Brawler classes
export const BRAWLER_CLASSES = [
  'Tank',
  'Support',
  'Assassin',
  'Sharpshooter',
  'Fighter',
  'Controller',
  'Artillery',
] as const;

// Brawler rarities
export const BRAWLER_RARITIES = [
  { name: 'Starting', color: '#8BC34A' },
  { name: 'Rare', color: '#2196F3' },
  { name: 'Super Rare', color: '#9C27B0' },
  { name: 'Epic', color: '#E91E63' },
  { name: 'Mythic', color: '#FF9800' },
  { name: 'Legendary', color: '#FFC107' },
  { name: 'Chromatic', color: '#00BCD4' },
] as const;
