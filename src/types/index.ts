/**
 * Brawl Stars API Types - Complete
 * @author Bruno Paulon
 */

// ============ PLAYER ============
export interface Player {
  tag: string;
  name: string;
  nameColor: string;
  icon: Icon;
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
  club?: ClubMember;
  brawlers: PlayerBrawler[];
}

export interface PlayerBrawler {
  id: number;
  name: string;
  power: number;
  rank: number;
  trophies: number;
  highestTrophies: number;
  starPowers: StarPower[];
  gadgets: Gadget[];
  gears: Gear[];
}

export interface StarPower {
  id: number;
  name: string;
}

export interface Gadget {
  id: number;
  name: string;
}

export interface Gear {
  id: number;
  name: string;
  level: number;
}

export interface Icon {
  id: number;
}

// ============ BATTLE LOG ============
export interface BattleLogResponse {
  items: BattleLogItem[];
  paging: Paging;
}

export interface BattleLogItem {
  battleTime: string;
  event: BattleEvent;
  battle: Battle;
}

export interface BattleEvent {
  id: number;
  mode: string;
  map: string;
}

export interface Battle {
  mode: string;
  type: string;
  result?: 'victory' | 'defeat' | 'draw';
  duration?: number;
  trophyChange?: number;
  rank?: number;
  teams?: BattleTeam[];
  players?: BattlePlayer[];
  bigBrawler?: BattlePlayer;
}

export interface BattleTeam {
  players: BattlePlayer[];
}

export interface BattlePlayer {
  tag: string;
  name: string;
  brawler: BattleBrawler;
}

export interface BattleBrawler {
  id: number;
  name: string;
  power: number;
  trophies: number;
}

export interface Paging {
  cursors: {
    before: string;
    after: string;
  };
}

// ============ BRAWLERS ============
export interface Brawler {
  id: number;
  name: string;
  starPowers: BrawlerStarPower[];
  gadgets: BrawlerGadget[];
  gears: BrawlerGear[];
  class: BrawlerClass;
  rarity: BrawlerRarity;
  description: string;
  imageUrl: string;
  avatarUrl?: string;
}

export interface BrawlerStarPower {
  id: number;
  name: string;
  description?: string;
}

export interface BrawlerGadget {
  id: number;
  name: string;
  description?: string;
}

export interface BrawlerGear {
  id: number;
  name: string;
  description?: string;
}

export interface BrawlerClass {
  id: number;
  name: string;
}

export interface BrawlerRarity {
  id: number;
  name: string;
  color: string;
}

export interface BrawlersResponse {
  items: Brawler[];
  paging?: Paging;
}

// ============ CLUB ============
export interface Club {
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
  icon: Icon;
}

export interface ClubMembersResponse {
  items: ClubMember[];
  paging: Paging;
}

// ============ RANKINGS ============
export interface RankingPlayer {
  tag: string;
  name: string;
  nameColor: string;
  icon: Icon;
  trophies: number;
  rank: number;
  club?: {
    name: string;
    tag: string;
  };
}

export interface RankingClub {
  tag: string;
  name: string;
  badgeId: number;
  trophies: number;
  rank: number;
  memberCount: number;
}

export interface BrawlerRankingPlayer extends RankingPlayer {
  brawler: {
    id: number;
    name: string;
    power: number;
    trophies: number;
  };
}

export interface RankingsResponse<T> {
  items: T[];
  paging?: Paging;
}

// ============ EVENTS ============
export interface Event {
  startTime: string;
  endTime: string;
  slotId: number;
  event: EventDetails;
}

export interface EventDetails {
  id: number;
  mode: string;
  map: string;
}

export interface EventsResponse {
  items: Event[];
}

// ============ APP TYPES ============
export interface PlayerStats {
  totalVictories: number;
  winRate: number;
  averageTrophiesPerBrawler: number;
  brawlersMaxed: number;
  brawlersAt1000: number;
  brawlersAt500: number;
  totalBrawlers: number;
  progressToGoal: number;
}

export interface BrawlerMeta {
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  bestModes: string[];
  bestMaps: string[];
  tips: string[];
}

export interface DailyRecommendation {
  brawler: string;
  brawlerId: number;
  mode: string;
  map: string;
  reason: string;
  estimatedTrophies: number;
  priority: 'high' | 'medium' | 'low';
}

export interface AnalysisResult {
  overallProgress: {
    trophyProgress: number;
    brawlerProgress: number;
    resourceEfficiency: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: Recommendation[];
  brawlerAnalysis: BrawlerAnalysisResult[];
  metaInsights: string[];
  dailyPlan: DailyRecommendation[];
}

export interface Recommendation {
  type: 'trophy' | 'brawler' | 'resource' | 'strategy' | 'mode';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionable: string;
  estimatedImpact: string;
}

export interface BrawlerAnalysisResult {
  id: number;
  name: string;
  trophies: number;
  highestTrophies: number;
  power: number;
  rank: number;
  targetProgress: number;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  bestModes: string[];
  bestMaps: string[];
  tips: string[];
  priority: 'focus' | 'maintain' | 'improve';
}
