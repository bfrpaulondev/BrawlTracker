/**
 * API Route: Player Analysis
 * POST /api/analyze
 * Provides algorithm-based player analysis and recommendations
 */

import { NextRequest, NextResponse } from 'next/server';
import { Player } from '@/types/Player';

interface BattleItem {
  battle: {
    mode: string;
    result: string;
    trophyChange?: number;
    teams?: Array<Array<{ tag: string }>>;
    players?: Array<{ tag: string }>;
  };
  event?: {
    map: string;
    mode: string;
  };
  brawler?: {
    name: string;
  };
}

// Meta tier data for recommendations
const TIER_DATA: Record<string, { tier: string; bestModes: string[]; tips: string[] }> = {
  'Edgar': { tier: 'S', bestModes: ['Showdown', 'Brawl Ball'], tips: ['Use super aggressively', 'Jump over walls for surprise attacks'] },
  'Draco': { tier: 'S', bestModes: ['Gem Grab', 'Hot Zone'], tips: ['Control mid with super', 'Pressure enemies constantly'] },
  'Kenji': { tier: 'S', bestModes: ['Knockout', 'Bounty'], tips: ['Use dash to dodge', 'Chain supers for eliminations'] },
  'Melodie': { tier: 'S', bestModes: ['Showdown', 'Gem Grab'], tips: ['Keep distance with speed', 'Use notes for area control'] },
  'Kit': { tier: 'S', bestModes: ['Hot Zone', 'Gem Grab'], tips: ['Chain attacks for pressure', 'Use super for zone control'] },
  'Willow': { tier: 'S', bestModes: ['Brawl Ball', 'Gem Grab'], tips: ['Control enemies with super', 'Chip damage from distance'] },
  'Berry': { tier: 'S', bestModes: ['Hot Zone', 'Knockout'], tips: ['Use puddles for area denial', 'Stay behind teammates'] },
  'Clancy': { tier: 'S', bestModes: ['Heist', 'Gem Grab'], tips: ['Build rage early', 'Use super for crowd control'] },
  'Draco': { tier: 'A', bestModes: ['Gem Grab', 'Brawl Ball'], tips: ['Use shield strategically', 'Tank damage for team'] },
};

