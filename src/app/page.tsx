/**
 * BrawlTracker ULTIMATE - Premium UI
 * The best Brawl Stars app ever created
 * @author Bruno Paulon
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Swords, Target, Zap, Crown, Star, TrendingUp,
  Calendar, Lock, Unlock, Sparkles, Search, Loader2,
  AlertCircle, BarChart3, MapPin, Users, CheckCircle,
  ChevronRight, ChevronDown, Filter, RefreshCw, Globe,
  Shield, Flame, Clock, Medal, Award, Heart, Share2,
  Settings, Menu, X, Home, Gamepad2, Crown as ClubIcon,
  Radio, User, ChevronUp, Layers, Eye, Bookmark, Play,
  Lightbulb, Zap as ZapIcon, Info, History, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BRAWL_API_KEY, APP_CONFIG } from '@/lib/config';
import {
  Player,
  BattleLogItem,
  Brawler,
  Event,
  RankingPlayer,
  ClubMember,
  AnalysisResult,
  PlayerStats
} from '@/types';
import { analyzePlayer, calculatePlayerStats, BRAWLER_META } from '@/services/AnalysisService';
import {
  getPlayer,
  getBattleLog,
  getBrawlers,
  getEvents,
  getPlayerRankings,
  getClub
} from '@/services/BrawlAPIClient';
import { LabTab } from '@/components/brawl/LabTab';
import { BrawlerAvatar, BrawlerGrid, setBrawlerImageCache } from '@/components/brawl/BrawlerAvatar';
import { getBrawlerMeta, TIER_LIST_2026, META_VERSION } from '@/services/MetaDataService';
import { getMapImage, getModeDisplayName, getGadgetIcon, getStarPowerIcon, getGearIcon } from '@/services/AssetService';

// ============ STORAGE ============
const STORAGE_KEY_TAG = 'brawltracker_tag';
const STORAGE_KEY_FAVORITES = 'brawltracker_favorites';
const STORAGE_KEY_HISTORY = 'brawltracker_history';

// ============ ANIMATIONS ============
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

// ============ HISTORY PLAYER TYPE ============
interface HistoryPlayer {
  tag: string;
  name: string;
  trophies: number;
  timestamp: number;
}

// ============ REAL-TIME GUIDE TYPE ============
interface RealTimeGuide {
  brawler: string;
  brawlerId: number;
  mode: string;
  map: string;
  reason: string;
  gadget: string;
  starPower: string;
  gear: string;
  tips: string[];
  tier: string;
  winRate: number;
}

// ============ MAIN COMPONENT ============
export default function BrawlTrackerUltimate() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'brawlers' | 'rankings' | 'events' | 'analysis' | 'lab'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Player Data
  const [playerTag, setPlayerTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [battleLog, setBattleLog] = useState<BattleLogItem[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  // Game Data
  const [allBrawlers, setAllBrawlers] = useState<Brawler[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [rankings, setRankings] = useState<RankingPlayer[]>([]);
  const [isLoadingGameData, setIsLoadingGameData] = useState(false);

  // Filters
  const [brawlerFilter, setBrawlerFilter] = useState<'all' | 'focus' | 'improve' | 'maintain'>('all');
  const [brawlerSearch, setBrawlerSearch] = useState('');
  const [rankingRegion, setRankingRegion] = useState<'global' | 'BR'>('BR');

  // Favorites & History
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryPlayer[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Real-time guide
  const [realTimeGuide, setRealTimeGuide] = useState<RealTimeGuide | null>(null);

  // Load saved data
  useEffect(() => {
    const savedTag = localStorage.getItem(STORAGE_KEY_TAG);
    const savedFavorites = localStorage.getItem(STORAGE_KEY_FAVORITES);
    const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (savedTag) setPlayerTag(savedTag);
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Load game data on mount
  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    setIsLoadingGameData(true);
    try {
      const [brawlersData, eventsData] = await Promise.all([
        getBrawlers(BRAWL_API_KEY),
        getEvents(BRAWL_API_KEY)
      ]);
      
      const brawlersList = brawlersData.items || [];
      setAllBrawlers(brawlersList);
      setEvents(eventsData.items || []);
      
      // Build image cache from API
      const imageCache: Record<string, string> = {};
      brawlersList.forEach((b: Brawler) => {
        if (b.imageUrl) {
          imageCache[b.id.toString()] = b.imageUrl;
          imageCache[b.name] = b.imageUrl;
        }
        if (b.avatarUrl) {
          imageCache[`${b.id}-avatar`] = b.avatarUrl;
        }
      });
      setBrawlerImageCache(imageCache);
      
    } catch (e) {
      console.error('Failed to load game data:', e);
    } finally {
      setIsLoadingGameData(false);
    }
  };

  const loadRankings = async () => {
    try {
      const region = rankingRegion === 'global' ? 'global' : 'BR';
      const data = await getPlayerRankings(region, BRAWL_API_KEY, 50);
      setRankings(data.items || []);
    } catch (e) {
      console.error('Failed to load rankings:', e);
    }
  };

  useEffect(() => {
    if (activeTab === 'rankings') {
      loadRankings();
    }
  }, [activeTab, rankingRegion]);

  // Generate real-time guide
  const generateRealTimeGuide = useCallback(() => {
    if (!player || !events.length || !allBrawlers.length) return null;

    // Get current event
    const currentEvent = events[0];
    const mode = currentEvent?.event?.mode || 'Gem Grab';
    const map = currentEvent?.event?.map || 'Hard Rock Mine';

    // Find best brawler for this mode/map from player's roster
    const meta = TIER_LIST_2026;
    const availableBrawlers = player.brawlers
      .filter(b => b.trophies >= 500) // Only decent brawlers
      .sort((a, b) => {
        const tierA = getBrawlerMeta(a.name)?.tier || 'C';
        const tierB = getBrawlerMeta(b.name)?.tier || 'C';
        const tierOrder = { 'S': 0, 'A': 1, 'B': 2, 'C': 3, 'D': 4 };
        return tierOrder[tierA] - tierOrder[tierB];
      });

    if (availableBrawlers.length === 0) return null;

    const bestBrawler = availableBrawlers[0];
    const brawlerMeta = getBrawlerMeta(bestBrawler.name);
    const brawlerData = allBrawlers.find(b => b.name === bestBrawler.name);

    // Generate guide
    const guide: RealTimeGuide = {
      brawler: bestBrawler.name,
      brawlerId: bestBrawler.id,
      mode,
      map,
      reason: brawlerMeta?.tier === 'S' || brawlerMeta?.tier === 'A' 
        ? `${bestBrawler.name} is Tier ${brawlerMeta?.tier} - great for ${mode}!`
        : `${bestBrawler.name} has ${bestBrawler.trophies} trophies with you`,
      gadget: brawlerData?.gadgets?.[0]?.name || 'Choose your preferred gadget',
      starPower: brawlerData?.starPowers?.[0]?.name || 'Choose your preferred star power',
      gear: bestBrawler.trophies >= 500 ? 'Speed + Damage' : 'Unlock gears at power 8+',
      tips: brawlerMeta?.tips || ['Play carefully', 'Use super strategically'],
      tier: brawlerMeta?.tier || 'C',
      winRate: 55 + Math.floor(Math.random() * 10),
    };

    return guide;
  }, [player, events, allBrawlers]);

  useEffect(() => {
    if (player && events.length > 0) {
      const guide = generateRealTimeGuide();
      setRealTimeGuide(guide);
    }
  }, [player, events, generateRealTimeGuide]);

  // Search player
  const handleSearch = useCallback(async (tag?: string) => {
    const searchTag = tag || playerTag;
    if (!searchTag.trim()) {
      setError('Enter player tag');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      localStorage.setItem(STORAGE_KEY_TAG, searchTag);

      const [playerData, battleLogData] = await Promise.all([
        getPlayer(searchTag, BRAWL_API_KEY),
        getBattleLog(searchTag, BRAWL_API_KEY)
      ]);

      setPlayer(playerData);
      setBattleLog(battleLogData.items || []);
      
      // Generate analysis
      const analysisResult = analyzePlayer(playerData, battleLogData.items, allBrawlers);
      setAnalysis(analysisResult);

      // Add to history
      const newHistory: HistoryPlayer = {
        tag: playerData.tag,
        name: playerData.name,
        trophies: playerData.trophies,
        timestamp: Date.now()
      };
      const updatedHistory = [newHistory, ...history.filter(h => h.tag !== playerData.tag)].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updatedHistory));
      setShowHistory(false);

    } catch (e: any) {
      setError(e.message || 'Error fetching data');
    } finally {
      setIsLoading(false);
    }
  }, [playerTag, allBrawlers, history]);

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  };

  // Stats calculation
  const stats: PlayerStats | null = useMemo(() => {
    return player ? calculatePlayerStats(player) : null;
  }, [player]);

  // Get brawler image URL
  const getBrawlerImageUrl = useCallback((name: string, id?: number) => {
    const brawler = allBrawlers.find(b => b.name === name || b.id === id);
    return brawler?.imageUrl || brawler?.avatarUrl;
  }, [allBrawlers]);

  // Filter brawlers
  const filteredBrawlers = useMemo(() => {
    if (!analysis) return [];
    
    let filtered = analysis.brawlerAnalysis;
    
    if (brawlerFilter !== 'all') {
      filtered = filtered.filter(b => b.priority === brawlerFilter);
    }
    
    if (brawlerSearch) {
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(brawlerSearch.toLowerCase())
      );
    }
    
    return filtered;
  }, [analysis, brawlerFilter, brawlerSearch]);

  // Toggle favorite
  const toggleFavorite = (tag: string) => {
    const newFavorites = favorites.includes(tag)
      ? favorites.filter(t => t !== tag)
      : [...favorites, tag];
    setFavorites(newFavorites);
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(newFavorites));
  };

  // History Sidebar Component
  const HistorySidebar = () => (
    <Card className="bg-white/5 border-white/10 sticky top-24">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <History className="w-4 h-4 text-amber-400" />
            Recent Players
          </CardTitle>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearHistory} className="h-6 px-2 text-xs text-gray-500">
              <Trash2 className="w-3 h-3 mr-1" /> Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {history.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4">
            No recent searches
          </p>
        ) : (
          <div className="space-y-2">
            {history.map((h) => (
              <button
                key={h.tag}
                onClick={() => handleSearch(h.tag)}
                className={`w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors text-left ${
                  player?.tag === h.tag ? 'bg-amber-500/10 border border-amber-500/20' : ''
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center text-sm">
                  {h.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{h.name}</p>
                  <p className="text-xs text-gray-500">{h.trophies.toLocaleString()} 🏆</p>
                </div>
                {favorites.includes(h.tag) && (
                  <Heart className="w-3 h-3 text-red-400 fill-red-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950/30 to-slate-950 text-white overflow-x-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-l from-purple-500/10 via-pink-500/5 to-transparent rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Mobile Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                  BrawlTracker
                </h1>
                <p className="text-[10px] text-gray-500 font-medium tracking-wider">ULTIMATE EDITION</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'home', icon: Home, label: 'Home' },
                { id: 'brawlers', icon: Swords, label: 'Brawlers' },
                { id: 'rankings', icon: Medal, label: 'Rankings' },
                { id: 'events', icon: Radio, label: 'Events' },
                { id: 'analysis', icon: Sparkles, label: 'Analysis' },
                { id: 'lab', icon: Zap, label: 'LAB' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 shadow-lg shadow-amber-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Player Badge or Search Toggle */}
            <div className="flex items-center gap-2">
              {player && (
                <Badge className="hidden sm:flex bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400 px-3">
                  <Crown className="w-3 h-3 mr-1.5" />
                  {player.trophies.toLocaleString()}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                type="text"
                value={playerTag}
                onChange={(e) => setPlayerTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter your tag (ex: #ABC123)"
                className="pl-10 h-10 bg-white/5 border-white/10 focus:border-amber-500/50 text-white placeholder:text-gray-500"
              />
              {/* History Dropdown */}
              {history.length > 0 && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    <History className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              )}
              {showHistory && history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-white/10 rounded-lg shadow-xl z-50 max-h-64 overflow-auto"
                >
                  <div className="p-2 flex items-center justify-between border-b border-white/5">
                    <span className="text-xs text-gray-400">Recent searches</span>
                    <Button variant="ghost" size="sm" onClick={clearHistory} className="h-6 px-2 text-xs">
                      <Trash2 className="w-3 h-3 mr-1" /> Clear
                    </Button>
                  </div>
                  {history.map((h) => (
                    <button
                      key={h.tag}
                      onClick={() => {
                        setPlayerTag(h.tag);
                        handleSearch(h.tag);
                      }}
                      className="w-full flex items-center gap-3 p-2 hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{h.name}</p>
                        <p className="text-xs text-gray-500">{h.tag}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-amber-400">{h.trophies.toLocaleString()} 🏆</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
            <Button
              onClick={() => handleSearch()}
              disabled={isLoading || !playerTag}
              className="h-10 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-orange-500/30"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="py-3 grid grid-cols-3 gap-2">
                  {[
                    { id: 'home', icon: Home, label: 'Home' },
                    { id: 'brawlers', icon: Swords, label: 'Brawlers' },
                    { id: 'rankings', icon: Medal, label: 'Rankings' },
                    { id: 'events', icon: Radio, label: 'Events' },
                    { id: 'analysis', icon: Sparkles, label: 'Analysis' },
                    { id: 'lab', icon: Zap, label: 'LAB' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400'
                          : 'text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div {...fadeIn} className="mb-6">
                  <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading State */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32"
              >
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-amber-500/20 rounded-full animate-spin border-t-amber-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-amber-500" />
                  </div>
                </div>
                <p className="mt-6 text-gray-400 font-medium">Loading data...</p>
                <p className="text-sm text-gray-500">Analyzing your account</p>
              </motion.div>
            )}

            {/* Welcome Screen */}
            {!player && !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="relative inline-block mb-8">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/40">
                    <Trophy className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>

                <h2 className="text-4xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                    BrawlTracker
                  </span>
                  <span className="text-gray-400 ml-2">ULTIMATE</span>
                </h2>
                <p className="text-gray-400 max-w-lg mx-auto mb-8">
                  The best Brawl Stars analysis tool ever created. 
                  Complete statistics, advanced AI, real-time rankings and much more.
                </p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
                  {[
                    { icon: BarChart3, title: 'Complete Dashboard', desc: 'Advanced metrics' },
                    { icon: Swords, title: '+80 Brawlers', desc: 'Individual analysis' },
                    { icon: Medal, title: 'Global Rankings', desc: 'Top players' },
                    { icon: Sparkles, title: 'Advanced AI', desc: 'Personalized recommendations' },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-amber-500/30 transition-colors"
                    >
                      <feature.icon className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-xs text-gray-500">{feature.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span>API Key configured</span>
                  <span className="text-gray-600">•</span>
                  <span>IP: 213.22.190.252</span>
                </div>
              </motion.div>
            )}

            {/* Content Tabs */}
            {player && !isLoading && (
              <AnimatePresence mode="wait">
                {/* HOME TAB */}
                {activeTab === 'home' && (
                  <motion.div key="home" {...fadeIn} className="space-y-6">
                    {/* Real-Time Guide */}
                    {realTimeGuide && (
                      <Card className="relative overflow-hidden rounded-3xl border-emerald-500/30">
                        {/* Map Background */}
                        <div className="absolute inset-0 opacity-20">
                          <img 
                            src={getMapImage(realTimeGuide.mode)} 
                            alt="Map background"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
                        </div>
                        
                        <CardContent className="relative p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row items-start gap-4">
                            {/* Brawler Avatar */}
                            <div className="flex-shrink-0">
                              <BrawlerAvatar 
                                name={realTimeGuide.brawler} 
                                id={realTimeGuide.brawlerId}
                                imageUrl={getBrawlerImageUrl(realTimeGuide.brawler, realTimeGuide.brawlerId)}
                                size="xl"
                                showTier={true}
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Play className="w-4 h-4 text-emerald-400" />
                                <h3 className="font-bold text-lg text-emerald-400">NEXT MATCH</h3>
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                                  Tier {realTimeGuide.tier}
                                </Badge>
                              </div>
                              <p className="text-2xl font-bold mb-1">{realTimeGuide.brawler}</p>
                              <p className="text-sm text-gray-400 mb-4">{realTimeGuide.reason}</p>
                              
                              {/* Mode & Map with Images */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Gamepad2 className="w-4 h-4 text-cyan-400" />
                                    <p className="text-[10px] text-gray-400 uppercase">MODE</p>
                                  </div>
                                  <p className="text-sm font-bold text-white">{getModeDisplayName(realTimeGuide.mode)}</p>
                                </div>
                                
                                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                                  <div className="flex items-center gap-2 mb-1">
                                    <MapPin className="w-4 h-4 text-purple-400" />
                                    <p className="text-[10px] text-gray-400 uppercase">MAP</p>
                                  </div>
                                  <p className="text-sm font-bold text-white truncate">{realTimeGuide.map}</p>
                                </div>
                                
                                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                                  <div className="flex items-center gap-2 mb-1">
                                    <img src={getGadgetIcon()} alt="Gadget" className="w-4 h-4 rounded" />
                                    <p className="text-[10px] text-gray-400 uppercase">GADGET</p>
                                  </div>
                                  <p className="text-xs font-medium text-white truncate">{realTimeGuide.gadget}</p>
                                </div>
                                
                                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                                  <div className="flex items-center gap-2 mb-1">
                                    <img src={getStarPowerIcon()} alt="Star Power" className="w-4 h-4 rounded" />
                                    <p className="text-[10px] text-gray-400 uppercase">STAR POWER</p>
                                  </div>
                                  <p className="text-xs font-medium text-white truncate">{realTimeGuide.starPower}</p>
                                </div>
                              </div>

                              {/* Gear & Tips */}
                              <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-2">
                                  <img src={getGearIcon()} alt="Gear" className="w-5 h-5" />
                                  <span className="text-xs text-gray-300">{realTimeGuide.gear}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                                  <p className="text-xs text-gray-300">{realTimeGuide.tips[0]}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Player Hero */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-purple-500/10 border border-white/10 p-4 sm:p-6">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-l from-amber-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                      
                      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold">{player.name}</h2>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                {player.trophies.toLocaleString()} trophies
                              </span>
                              <span className="flex items-center gap-1">
                                <Crown className="w-3.5 h-3.5 text-yellow-400" />
                                Record: {player.highestTrophies.toLocaleString()}
                              </span>
                            </div>
                            {player.club && (
                              <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                                <Shield className="w-3 h-3" />
                                {player.club.name}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/10 hover:bg-white/5"
                            onClick={() => toggleFavorite(player.tag)}
                          >
                            <Heart className={`w-4 h-4 mr-2 ${favorites.includes(player.tag) ? 'fill-red-500 text-red-500' : ''}`} />
                            Favorite
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Goals Progress */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Trophy Goal */}
                      <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20 overflow-hidden">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Trophy Goal</p>
                                <p className="text-2xl font-bold text-amber-400">
                                  {player.trophies.toLocaleString()}
                                  <span className="text-gray-500 text-sm font-normal">/100,000</span>
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                              {stats?.progressToGoal}%
                            </Badge>
                          </div>
                          <Progress value={stats?.progressToGoal || 0} className="h-2 bg-black/30" />
                          <p className="text-xs text-gray-500 mt-2">
                            {(100000 - player.trophies).toLocaleString()} trophies remaining
                          </p>
                        </CardContent>
                      </Card>

                      {/* Brawler Goal */}
                      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/20 overflow-hidden">
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center">
                                <Star className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">Brawlers @ 1000</p>
                                <p className="text-2xl font-bold text-purple-400">
                                  {stats?.brawlersAt1000}
                                  <span className="text-gray-500 text-sm font-normal">/{stats?.totalBrawlers}</span>
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                              {stats ? Math.round((stats.brawlersAt1000 / stats.totalBrawlers) * 100) : 0}%
                            </Badge>
                          </div>
                          <Progress value={stats ? (stats.brawlersAt1000 / stats.totalBrawlers) * 100 : 0} className="h-2 bg-black/30" />
                          <p className="text-xs text-gray-500 mt-2">
                            {(stats?.totalBrawlers || 0) - (stats?.brawlersAt1000 || 0)} brawlers to upgrade
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { icon: Swords, value: `${stats?.winRate || 50}%`, label: 'Win Rate', color: 'emerald' },
                        { icon: Target, value: battleLog.filter(b => b.battle.result === 'victory').length, label: 'Recent Wins', color: 'blue' },
                        { icon: Users, value: player['3vs3Victories'].toLocaleString(), label: '3v3 Wins', color: 'amber' },
                        { icon: Crown, value: (player.soloVictories + player.duoVictories).toLocaleString(), label: 'SD Wins', color: 'yellow' },
                      ].map((stat, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-white/20 transition-all"
                        >
                          <stat.icon className={`w-6 h-6 text-${stat.color}-400 mb-2`} />
                          <p className="text-xl font-bold">{stat.value}</p>
                          <p className="text-xs text-gray-500">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Recent Battles */}
                    {battleLog.length > 0 && (
                      <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Clock className="w-4 h-4 text-amber-400" />
                            Recent Matches
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {battleLog.slice(0, 5).map((battle, i) => {
                              const brawlerName = battle.battle.players?.[0]?.brawler?.name || battle.battle.teams?.[0]?.[0]?.brawler?.name || 'Unknown';
                              const brawlerId = battle.battle.players?.[0]?.brawler?.id || battle.battle.teams?.[0]?.[0]?.brawler?.id;
                              return (
                                <div
                                  key={i}
                                  className="flex items-center justify-between p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <BrawlerAvatar 
                                      name={brawlerName} 
                                      id={brawlerId} 
                                      imageUrl={getBrawlerImageUrl(brawlerName, brawlerId)}
                                      size="sm" 
                                      showTier={false} 
                                    />
                                    <div className="min-w-0">
                                      <p className="font-medium text-sm truncate">{brawlerName}</p>
                                      <p className="text-xs text-gray-500 truncate">
                                        {battle.event?.mode || battle.battle.mode} • {battle.event?.map || 'Unknown'}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                      battle.battle.result === 'victory'
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : battle.battle.result === 'defeat'
                                        ? 'bg-red-500/20 text-red-400'
                                        : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                      {battle.battle.result === 'victory' ? <Trophy className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                    </div>
                                    <Badge variant="outline" className={`text-xs ${
                                      (battle.battle.trophyChange || 0) >= 0
                                        ? 'border-emerald-500/30 text-emerald-400'
                                        : 'border-red-500/30 text-red-400'
                                    }`}>
                                      {(battle.battle.trophyChange || 0) >= 0 ? '+' : ''}{battle.battle.trophyChange || 0}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Daily Recommendations */}
                    {analysis && analysis.dailyPlan.length > 0 && (
                      <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/5 border-cyan-500/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            Recommended Today
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                            {analysis.dailyPlan.slice(0, 3).map((plan, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10"
                              >
                                <BrawlerAvatar 
                                  name={plan.brawler} 
                                  id={plan.brawlerId} 
                                  imageUrl={getBrawlerImageUrl(plan.brawler, plan.brawlerId)}
                                  size="sm" 
                                  showTier={true} 
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{plan.brawler}</p>
                                  <p className="text-xs text-gray-500 truncate">{plan.mode} • {plan.map}</p>
                                </div>
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs whitespace-nowrap">
                                  +{plan.estimatedTrophies}🏆
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                )}

                {/* BRAWLERS TAB */}
                {activeTab === 'brawlers' && analysis && (
                  <motion.div key="brawlers" {...fadeIn} className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                          value={brawlerSearch}
                          onChange={(e) => setBrawlerSearch(e.target.value)}
                          placeholder="Search brawler..."
                          className="pl-10 bg-white/5 border-white/10"
                        />
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {[
                          { id: 'all', label: 'All' },
                          { id: 'focus', label: 'Focus' },
                          { id: 'improve', label: 'Improve' },
                          { id: 'maintain', label: 'OK' },
                        ].map((filter) => (
                          <Button
                            key={filter.id}
                            variant={brawlerFilter === filter.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setBrawlerFilter(filter.id as any)}
                            className={brawlerFilter === filter.id
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 whitespace-nowrap'
                              : 'border-white/10 hover:bg-white/5 whitespace-nowrap'
                            }
                          >
                            {filter.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Brawler Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                      {filteredBrawlers.map((brawler, i) => (
                        <motion.div
                          key={brawler.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <Card className={`overflow-hidden transition-all hover:scale-[1.02] ${
                            brawler.priority === 'focus'
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : brawler.priority === 'improve'
                              ? 'bg-amber-500/10 border-amber-500/30'
                              : 'bg-white/5 border-white/10'
                          }`}>
                            <CardContent className="p-3 sm:p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <BrawlerAvatar 
                                    name={brawler.name} 
                                    id={brawler.id}
                                    imageUrl={getBrawlerImageUrl(brawler.name, brawler.id)}
                                    size="md"
                                    trophies={brawler.trophies}
                                    power={brawler.power}
                                    showTier={true}
                                  />
                                  <div className="min-w-0">
                                    <h3 className="font-semibold text-sm sm:text-base truncate">{brawler.name}</h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <span className="font-medium text-amber-400">{brawler.trophies}🏆</span>
                                      <span className="hidden sm:inline">/1000</span>
                                    </div>
                                  </div>
                                </div>
                                <Badge variant="outline" className={`hidden sm:flex ${
                                  brawler.priority === 'focus'
                                    ? 'border-emerald-500/30 text-emerald-400'
                                    : brawler.priority === 'improve'
                                    ? 'border-amber-500/30 text-amber-400'
                                    : 'border-gray-500/30 text-gray-400'
                                }`}>
                                  {brawler.priority === 'focus' ? 'FOCUS' : brawler.priority === 'improve' ? 'UP' : 'OK'}
                                </Badge>
                              </div>

                              <Progress value={brawler.targetProgress} className="h-1.5 mb-3" />

                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-black/20 rounded-lg p-2">
                                  <p className="text-gray-500 mb-0.5">Modes</p>
                                  <p className="text-gray-300 truncate text-[11px]">{brawler.bestModes.slice(0, 2).join(', ')}</p>
                                </div>
                                <div className="bg-black/20 rounded-lg p-2">
                                  <p className="text-gray-500 mb-0.5">Maps</p>
                                  <p className="text-gray-300 truncate text-[11px]">{brawler.bestMaps.slice(0, 2).join(', ')}</p>
                                </div>
                              </div>

                              {brawler.tips.length > 0 && (
                                <div className="mt-3 p-2 bg-black/20 rounded-lg">
                                  <p className="text-xs text-amber-400 truncate">💡 {brawler.tips[0]}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* RANKINGS TAB */}
                {activeTab === 'rankings' && (
                  <motion.div key="rankings" {...fadeIn} className="space-y-4">
                    {/* Region Toggle */}
                    <div className="flex gap-2">
                      {[
                        { id: 'BR', label: 'Brazil' },
                        { id: 'global', label: 'Global' },
                      ].map((region) => (
                        <Button
                          key={region.id}
                          variant={rankingRegion === region.id ? 'default' : 'outline'}
                          onClick={() => setRankingRegion(region.id as any)}
                          className={rankingRegion === region.id
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                            : 'border-white/10 hover:bg-white/5'
                          }
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          {region.label}
                        </Button>
                      ))}
                    </div>

                    {/* Rankings List */}
                    <Card className="bg-white/5 border-white/10">
                      <CardContent className="p-0">
                        {rankings.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-4" />
                            <p className="text-gray-400">Loading rankings...</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-white/5">
                            {rankings.map((player, i) => (
                              <button
                                key={player.tag}
                                onClick={() => {
                                  setPlayerTag(player.tag);
                                  handleSearch(player.tag);
                                }}
                                className={`w-full flex items-center justify-between p-3 sm:p-4 hover:bg-white/5 transition-colors ${
                                  i < 3 ? 'bg-gradient-to-r from-amber-500/5 to-transparent' : ''
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                                    i === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-white' :
                                    i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                                    i === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-700 text-white' :
                                    'bg-white/10 text-gray-400'
                                  }`}>
                                    {player.rank || i + 1}
                                  </div>
                                  <div className="text-left">
                                    <p className="font-medium">{player.name}</p>
                                    {player.club && (
                                      <p className="text-xs text-gray-500">{player.club.name}</p>
                                    )}
                                  </div>
                                </div>
                                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                                  <Trophy className="w-3 h-3 mr-1" />
                                  {player.trophies.toLocaleString()}
                                </Badge>
                              </button>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* EVENTS TAB */}
                {activeTab === 'events' && (
                  <motion.div key="events" {...fadeIn} className="space-y-4">
                    {/* Meta Version Banner */}
                    <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/5 border-purple-500/20">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-600 rounded-lg flex items-center justify-center">
                              <Info className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Meta Data v{META_VERSION.version}</p>
                              <p className="text-xs text-gray-500">{META_VERSION.season}</p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                            {events.length} active events
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {isLoadingGameData ? (
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="w-12 h-12 text-amber-400 animate-spin mb-4" />
                          <p className="text-gray-400">Loading events...</p>
                        </CardContent>
                      </Card>
                    ) : events.length === 0 ? (
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <Radio className="w-12 h-12 text-gray-600 mb-4" />
                          <p className="text-gray-400">No active events at the moment</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {events.map((event, i) => (
                          <motion.div
                            key={event.slotId || i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border-cyan-500/20 overflow-hidden hover:scale-[1.02] transition-transform">
                              <CardContent className="p-3 sm:p-4">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                                    <Gamepad2 className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">{event.event?.mode || 'Unknown'}</h3>
                                    <p className="text-xs text-gray-500">{event.event?.map || 'Unknown'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-500">Slot {event.slotId}</span>
                                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Active
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ANALYSIS TAB */}
                {activeTab === 'analysis' && analysis && (
                  <motion.div key="analysis" {...fadeIn} className="space-y-6">
                    {/* Strengths & Weaknesses */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="bg-emerald-500/10 border-emerald-500/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-emerald-400">
                            <Unlock className="w-5 h-5" />
                            Strengths
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.strengths.map((s, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <Star className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-300">{s}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="bg-red-500/10 border-red-500/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-red-400">
                            <Lock className="w-5 h-5" />
                            Areas to Improve
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {analysis.weaknesses.map((w, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <Target className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-300">{w}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recommendations */}
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-amber-400" />
                          Personalized Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analysis.recommendations.map((rec, i) => (
                            <div
                              key={i}
                              className={`p-4 rounded-xl border ${
                                rec.priority === 'high'
                                  ? 'bg-red-500/10 border-red-500/20'
                                  : rec.priority === 'medium'
                                  ? 'bg-amber-500/10 border-amber-500/20'
                                  : 'bg-white/5 border-white/10'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium">{rec.title}</h4>
                                <Badge className={
                                  rec.priority === 'high'
                                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                    : rec.priority === 'medium'
                                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                    : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                }>
                                  {rec.priority === 'high' ? 'High' : rec.priority === 'medium' ? 'Medium' : 'Low'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-400 mb-2">{rec.description}</p>
                              <p className="text-sm text-amber-400">{rec.actionable}</p>
                              <p className="text-xs text-emerald-400 mt-2">Impact: {rec.estimatedImpact}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Meta Insights */}
                    <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/5 border-purple-500/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-purple-400" />
                          Current Meta Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {analysis.metaInsights.map((insight, i) => (
                            <div key={i} className="flex items-center gap-2 p-3 bg-white/5 rounded-xl">
                              <ZapIcon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                              <span className="text-sm text-gray-300">{insight}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* LAB TAB */}
                {activeTab === 'lab' && player && (
                  <LabTab 
                    player={player} 
                    battleLog={battleLog} 
                    analysis={analysis} 
                    stats={stats} 
                  />
                )}
              </AnimatePresence>
            )}
          </div>

          {/* History Sidebar - Always visible on desktop */}
          {history.length > 0 && (
            <div className="hidden lg:block w-64 flex-shrink-0">
              <HistorySidebar />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            BrawlTracker ULTIMATE • Developed by <span className="text-amber-400">Bruno Paulon</span>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            GitHub: <a href="https://github.com/bfrpaulondev/BrawlTracker" className="hover:text-amber-400 transition-colors">bfrpaulondev/BrawlTracker</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
