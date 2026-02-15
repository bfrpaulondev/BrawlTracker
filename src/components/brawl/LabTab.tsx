/**
 * LAB Tab - Advanced Tools
 * 5 unique features no other app has
 * @author Bruno Paulon
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Target, TrendingUp, Coins, Trophy, ChevronRight,
  Zap, Calendar, AlertTriangle, BarChart3, Star, Flame,
  CheckCircle, XCircle, Minus, ArrowUp, ArrowDown, Award,
  Gift, Crown, Sword, Shield, Heart, Timer, Lightbulb,
  Filter, Search, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Player, BattleLogItem, AnalysisResult, PlayerStats } from '@/types';
import { TIER_LIST_2026, getBrawlerTier, META_VERSION } from '@/services/MetaDataService';
import { BrawlerAvatar } from '@/components/brawl/BrawlerAvatar';

// ============ TYPES ============
interface PushPlan {
  brawler: string;
  brawlerId?: number;
  mode: string;
  map: string;
  estimatedTrophies: number;
  reason: string;
  timeSlot: string;
  priority: 'high' | 'medium' | 'low';
}

interface MatchupData {
  brawler: string;
  winRate: number;
  games: number;
  avgTrophyChange: number;
  performance: 'strong' | 'average' | 'weak';
}

interface TrueSkillRating {
  overall: number;
  consistency: number;
  winRateAdjusted: number;
  progressScore: number;
  percentile: number;
  trend: 'improving' | 'stable' | 'declining';
}

interface ResourcePlan {
  brawler: string;
  currentPower: number;
  targetPower: number;
  cost: number;
  priority: number;
  roi: number;
  reason: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  reward: string;
  rewardType: 'gems' | 'coins' | 'power' | 'other';
  progress: number;
  total: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  completed: boolean;
}

// ============ LAB COMPONENT ============
interface LabTabProps {
  player: Player;
  battleLog: BattleLogItem[];
  analysis: AnalysisResult | null;
  stats: PlayerStats | null;
}

export function LabTab({ player, battleLog, analysis, stats }: LabTabProps) {
  const [activeFeature, setActiveFeature] = useState<'planner' | 'matchup' | 'skill' | 'resource' | 'achievements'>('planner');

  const features = [
    { id: 'planner', icon: Calendar, label: 'Push Planner', desc: 'Optimal times' },
    { id: 'matchup', icon: Target, label: 'Matchup Matrix', desc: 'Your counters' },
    { id: 'skill', icon: TrendingUp, label: 'True Skill', desc: 'Real rating' },
    { id: 'resource', icon: Coins, label: 'Resources', desc: 'Optimize coins' },
    { id: 'achievements', icon: Trophy, label: 'Achievements', desc: 'Hunt achievements' },
  ];

  return (
    <div className="space-y-4">
      {/* Meta Version Banner */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/5 border-purple-500/20">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Meta Data v{META_VERSION.version}</p>
                <p className="text-xs text-gray-500">{META_VERSION.season}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                Updated
              </Badge>
              <p className="text-xs text-gray-500 mt-1">{META_VERSION.lastUpdated}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Selector */}
      <div className="grid grid-cols-5 sm:grid-cols-5 gap-1 sm:gap-2">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => setActiveFeature(feature.id as any)}
            className={`flex flex-col items-center gap-0.5 sm:gap-1 p-2 sm:p-3 rounded-xl transition-all ${
              activeFeature === feature.id
                ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30'
                : 'bg-white/5 border border-white/5 hover:border-white/20'
            }`}
          >
            <feature.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${activeFeature === feature.id ? 'text-amber-400' : 'text-gray-400'}`} />
            <span className={`text-[10px] sm:text-xs font-medium ${activeFeature === feature.id ? 'text-amber-400' : 'text-gray-400'}`}>
              {feature.label}
            </span>
            <span className="text-[8px] sm:text-[10px] text-gray-500 hidden sm:block">{feature.desc}</span>
          </button>
        ))}
      </div>

      {/* Feature Content */}
      <AnimatePresence mode="wait">
        {activeFeature === 'planner' && (
          <PushPlannerFeature key="planner" player={player} battleLog={battleLog} analysis={analysis} />
        )}
        {activeFeature === 'matchup' && (
          <MatchupMatrixFeature key="matchup" player={player} battleLog={battleLog} />
        )}
        {activeFeature === 'skill' && (
          <TrueSkillFeature key="skill" player={player} battleLog={battleLog} stats={stats} />
        )}
        {activeFeature === 'resource' && (
          <ResourceOptimizerFeature key="resource" player={player} analysis={analysis} />
        )}
        {activeFeature === 'achievements' && (
          <AchievementHunterFeature key="achievements" player={player} battleLog={battleLog} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ 1. SMART PUSH PLANNER ============
function PushPlannerFeature({ player, battleLog, analysis }: { player: Player; battleLog: BattleLogItem[]; analysis: AnalysisResult | null }) {
  // Analyze best times based on battle history
  const timeAnalysis = useMemo(() => {
    const hourStats: Record<number, { wins: number; total: number; trophies: number }> = {};
    
    battleLog.forEach(battle => {
      const hour = new Date(battle.battleTime.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6')).getHours();
      if (!hourStats[hour]) hourStats[hour] = { wins: 0, total: 0, trophies: 0 };
      hourStats[hour].total++;
      if (battle.battle.result === 'victory') hourStats[hour].wins++;
      hourStats[hour].trophies += battle.battle.trophyChange || 0;
    });

    const bestHours = Object.entries(hourStats)
      .map(([hour, data]) => ({
        hour: parseInt(hour),
        winRate: data.total > 0 ? Math.round((data.wins / data.total) * 100) : 50,
        avgTrophies: data.total > 0 ? Math.round(data.trophies / data.total) : 0,
        games: data.total
      }))
      .filter(h => h.games >= 2)
      .sort((a, b) => b.winRate - a.winRate)
      .slice(0, 3);

    return bestHours;
  }, [battleLog]);

  // Generate push plan
  const pushPlan = useMemo((): PushPlan[] => {
    if (!analysis) return [];
    
    return analysis.dailyPlan.slice(0, 5).map((plan, i) => {
      const bestHour = timeAnalysis[i]?.hour || (18 + i) % 24;
      const timeSlot = `${bestHour}:00 - ${(bestHour + 1) % 24}:00`;
      
      return {
        brawler: plan.brawler,
        brawlerId: plan.brawlerId,
        mode: plan.mode,
        map: plan.map,
        estimatedTrophies: plan.estimatedTrophies + (timeAnalysis[i]?.avgTrophies || 0),
        reason: plan.reason,
        timeSlot,
        priority: plan.priority,
      };
    });
  }, [analysis, timeAnalysis]);

  // Tilt detection
  const recentResults = battleLog.slice(0, 10).map(b => b.battle.result);
  const losses = recentResults.filter(r => r === 'defeat').length;
  const isTilting = losses >= 6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Tilt Warning */}
      {isTilting && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <p className="font-medium text-red-400">Tilt Detected!</p>
                <p className="text-sm text-gray-400">You lost {losses} of the last 10 matches. Consider taking a 15 minute break.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Best Times */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="w-4 h-4 text-cyan-400" />
            Your Best Times
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {timeAnalysis.length > 0 ? timeAnalysis.map((time, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-amber-400">{time.hour}:00</p>
                <p className="text-sm text-gray-400">{time.winRate}% WR</p>
                <p className="text-xs text-gray-500">{time.games} games</p>
              </div>
            )) : (
              <div className="col-span-3 text-center text-gray-500 py-4">
                Play more matches for time analysis
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Push Plan */}
      <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/5 border-cyan-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="w-4 h-4 text-cyan-400" />
            Optimized Push Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 sm:space-y-3">
            {pushPlan.map((plan, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <BrawlerAvatar name={plan.brawler} id={plan.brawlerId} size="sm" showTier={true} />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{plan.brawler}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="truncate">{plan.mode}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{plan.timeSlot}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                    +{plan.estimatedTrophies} 🏆
                  </Badge>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate max-w-[80px] sm:max-w-none">{plan.map}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total Estimate */}
          <div className="mt-4 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/5 rounded-xl border border-amber-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Total estimated for today:</span>
              <span className="text-lg font-bold text-amber-400">
                +{pushPlan.reduce((sum, p) => sum + p.estimatedTrophies, 0)} trophies
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Push Tips</p>
              <ul className="text-xs text-gray-400 mt-1 space-y-1">
                <li>• Stop playing after 3 consecutive losses</li>
                <li>• Alternate between 3-5 brawlers per session</li>
                <li>• Brawlers between 600-900 trophies have better ROI</li>
                <li>• Special events give more trophies per win</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============ 2. MATCHUP MATRIX ============
function MatchupMatrixFeature({ player, battleLog }: { player: Player; battleLog: BattleLogItem[] }) {
  const [selectedMode, setSelectedMode] = useState<string>('all');

  // Analyze matchups from battle log
  const matchupData = useMemo((): MatchupData[] => {
    const brawlerStats: Record<string, { wins: number; losses: number; trophyChange: number; games: number }> = {};
    
    battleLog.forEach(battle => {
      const brawlerName = battle.battle.players?.[0]?.brawler?.name || 
                         battle.battle.teams?.[0]?.[0]?.brawler?.name || 
                         'Unknown';
      
      if (!brawlerStats[brawlerName]) {
        brawlerStats[brawlerName] = { wins: 0, losses: 0, trophyChange: 0, games: 0 };
      }
      
      brawlerStats[brawlerName].games++;
      brawlerStats[brawlerName].trophyChange += battle.battle.trophyChange || 0;
      
      if (battle.battle.result === 'victory') {
        brawlerStats[brawlerName].wins++;
      } else if (battle.battle.result === 'defeat') {
        brawlerStats[brawlerName].losses++;
      }
    });

    return Object.entries(brawlerStats)
      .map(([name, data]) => ({
        brawler: name,
        winRate: data.games > 0 ? Math.round((data.wins / data.games) * 100) : 50,
        games: data.games,
        avgTrophyChange: data.games > 0 ? Math.round(data.trophyChange / data.games) : 0,
        performance: data.games > 0 && (data.wins / data.games) >= 0.6 ? 'strong' : 
                    data.games > 0 && (data.wins / data.games) <= 0.4 ? 'weak' : 'average'
      }))
      .sort((a, b) => b.winRate - a.winRate);
  }, [battleLog]);

  const strongBrawlers = matchupData.filter(m => m.performance === 'strong');
  const weakBrawlers = matchupData.filter(m => m.performance === 'weak');

  // Counter suggestions
  const counterSuggestions = useMemo(() => {
    const suggestions: { brawler: string; counters: string[]; countered: string[] }[] = [];
    
    player.brawlers.slice(0, 10).forEach(b => {
      const tier = getBrawlerTier(b.name);
      const counters: string[] = [];
      const countered: string[] = [];
      
      // Based on tier and general knowledge
      if (tier === 'S' || tier === 'A') {
        countered.push(...TIER_LIST_2026.D.slice(0, 2));
        countered.push(...TIER_LIST_2026.C.slice(0, 1));
      }
      if (tier === 'D' || tier === 'C') {
        counters.push(...TIER_LIST_2026.S.slice(0, 2));
        counters.push(...TIER_LIST_2026.A.slice(0, 1));
      }
      
      suggestions.push({ brawler: b.name, counters, countered });
    });
    
    return suggestions;
  }, [player.brawlers]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Performance Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Strong Against */}
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-emerald-400">
              <ArrowUp className="w-4 h-4" />
              You DOMINATE with
            </CardTitle>
          </CardHeader>
          <CardContent>
            {strongBrawlers.length > 0 ? (
              <div className="space-y-2">
                {strongBrawlers.slice(0, 5).map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm">{m.brawler}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        {m.winRate}%
                      </Badge>
                      <span className="text-xs text-gray-500">{m.games}g</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">Play more for analysis</p>
            )}
          </CardContent>
        </Card>

        {/* Weak Against */}
        <Card className="bg-red-500/10 border-red-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-red-400">
              <ArrowDown className="w-4 h-4" />
              You STRUGGLE with
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weakBrawlers.length > 0 ? (
              <div className="space-y-2">
                {weakBrawlers.slice(0, 5).map((m, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-sm">{m.brawler}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        {m.winRate}%
                      </Badge>
                      <span className="text-xs text-gray-500">{m.games}g</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No problematic brawlers!</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Counter Matrix */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sword className="w-4 h-4 text-purple-400" />
            Counter-Pick Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Your Brawler</th>
                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Counters</th>
                  <th className="text-left py-2 px-2 text-gray-400 font-medium">Good Against</th>
                </tr>
              </thead>
              <tbody>
                {counterSuggestions.slice(0, 5).map((s, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-2 px-2 font-medium">{s.brawler}</td>
                    <td className="py-2 px-2">
                      <div className="flex flex-wrap gap-1">
                        {s.counters.length > 0 ? s.counters.map((c, j) => (
                          <Badge key={j} className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                            {c}
                          </Badge>
                        )) : <span className="text-gray-500 text-xs">-</span>}
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex flex-wrap gap-1">
                        {s.countered.length > 0 ? s.countered.map((c, j) => (
                          <Badge key={j} className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                            {c}
                          </Badge>
                        )) : <span className="text-gray-500 text-xs">-</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mode Analysis */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="w-4 h-4 text-amber-400" />
            Analysis by Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Gem Grab', 'Brawl Ball', 'Showdown', 'Hot Zone'].map((mode) => {
              const modeBattles = battleLog.filter(b => 
                (b.event?.mode || b.battle.mode) === mode.replace(' ', '')
              );
              const wins = modeBattles.filter(b => b.battle.result === 'victory').length;
              const winRate = modeBattles.length > 0 ? Math.round((wins / modeBattles.length) * 100) : 50;
              
              return (
                <div key={mode} className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400 mb-1">{mode}</p>
                  <p className={`text-lg font-bold ${winRate >= 55 ? 'text-emerald-400' : winRate <= 45 ? 'text-red-400' : 'text-gray-400'}`}>
                    {winRate}%
                  </p>
                  <p className="text-xs text-gray-500">{modeBattles.length} games</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============ 3. TRUE SKILL RATING ============
function TrueSkillFeature({ player, battleLog, stats }: { player: Player; battleLog: BattleLogItem[]; stats: PlayerStats | null }) {
  const trueSkill = useMemo((): TrueSkillRating => {
    // Win Rate Adjusted (considering trophy range)
    const baseWR = stats?.winRate || 50;
    const avgTrophies = player.trophies / Math.max(player.brawlers.length, 1);
    const trophyMultiplier = avgTrophies / 1000; // Higher trophies = harder opponents
    const winRateAdjusted = Math.round(baseWR * (1 + trophyMultiplier * 0.1));

    // Consistency (based on variance in results)
    const results = battleLog.slice(0, 20).map(b => b.battle.trophyChange || 0);
    const avg = results.reduce((a, b) => a + b, 0) / Math.max(results.length, 1);
    const variance = results.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / Math.max(results.length, 1);
    const consistency = Math.max(0, Math.min(100, 100 - Math.sqrt(variance) * 2));

    // Progress Score (how fast improving)
    const recentTrophies = battleLog.slice(0, 10).reduce((sum, b) => sum + (b.battle.trophyChange || 0), 0);
    const progressScore = Math.min(100, Math.max(0, 50 + recentTrophies));

    // Overall rating
    const overall = Math.round((winRateAdjusted * 0.4 + consistency * 0.3 + progressScore * 0.3));

    // Percentile (estimate based on trophies)
    const percentile = Math.min(99, Math.round((player.trophies / 100000) * 100));

    // Trend
    const last5 = battleLog.slice(0, 5);
    const wins = last5.filter(b => b.battle.result === 'victory').length;
    const trend = wins >= 3 ? 'improving' : wins <= 2 ? 'declining' : 'stable';

    return { overall, consistency, winRateAdjusted, progressScore, percentile, trend };
  }, [player, battleLog, stats]);

  const skillLevel = useMemo(() => {
    if (trueSkill.overall >= 80) return { level: 'Elite', color: 'text-amber-400', icon: Crown };
    if (trueSkill.overall >= 65) return { level: 'Advanced', color: 'text-purple-400', icon: Star };
    if (trueSkill.overall >= 50) return { level: 'Intermediate', color: 'text-blue-400', icon: TrendingUp };
    return { level: 'Beginner', color: 'text-gray-400', icon: Target };
  }, [trueSkill.overall]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Overall Rating */}
      <Card className="bg-gradient-to-br from-amber-500/10 via-purple-500/5 to-blue-500/10 border-amber-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                skillLevel.level === 'Elite' ? 'bg-gradient-to-br from-amber-400 to-orange-600' :
                skillLevel.level === 'Advanced' ? 'bg-gradient-to-br from-purple-400 to-pink-600' :
                skillLevel.level === 'Intermediate' ? 'bg-gradient-to-br from-blue-400 to-cyan-600' :
                'bg-gradient-to-br from-gray-400 to-gray-600'
              }`}>
                <skillLevel.icon className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className={`text-sm font-medium ${skillLevel.color}`}>{skillLevel.level}</p>
                <p className="text-4xl font-bold">{trueSkill.overall}</p>
                <p className="text-xs text-gray-500">True Skill Rating</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                {trueSkill.trend === 'improving' && <ArrowUp className="w-4 h-4 text-emerald-400" />}
                {trueSkill.trend === 'declining' && <ArrowDown className="w-4 h-4 text-red-400" />}
                {trueSkill.trend === 'stable' && <Minus className="w-4 h-4 text-gray-400" />}
                <span className={`text-sm ${
                  trueSkill.trend === 'improving' ? 'text-emerald-400' :
                  trueSkill.trend === 'declining' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {trueSkill.trend === 'improving' ? 'Improving' : 
                   trueSkill.trend === 'declining' ? 'Declining' : 'Stable'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Top {100 - trueSkill.percentile}% of players</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Adjusted Win Rate', value: `${trueSkill.winRateAdjusted}%`, icon: Target },
          { label: 'Consistency', value: `${trueSkill.consistency}%`, icon: BarChart3 },
          { label: 'Progress', value: `${trueSkill.progressScore}`, icon: TrendingUp },
          { label: 'Percentile', value: `Top ${trueSkill.percentile}%`, icon: Award },
        ].map((stat, i) => (
          <Card key={i} className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <stat.icon className="w-5 h-5 mx-auto mb-2 text-amber-400" />
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Comparison with Average
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'Trophies', user: player.trophies, average: 25000, max: 100000 },
              { label: '3v3 Wins', user: player['3vs3Victories'], average: 2000, max: 10000 },
              { label: 'Brawlers @ 1000', user: player.brawlers.filter(b => b.trophies >= 1000).length, average: 5, max: player.brawlers.length },
            ].map((item, i) => {
              const userPercent = Math.round((item.user / item.max) * 100);
              const avgPercent = Math.round((item.average / item.max) * 100);
              
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-amber-400">{item.user.toLocaleString()}</span>
                  </div>
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="absolute h-full bg-gray-600/50 rounded-full" style={{ width: `${avgPercent}%` }} />
                    <div className="absolute h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${userPercent}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Average: {item.average.toLocaleString()}</span>
                    <span className={item.user >= item.average ? 'text-emerald-400' : 'text-red-400'}>
                      {item.user >= item.average ? '+' : ''}{(item.user - item.average).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============ 4. RESOURCE OPTIMIZER ============
function ResourceOptimizerFeature({ player, analysis }: { player: Player; analysis: AnalysisResult | null }) {
  const resourcePlan = useMemo((): ResourcePlan[] => {
    return player.brawlers
      .filter(b => b.power < 11 && b.trophies >= 300)
      .map(b => {
        const tier = getBrawlerTier(b.name);
        const powerToMax = 11 - b.power;
        const cost = powerToMax * 900 + (powerToMax >= 5 ? 2000 : 0); // Estimate
        const priority = tier === 'S' ? 1 : tier === 'A' ? 2 : tier === 'B' ? 3 : 4;
        const roi = Math.round((b.trophies / Math.max(cost, 1)) * 100);
        
        let reason = '';
        if (tier === 'S') reason = 'Tier S - Maximum ROI in current meta';
        else if (tier === 'A') reason = 'Tier A - Strong in meta';
        else if (b.trophies >= 800) reason = 'Close to 1000 - High priority';
        else reason = 'Invest when you have spare resources';
        
        return {
          brawler: b.name,
          currentPower: b.power,
          targetPower: 11,
          cost,
          priority,
          roi,
          reason,
        };
      })
      .sort((a, b) => a.priority - b.priority || b.roi - a.roi)
      .slice(0, 10);
  }, [player.brawlers]);

  const totalCost = resourcePlan.reduce((sum, p) => sum + p.cost, 0);

  // ROI Calculator
  const [coinsPerDay, setCoinsPerDay] = useState(500);
  const daysToComplete = Math.ceil(totalCost / coinsPerDay);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Summary */}
      <Card className="bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border-amber-500/20">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total cost to upgrade all</p>
              <p className="text-3xl font-bold text-amber-400">{totalCost.toLocaleString()}</p>
              <p className="text-xs text-gray-500">estimated coins</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center">
              <Coins className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Calculator */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Timer className="w-4 h-4 text-cyan-400" />
            Timeline Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">Coins per day</p>
              <Input
                type="number"
                value={coinsPerDay}
                onChange={(e) => setCoinsPerDay(Math.max(100, parseInt(e.target.value) || 500))}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Estimated time</p>
              <p className="text-xl font-bold text-amber-400">{daysToComplete} days</p>
            </div>
          </div>
          <Progress value={(coinsPerDay * 30) / totalCost * 100} className="h-2" />
          <p className="text-xs text-gray-500 mt-2">
            With {coinsPerDay} coins/day, you complete in ~{Math.round(daysToComplete / 30)} months
          </p>
        </CardContent>
      </Card>

      {/* Priority List */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Priority Queue (ROI)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {resourcePlan.map((plan, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    plan.priority === 1 ? 'bg-gradient-to-br from-amber-400 to-orange-600' :
                    plan.priority === 2 ? 'bg-gradient-to-br from-emerald-400 to-green-600' :
                    plan.priority === 3 ? 'bg-gradient-to-br from-blue-400 to-cyan-600' :
                    'bg-gradient-to-br from-gray-400 to-gray-600'
                  }`}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{plan.brawler}</p>
                    <p className="text-xs text-gray-500">P{plan.currentPower} → P{plan.targetPower}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-400">{plan.cost.toLocaleString()} 🪙</p>
                  <p className="text-xs text-gray-500">ROI: {plan.roi}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Saving Tips</p>
              <ul className="text-xs text-gray-400 mt-1 space-y-1">
                <li>• Always prioritize Tier S and A for maximum ROI</li>
                <li>• Brawlers with 800+ trophies should be prioritized</li>
                <li>• Special events give more coins per match</li>
                <li>• Brawl Pass greatly accelerates resource collection</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============ 5. ACHIEVEMENT HUNTER ============