const MODE_MAP_RECOMMENDATIONS = [
  { mode: 'Gem Grab', map: 'Hard Rock Mine', brawlers: ['Pam', 'Gene', 'Sprout', 'Tick'] },
  { mode: 'Brawl Ball', map: 'Super Stadium', brawlers: ['El Primo', 'Frank', 'Bibi', 'Edgar'] },
  { mode: 'Showdown', map: 'Stormy Plains', brawlers: ['Leon', 'Edgar', 'El Primo', 'Bull'] },
  { mode: 'Heist', map: 'Safe Zone', brawlers: ['Colt', 'Brock', 'Bull', 'El Primo'] },
  { mode: 'Hot Zone', map: 'Kaboom Canyon', brawlers: ['Gene', 'Tick', 'Sprout', 'Pam'] },
  { mode: 'Knockout', map: 'Goldarm Gulch', brawlers: ['Piper', 'Belle', 'Nani', 'Angelo'] },
  { mode: 'Bounty', map: 'Canal Grande', brawlers: ['Piper', 'Nani', 'Belle', 'Mandy'] },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { player, battleLog } = body as { player: Player; battleLog: BattleItem[] };
    
    if (!player) {
      return NextResponse.json(
        { error: 'Player data is required' },
        { status: 400 }
      );
    }
    
    // Calculate comprehensive stats
    const totalBrawlers = player.brawlers?.length || 0;
    const brawlersAt1000 = player.brawlers?.filter(b => b.trophies >= 1000).length || 0;
    const brawlersAt500 = player.brawlers?.filter(b => b.trophies >= 500).length || 0;
    const brawlersAt300 = player.brawlers?.filter(b => b.trophies >= 300).length || 0;
    const maxPowerBrawlers = player.brawlers?.filter(b => b.power >= 11).length || 0;
    const maxPowerBrawlersWithGear = player.brawlers?.filter(b => b.gears && b.gears.length > 0).length || 0;
    
    // Calculate win rate and performance metrics from battle log
    let totalBattles = 0;
    let wins = 0;
    let losses = 0;
    let draws = 0;
    let totalTrophyChange = 0;
    const modePerformance: Record<string, { wins: number; losses: number; total: number }> = {};
    const brawlerPerformance: Record<string, { wins: number; losses: number; total: number; trophyChange: number }> = {};
    const recentBrawlers: string[] = [];
    
    if (battleLog && battleLog.length > 0) {
      battleLog.forEach((battle: BattleItem) => {
        if (battle.battle?.result) {
          totalBattles++;
          const mode = battle.event?.mode || battle.battle.mode || 'Unknown';
          const brawler = battle.brawler?.name || 'Unknown';
          
          // Track mode performance
          if (!modePerformance[mode]) {
            modePerformance[mode] = { wins: 0, losses: 0, total: 0 };
          }
          modePerformance[mode].total++;
          
          // Track brawler performance
          if (!brawlerPerformance[brawler]) {
            brawlerPerformance[brawler] = { wins: 0, losses: 0, total: 0, trophyChange: 0 };
          }
          brawlerPerformance[brawler].total++;
          
          if (battle.battle.trophyChange) {
            totalTrophyChange += battle.battle.trophyChange;
            brawlerPerformance[brawler].trophyChange += battle.battle.trophyChange;
          }
          
          if (battle.battle.result === 'victory') {
            wins++;
            modePerformance[mode].wins++;
            brawlerPerformance[brawler].wins++;
          } else if (battle.battle.result === 'defeat') {
            losses++;
            modePerformance[mode].losses++;
            brawlerPerformance[brawler].losses++;
          } else {
            draws++;
          }
          
          if (!recentBrawlers.includes(brawler) && brawler !== 'Unknown') {
            recentBrawlers.push(brawler);
          }
        }
      });
    }
    
    const winRate = totalBattles > 0 ? Math.round((wins / totalBattles) * 100) : 50;
    
    // Calculate consistency score
    const consistencyScore = calculateConsistencyScore(winRate, totalBattles, player.trophies);
    
    // Calculate true skill rating
    const trueSkillRating = calculateTrueSkill(player, winRate, consistencyScore);
    
    // Analyze top brawlers
    const topBrawlers = [...(player.brawlers || [])]
      .sort((a, b) => b.trophies - a.trophies)
      .slice(0, 5);
    
    // Find brawlers close to 1000 trophies
    const brawlersNear1000 = player.brawlers
      ?.filter(b => b.trophies >= 700 && b.trophies < 1000)
      .sort((a, b) => b.trophies - a.trophies) || [];
    
    // Find best performing brawlers from recent battles
    const bestPerformingBrawlers = Object.entries(brawlerPerformance)
      .filter(([_, stats]) => stats.total >= 3)
      .sort((a, b) => {
        const aWR = a[1].wins / a[1].total;
        const bWR = b[1].wins / b[1].total;
        return bWR - aWR;
      })
      .slice(0, 3)
      .map(([name]) => name);
    
    // Find weakest brawlers (high trophies but low power)
    const weakBrawlers = player.brawlers
      ?.filter(b => b.trophies >= 500 && b.power < 9)
      .sort((a, b) => b.trophies - a.trophies)
      .slice(0, 3) || [];
    
    // Generate strengths
    const strengths = generateStrengths(player, {
      totalBrawlers,
      brawlersAt1000,
      brawlersAt500,
      maxPowerBrawlers,
      winRate,
      consistencyScore
    });
    
    // Generate weaknesses
    const weaknesses = generateWeaknesses(player, {
      totalBrawlers,
      brawlersAt1000,
      brawlersAt500,
      maxPowerBrawlers,
      winRate,
      weakBrawlers
    });
    
    // Generate recommendations
    const recommendations = generateRecommendations(player, {
      brawlersNear1000,
      bestPerformingBrawlers,
      weakBrawlers,
      winRate,
      modePerformance,
      totalBattles,
      maxPowerBrawlers
    });
    
    // Generate daily plan
    const dailyPlan = generateDailyPlan(player, topBrawlers, brawlersNear1000, MODE_MAP_RECOMMENDATIONS);
    
    // Generate meta insights
    const metaInsights = generateMetaInsights(player, TIER_DATA);
    
    // Estimate time to goal
    const estimatedTimeToGoal = estimateTimeToGoal(player.trophies, brawlersAt1000);
    
    const analysis = {
      summary: generateSummary(player, winRate, brawlersAt1000, trueSkillRating),
      strengths,
      weaknesses,
      recommendations,
      dailyPlan,
      metaInsights,
      estimatedTimeToGoal,
      stats: {
        totalBrawlers,
        brawlersAt1000,
        brawlersAt500,
        brawlersAt300,
        maxPowerBrawlers,
        maxPowerBrawlersWithGear,
        winRate,
        consistencyScore,
        trueSkillRating,
        trophyProgress: Math.round((player.trophies / 100000) * 100),
        brawlerProgress: totalBrawlers > 0 ? Math.round((brawlersAt1000 / totalBrawlers) * 100) : 0,
        recentWinRate: winRate,
        totalRecentBattles: totalBattles
      }
    };
    
    return NextResponse.json({
      success: true,
      data: analysis
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze player data' },
      { status: 500 }
    );
  }
}

