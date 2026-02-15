/**
 * Type definitions for Brawl Stars Events API
 */

export interface EventRotation {
  active: Event[];
  upcoming: Event[];
}

export interface Event {
  id: number;
  map: EventMap;
  mode: EventMode;
  startTime: string;
  endTime: string;
  slotId: number;
  hasPowerPlay: boolean;
}

export interface EventMap {
  id: number;
  name: string;
  gameMode: GameMode;
}

export interface GameMode {
  id: number;
  name: string;
  color: string;
}

export interface EventMode {
  id: number;
  name: string;
}

// Event mode mappings
export const EVENT_MODES: Record<string, { name: string; icon: string; color: string }> = {
  'gemGrab': { name: 'Gem Grab', icon: '💎', color: '#8b5cf6' },
  'brawlBall': { name: 'Brawl Ball', icon: '⚽', color: '#22c55e' },
  'bounty': { name: 'Bounty', icon: '🎯', color: '#f59e0b' },
  'heist': { name: 'Heist', icon: '💰', color: '#ef4444' },
  'hotZone': { name: 'Hot Zone', icon: '🔥', color: '#f97316' },
  'knockout': { name: 'Knockout', icon: '💀', color: '#dc2626' },
  'wipeout': { name: 'Wipeout', icon: '⚔️', color: '#7c3aed' },
  'showdown': { name: 'Showdown', icon: '🏆', color: '#eab308' },
  'duoShowdown': { name: 'Duo Showdown', icon: '👥', color: '#f59e0b' },
  'soloShowdown': { name: 'Solo Showdown', icon: '🧍', color: '#eab308' },
};

export interface EventSlot {
  id: number;
  name: string;
  type: 'rotating' | 'powerPlay' | 'special';
}
