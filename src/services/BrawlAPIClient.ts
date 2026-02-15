/**
 * Brawl Stars API Client - Using Local API Routes
 * Avoids CORS issues by proxying through Next.js API routes
 * @author Bruno Paulon
 */

import {
  Player,
  BattleLogResponse,
  Brawler,
  BrawlersResponse,
  Club,
  ClubMembersResponse,
  RankingPlayer,
  RankingClub,
  BrawlerRankingPlayer,
  RankingsResponse,
  Event,
  EventsResponse,
} from '@/types';

// ============ ERROR HANDLING ============
export class BrawlAPIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint: string,
    public details?: string
  ) {
    super(message);
    this.name = 'BrawlAPIError';
  }
}

// ============ PLAYERS ============

/**
 * Get player data (player + battle log)
 */
export async function getPlayer(tag: string, _apiKey: string): Promise<Player> {
  const response = await fetch(`/api/player?tag=${encodeURIComponent(tag)}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new BrawlAPIError(error.error || 'Failed to fetch player', response.status, '/api/player');
  }
  
  const data = await response.json();
  return data.player;
}

export async function getBattleLog(tag: string, _apiKey: string): Promise<BattleLogResponse> {
  const response = await fetch(`/api/player?tag=${encodeURIComponent(tag)}`);
  
  if (!response.ok) {
    return { items: [] };
  }
  
  const data = await response.json();
  return data.battleLog || { items: [] };
}

// ============ BRAWLERS ============

export async function getBrawlers(_apiKey: string): Promise<BrawlersResponse> {
  const response = await fetch('/api/brawlers');
  
  if (!response.ok) {
    const error = await response.json();
    throw new BrawlAPIError(error.error || 'Failed to fetch brawlers', response.status, '/api/brawlers');
  }
  
  return response.json();
}

export async function getBrawler(brawlerId: number, _apiKey: string): Promise<Brawler> {
  // For individual brawler, we'll filter from the full list
  const response = await fetch('/api/brawlers');
  const data = await response.json();
  const brawler = data.items?.find((b: Brawler) => b.id === brawlerId);
  
  if (!brawler) {
    throw new BrawlAPIError('Brawler not found', 404, '/api/brawlers');
  }
  
  return brawler;
}

// ============ CLUBS ============

export async function getClub(tag: string, _apiKey: string): Promise<Club> {
  const response = await fetch(`/api/club?tag=${encodeURIComponent(tag)}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new BrawlAPIError(error.error || 'Failed to fetch club', response.status, '/api/club');
  }
  
  return response.json();
}

export async function getClubMembers(tag: string, _apiKey: string): Promise<ClubMembersResponse> {
  const response = await fetch(`/api/club?tag=${encodeURIComponent(tag)}&members=true`);
  
  if (!response.ok) {
    return { items: [] };
  }
  
  return response.json();
}

// ============ RANKINGS ============

export async function getPlayerRankings(
  countryCode: string,
  _apiKey: string,
  limit?: number
): Promise<RankingsResponse<RankingPlayer>> {
  const url = `/api/rankings?region=${countryCode}&type=players&limit=${limit || 50}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new BrawlAPIError(error.error || 'Failed to fetch rankings', response.status, '/api/rankings');
  }
  
  return response.json();
}

export async function getClubRankings(
  countryCode: string,
  _apiKey: string,
  limit?: number
): Promise<RankingsResponse<RankingClub>> {
  const url = `/api/rankings?region=${countryCode}&type=clubs&limit=${limit || 50}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new BrawlAPIError(error.error || 'Failed to fetch club rankings', response.status, '/api/rankings');
  }
  
  return response.json();
}

export async function getBrawlerRankings(
  countryCode: string,
  brawlerId: number,
  _apiKey: string,
  limit?: number
): Promise<RankingsResponse<BrawlerRankingPlayer>> {
  const url = `/api/rankings?region=${countryCode}&type=brawlers&brawlerId=${brawlerId}&limit=${limit || 50}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new BrawlAPIError(error.error || 'Failed to fetch brawler rankings', response.status, '/api/rankings');
  }
  
  return response.json();
}

// ============ EVENTS ============

export async function getEvents(_apiKey: string): Promise<EventsResponse> {
  const response = await fetch('/api/events');
  
  if (!response.ok) {
    return { items: [] };
  }
  
  const data = await response.json();
  
  // API returns array directly, wrap it in items
  if (Array.isArray(data)) {
    return { items: data };
  }
  
  return data;
}

// ============ COMBINED DATA ============

export async function getFullPlayerData(tag: string, apiKey: string): Promise<{
  player: Player;
  battleLog: BattleLogResponse;
}> {
  const response = await fetch(`/api/player?tag=${encodeURIComponent(tag)}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new BrawlAPIError(error.error || 'Failed to fetch player data', response.status, '/api/player');
  }
  
  const data = await response.json();
  return {
    player: data.player,
    battleLog: data.battleLog || { items: [] },
  };
}

export async function getGameData(apiKey: string): Promise<{
  brawlers: BrawlersResponse;
  events: EventsResponse;
}> {
  const [brawlers, events] = await Promise.all([
    getBrawlers(apiKey),
    getEvents(apiKey),
  ]);

  return { brawlers, events };
}
