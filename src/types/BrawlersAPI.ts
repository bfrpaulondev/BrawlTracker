/**
 * Type definitions for Brawl Stars Brawlers API
 */

export interface BrawlersResponse {
  items: BrawlerInfo[];
  paging?: {
    cursors: {
      after?: string;
      before?: string;
    };
  };
}

export interface BrawlerInfo {
  id: number;
  name: string;
  link: string;
  imageUrl: string;
  imageUrl2: string;
  starPowers: BrawlerAbility[];
  gadgets: BrawlerAbility[];
  gears: BrawlerGear[];
  stats: BrawlerStat[];
  rarity: BrawlerRarity;
  class: BrawlerClass;
  description?: string;
}

export interface BrawlerAbility {
  id: number;
  name: string;
  imageUrl: string;
  description?: string;
}

export interface BrawlerGear {
  id: number;
  name: string;
  imageUrl: string;
  description?: string;
  level?: number;
}

export interface BrawlerStat {
  name: string;
  value: number;
  powerValue: number;
  imageUrl?: string;
}

export interface BrawlerRarity {
  id: number;
  name: string;
  color: string;
}

export interface BrawlerClass {
  id: number;
  name: string;
}

// Rarity tiers ordered from most common to rarest
export const RARITY_ORDER: Record<string, number> = {
  'Trophy Road': 0,
  'Starter': 1,
  'Rare': 2,
  'Super Rare': 3,
  'Epic': 4,
  'Mythic': 5,
  'Legendary': 6,
  'Chromatic': 7,
};

// Rarity colors
export const RARITY_COLORS: Record<string, string> = {
  'Trophy Road': '#6b7280',
  'Starter': '#10b981',
  'Rare': '#22c55e',
  'Super Rare': '#3b82f6',
  'Epic': '#a855f7',
  'Mythic': '#f59e0b',
  'Legendary': '#fcd34d',
  'Chromatic': '#ec4899',
};

// Class icons for display
export const CLASS_ICONS: Record<string, string> = {
  'Tank': '🛡️',
  'Assassin': '🗡️',
  'Support': '💚',
  'Controller': '🎯',
  'Marksman': '🎯',
  'Thrower': '💣',
  'Hybrid': '⚡',
  'Fighter': '👊',
  'DPS': '💥',
};

// Brawler meta tiers
export type Tier = 'S' | 'A' | 'B' | 'C' | 'D';

export interface BrawlerMeta {
  name: string;
  tier: Tier;
  bestModes: string[];
  bestMaps: string[];
  tips: string[];
  counters: string[];
  synergies: string[];
}
