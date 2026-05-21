import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function formatTrophies(trophies: number): string {
  return trophies.toLocaleString('pt-BR');
}

export function encodeTag(tag: string): string {
  return encodeURIComponent(tag.replace('#', '%23'));
}

export function cleanTag(tag: string): string {
  return tag.startsWith('#') ? tag : '#' + tag;
}

export function getBrawlerImageUrl(id: number): string {
  return `https://cdn.brawlstats.com/brawlers/${id}.png`;
}

export function getWinRate(victories: number, defeats: number): number {
  const total = victories + defeats;
  if (total === 0) return 0;
  return Math.round((victories / total) * 100);
}

export function getTierColor(tier: string): string {
  switch (tier) {
    case 'S': return 'from-amber-500 to-orange-600';
    case 'A': return 'from-emerald-500 to-green-600';
    case 'B': return 'from-blue-500 to-cyan-600';
    case 'C': return 'from-gray-400 to-gray-500';
    case 'D': return 'from-red-500 to-red-700';
    default: return 'from-gray-400 to-gray-500';
  }
}

export function getTierBadgeColor(tier: string): string {
  switch (tier) {
    case 'S': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'A': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'B': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'C': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    case 'D': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

export function getModeName(mode: string): string {
  const modeNames: Record<string, string> = {
    'gemGrab': 'Coleta de Gemas',
    'brawlBall': 'Brawl Ball',
    'heist': 'Assalto',
    'bounty': 'Recompensa',
    'hotZone': 'Zona Quente',
    'knockout': 'Eliminação',
    'soloShowdown': 'Showdown Solo',
    'duoShowdown': 'Showdown Dupla',
    'trioShowdown': 'Showdown Trio',
    'siege': 'Cerco',
    'bigGame': 'Caçada',
    'bossFight': 'Chefe',
    'roboRumble': 'Robo Rumble',
    'presentPlunder': 'Saque de Presentes',
    'snowdown': 'Snowdown',
    'holdTheFlag': 'Captura de Bandeira',
    'wipeout': 'Aniquilação',
    'volleyballBrawl': 'Vôlei',
    'botDrop': 'Chuva de Bots',
    'hunters': 'Caçadores',
    'lastStanding': 'Último em Pé',
    'loneStar': 'Estrela Solitária',
    'takedown': 'Derrubada',
  };
  return modeNames[mode] || mode;
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr.slice(0, 4) + '-' + dateStr.slice(4, 6) + '-' + dateStr.slice(6, 8) + 'T' + dateStr.slice(9, 11) + ':' + dateStr.slice(11, 13) + ':' + dateStr.slice(13, 15) + 'Z');
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins}min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  return `${diffDays}d atrás`;
}

export function getResultLabel(result?: string): { label: string; color: string } {
  switch (result) {
    case 'victory': return { label: 'Vitória', color: 'text-emerald-400' };
    case 'defeat': return { label: 'Derrota', color: 'text-red-400' };
    case 'draw': return { label: 'Empate', color: 'text-yellow-400' };
    default: return { label: 'N/A', color: 'text-gray-400' };
  }
}
