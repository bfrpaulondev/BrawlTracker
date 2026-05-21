import { BRAWL_API_KEY, APP_CONFIG } from '@/lib/config';

async function fetchBrawlAPI(endpoint: string) {
  const url = APP_CONFIG.apiBaseUrl + endpoint;
  const res = await fetch(url, {
    headers: { 'Authorization': 'Bearer ' + BRAWL_API_KEY, 'Accept': 'application/json' },
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error('Brawl API error ' + res.status + ': ' + text);
  }
  return res.json();
}

export async function getPlayer(tag: string) {
  const encoded = encodeURIComponent(tag);
  return fetchBrawlAPI('/players/' + encoded);
}

export async function getBattleLog(tag: string) {
  const encoded = encodeURIComponent(tag);
  return fetchBrawlAPI('/players/' + encoded + '/battlelog');
}

export async function getBrawlers() {
  return fetchBrawlAPI('/brawlers');
}

export async function getEvents() {
  return fetchBrawlAPI('/events/rotation');
}

export async function getRankings(countryCode: string, type: 'players' | 'clubs', limit = 50) {
  return fetchBrawlAPI('/rankings/' + countryCode + '/' + type + '?limit=' + limit);
}

export async function getBrawlerRankings(countryCode: string, brawlerId: number, limit = 50) {
  return fetchBrawlAPI('/rankings/' + countryCode + '/brawlers/' + brawlerId + '?limit=' + limit);
}

export async function getClub(tag: string) {
  const encoded = encodeURIComponent(tag);
  return fetchBrawlAPI('/clubs/' + encoded);
}