function calculateConsistencyScore(winRate: number, totalBattles: number, trophies: number): number {
  // Based on how close win rate is to 50% (stable) vs volatile
  const stabilityScore = 100 - Math.abs(50 - Math.min(70, Math.max(30, winRate)));
  // Factor in number of battles for reliability
  const reliabilityScore = Math.min(100, totalBattles * 3);
  // Factor in trophy count for experience
  const experienceScore = Math.min(100, trophies / 1000);
  
  return Math.round((stabilityScore * 0.4 + reliabilityScore * 0.3 + experienceScore * 0.3));
}

function calculateTrueSkill(player: Player, winRate: number, consistencyScore: number): number {
  const trophyScore = player.trophies / 100;
  const brawlerScore = player.brawlers ? player.brawlers.filter(b => b.trophies >= 500).length * 5 : 0;
  const winRateScore = (winRate - 30) * 2;
  const consistencyBonus = consistencyScore * 0.5;
  
  return Math.round(trophyScore + brawlerScore + winRateScore + consistencyBonus);
}

function generateStrengths(
  player: Player,
  stats: { totalBrawlers: number; brawlersAt1000: number; brawlersAt500: number; maxPowerBrawlers: number; winRate: number; consistencyScore: number }
): string[] {
  const strengths: string[] = [];
  
  if (stats.brawlersAt1000 >= 10) {
    strengths.push(`Excellent brawler mastery with ${stats.brawlersAt1000} brawlers at 1000+ trophies`);
  } else if (stats.brawlersAt500 >= 20) {
    strengths.push(`Strong brawler diversity with ${stats.brawlersAt500} brawlers at 500+ trophies`);
  }
  
  if (stats.winRate >= 55) {
    strengths.push('Above average win rate indicates good game sense');
  }
  
  if (stats.consistencyScore >= 70) {
    strengths.push('High consistency score shows reliable performance');
  }
  
  if (player.highestTrophies && player.trophies >= player.highestTrophies * 0.95) {
    strengths.push('Currently near or at peak trophy count');
  }
  
  if (stats.maxPowerBrawlers >= 15) {
    strengths.push(`Well-developed roster with ${stats.maxPowerBrawlers} max power brawlers`);
  }
  
  if (player['3vs3Victories'] && player['3vs3Victories'] > 5000) {
    strengths.push('Extensive 3v3 experience demonstrates team play skills');
  }
  
  if (player.soloVictories && player.soloVictories > 500) {
    strengths.push('Strong solo showdown skills with excellent survival instincts');
  }
  
  if (strengths.length < 3) {
    strengths.push('Active player with potential for growth');
  }
  
  return strengths.slice(0, 5);
}

