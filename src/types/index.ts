// =============================================
// BRAWLTRACKER v4 - TYPES
// =============================================

export interface Player {
  tag: string;
  name: string;
  nameColor: string;
  icon: { id: number };
  trophies: number;
  highestTrophies: number;
  expLevel: number;
  expPoints: number;
  isQualifiedFromChampionshipChallenge: boolean;
  '3vs3Victories': number;
  soloVictories: number;
  duoVictories: number;
  bestRoboRumbleLevel: number;
  bestTimeAsBigBrawler: number;
  club?: { tag: string; name: string };
  brawlers: PlayerBrawler[];
}

export interface PlayerBrawler {
  id: number;
  name: string;
  power: number;
  rank: number;
  trophies: number;
  highestTrophies: number;
  starPowers: { id: number; name: string }[];
  gadgets: { id: number; name: string }[];
  gears: { id: number; name: string; level: number }[];
}

export interface BattleLogItem {
  battleTime: string;
  event: { id: number; mode: string; map: string };
  battle: Battle;
}

export interface Battle {
  mode: string;
  type: string;
  result?: 'victory' | 'defeat' | 'draw';
  duration?: number;
  trophyChange?: number;
  rank?: number;
  teams?: { players: BattlePlayer[] }[];
  players?: BattlePlayer[];
  bigBrawler?: BattlePlayer;
}

export interface BattlePlayer {
  tag: string;
  name: string;
  brawler: { id: number; name: string; power: number; trophies: number };
}

export interface BrawlerInfo {
  id: number;
  name: string;
  starPowers: { id: number; name: string; description?: string }[];
  gadgets: { id: number; name: string; description?: string }[];
  gears: { id: number; name: string; description?: string }[];
  class: { id: number; name: string };
  rarity: { id: number; name: string; color: string };
  description: string;
  imageUrl: string;
}

export interface ClubInfo {
  tag: string;
  name: string;
  description: string;
  type: 'open' | 'inviteOnly' | 'closed';
  badgeId: number;
  requiredTrophies: number;
  trophies: number;
  members: ClubMember[];
}

export interface ClubMember {
  tag: string;
  name: string;
  nameColor: string;
  role: 'president' | 'vicePresident' | 'senior' | 'member';
  trophies: number;
  icon: { id: number };
}

export interface RankingPlayer {
  tag: string;
  name: string;
  nameColor: string;
  icon: { id: number };
  trophies: number;
  rank: number;
  club?: { name: string; tag: string };
}

export interface EventItem {
  startTime: string;
  endTime: string;
  slotId: number;
  event: { id: number; mode: string; map: string };
}

// AI Response Types
export interface DraftSuggestion {
  mapa: string;
  modo: string;
  resumo: string;
  banSugerido: string;
  banRazao: string;
  picksPorPosicao: {
    posicao: number;
    titulo: string;
    pickRecomendado: string;
    razao: string;
    alternativas: { nome: string; razao: string }[];
  }[];
  composicaoTime: string[];
  countersInimigos: Record<string, string[]>;
  sinergiasAliados: string[];
  dicasGeral: string[];
  dicasMapa: string[];
  estrategiaGeral: string;
}

export interface BrawlerAdvice {
  optimalLoadout: { gadget: string; starPower: string; gears: string[] };
  strategy: string;
  positioning: string;
  tips: string[];
  counters: string[];
  synergies: string[];
  keyMechanics: string[];
}

export interface AIPlayerAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: { type: string; priority: string; title: string; description: string; actionable: string; estimatedImpact: string }[];
  dailyPlan: { brawler: string; mode: string; map: string; reason: string; estimatedTrophies: number; priority: string }[];
  metaInsights: string[];
  trueSkillEstimate: { rating: number; level: string; percentile: number; trend: string };
}

export interface PushPlan {
  sessions: { brawler: string; mode: string; map: string; duration: number; reason: string; estimatedTrophies: number }[];
  totalEstimatedTrophies: number;
  tiltWarning: boolean;
  tiltAdvice: string;
  generalTips: string[];
}

export interface ContentIdea {
  title: string;
  platform: string;
  format: string;
  description: string;
  hooks: string[];
  estimatedViews: string;
  difficulty: string;
}

export interface VideoScript {
  title: string;
  duration: string;
  sections: { name: string; duration: string; content: string; tips: string[] }[];
  thumbnailIdea: string;
  tags: string[];
  cta: string;
}

export interface ProgressionDay {
  day: number;
  week: number;
  focus: string;
  brawlers: string[];
  modes: string[];
  goals: string[];
  resourceTip: string;
  estimatedTrophies: number;
}

export interface GoalTracker {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  createdAt: string;
}

export interface F2PGuide {
  priority: string;
  items: { name: string; cost: string; value: string; reason: string }[];
  monthlyEstimate: string;
  tips: string[];
}

export interface ResourceCalc {
  type: string;
  current: number;
  target: number;
  needed: number;
  coinCost: number;
  gemCost: number;
  timeEstimate: string;
}

export interface ScheduleWeek {
  days: { day: string; slots: { time: string; content: string; platform: string; status: string }[] }[];
  tips: string[];
}

export interface TrendData {
  topic: string;
  platform: string;
  volume: string;
  trend: 'rising' | 'stable' | 'declining';
  suggestion: string;
}

export interface BattleAnalysis {
  summary: string;
  keyMoments: string[];
  whatWentWrong: string[];
  whatWentRight: string[];
  improvementTips: string[];
  brawlerRating: number;
  mvpAnalysis: string;
}

export interface CounterPick {
  enemy: string;
  counters: { name: string; reason: string; effectiveness: number }[];
  avoid: string[];
  tips: string[];
}

export interface MetaReport {
  topBrawlers: { name: string; winRate: string; pickRate: string; tier: string }[];
  bestComps: { name: string; brawlers: string[]; mode: string; winRate: string }[];
  bans: string[];
  trends: string[];
  patchImpact: string;
}

export interface MilestoneChecklist {
  category: string;
  items: { name: string; target: number; current: number; unit: string; completed: boolean }[];
}

export type TabId = 
  | 'dashboard' | 'brawlers' | 'events' | 'rankings' | 'club'
  | 'coach' | 'draft' | 'advisor' | 'analysis' | 'battles' | 'push' | 'meta' | 'counters'
  | 'progression' | 'f2p' | 'calculator' | 'goals' | 'milestones'
  | 'content' | 'titles' | 'schedule' | 'script' | 'recording' | 'trends';
