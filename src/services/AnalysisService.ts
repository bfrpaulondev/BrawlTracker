/**
 * Brawl Stars Analysis Service - Premium Intelligence Engine
 * @author Bruno Paulon
 */

import {
  Player,
  PlayerBrawler,
  BattleLogItem,
  Brawler,
  PlayerStats,
  AnalysisResult,
  BrawlerAnalysisResult,
  DailyRecommendation,
  Recommendation,
  BrawlerMeta,
} from '@/types';

// ============ META DATA (Current Season) ============

const BRAWLER_META: Record<string, BrawlerMeta> = {
  // S-Tier - Meta Defining
  'Kenji': { tier: 'S', bestModes: ['Gem Grab', 'Brawl Ball', 'Knockout'], bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Goldarm Gulch'], tips: ['Use super to engage and escape quickly', 'Great for flanking and eliminating priority targets', 'Keep distance from control brawlers'] },
  'Berry': { tier: 'S', bestModes: ['Hot Zone', 'Gem Grab', 'Brawl Ball'], bestMaps: ['Dueling Beetles', 'Hard Rock Mine', 'Super Stadium'], tips: ['Position well to heal allies', 'Use attack to zone areas', 'Communicate with team to maximize healing'] },
  'Draco': { tier: 'S', bestModes: ['Brawl Ball', 'Knockout', 'Showdown'], bestMaps: ['Super Stadium', 'Goldarm Gulch', 'Cavern Churn'], tips: ['Charge super before engaging', 'Great for finishing low enemies', 'Use mobility to rotate'] },
  'Clancy': { tier: 'S', bestModes: ['Gem Grab', 'Brawl Ball', 'Hot Zone'], bestMaps: ['Deep Mine', 'Super Stadium', 'Dueling Beetles'], tips: ['Use tracks to rotate quickly', 'Keep distance from assassins', 'Area control is your strength'] },
  'Melodie': { tier: 'S', bestModes: ['Showdown', 'Brawl Ball', 'Gem Grab'], bestMaps: ['Cavern Churn', 'Super Stadium', 'Hard Rock Mine'], tips: ['Use notes to gain speed', 'Kite enemies using your mobility', 'Speed stack is key'] },
  'Kaze': { tier: 'S', bestModes: ['Knockout', 'Brawl Ball', 'Showdown'], bestMaps: ['Goldarm Gulch', 'Super Stadium', 'Cavern Churn'], tips: ['Use invisibility to flank', 'Engage when enemy is isolated', 'Avoid revealing position early'] },
  
  // A-Tier - Very Strong
  'Spike': { tier: 'A', bestModes: ['Gem Grab', 'Brawl Ball', 'Showdown'], bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Cavern Churn'], tips: ['Use cactus to zone', 'Charged attack is more effective', 'Super for area control'] },
  'Crow': { tier: 'A', bestModes: ['Showdown', 'Brawl Ball', 'Gem Grab'], bestMaps: ['Cavern Churn', 'Super Stadium', 'Hard Rock Mine'], tips: ['Apply poison constantly', 'Use speed to escape', 'Redirect to allies'] },
  'Leon': { tier: 'A', bestModes: ['Showdown', 'Brawl Ball', 'Knockout'], bestMaps: ['Cavern Churn', 'Super Stadium', 'Goldarm Gulch'], tips: ['Use invisibility to flank', 'Engage when enemy is low', 'Decoy can distract'] },
  'Sandy': { tier: 'A', bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'], tips: ['Use super for vision and protection', 'Great for controlling area', 'Cooldown is fast'] },
  'Amber': { tier: 'A', bestModes: ['Hot Zone', 'Gem Grab', 'Brawl Ball'], bestMaps: ['Dueling Beetles', 'Hard Rock Mine', 'Super Stadium'], tips: ['Spread fire to zone', 'Use super on groups', 'Manage fuel'] },
  'Buzz': { tier: 'A', bestModes: ['Brawl Ball', 'Knockout', 'Gem Grab'], bestMaps: ['Super Stadium', 'Goldarm Gulch', 'Hard Rock Mine'], tips: ['Charge super quickly', 'Stun is key for kills', 'Use residence for recharge'] },
  'Fang': { tier: 'A', bestModes: ['Brawl Ball', 'Knockout', 'Showdown'], bestMaps: ['Super Stadium', 'Goldarm Gulch', 'Cavern Churn'], tips: ['Use super to finish', 'Great against low health brawlers', 'Kick combo is devastating'] },
  'Belle': { tier: 'A', bestModes: ['Bounty', 'Gem Grab', 'Knockout'], bestMaps: ['Snake Prairie', 'Hard Rock Mine', 'Goldarm Gulch'], tips: ['Mark priority targets', 'Keep maximum distance', 'Use heals to survive'] },
  'Gus': { tier: 'A', bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'], tips: ['Use shields for protection', 'Position behind team', 'Ghosts help with control'] },
  'Mico': { tier: 'A', bestModes: ['Brawl Ball', 'Knockout', 'Gem Grab'], bestMaps: ['Super Stadium', 'Goldarm Gulch', 'Hard Rock Mine'], tips: ['Use mobility to flank', 'Quick attack and retreat', 'Avoid getting trapped'] },
  'Kit': { tier: 'A', bestModes: ['Brawl Ball', 'Gem Grab', 'Hot Zone'], bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Dueling Beetles'], tips: ['Use super for CC', 'Great support for team', 'Manage resources'] },
  'Angelo': { tier: 'A', bestModes: ['Gem Grab', 'Bounty', 'Knockout'], bestMaps: ['Hard Rock Mine', 'Snake Prairie', 'Goldarm Gulch'], tips: ['Charge arrows for max damage', 'Use poison for pressure', 'Keep distance'] },
  'Cordelius': { tier: 'A', bestModes: ['Brawl Ball', 'Gem Grab', 'Knockout'], bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Goldarm Gulch'], tips: ['Use super to isolate targets', 'Excellent area control', 'Maintain constant pressure'] },
  'R-T': { tier: 'A', bestModes: ['Gem Grab', 'Hot Zone', 'Knockout'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Goldarm Gulch'], tips: ['Use markers for damage', 'Strong area control', 'Positioning is key'] },
  'Willow': { tier: 'A', bestModes: ['Gem Grab', 'Showdown', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Cavern Churn', 'Super Stadium'], tips: ['Use mind control strategically', 'Keep distance', 'Combo with super is devastating'] },
  'Dynamike': { tier: 'A', bestModes: ['Brawl Ball', 'Gem Grab', 'Hot Zone'], bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Dueling Beetles'], tips: ['Predict enemy movements', 'Super for area control', 'Use sticks for zone'] },
  'Gene': { tier: 'A', bestModes: ['Gem Grab', 'Bounty', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Snake Prairie', 'Super Stadium'], tips: ['Use hand to pull targets', 'Healing lamp helps team', 'Keep distance'] },
  'Byron': { tier: 'A', bestModes: ['Gem Grab', 'Bounty', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Snake Prairie', 'Dueling Beetles'], tips: ['Heal allies and damage enemies', 'Keep distance', 'Super for clutch'] },
  
  // B-Tier - Solid Picks
  'Shelly': { tier: 'B', bestModes: ['Brawl Ball', 'Showdown', 'Gem Grab'], bestMaps: ['Super Stadium', 'Cavern Churn', 'Hard Rock Mine'], tips: ['Use super at medium distance', 'Bush camping works well', 'Fast fingers for combo'] },
  'Colt': { tier: 'B', bestModes: ['Brawl Ball', 'Gem Grab', 'Bounty'], bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Snake Prairie'], tips: ['Predict enemy movement', 'Super to break walls', 'Keep distance'] },
  'Bull': { tier: 'B', bestModes: ['Showdown', 'Brawl Ball', 'Gem Grab'], bestMaps: ['Cavern Churn', 'Super Stadium', 'Hard Rock Mine'], tips: ['Use super to escape or engage', 'Bush camping is effective', 'Charge for burst'] },
  'Jessie': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'], tips: ['Position turret well', 'Super on groups', 'Bounce for extra damage'] },
  'Nita': { tier: 'B', bestModes: ['Gem Grab', 'Brawl Ball', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Dueling Beetles'], tips: ['Use bear to pressure', 'Keep bear alive', 'Bear with hunter'] },
  'Brock': { tier: 'B', bestModes: ['Bounty', 'Gem Grab', 'Brawl Ball'], bestMaps: ['Snake Prairie', 'Hard Rock Mine', 'Super Stadium'], tips: ['Keep distance', 'Super to break cover', 'Rocket rain for control'] },
  'Rico': { tier: 'B', bestModes: ['Brawl Ball', 'Gem Grab', 'Bounty'], bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Snake Prairie'], tips: ['Use walls to ricochet', 'Charged attacks are stronger', 'Super in corners is devastating'] },
  'Penny': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'], tips: ['Position cannon well', 'Super on groups', 'Cannon balls for zone'] },
  'Piper': { tier: 'B', bestModes: ['Bounty', 'Knockout', 'Gem Grab'], bestMaps: ['Snake Prairie', 'Goldarm Gulch', 'Hard Rock Mine'], tips: ['Keep maximum distance', 'Super to escape or finish', 'Homemaker for control'] },
  'Pam': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'], tips: ['Position healing station', 'Support your team', 'Mama bear for push'] },
  'Frank': { tier: 'B', bestModes: ['Gem Grab', 'Brawl Ball', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Dueling Beetles'], tips: ['Use stun for control', 'Watch for enemy CC', 'Super charges fast'] },
  'Bibi': { tier: 'B', bestModes: ['Brawl Ball', 'Gem Grab', 'Hot Zone'], bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Dueling Beetles'], tips: ['Use rubber ball for KB', 'Move constantly', 'Batinet for damage'] },
  'Tara': { tier: 'B', bestModes: ['Gem Grab', 'Brawl Ball', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Dueling Beetles'], tips: ['Use super to pull groups', 'Maintain constant pressure', 'Shadow void for extra damage'] },
  'Max': { tier: 'B', bestModes: ['Gem Grab', 'Brawl Ball', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Dueling Beetles'], tips: ['Use speed boosts for team', 'Stay mobile', 'Super for clutch'] },
  'Mr. P': { tier: 'B', bestModes: ['Gem Grab', 'Bounty', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Snake Prairie', 'Dueling Beetles'], tips: ['Position penguins well', 'Super for extra pressure', 'Bounce for range'] },
  'Sprout': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'], tips: ['Use wall to block', 'Area control is key', 'Photosynthesis for healing'] },
  'Lou': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'], tips: ['Use slow for control', 'Maintain constant pressure', 'Super for freeze'] },
  'Ruffs': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'], tips: ['Buff your allies', 'Use power-ups strategically', 'Air support for damage'] },
  'Griff': { tier: 'B', bestModes: ['Gem Grab', 'Brawl Ball', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Dueling Beetles'], tips: ['Use super for burst damage', 'Manage your coins', 'Keep the change for sustain'] },
  'Grom': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone', 'Knockout'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Goldarm Gulch'], tips: ['Use bombs for control', 'Keep distance', 'Super for large area'] },
  'Colette': { tier: 'B', bestModes: ['Showdown', 'Gem Grab', 'Hot Zone'], bestMaps: ['Cavern Churn', 'Hard Rock Mine', 'Dueling Beetles'], tips: ['Damage based on % health', 'Great against tanks', 'Push it for control'] },
  'Edgar': { tier: 'B', bestModes: ['Brawl Ball', 'Showdown', 'Gem Grab'], bestMaps: ['Super Stadium', 'Cavern Churn', 'Hard Rock Mine'], tips: ['Use super to engage', 'Watch for range brawlers', 'Hard landing for stun'] },
  'Stu': { tier: 'B', bestModes: ['Brawl Ball', 'Gem Grab', 'Hot Zone'], bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Dueling Beetles'], tips: ['Use dash for mobility', 'Hit super for burn', 'Zero drag for damage'] },
  'Maisie': { tier: 'B', bestModes: ['Gem Grab', 'Brawl Ball', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Dueling Beetles'], tips: ['Use super for control', 'Keep distance', 'Disengage to escape'] },
  'Pearl': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'], tips: ['Use super when charged', 'Constant area control', 'Overcooked for burst'] },
  'Charlie': { tier: 'B', bestModes: ['Gem Grab', 'Brawl Ball', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Dueling Beetles'], tips: ['Use cocoon to isolate', 'Area control', 'Spider swarm for damage'] },
  'L&L': { tier: 'B', bestModes: ['Gem Grab', 'Brawl Ball', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Dueling Beetles'], tips: ['Coordinate Larry and Lawrie', 'Use both strategically', 'Combo for burst'] },
  'Mandy': { tier: 'B', bestModes: ['Bounty', 'Gem Grab', 'Knockout'], bestMaps: ['Snake Prairie', 'Hard Rock Mine', 'Goldarm Gulch'], tips: ['Charge for max damage', 'Keep distance', 'In my sights for vision'] },
  'Maisie': { tier: 'B', bestModes: ['Gem Grab', 'Brawl Ball', 'Hot Zone'], bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Dueling Beetles'], tips: ['Use super for control', 'Keep distance', 'Disengage to escape'] },
  'Ash': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'], tips: ['Manage rage', 'Use bots to distract', 'First bash for stun'] },
  'Meg': { tier: 'B', bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'], bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'], tips: ['Use robot mode strategically', 'Juggernaut for push', 'Recharge when possible'] },
  'Chester': { tier: 'B', bestModes: ['Brawl Ball', 'Gem Grab', 'Knockout'], bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Goldarm Gulch'], tips: ['Manage venom stacks', 'Use super for burst', 'Multi ball for confusion'] },
  'Gray': { tier: 'B', bestModes: ['Brawl Ball', 'Gem Grab', 'Hot Zone'], bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Dueling Beetles'], tips: ['Use portals strategically', 'Walk it off for sustainability', 'Area control'] },
  'Chuck': { tier: 'B', bestModes: ['Brawl Ball', 'Gem Grab', 'Hot Zone'], bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Dueling Beetles'], tips: ['Use signs for mobility', 'Stay mobile', 'Ticket please for damage'] },
  'El Primo': { tier: 'B', bestModes: ['Showdown', 'Brawl Ball', 'Gem Grab'], bestMaps: ['Cavern Churn', 'Super Stadium', 'Hard Rock Mine'], tips: ['Use super to engage', 'Bush camping works well', 'Suplex supplement for stun'] },
  'Mortis': { tier: 'B', bestModes: ['Brawl Ball', 'Gem Grab', 'Showdown'], bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Cavern Churn'], tips: ['Manage dashes', 'Engage when enemy is low', 'Survival shovel for healing'] },
};

const DEFAULT_META: BrawlerMeta = {
  tier: 'C',
  bestModes: ['Gem Grab', 'Brawl Ball'],
  bestMaps: ['Hard Rock Mine', 'Super Stadium'],
  tips: ['Practice in training mode', 'Know your brawler strengths', 'Watch the current meta']
};

// ============ STATS CALCULATION ============

export function calculatePlayerStats(player: Player): PlayerStats {
  const brawlers = player.brawlers || [];
  const totalBrawlers = brawlers.length;
  const brawlersAt1000 = brawlers.filter(b => b.trophies >= 1000).length;
  const brawlersAt500 = brawlers.filter(b => b.trophies >= 500).length;
  const brawlersMaxed = brawlers.filter(b => b.power === 11).length;
  const totalVictories = player['3vs3Victories'] + player.soloVictories + player.duoVictories;
  const averageTrophies = totalBrawlers > 0 ? Math.round(brawlers.reduce((sum, b) => sum + b.trophies, 0) / totalBrawlers) : 0;
  
  return {
    totalVictories,
    winRate: 50, // Calculated from battle log
    averageTrophiesPerBrawler: averageTrophies,
    brawlersMaxed,
    brawlersAt1000,
    brawlersAt500,
    totalBrawlers,
    progressToGoal: Math.round((player.trophies / 100000) * 100),
  };
}

// ============ ANALYSIS ENGINE ============

export function analyzePlayer(
  player: Player,
  battleLog?: BattleLogItem[],
  allBrawlers?: Brawler[]
): AnalysisResult {
  const stats = calculatePlayerStats(player);
  const brawlers = player.brawlers || [];
  
  // Calculate win rate from battle log
  let winRate = 50;
  if (battleLog && battleLog.length > 0) {
    const wins = battleLog.filter(b => b.battle.result === 'victory').length;
    const total = battleLog.filter(b => b.battle.result).length;
    if (total > 0) {
      winRate = Math.round((wins / total) * 100);
    }
  }
  stats.winRate = winRate;

  // Strengths Analysis
  const strengths: string[] = [];
  if (stats.brawlersAt1000 >= 10) {
    strengths.push(`🏆 ${stats.brawlersAt1000} brawlers above 1000 trophies - exceptional diversity`);
  } else if (stats.brawlersAt1000 >= 5) {
    strengths.push(`🏆 ${stats.brawlersAt1000} brawlers above 1000 trophies - good progress`);
  }
  if (winRate >= 65) {
    strengths.push(`⚔️ Win rate of ${winRate}% - exceptional performance`);
  } else if (winRate >= 55) {
    strengths.push(`⚔️ Win rate of ${winRate}% - above average`);
  }
  if (player['3vs3Victories'] >= 5000) {
    strengths.push(`👥 ${player['3vs3Victories'].toLocaleString()} 3v3 wins - team veteran`);
  }
  if (player.soloVictories + player.duoVictories >= 1000) {
    strengths.push(`🥇 ${(player.soloVictories + player.duoVictories).toLocaleString()} Showdown wins - specialist`);
  }
  if (player.trophies >= 75000) {
    strengths.push(`⭐ ${player.trophies.toLocaleString()} trophies - elite player`);
  } else if (player.trophies >= 50000) {
    strengths.push(`⭐ ${player.trophies.toLocaleString()} trophies - advanced player`);
  }
  if (stats.brawlersMaxed >= 20) {
    strengths.push(`💪 ${stats.brawlersMaxed} maxed brawlers - dedicated collector`);
  }
  if (stats.brawlersAt500 >= stats.totalBrawlers * 0.8) {
    strengths.push(`📊 ${stats.brawlersAt500}/${stats.totalBrawlers} brawlers above 500 - balanced distribution`);
  }
  
  if (strengths.length === 0) {
    strengths.push(`🎮 Has ${stats.totalBrawlers} unlocked brawlers`);
    strengths.push(`📈 Keep playing to progress!`);
  }

  // Weaknesses Analysis
  const weaknesses: string[] = [];
  const brawlersUnder1000 = stats.totalBrawlers - stats.brawlersAt1000;
  if (brawlersUnder1000 > 40) {
    weaknesses.push(`📉 ${brawlersUnder1000} brawlers need to reach 1000 trophies`);
  }
  if (winRate < 45) {
    weaknesses.push(`⚠️ Win rate of ${winRate}% - focus on improving strategies`);
  }
  if (player.trophies < player.highestTrophies * 0.9) {
    const diff = player.highestTrophies - player.trophies;
    weaknesses.push(`📉 ${diff.toLocaleString()} trophies below your record`);
  }
  const lowPowerBrawlers = brawlers.filter(b => b.power < 9 && b.trophies >= 500);
  if (lowPowerBrawlers.length > 5) {
    weaknesses.push(`🔋 ${lowPowerBrawlers.length} brawlers with high trophies need power`);
  }
  
  if (weaknesses.length === 0) {
    weaknesses.push('🎯 Keep practicing to improve even more!');
  }

  // Recommendations
  const recommendations = generateRecommendations(player, stats, battleLog);
  
  // Brawler Analysis
  const brawlerAnalysis = analyzeBrawlers(brawlers, allBrawlers);
  
  // Daily Plan
  const dailyPlan = generateDailyPlan(brawlers, battleLog);
  
  // Meta Insights
  const metaInsights = [
    '🔥 Current meta favors brawlers with mobility and burst damage',
    '⭐ Tier S: Kenji, Berry, Draco, Clancy, Melodie, Kaze',
    '🎮 Gem Grab and Brawl Ball are the best modes to gain trophies',
    '👥 Showdown Duo is excellent for consistent farming',
    '🎯 Special events rotate daily - don\'t miss the rewards!',
    '💪 Focus on 3-5 brawlers at a time to maximize efficiency',
    '⚡ Power 9+ is essential for high-level competition',
  ];

  return {
    overallProgress: {
      trophyProgress: stats.progressToGoal,
      brawlerProgress: Math.round((stats.brawlersAt1000 / Math.max(stats.totalBrawlers, 1)) * 100),
      resourceEfficiency: Math.round((stats.brawlersMaxed / Math.max(stats.totalBrawlers, 1)) * 100),
    },
    strengths,
    weaknesses,
    recommendations,
    brawlerAnalysis,
    metaInsights,
    dailyPlan,
  };
}

function generateRecommendations(
  player: Player,
  stats: PlayerStats,
  battleLog?: BattleLogItem[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const brawlers = player.brawlers || [];

  // Trophy Goal
  if (player.trophies < 100000) {
    recommendations.push({
      type: 'trophy',
      priority: 'high',
      title: '🎯 100,000 Trophy Goal',
      description: `You're at ${stats.progressToGoal}% of the goal. ${(100000 - player.trophies).toLocaleString()} trophies remaining.`,
      actionable: 'Play 5-10 matches per day with brawlers between 600-900 trophies',
      estimatedImpact: '+50-150 trophies/day'
    });
  }

  // Brawlers to Push
  const brawlersToPush = brawlers
    .filter(b => b.trophies >= 600 && b.trophies < 1050)
    .sort((a, b) => b.trophies - a.trophies)
    .slice(0, 5);

  if (brawlersToPush.length > 0) {
    recommendations.push({
      type: 'brawler',
      priority: 'high',
      title: '🚀 Brawlers Close to 1000',
      description: `${brawlersToPush.length} brawlers ready for final push`,
      actionable: `Prioritize: ${brawlersToPush.map(b => b.name).join(', ')}`,
      estimatedImpact: '+200-500 total trophies'
    });
  }

  // Power Up
  const lowPowerHighTrophies = brawlers
    .filter(b => b.power < 9 && b.trophies >= 500)
    .sort((a, b) => b.trophies - a.trophies)
    .reverse()
    .slice(0, 5);

  if (lowPowerHighTrophies.length > 0) {
    recommendations.push({
      type: 'resource',
      priority: 'medium',
      title: '⚡ Upgrade Brawler Power',
      description: `${lowPowerHighTrophies.length} brawlers with high trophies need power`,
      actionable: `Prioritize: ${lowPowerHighTrophies.map(b => `${b.name} (P${b.power})`).join(', ')}`,
      estimatedImpact: '+5-10% win rate'
    });
  }

  // Mode Recommendation
  const trioWins = player['3vs3Victories'];
  const sdWins = player.soloVictories + player.duoVictories;
  
  if (trioWins > sdWins * 1.5) {
    recommendations.push({
      type: 'mode',
      priority: 'medium',
      title: '👥 Focus on 3v3 Modes',
      description: `You have more 3v3 wins (${trioWins.toLocaleString()}) - that's your strength`,
      actionable: 'Play Gem Grab and Brawl Ball to climb efficiently',
      estimatedImpact: '+3-7% win rate'
    });
  } else if (sdWins > trioWins) {
    recommendations.push({
      type: 'mode',
      priority: 'medium',
      title: '🥇 Focus on Showdown',
      description: `You have more SD wins (${sdWins.toLocaleString()}) - that's your strength`,
      actionable: 'Showdown Duo is great for consistent farming',
      estimatedImpact: '+3-7% win rate'
    });
  }

  // Strategy
  recommendations.push({
    type: 'strategy',
    priority: 'low',
    title: '🔄 Brawler Rotation',
    description: 'Rotating brawlers prevents trophy loss on a single character',
    actionable: 'Use 3-5 different brawlers per gaming session',
    estimatedImpact: 'More consistent progress'
  });

  return recommendations;
}

function analyzeBrawlers(
  playerBrawlers: PlayerBrawler[],
  allBrawlers?: Brawler[]
): BrawlerAnalysisResult[] {
  return playerBrawlers
    .map(brawler => {
      const meta = BRAWLER_META[brawler.name] || DEFAULT_META;
      const targetProgress = Math.min(100, Math.round((brawler.trophies / 1000) * 100));
      
      let priority: 'focus' | 'maintain' | 'improve';
      if (brawler.trophies >= 1000) {
        priority = 'maintain';
      } else if (brawler.trophies >= 600 && meta.tier !== 'D' && meta.tier !== 'C') {
        priority = 'focus';
      } else {
        priority = 'improve';
      }

      return {
        id: brawler.id,
        name: brawler.name,
        trophies: brawler.trophies,
        highestTrophies: brawler.highestTrophies,
        power: brawler.power,
        rank: brawler.rank,
        targetProgress,
        tier: meta.tier,
        bestModes: meta.bestModes,
        bestMaps: meta.bestMaps,
        tips: meta.tips,
        priority,
      };
    })
    .sort((a, b) => {
      // Sort by priority then trophies
      const priorityOrder = { focus: 0, improve: 1, maintain: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.trophies - a.trophies;
    });
}

function generateDailyPlan(
  brawlers: PlayerBrawler[],
  battleLog?: BattleLogItem[]
): DailyRecommendation[] {
  // Get brawlers optimal for today's push
  const todayBrawlers = brawlers
    .filter(b => b.trophies >= 400 && b.trophies < 1100)
    .sort((a, b) => {
      const metaA = BRAWLER_META[a.name] || DEFAULT_META;
      const metaB = BRAWLER_META[b.name] || DEFAULT_META;
      const tierOrder = { 'S': 0, 'A': 1, 'B': 2, 'C': 3, 'D': 4 };
      
      // Prioritize S/A tier with high trophies
      if (tierOrder[metaA.tier] !== tierOrder[metaB.tier]) {
        return tierOrder[metaA.tier] - tierOrder[metaB.tier];
      }
      return b.trophies - a.trophies;
    })
    .slice(0, 5);

  return todayBrawlers.map(brawler => {
    const meta = BRAWLER_META[brawler.name] || DEFAULT_META;
    const estimatedTrophies = Math.max(5, Math.round((1000 - brawler.trophies) * 0.08) + 5);
    
    let priority: 'high' | 'medium' | 'low';
    if (meta.tier === 'S' && brawler.trophies >= 700) {
      priority = 'high';
    } else if (meta.tier === 'A' || brawler.trophies >= 800) {
      priority = 'medium';
    } else {
      priority = 'low';
    }

    return {
      brawler: brawler.name,
      brawlerId: brawler.id,
      mode: meta.bestModes[0],
      map: meta.bestMaps[0],
      reason: meta.tier === 'S' || meta.tier === 'A'
        ? `${brawler.name} is Tier ${meta.tier} - excellent choice!`
        : `Push ${brawler.name} to 1000 trophies`,
      estimatedTrophies,
      priority,
    };
  });
}

export function getBrawlerMeta(name: string): BrawlerMeta {
  return BRAWLER_META[name] || DEFAULT_META;
}

export { BRAWLER_META, DEFAULT_META };