function generateWeaknesses(
  player: Player,
  stats: { totalBrawlers: number; brawlersAt1000: number; brawlersAt500: number; maxPowerBrawlers: number; winRate: number; weakBrawlers: typeof player.brawlers }
): string[] {
  const weaknesses: string[] = [];
  
  if (stats.winRate < 45) {
    weaknesses.push('Win rate below average - focus on improving positioning and timing');
  }
  
  if (stats.brawlersAt1000 < 5 && player.trophies > 50000) {
    weaknesses.push('Focus on pushing more brawlers to 1000 for consistent progress');
  }
  
  if (stats.weakBrawlers && stats.weakBrawlers.length > 0) {
    weaknesses.push(`${stats.weakBrawlers[0]?.name || 'Some brawlers'} have high trophies but low power - upgrade priority`);
  }
  
  if (!player.club?.name) {
    weaknesses.push('Not in a club - consider joining one for team events and tips');
  }
  
  if (stats.maxPowerBrawlers < 10) {
    weaknesses.push('Need more max power brawlers for competitive play');
  }
  
  if (player.highestTrophies && player.trophies < player.highestTrophies * 0.85) {
    weaknesses.push('Currently below peak - consider taking breaks during tilt');
  }
  
  return weaknesses.slice(0, 4);
}

function generateRecommendations(
  player: Player,
  data: {
    brawlersNear1000: typeof player.brawlers;
    bestPerformingBrawlers: string[];
    weakBrawlers: typeof player.brawlers;
    winRate: number;
    modePerformance: Record<string, { wins: number; losses: number; total: number }>;
    totalBattles: number;
    maxPowerBrawlers: number;
  }
): Array<{ title: string; description: string; action: string; priority: string }> {
  const recommendations: Array<{ title: string; description: string; action: string; priority: string }> = [];
  
  // Priority 1: Push brawlers close to 1000
  if (data.brawlersNear1000.length > 0) {
    const brawler = data.brawlersNear1000[0];
    recommendations.push({
      title: `Push ${brawler?.name || 'brawler'} to 1000`,
      description: `You're ${1000 - (brawler?.trophies || 0)} trophies away from another 1k brawler`,
      action: `Play ${brawler?.name || 'this brawler'} in your best modes today`,
      priority: 'high'
    });
  }
  
  // Priority 2: Use best performing brawlers
  if (data.bestPerformingBrawlers.length > 0) {
    recommendations.push({
      title: 'Ride your hot streak',
      description: `${data.bestPerformingBrawlers[0]} has been performing well recently`,
      action: `Continue using ${data.bestPerformingBrawlers[0]} for consistent wins`,
      priority: 'high'
    });
  }
  
  // Priority 3: Upgrade weak brawlers
  if (data.weakBrawlers.length > 0) {
    const brawler = data.weakBrawlers[0];
    recommendations.push({
      title: `Upgrade ${brawler?.name || 'underpowered brawler'}`,
      description: `Currently at power ${brawler?.power || 1} with ${brawler?.trophies || 0} trophies`,
      action: 'Use coins to upgrade for better performance',
      priority: 'medium'
    });
  }
  
  // Priority 4: Mode-specific advice
  const worstMode = Object.entries(data.modePerformance)
    .filter(([_, stats]) => stats.total >= 3)
    .sort((a, b) => (a[1].wins / a[1].total) - (b[1].wins / b[1].total))[0];
  
  if (worstMode && (worstMode[1].wins / worstMode[1].total) < 0.4) {
    recommendations.push({
      title: `Improve in ${worstMode[0]}`,
      description: `Current win rate: ${Math.round((worstMode[1].wins / worstMode[1].total) * 100)}% in this mode`,
      action: 'Watch replays and try different brawlers for this mode',
      priority: 'medium'
    });
  }
  
  // Priority 5: General progress
  if (data.maxPowerBrawlers < 20) {
    recommendations.push({
      title: 'Continue upgrading brawlers',
      description: 'Max power brawlers are essential for ranked and competitive play',
      action: 'Save coins for power points and upgrade priority brawlers',
      priority: 'low'
    });
  }
  
  return recommendations.slice(0, 5);
}

