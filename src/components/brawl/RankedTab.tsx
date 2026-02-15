/**
 * RANKED Tab - Competitive/Ranked Mode Helper
 * Power League and Ranked Match Strategy Assistant
 * @author Bruno Paulon
 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sword, Shield, Ban, Lightbulb, Map, ChevronDown, ChevronUp,
  Trophy, Target, Users, Star, AlertTriangle, Crown, Zap,
  Eye, EyeOff, RefreshCw, Info, Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BrawlerAvatar } from '@/components/brawl/BrawlerAvatar';
import { getMapImage, getModeDisplayName } from '@/services/AssetService';

// ============ TYPES ============
interface RankedMap {
  name: string;
  mode: string;
  image: string;
  firstPick: string;
  firstPickReason: string;
  firstPickTier: 'S' | 'A' | 'B';
  alternatives: string[];
  counters: Record<string, string[]>;
  tips: string[];
  lanes: string[];
  teamComp: string[];
  bans: string[];
}

interface SuggestedBan {
  brawler: string;
  reason: string;
  tier: 'S' | 'A' | 'B';
}

interface DraftStrategy {
  position: number;
  title: string;
  strategy: string;
  tips: string[];
}

// ============ DATA ============
const RANKED_MAPS: RankedMap[] = [
  {
    name: "Goldarm Gulch",
    mode: "Knockout",
    image: "/assets/maps/knockout.png",
    firstPick: "Nani",
    firstPickReason: "Long range dominance, can control mid with Return to Sender gadget",
    firstPickTier: "S",
    alternatives: ["Piper", "Belle", "Angelo"],
    counters: {
      "Nani": ["Edgar", "Leon", "Mortis"],
      "Piper": ["Edgar", "Leon", "Darryl"],
      "Belle": ["Edgar", "Mortis", "Kenji"],
      "Angelo": ["Edgar", "Fang", "Buzz"]
    },
    tips: [
      "Control the center bushes for vision advantage",
      "Stay spread to avoid team wipes from supers",
      "Use walls for cover against snipers",
      "Watch for assassin flanks from side lanes"
    ],
    lanes: ["Left: Safe lane for snipers", "Mid: Control zone", "Right: Aggressive angle"],
    teamComp: ["Sniper", "Assassin/Tank", "Support"],
    bans: ["Edgar", "Leon"]
  },
  {
    name: "Hard Rock Mine",
    mode: "Gem Grab",
    image: "/assets/maps/gem-grab.png",
    firstPick: "Gene",
    firstPickReason: "Excellent control with Magic Hand, can save teammates or grab gems",
    firstPickTier: "S",
    alternatives: ["Pam", "Poco", "Byron"],
    counters: {
      "Gene": ["Edgar", "Leon", "Mortis"],
      "Pam": ["Nani", "Piper", "Belle"],
      "Poco": ["Brock", "Tick", "Sprout"],
      "Byron": ["Edgar", "Crow", "Leon"]
    },
    tips: [
      "Control mid for gem spawns",
      "Don't overcommit on gems early",
      "Use walls to heal safely",
      "Count enemy supers before engaging"
    ],
    lanes: ["Left: Defensive angle", "Mid: Gem carrier zone", "Right: Aggressive push lane"],
    teamComp: ["Gem Carrier", "Support", "Tank/Control"],
    bans: ["Edgar", "Kit"]
  },
  {
    name: "Super Stadium",
    mode: "Brawl Ball",
    image: "/assets/maps/brawl-ball.png",
    firstPick: "Bibi",
    firstPickReason: "Fast movement, home run ability creates openings, tanky with Gadget",
    firstPickTier: "S",
    alternatives: ["Lou", "Bull", "El Primo"],
    counters: {
      "Bibi": ["Emz", "Sandy", "Gene"],
      "Lou": ["Darryl", "Bull", "El Primo"],
      "Bull": ["Emz", "Colette", "Shelly"],
      "El Primo": ["Emz", "Tick", "Sprout"]
    },
    tips: [
      "Don't all push at once - stagger your attacks",
      "Use walls for passing plays",
      "Super when enemies are grouped",
      "Defend first, attack when opportunity arises"
    ],
    lanes: ["Left: Wide lane", "Mid: Ball control", "Right: Narrow lane for tanks"],
    teamComp: ["Ball Carrier", "Defender", "Playmaker"],
    bans: ["Fang", "Lou"]
  },
  {
    name: "Cavern Churn",
    mode: "Showdown",
    image: "/assets/maps/showdown.png",
    firstPick: "Kit",
    firstPickReason: "Self-sustain, strong 1v1, can hide in bushes effectively",
    firstPickTier: "S",
    alternatives: ["Edgar", "Draco", "Hank"],
    counters: {
      "Kit": ["Crow", "Leon", "Byron"],
      "Edgar": ["Shelly", "Griff", "Bull"],
      "Draco": ["Emz", "Sandy", "Gene"],
      "Hank": ["Piper", "Nani", "Belle"]
    },
    tips: [
      "Bush camping is key early game",
      "Save super for final circle",
      "Don't engage without power cubes advantage",
      "Position for final zone early"
    ],
    lanes: ["North: High ground", "East: Bush maze", "West: Open area"],
    teamComp: ["Duo: Tank + Support", "Solo: Self-sustain brawler"],
    bans: ["Crow", "Leon"]
  },
  {
    name: "Hot Zone",
    mode: "Hot Zone",
    image: "/assets/maps/knockout.png",
    firstPick: "Kit",
    firstPickReason: "Dominates zones with healing and damage, very hard to dislodge",
    firstPickTier: "S",
    alternatives: ["Pam", "Sandy", "Carl"],
    counters: {
      "Kit": ["Edgar", "Leon", "Mortis"],
      "Pam": ["Nani", "Piper", "Tick"],
      "Sandy": ["Edgar", "Leon", "Crow"],
      "Carl": ["Emz", "Gene", "Tara"]
    },
    tips: [
      "Rotate between zones quickly",
      "Don't die in the zone - retreat and heal",
      "Control two zones to win",
      "Super usage is timing critical"
    ],
    lanes: ["Zone A: Open fight", "Zone B: Bush control", "Zone C: Final stand"],
    teamComp: ["Zone Controller", "Support", "Disruptor"],
    bans: ["Kit", "Draco"]
  },
  {
    name: "Canal Grande",
    mode: "Gem Grab",
    image: "/assets/maps/gem-grab.png",
    firstPick: "Byron",
    firstPickReason: "Long range healing and damage, controls water lanes effectively",
    firstPickTier: "S",
    alternatives: ["Gene", "Pam", "Poco"],
    counters: {
      "Byron": ["Edgar", "Leon", "Mortis"],
      "Gene": ["Edgar", "Leon", "Crow"],
      "Pam": ["Piper", "Nani", "Belle"],
      "Poco": ["Brock", "Tick", "Sprout"]
    },
    tips: [
      "Water lanes are key for rotation",
      "Don't get trapped on your side",
      "Bridge control wins games",
      "Gem carrier should stay mid"
    ],
    lanes: ["Left Bridge: Flank route", "Mid: Gem control", "Right Bridge: Escape route"],
    teamComp: ["Gem Carrier", "Healer", "Tank"],
    bans: ["Edgar", "Leon"]
  }
];

const SUGGESTED_BANS: SuggestedBan[] = [
  { brawler: "Edgar", reason: "Too strong in close-range maps, hard to counter without specific picks", tier: "S" },
  { brawler: "Kit", reason: "Dominates hot zone and gem grab, self-sustain makes him hard to kill", tier: "S" },
  { brawler: "Draco", reason: "Best tank in meta, wins most matchups in close combat", tier: "S" },
  { brawler: "Leon", reason: "Invisible assassin can pick off carries easily", tier: "A" },
  { brawler: "Crow", reason: "Poison prevents healing, strong in showdown and hot zone", tier: "A" },
  { brawler: "Fang", reason: "One-shot potential with super, great in brawl ball", tier: "A" }
];

const DRAFT_STRATEGIES: DraftStrategy[] = [
  {
    position: 1,
    title: "First Pick",
    strategy: "Pick your strongest meta brawler or the map's best first pick",
    tips: [
      "Choose a safe pick that works in multiple modes",
      "Don't reveal your carry if you're second picking",
      "Consider what the enemy might counter with"
    ]
  },
  {
    position: 2,
    title: "Second Pick",
    strategy: "Counter pick the enemy's first choice or pick a strong team synergist",
    tips: [
      "If they picked sniper, consider assassin",
      "If they picked tank, consider control/damage dealer",
      "Save your best brawler for last pick if possible"
    ]
  },
  {
    position: 3,
    title: "Third Pick",
    strategy: "Complete your team composition or pick your win condition",
    tips: [
      "This is your 'carry' pick - your best brawler",
      "Fill the missing role in your team",
      "Pick what can turn the game around"
    ]
  }
];

// ============ TIER COLORS ============
const TIER_COLORS: Record<string, string> = {
  S: 'from-yellow-400 via-amber-500 to-orange-600',
  A: 'from-emerald-400 via-green-500 to-teal-600',
  B: 'from-blue-400 via-cyan-500 to-indigo-600',
};

const TIER_TEXT_COLORS: Record<string, string> = {
  S: 'text-amber-400',
  A: 'text-emerald-400',
  B: 'text-blue-400',
};

const TIER_BG_COLORS: Record<string, string> = {
  S: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
  A: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
  B: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
};

// ============ COMPONENT ============
export function RankedTab() {
  const [expandedMap, setExpandedMap] = useState<string | null>(null);
  const [showAllBans, setShowAllBans] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string>('all');

  const filteredMaps = useMemo(() => {
    if (selectedMode === 'all') return RANKED_MAPS;
    return RANKED_MAPS.filter(map => map.mode.toLowerCase().includes(selectedMode.toLowerCase()));
  }, [selectedMode]);

  const uniqueModes = useMemo(() => {
    return [...new Set(RANKED_MAPS.map(m => m.mode))];
  }, []);

  const toggleMap = (mapName: string) => {
    setExpandedMap(expandedMap === mapName ? null : mapName);
  };

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-purple-500/10 via-red-500/10 to-orange-500/10 border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 via-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Ranked Mode Helper</h3>
                <p className="text-xs text-gray-400">Power League & Competitive Strategy</p>
              </div>
            </div>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              Season 30
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Mode Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          onClick={() => setSelectedMode('all')}
          variant={selectedMode === 'all' ? 'default' : 'outline'}
          size="sm"
          className={`flex-shrink-0 ${selectedMode === 'all' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'border-white/10'}`}
        >
          All Modes
        </Button>
        {uniqueModes.map((mode) => (
          <Button
            key={mode}
            onClick={() => setSelectedMode(mode)}
            variant={selectedMode === mode ? 'default' : 'outline'}
            size="sm"
            className={`flex-shrink-0 ${selectedMode === mode ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'border-white/10'}`}
          >
            {getModeDisplayName(mode)}
          </Button>
        ))}
      </div>

      {/* Ban Suggestions Section */}
      <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/5 border-red-500/20">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Ban className="w-4 h-4 text-red-400" />
              Suggested Bans This Season
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllBans(!showAllBans)}
              className="text-xs"
            >
              {showAllBans ? 'Show Less' : 'Show All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(showAllBans ? SUGGESTED_BANS : SUGGESTED_BANS.slice(0, 3)).map((ban, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
              >
                <BrawlerAvatar name={ban.brawler} size="md" showTier={true} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{ban.brawler}</p>
                    <Badge className={`${TIER_BG_COLORS[ban.tier]} text-xs`}>
                      Tier {ban.tier}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{ban.reason}</p>
                </div>
                <Ban className="w-4 h-4 text-red-400 flex-shrink-0" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Draft Strategy Section */}
      <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/5 border-cyan-500/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Layers className="w-4 h-4 text-cyan-400" />
            Draft Order Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3">
            {DRAFT_STRATEGIES.map((strategy, i) => (
              <div
                key={i}
                className="p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${TIER_COLORS[i === 0 ? 'S' : i === 1 ? 'A' : 'B']} flex items-center justify-center`}>
                    <span className="text-sm font-bold text-white">{strategy.position}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{strategy.title}</p>
                    <p className="text-xs text-gray-500">Pick #{strategy.position}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-2">{strategy.strategy}</p>
                <div className="space-y-1">
                  {strategy.tips.map((tip, j) => (
                    <div key={j} className="flex items-start gap-1.5 text-xs text-gray-500">
                      <Lightbulb className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ranked Maps Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Map className="w-5 h-5 text-purple-400" />
          Current Ranked Maps
        </h3>
        
        {filteredMaps.map((map, index) => (
          <motion.div
            key={map.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`bg-white/5 border-white/10 overflow-hidden transition-all ${
              expandedMap === map.name ? 'border-amber-500/30' : ''
            }`}>
              {/* Map Header */}
              <div
                className="relative cursor-pointer"
                onClick={() => toggleMap(map.name)}
              >
                {/* Map Background */}
                <div className="absolute inset-0 opacity-20">
                  <img
                    src={map.image}
                    alt={map.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
                </div>

                <CardContent className="relative p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Map Info */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20">
                        <img
                          src={map.image}
                          alt={map.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold">{map.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                            {getModeDisplayName(map.mode)}
                          </Badge>
                          <span className="text-xs text-gray-500">Ranked</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* First Pick Preview */}
                      <div className="hidden sm:flex items-center gap-2">
                        <span className="text-xs text-gray-400">First Pick:</span>
                        <BrawlerAvatar name={map.firstPick} size="sm" showTier={true} />
                        <Badge className={`${TIER_BG_COLORS[map.firstPickTier]} text-xs`}>
                          {map.firstPickTier}
                        </Badge>
                      </div>
                      {expandedMap === map.name ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedMap === map.name && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <CardContent className="pt-0 space-y-4">
                      {/* First Pick Section */}
                      <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/5 rounded-xl border border-amber-500/20">
                        <div className="flex items-center gap-2 mb-3">
                          <Sword className="w-4 h-4 text-amber-400" />
                          <h5 className="font-semibold text-sm">First Pick Recommendation</h5>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                          <BrawlerAvatar name={map.firstPick} size="lg" showTier={true} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-lg">{map.firstPick}</p>
                              <Badge className={`${TIER_BG_COLORS[map.firstPickTier]}`}>
                                Tier {map.firstPickTier}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400">{map.firstPickReason}</p>
                          </div>
                        </div>
                        {/* Alternative Picks */}
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs text-gray-500">Alternatives:</span>
                          <div className="flex gap-1.5">
                            {map.alternatives.map((alt, i) => (
                              <BrawlerAvatar key={i} name={alt} size="sm" showTier={true} />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Counter Picks */}
                      <div className="p-4 bg-gradient-to-r from-red-500/10 to-rose-500/5 rounded-xl border border-red-500/20">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield className="w-4 h-4 text-red-400" />
                          <h5 className="font-semibold text-sm">Counter Picks</h5>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {Object.entries(map.counters).slice(0, 4).map(([brawler, counters]) => (
                            <div key={brawler} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                              <BrawlerAvatar name={brawler} size="sm" showTier={true} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-400">{brawler} countered by:</p>
                                <div className="flex gap-1 flex-wrap">
                                  {counters.map((counter, i) => (
                                    <Badge key={i} className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">
                                      {counter}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Map Tips & Lanes */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Tips */}
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                            <h5 className="font-semibold text-sm">Map Tips</h5>
                          </div>
                          <div className="space-y-2">
                            {map.tips.map((tip, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                                <span className="text-amber-400">•</span>
                                <span>{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Lanes */}
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center gap-2 mb-3">
                            <Target className="w-4 h-4 text-cyan-400" />
                            <h5 className="font-semibold text-sm">Lane Strategy</h5>
                          </div>
                          <div className="space-y-2">
                            {map.lanes.map((lane, i) => (
                              <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                                <span className="text-cyan-400">→</span>
                                <span>{lane}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Team Composition */}
                      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/5 rounded-xl border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-4 h-4 text-purple-400" />
                          <h5 className="font-semibold text-sm">Recommended Team Composition</h5>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {map.teamComp.map((role, i) => (
                            <Badge key={i} className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Bans for this Map */}
                      <div className="flex items-center gap-2 text-sm">
                        <Ban className="w-4 h-4 text-red-400" />
                        <span className="text-gray-400">Recommended bans:</span>
                        <div className="flex gap-1.5">
                          {map.bans.map((ban, i) => (
                            <Badge key={i} className="bg-red-500/20 text-red-400 border-red-500/30">
                              {ban}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Reference Card */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border-emerald-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="font-semibold text-sm mb-2">Pro Tips for Ranked</h5>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li>• Always check enemy brawler levels before committing to picks</li>
                <li>• If your team loses first round, consider banning the enemy's best brawler</li>
                <li>• Communication with teammates improves win rate by 20%+</li>
                <li>• Pick comfort picks over meta picks if you're significantly better with them</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RankedTab;