function AchievementHunterFeature({ player, battleLog }: { player: Player; battleLog: BattleLogItem[] }) {
  const [filter, setFilter] = useState<'all' | 'gems' | 'easy' | 'progress'>('all');

  // Achievement definitions
  const achievements = useMemo((): Achievement[] => {
    const all: Achievement[] = [
      // Trophy Achievements
      { id: 'trophies_10k', name: '10K Club', description: 'Reach 10,000 trophies', reward: '100', rewardType: 'gems', progress: Math.min(player.trophies, 10000), total: 10000, difficulty: 'easy', category: 'Trophies', completed: player.trophies >= 10000 },
      { id: 'trophies_25k', name: '25K Club', description: 'Reach 25,000 trophies', reward: '250', rewardType: 'gems', progress: Math.min(player.trophies, 25000), total: 25000, difficulty: 'medium', category: 'Trophies', completed: player.trophies >= 25000 },
      { id: 'trophies_50k', name: '50K Club', description: 'Reach 50,000 trophies', reward: '500', rewardType: 'gems', progress: Math.min(player.trophies, 50000), total: 50000, difficulty: 'hard', category: 'Trophies', completed: player.trophies >= 50000 },
      
      // Victory Achievements
      { id: 'wins_100', name: 'Winner', description: 'Win 100 3v3 matches', reward: '500', rewardType: 'coins', progress: Math.min(player['3vs3Victories'], 100), total: 100, difficulty: 'easy', category: 'Victories', completed: player['3vs3Victories'] >= 100 },
      { id: 'wins_1000', name: 'Veteran', description: 'Win 1,000 3v3 matches', reward: '2000', rewardType: 'coins', progress: Math.min(player['3vs3Victories'], 1000), total: 1000, difficulty: 'medium', category: 'Victories', completed: player['3vs3Victories'] >= 1000 },
      { id: 'wins_5000', name: 'Legend', description: 'Win 5,000 3v3 matches', reward: '100', rewardType: 'gems', progress: Math.min(player['3vs3Victories'], 5000), total: 5000, difficulty: 'hard', category: 'Victories', completed: player['3vs3Victories'] >= 5000 },
      
      // Showdown Achievements
      { id: 'sd_100', name: 'Survivor', description: 'Win 100 Showdown matches', reward: '500', rewardType: 'coins', progress: Math.min(player.soloVictories + player.duoVictories, 100), total: 100, difficulty: 'easy', category: 'Showdown', completed: player.soloVictories + player.duoVictories >= 100 },
      { id: 'sd_500', name: 'Predator', description: 'Win 500 Showdown matches', reward: '1500', rewardType: 'coins', progress: Math.min(player.soloVictories + player.duoVictories, 500), total: 500, difficulty: 'medium', category: 'Showdown', completed: player.soloVictories + player.duoVictories >= 500 },
      
      // Brawler Achievements
      { id: 'brawlers_1000', name: 'Master', description: 'Have 1 brawler with 1000 trophies', reward: '50', rewardType: 'gems', progress: player.brawlers.filter(b => b.trophies >= 1000).length, total: 1, difficulty: 'medium', category: 'Brawlers', completed: player.brawlers.some(b => b.trophies >= 1000) },
      { id: 'brawlers_10_1000', name: 'Diversified', description: 'Have 10 brawlers with 1000 trophies', reward: '100', rewardType: 'gems', progress: player.brawlers.filter(b => b.trophies >= 1000).length, total: 10, difficulty: 'hard', category: 'Brawlers', completed: player.brawlers.filter(b => b.trophies >= 1000).length >= 10 },
      { id: 'brawlers_max', name: 'Max Power', description: 'Have 1 brawler at max power', reward: '500', rewardType: 'coins', progress: player.brawlers.filter(b => b.power === 11).length, total: 1, difficulty: 'medium', category: 'Brawlers', completed: player.brawlers.some(b => b.power === 11) },
    ];

    return all;
  }, [player]);

  const filteredAchievements = useMemo(() => {
    let filtered = achievements;
    
    if (filter === 'gems') {
      filtered = achievements.filter(a => a.rewardType === 'gems');
    } else if (filter === 'easy') {
      filtered = achievements.filter(a => a.difficulty === 'easy' && !a.completed);
    } else if (filter === 'progress') {
      filtered = achievements.filter(a => !a.completed && a.progress > 0).sort((a, b) => (b.progress / b.total) - (a.progress / a.total));
    }
    
    return filtered;
  }, [achievements, filter]);

  const completedCount = achievements.filter(a => a.completed).length;
  const totalGems = achievements.filter(a => a.completed && a.rewardType === 'gems').reduce((sum, a) => sum + parseInt(a.reward), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <Gift className="w-6 h-6 mx-auto mb-2 text-purple-400" />
            <p className="text-2xl font-bold">{totalGems}</p>
            <p className="text-xs text-gray-500">Gems earned</p>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-amber-400" />
            <p className="text-2xl font-bold">{achievements.length - completedCount}</p>
            <p className="text-xs text-gray-500">Remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'gems', label: 'With Gems' },
          { id: 'easy', label: 'Easy' },
          { id: 'progress', label: 'In Progress' },
        ].map((f) => (
          <Button
            key={f.id}
            variant={filter === f.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f.id as any)}
            className={filter === f.id ? 'bg-amber-500' : 'border-white/10'}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Achievement List */}
      <div className="space-y-2">
        {filteredAchievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`${
              achievement.completed
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    achievement.completed
                      ? 'bg-emerald-500/30'
                      : achievement.difficulty === 'easy'
                      ? 'bg-green-500/20'
                      : achievement.difficulty === 'medium'
                      ? 'bg-amber-500/20'
                      : 'bg-red-500/20'
                  }`}>
                    {achievement.completed ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Award className={`w-5 h-5 ${
                        achievement.difficulty === 'easy' ? 'text-green-400' :
                        achievement.difficulty === 'medium' ? 'text-amber-400' :
                        'text-red-400'
                      }`} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{achievement.name}</p>
                    <p className="text-xs text-gray-400">{achievement.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${
                    achievement.rewardType === 'gems'
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    {achievement.reward} {achievement.rewardType === 'gems' ? '💎' : '🪙'}
                  </Badge>
                  {!achievement.completed && (
                    <div className="mt-2">
                      <Progress value={(achievement.progress / achievement.total) * 100} className="h-1.5" />
                      <p className="text-xs text-gray-500 mt-1">
                        {achievement.progress.toLocaleString()} / {achievement.total.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