function generateDailyPlan(
  player: Player,
  topBrawlers: typeof player.brawlers,
  brawlersNear1000: typeof player.brawlers,
  modeMapRecs: typeof MODE_MAP_RECOMMENDATIONS
): Array<{ brawler: string; mode: string; reason: string }> {
  const plan: Array<{ brawler: string; mode: string; reason: string }> = [];
  
  // First: Push brawler close to 1000
  if (brawlersNear1000.length > 0) {
    const brawler = brawlersNear1000[0];
    const tierInfo = TIER_DATA[brawler?.name || ''];
    const bestMode = tierInfo?.bestModes[0] || 'Showdown';
    
    plan.push({
      brawler: brawler?.name || 'Unknown',
      mode: bestMode,
      reason: `${brawler?.trophies || 0} trophies - close to 1000! ${tierInfo?.tips[0] || 'Focus on wins'}`
    });
  }
  
  // Second: Use top brawler
  if (topBrawlers.length > 0) {
    const brawler = topBrawlers[0];
    const tierInfo = TIER_DATA[brawler?.name || ''];
    const bestMode = tierInfo?.bestModes[0] || 'Gem Grab';
    
    plan.push({
      brawler: brawler?.name || 'Unknown',
      mode: bestMode,
      reason: `Your strongest brawler at ${brawler?.trophies || 0} trophies. Great for maintaining rank.`
    });
  }
  
  // Third: Current event recommendation
  const currentEvent = modeMapRecs[Math.floor(Math.random() * modeMapRecs.length)];
  const recBrawler = currentEvent.brawlers[Math.floor(Math.random() * currentEvent.brawlers.length)];
  
  plan.push({
    brawler: recBrawler,
    mode: currentEvent.mode,
    reason: `Strong pick for ${currentEvent.map}. Meta recommendation.`
  });
  
  return plan.slice(0, 3);
}

function generateMetaInsights(player: Player, tierData: typeof TIER_DATA): string[] {
  const insights: string[] = [];
  
  // Check player's brawlers against meta
  const playerBrawlerNames = player.brawlers?.map(b => b.name) || [];
  const metaBrawlers = Object.keys(tierData).filter(name => tierData[name]?.tier === 'S');
  const ownedMeta = playerBrawlerNames.filter(name => metaBrawlers.includes(name));
  
  if (ownedMeta.length >= 3) {
    insights.push(`You have ${ownedMeta.length} meta-defining brawlers: ${ownedMeta.slice(0, 3).join(', ')}`);
  } else {
    insights.push('Consider investing in meta brawlers for easier ranked progression');
  }
  
  insights.push('Current meta favors assassins and throwers - adjust your playstyle accordingly');
  insights.push('Hot Zone and Gem Grab are high-impact modes for trophy pushing');
  
  // Mode-specific insights
  insights.push('Knockout and Bounty maps favor long-range brawlers this rotation');
  
  return insights;
}

function estimateTimeToGoal(currentTrophies: number, brawlersAt1000: number): string {
  const remaining = 100000 - currentTrophies;
  const averageGainPerDay = 50 + (brawlersAt1000 * 5); // More 1k brawlers = faster progress
  
  const daysNeeded = Math.ceil(remaining / averageGainPerDay);
  
  if (daysNeeded < 30) {
    return `Less than a month! Keep up the great pace`;
  } else if (daysNeeded < 90) {
    return `Approximately ${Math.round(daysNeeded / 30)} months with consistent play`;
  } else if (daysNeeded < 365) {
    return `Around ${Math.round(daysNeeded / 30)} months - focus on brawler diversity`;
  } else {
    return `${Math.round(daysNeeded / 365)} year+ - focus on upgrading and mastering brawlers`;
  }
}

function generateSummary(player: Player, winRate: number, brawlersAt1000: number, trueSkill: number): string {
  const level = trueSkill >= 800 ? 'elite' : trueSkill >= 600 ? 'advanced' : trueSkill >= 400 ? 'intermediate' : 'developing';
  const trend = winRate >= 55 ? 'improving' : winRate >= 45 ? 'stable' : 'struggling';
  
  return `${player.name} is a ${level} player with ${player.trophies.toLocaleString()} trophies and ${brawlersAt1000} brawlers at 1000+. Recent win rate of ${winRate}% shows ${trend} performance. True Skill Rating: ${trueSkill}.`;
}
