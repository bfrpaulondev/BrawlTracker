/**
 * Server Actions for BrawlTracker PRO
 * Handles API calls and AI analysis
 */

'use server';

import { getPlayer, getBattleLog } from '@/services/BrawlAPIClient';
import { analyzePlayer, PlayerAnalysis } from '@/services/AIService';

export interface FullPlayerData {
  player: {
    tag: string;
    name: string;
    trophies: number;
    highestTrophies: number;
    expLevel: number;
    victories: { total: number; trio: number; solo: number; duo: number };
    club?: { name: string; tag: string };
    brawlers: Array<{
      name: string;
      power: number;
      rank: number;
      trophies: number;
      highestTrophies: number;
    }>;
  };
  battles: Array<{
    id: string;
    time: Date;
    mode: string;
    map: string;
    result: 'victory' | 'defeat' | 'draw' | 'unknown';
    trophyChange: number;
    brawler: { name: string; id: number; power: number; trophies: number };
    teammates?: string[];
  }>;
  battleStats: { wins: number; losses: number; winRate: number };
  analysis?: PlayerAnalysis;
}

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Get complete player data with AI analysis
 */
export async function getFullPlayerDataWithAnalysis(
  tag: string,
  apiKey: string
): Promise<ActionResult<FullPlayerData>> {
  try {
    // Normalize tag
    let normalizedTag = tag.trim().toUpperCase();
    if (!normalizedTag.startsWith('#')) {
      normalizedTag = '#' + normalizedTag;
    }

    // Fetch player data
    const player = await getPlayer(normalizedTag, apiKey);
    
    // Fetch battle log
    const battleLog = await getBattleLog(normalizedTag, apiKey);
    
    // Process battle log
    const battles = battleLog.items.map((battle, index) => {
      let playerBrawler: any = null;
      let teammates: string[] = [];
      
      if (battle.battle.teams) {
        for (const team of battle.battle.teams) {
          const playerInTeam = team.find(p => p.tag.toUpperCase() === normalizedTag.replace('#', ''));
          if (playerInTeam) {
            playerBrawler = playerInTeam.brawler;
            teammates = team.filter(p => p.tag.toUpperCase() !== normalizedTag.replace('#', '')).map(p => p.name);
          }
        }
      }
      
      if (!playerBrawler && battle.battle.players) {
        const player = battle.battle.players.find(p => p.tag.toUpperCase() === normalizedTag.replace('#', ''));
        if (player) playerBrawler = player.brawler;
      }

      let result: 'victory' | 'defeat' | 'draw' | 'unknown' = 'unknown';
      if (battle.battle.result) result = battle.battle.result;
      else if (battle.battle.rank) result = battle.battle.rank <= 4 ? 'victory' : 'defeat';

      return {
        id: `${battle.battleTime}-${index}`,
        time: new Date(battle.battleTime.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6')),
        mode: battle.battle.mode,
        map: battle.event?.map || 'Unknown',
        result,
        trophyChange: battle.battle.trophyChange || 0,
        brawler: playerBrawler || { name: 'Unknown', id: 0, power: 0, trophies: 0 },
        teammates,
      };
    });

    // Calculate battle stats
    const wins = battles.filter(b => b.result === 'victory').length;
    const losses = battles.filter(b => b.result === 'defeat').length;
    const battleStats = {
      wins,
      losses,
      winRate: battles.length > 0 ? Math.round((wins / battles.length) * 100) : 0,
    };

    // Format player data
    const playerData = {
      tag: player.tag,
      name: player.name,
      trophies: player.trophies,
      highestTrophies: player.highestTrophies,
      expLevel: player.expLevel,
      victories: {
        total: (player as any)['3vs3Victories'] + player.soloVictories + player.duoVictories,
        trio: (player as any)['3vs3Victories'] || 0,
        solo: player.soloVictories,
        duo: player.duoVictories,
      },
      club: player.club ? { name: player.club.name, tag: player.club.tag } : undefined,
      brawlers: player.brawlers.map(b => ({
        name: b.name,
        power: b.power,
        rank: b.rank,
        trophies: b.trophies,
        highestTrophies: b.highestTrophies,
      })),
    };

    // Get AI analysis
    let analysis: PlayerAnalysis | undefined;
    try {
      analysis = await analyzePlayer({
        ...playerData,
        battleHistory: battles.slice(0, 25).map(b => ({
          mode: b.mode,
          map: b.map,
          result: b.result,
          brawler: b.brawler.name,
          trophyChange: b.trophyChange,
        })),
      });
    } catch (e) {
      console.error('AI analysis failed:', e);
    }

    return {
      success: true,
      data: {
        player: playerData,
        battles,
        battleStats,
        analysis,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch player data',
    };
  }
}
