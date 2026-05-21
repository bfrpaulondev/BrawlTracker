'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Swords, Radio, Medal, Users, Bot, Crown, Sparkles,
  TrendingUp, Target, Calculator, Flag, Film, Type, Calendar,
  FileText, Camera, BarChart3, Search, Loader2, Send, X,
  Trophy, ChevronRight, Star, Zap, Shield, Flame, Clock,
  Heart, Share2, Lightbulb, RefreshCw, Menu, ChevronDown,
  Play, Info, Plus, Minus, CheckCircle, AlertCircle, ArrowUp,
  Crosshair, BookOpen, Gift, PieChart, Activity, Layers,
  ArrowRight, Eye, ThumbsUp, MessageSquare, Wand2, SwordsIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { APP_CONFIG, RANKED_MAPS, RARITY_COLORS, CONTENT_PLATFORMS, CONTENT_FORMATS, POWER_POINT_COSTS } from '@/lib/config';
import type {
  Player, BattleLogItem, BrawlerInfo, EventItem, TabId,
  DraftSuggestion, BrawlerAdvice, AIPlayerAnalysis, PushPlan, ContentIdea, VideoScript,
  GoalTracker, BattleAnalysis, CounterPick, MetaReport, ScheduleWeek, TrendData
} from '@/types';

// ============ NAVIGATION CONFIG ============
const NAV_SECTIONS = [
  { label: 'Principal', items: [
    { id: 'dashboard' as TabId, icon: Home, label: 'Dashboard', color: 'from-amber-500 to-orange-600' },
    { id: 'brawlers' as TabId, icon: Swords, label: 'Brawlers', color: 'from-purple-500 to-violet-600' },
    { id: 'events' as TabId, icon: Radio, label: 'Eventos', color: 'from-emerald-500 to-green-600' },
    { id: 'rankings' as TabId, icon: Medal, label: 'Rankings', color: 'from-blue-500 to-cyan-600' },
    { id: 'club' as TabId, icon: Users, label: 'Clube', color: 'from-pink-500 to-rose-600' },
  ]},
  { label: 'Inteligência AI', items: [
    { id: 'coach' as TabId, icon: Bot, label: 'Coach AI', color: 'from-amber-500 to-orange-600' },
    { id: 'draft' as TabId, icon: Crown, label: 'Draft AI', color: 'from-emerald-500 to-green-600' },
    { id: 'advisor' as TabId, icon: Sparkles, label: 'Conselheiro', color: 'from-purple-500 to-violet-600' },
    { id: 'analysis' as TabId, icon: TrendingUp, label: 'Análise AI', color: 'from-cyan-500 to-blue-600' },
    { id: 'battles' as TabId, icon: Activity, label: 'Análise Batalhas', color: 'from-red-500 to-rose-600' },
    { id: 'push' as TabId, icon: Flame, label: 'Push Planner', color: 'from-orange-500 to-amber-600' },
    { id: 'meta' as TabId, icon: BarChart3, label: 'Meta Tracker', color: 'from-indigo-500 to-violet-600' },
    { id: 'counters' as TabId, icon: Crosshair, label: 'Counter Pick', color: 'from-teal-500 to-emerald-600' },
  ]},
  { label: 'Progressão', items: [
    { id: 'progression' as TabId, icon: Target, label: 'Plano 30 Dias', color: 'from-amber-500 to-orange-600' },
    { id: 'f2p' as TabId, icon: Gift, label: 'Guia F2P', color: 'from-emerald-500 to-green-600' },
    { id: 'calculator' as TabId, icon: Calculator, label: 'Calculadora', color: 'from-blue-500 to-cyan-600' },
    { id: 'goals' as TabId, icon: Flag, label: 'Metas', color: 'from-pink-500 to-rose-600' },
    { id: 'milestones' as TabId, icon: PieChart, label: 'Marcos', color: 'from-purple-500 to-violet-600' },
  ]},
  { label: 'Criador de Conteúdo', items: [
    { id: 'content' as TabId, icon: Film, label: 'Conteúdo', color: 'from-red-500 to-rose-600' },
    { id: 'titles' as TabId, icon: Type, label: 'Títulos', color: 'from-amber-500 to-orange-600' },
    { id: 'schedule' as TabId, icon: Calendar, label: 'Calendário', color: 'from-blue-500 to-cyan-600' },
    { id: 'script' as TabId, icon: FileText, label: 'Roteiro', color: 'from-emerald-500 to-green-600' },
    { id: 'recording' as TabId, icon: Camera, label: 'Gravação', color: 'from-purple-500 to-violet-600' },
    { id: 'trends' as TabId, icon: TrendingUp, label: 'Tendências', color: 'from-cyan-500 to-blue-600' },
  ]},
];

const MOBILE_NAV: { id: TabId; icon: any; label: string }[] = [
  { id: 'dashboard', icon: Home, label: 'Home' },
  { id: 'brawlers', icon: Swords, label: 'Brawlers' },
  { id: 'coach', icon: Bot, label: 'Coach' },
  { id: 'draft', icon: Crown, label: 'Draft' },
  { id: 'content', icon: Film, label: 'Criar' },
];

// ============ HELPER FUNCTIONS ============
function formatNum(n: number) { return n.toLocaleString('pt-BR'); }
function getBrawlerImg(id: number) { return APP_CONFIG.brawlerImageUrl(id); }

function formatBattleLog(battles: BattleLogItem[], tag: string) {
  return battles.slice(0, 20).map(b => {
    let brawler = 'Desconhecido';
    if (b.battle.teams && Array.isArray(b.battle.teams)) {
      for (const team of b.battle.teams) {
        if (!team?.players || !Array.isArray(team.players)) continue;
        const found = team.players.find(p => p?.tag === tag);
        if (found?.brawler) { brawler = found.brawler.name; break; }
      }
    } else if (b.battle.players && Array.isArray(b.battle.players)) {
      const found = b.battle.players.find(p => p?.tag === tag);
      if (found?.brawler) brawler = found.brawler.name;
    }
    return { mode: b.battle.mode, map: b.event?.map || '?', result: b.battle.result || 'unknown', brawler, trophyChange: b.battle.trophyChange || 0, time: b.battleTime, type: b.battle.type };
  });
}

// ============ MAIN COMPONENT ============
export default function BrawlTrackerV4() {
  // Core State
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [player, setPlayer] = useState<Player | null>(null);
  const [battleLog, setBattleLog] = useState<BattleLogItem[]>([]);
  const [allBrawlers, setAllBrawlers] = useState<BrawlerInfo[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchTag, setSearchTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // AI States
  const [aiLoading, setAiLoading] = useState(false);
  const [draftResult, setDraftResult] = useState<DraftSuggestion | null>(null);
  const [advisorResult, setAdvisorResult] = useState<BrawlerAdvice | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AIPlayerAnalysis | null>(null);
  const [pushResult, setPushResult] = useState<PushPlan | null>(null);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[] | null>(null);
  const [titleIdeas, setTitleIdeas] = useState<any[] | null>(null);
  const [scriptResult, setScriptResult] = useState<VideoScript | null>(null);
  const [trendsResult, setTrendsResult] = useState<TrendData[] | null>(null);
  const [progressionResult, setProgressionResult] = useState<any | null>(null);
  const [battleAnalysisResult, setBattleAnalysisResult] = useState<BattleAnalysis | null>(null);
  const [counterResult, setCounterResult] = useState<CounterPick[] | null>(null);
  const [metaResult, setMetaResult] = useState<MetaReport | null>(null);
  const [scheduleResult, setScheduleResult] = useState<ScheduleWeek | null>(null);
  const [f2pResult, setF2pResult] = useState<any | null>(null);
  const [goals, setGoals] = useState<GoalTracker[]>([]);

  // Coach Chat State
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Olá! Sou o Coach AI do BrawlTracker v4. Como posso te ajudar a melhorar no jogo? 🎮' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Filter / Sub States
  const [brawlerFilter, setBrawlerFilter] = useState('all');
  const [brawlerSearch, setBrawlerSearch] = useState('');
  const [brawlerSortBy, setBrawlerSortBy] = useState<'trophies' | 'power' | 'name'>('trophies');
  const [rankingRegion, setRankingRegion] = useState('global');
  const [rankingType, setRankingType] = useState<'players' | 'clubs'>('players');
  const [rankings, setRankings] = useState<any[]>([]);
  const [rankingsLoading, setRankingsLoading] = useState(false);
  const [clubTag, setClubTag] = useState('');
  const [club, setClub] = useState<any>(null);
  const [clubLoading, setClubLoading] = useState(false);

  // Form States
  const [draftMap, setDraftMap] = useState('');
  const [draftBrawlers, setDraftBrawlers] = useState('');
  const [draftEnemies, setDraftEnemies] = useState('');
  const [draftAllies, setDraftAllies] = useState('');
  const [draftBans, setDraftBans] = useState('');
  const [draftSituacao, setDraftSituacao] = useState('');
  const [advisorBrawler, setAdvisorBrawler] = useState('');
  const [advisorMode, setAdvisorMode] = useState('');
  const [counterEnemies, setCounterEnemies] = useState('');
  const [counterMode, setCounterMode] = useState('');
  const [contentTopic, setContentTopic] = useState('');
  const [contentPlatform, setContentPlatform] = useState('YouTube');
  const [contentFormat, setContentFormat] = useState('Vídeo Longo');
  const [titleTopic, setTitleTopic] = useState('');
  const [titlePlatform, setTitlePlatform] = useState('YouTube');
  const [scriptTopic, setScriptTopic] = useState('');
  const [scriptPlatform, setScriptPlatform] = useState('YouTube');
  const [scriptDuration, setScriptDuration] = useState('10 min');
  const [schedDaysPerWeek, setSchedDaysPerWeek] = useState('5');
  const [schedHoursPerDay, setSchedHoursPerDay] = useState('2');
  const [trendPlatform, setTrendPlatform] = useState('YouTube');
  const [calcCurrent, setCalcCurrent] = useState(1);
  const [calcTarget, setCalcTarget] = useState(11);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalUnit, setNewGoalUnit] = useState('troféus');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // ============ EFFECTS ============
  useEffect(() => {
    const saved = localStorage.getItem('bt_history');
    if (saved) setSearchHistory(JSON.parse(saved));
    const savedPlayer = localStorage.getItem('bt_player_tag');
    if (savedPlayer) handleSearch(savedPlayer);
    const savedGoals = localStorage.getItem('bt_goals');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => {
    fetch('/api/brawlers').then(r => r.json()).then(d => setAllBrawlers(d.items || [])).catch(() => {});
    fetch('/api/events').then(r => r.json()).then(d => setEvents(d.items || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setRankingsLoading(true);
    fetch('/api/rankings?region=' + rankingRegion + '&type=' + rankingType).then(r => r.json()).then(d => { setRankings(d.items || []); setRankingsLoading(false); }).catch(() => setRankingsLoading(false));
  }, [rankingRegion, rankingType]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  // ============ SEARCH ============
  const handleSearch = useCallback(async (tag?: string) => {
    const t = (tag || searchTag).trim();
    if (!t) return;
    setLoading(true);
    setError('');
    try {
      const formatted = t.startsWith('#') ? t : '#' + t;
      const res = await fetch('/api/player?tag=' + encodeURIComponent(formatted));
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setPlayer(data.player);
      setBattleLog(data.battleLog || []);
      setSearchHistory(prev => {
        const updated = [formatted, ...prev.filter(h => h !== formatted)].slice(0, 10);
        localStorage.setItem('bt_history', JSON.stringify(updated));
        return updated;
      });
      localStorage.setItem('bt_player_tag', formatted);
    } catch {
      setError('Erro ao buscar jogador');
    } finally {
      setLoading(false);
    }
  }, [searchTag]);

  // ============ AI CALLS ============
  const getPlayerContext = () => {
    if (!player) return null;
    const top = [...player.brawlers].sort((a, b) => b.trophies - a.trophies).slice(0, 10);
    return player.name + ' | Troféus: ' + player.trophies + ' | Maior: ' + player.highestTrophies + ' | Vitórias 3v3: ' + player['3vs3Victories'] + ' | Solo: ' + player.soloVictories + ' | Duo: ' + player.duoVictories + ' | Top brawlers: ' + top.map(b => b.name + '(P' + b.power + ',' + b.trophies + '🏆)').join(', ') + (player.club ? ' | Clube: ' + player.club.name : '');
  };

  const callAI = async (endpoint: string, body: any) => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/' + endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      return await res.json();
    } catch { return null; }
    finally { setAiLoading(false); }
  };

  // ============ GOALS ============
  const addGoal = () => {
    if (!newGoalTitle.trim() || !newGoalTarget) return;
    const goal: GoalTracker = {
      id: Date.now().toString(),
      title: newGoalTitle.trim(),
      target: parseInt(newGoalTarget),
      current: 0,
      unit: newGoalUnit,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...goals, goal];
    setGoals(updated);
    localStorage.setItem('bt_goals', JSON.stringify(updated));
    setNewGoalTitle('');
    setNewGoalTarget('');
  };

  const removeGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    localStorage.setItem('bt_goals', JSON.stringify(updated));
  };

  const updateGoalProgress = (id: string, delta: number) => {
    const updated = goals.map(g => g.id === id ? { ...g, current: Math.max(0, g.current + delta) } : g);
    setGoals(updated);
    localStorage.setItem('bt_goals', JSON.stringify(updated));
  };

  // ============ RENDER HELPERS ============
  const renderStatCard = (label: string, value: string | number, icon: any, color = 'text-amber-400') => (
    <div className="glass rounded-xl p-4 flex items-center gap-3 hover:bg-white/8 transition-colors">
      <div className={'w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 ' + color}>{icon}</div>
      <div><p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p><p className="text-lg font-bold text-white">{value}</p></div>
    </div>
  );

  const renderSectionTitle = (icon: any, title: string, color = 'text-amber-400') => (
    <h2 className="text-xl font-bold text-white flex items-center gap-2">{icon && <icon.className className={'w-5 h-5 ' + color} />}<span className={color}>{title}</span></h2>
  );

  const renderAILoading = () => (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="text-sm text-gray-400">Analisando com IA...</p>
      </div>
    </div>
  );

  const renderEmptyState = (icon: any, message: string) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
        {typeof icon === 'object' ? icon : <icon className="w-8 h-8 text-gray-600" />}
      </div>
      <p className="text-gray-500">{message}</p>
    </div>
  );

  // ============ TAB RENDERERS ============

  // 1. DASHBOARD
  const renderDashboard = () => {
    if (!player) return renderWelcome();
    const totalV = player['3vs3Victories'] + player.soloVictories + player.duoVictories;
    const maxed = player.brawlers.filter(b => b.power >= 11).length;
    const at1000 = player.brawlers.filter(b => b.trophies >= 1000).length;
    const recentBattles = formatBattleLog(battleLog, player.tag);
    const wins = recentBattles.filter(b => b.result === 'victory').length;
    const wr = recentBattles.length > 0 ? Math.round((wins / recentBattles.length) * 100) : 0;
    const avgTrophies = Math.round(player.brawlers.reduce((a, b) => a + b.trophies, 0) / player.brawlers.length);
    const totalSP = player.brawlers.reduce((a, b) => a + b.starPowers.length, 0);
    const totalGadgets = player.brawlers.reduce((a, b) => a + b.gadgets.length, 0);

    return (
      <div className="space-y-6">
        {/* Hero Card */}
        <div className="glass rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-full" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-amber-500/30">
              {player.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{player.name}</h2>
              <p className="text-sm text-gray-400">{player.tag} {player.club ? '• ' + player.club.name : ''}</p>
              <p className="text-xs text-gray-500 mt-1">Nível {player.expLevel} • {player.brawlers.length} brawlers</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold gradient-text">{formatNum(player.trophies)}</p>
              <p className="text-xs text-gray-500">Troféus Totais</p>
              <p className="text-xs text-gray-600 mt-1">Recorde: {formatNum(player.highestTrophies)}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progresso para 100k</span>
              <span>{Math.round((player.trophies / 100000) * 100)}%</span>
            </div>
            <Progress value={(player.trophies / 100000) * 100} className="h-2" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {renderStatCard('Vitórias', formatNum(totalV), <Trophy className="w-5 h-5" />)}
          {renderStatCard('Win Rate', wr + '%', <Target className="w-5 h-5" />, 'text-emerald-400')}
          {renderStatCard('Brawlers Max', maxed + '/' + player.brawlers.length, <Zap className="w-5 h-5" />, 'text-purple-400')}
          {renderStatCard('Rank 25', at1000.toString(), <Star className="w-5 h-5" />, 'text-amber-400')}
        </div>

        {/* Extra Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {renderStatCard('Média Troféus', avgTrophies.toString(), <BarChart3 className="w-5 h-5" />, 'text-blue-400')}
          {renderStatCard('Star Powers', totalSP.toString(), <Sparkles className="w-5 h-5" />, 'text-yellow-400')}
          {renderStatCard('Gadgets', totalGadgets.toString(), <Zap className="w-5 h-5" />, 'text-cyan-400')}
          {renderStatCard('Solo Wins', formatNum(player.soloVictories), <Swords className="w-5 h-5" />, 'text-red-400')}
        </div>

        {/* Quick AI Actions */}
        <div className="glass rounded-2xl p-4">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Bot className="w-4 h-4 text-amber-400" />Ações Rápidas AI</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Análise Completa', tab: 'analysis' as TabId, icon: TrendingUp, color: 'from-purple-500 to-violet-600' },
              { label: 'Coach AI', tab: 'coach' as TabId, icon: Bot, color: 'from-amber-500 to-orange-600' },
              { label: 'Draft Ranqueado', tab: 'draft' as TabId, icon: Crown, color: 'from-emerald-500 to-green-600' },
              { label: 'Plano 30 Dias', tab: 'progression' as TabId, icon: Target, color: 'from-pink-500 to-rose-600' },
            ].map(a => (
              <button key={a.tab} onClick={() => setActiveTab(a.tab)} className="glass rounded-xl p-4 text-left hover:bg-white/10 transition-all group">
                <div className={'w-10 h-10 rounded-lg bg-gradient-to-br ' + a.color + ' flex items-center justify-center mb-2 group-hover:scale-110 transition-transform'}>
                  <a.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-white">{a.label}</p>
                <p className="text-xs text-gray-500">Powered by Groq AI</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Battles */}
        <div className="glass rounded-2xl p-4">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Clock className="w-5 h-5 text-amber-400" />Batalhas Recentes</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {recentBattles.map((b, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                <div className="flex items-center gap-3">
                  <Badge variant={b.result === 'victory' ? 'default' : 'destructive'} className={b.result === 'victory' ? 'bg-emerald-500/20 text-emerald-400 border-0' : 'bg-red-500/20 text-red-400 border-0'}>
                    {b.result === 'victory' ? 'Vitória' : b.result === 'defeat' ? 'Derrota' : 'Empate'}
                  </Badge>
                  <div>
                    <p className="text-sm text-white font-medium">{b.brawler}</p>
                    <p className="text-xs text-gray-500">{b.mode} • {b.map}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={'text-sm font-bold ' + (b.trophyChange >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                    {b.trophyChange >= 0 ? '+' : ''}{b.trophyChange}🏆
                  </span>
                  {b.type && <p className="text-[10px] text-gray-600">{b.type}</p>}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab('battles')} className="mt-3 text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
            Analisar batalhas com AI <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  // WELCOME (no player loaded)
  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
      <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl shadow-amber-500/30 pulse-glow">
        <Swords className="w-14 h-14 text-white" />
      </div>
      <div>
        <h1 className="text-5xl font-bold gradient-text mb-3">BrawlTracker v4</h1>
        <p className="text-gray-400 text-lg">Seu companheiro completo de Brawl Stars com IA</p>
        <p className="text-gray-600 text-sm mt-1">22 funcionalidades para melhorar seu jogo e virar criador de conteúdo</p>
      </div>
      <div className="w-full max-w-md space-y-3">
        <div className="flex gap-2">
          <Input placeholder="#TAGDOJOGADOR" value={searchTag} onChange={e => setSearchTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="bg-white/5 border-white/10 text-white h-12 text-lg" />
          <Button onClick={() => handleSearch()} disabled={loading} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white h-12 px-6">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </Button>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {searchHistory.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(0, 5).map(h => (
              <button key={h} onClick={() => handleSearch(h)} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-amber-400 hover:border-amber-500/30 transition-all">
                {h}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl mt-6">
        {[
          { icon: Bot, label: 'Coach AI', desc: 'Tire dúvidas com IA' },
          { icon: Crown, label: 'Draft AI', desc: 'Assistente de draft' },
          { icon: Film, label: 'Criador', desc: 'Gere conteúdo' },
          { icon: Target, label: 'Progressão', desc: 'Plano de 30 dias' },
          { icon: Crosshair, label: 'Counters', desc: 'Counter picks' },
          { icon: BarChart3, label: 'Meta', desc: 'Tier list ao vivo' },
          { icon: Gift, label: 'F2P Guide', desc: 'Maximize recursos' },
          { icon: Activity, label: 'Batalhas', desc: 'Análise detalhada' },
        ].map(f => (
          <button key={f.label} onClick={() => setActiveTab(f.label === 'Coach AI' ? 'coach' : f.label === 'Draft AI' ? 'draft' : f.label === 'Criador' ? 'content' : f.label === 'Progressão' ? 'progression' : f.label === 'Counters' ? 'counters' : f.label === 'Meta' ? 'meta' : f.label === 'F2P Guide' ? 'f2p' : 'battles')} className="glass rounded-xl p-4 text-center hover:bg-white/10 transition-all">
            <f.icon className="w-7 h-7 text-amber-400 mx-auto mb-2" />
            <p className="text-xs font-medium text-white">{f.label}</p>
            <p className="text-[10px] text-gray-500">{f.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );

  // 2. BRAWLERS
  const renderBrawlers = () => {
    const brawlers = player?.brawlers || [];
    const filtered = brawlers.filter(b => {
      if (brawlerSearch && !b.name.toLowerCase().includes(brawlerSearch.toLowerCase())) return false;
      if (brawlerFilter === 'maxed') return b.power >= 11;
      if (brawlerFilter === 'need-upgrade') return b.power < 9 && b.trophies >= 500;
      if (brawlerFilter === 'rank25') return b.trophies >= 1000;
      if (brawlerFilter === 'no-gadget') return b.gadgets.length === 0;
      if (brawlerFilter === 'no-sp') return b.starPowers.length === 0;
      return true;
    }).sort((a, b) => {
      if (brawlerSortBy === 'trophies') return b.trophies - a.trophies;
      if (brawlerSortBy === 'power') return b.power - a.power;
      return a.name.localeCompare(b.name);
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Input placeholder="Buscar brawler..." value={brawlerSearch} onChange={e => setBrawlerSearch(e.target.value)} className="bg-white/5 border-white/10 text-white flex-1 min-w-[200px]" />
          <select value={brawlerSortBy} onChange={e => setBrawlerSortBy(e.target.value as any)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
            <option value="trophies" className="bg-zinc-900">Troféus ↓</option>
            <option value="power" className="bg-zinc-900">Power ↓</option>
            <option value="name" className="bg-zinc-900">Nome A-Z</option>
          </select>
          <div className="flex gap-1 flex-wrap">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'maxed', label: 'Max' },
              { id: 'need-upgrade', label: 'Upar' },
              { id: 'rank25', label: 'Rank 25' },
              { id: 'no-gadget', label: 'Sem Gadget' },
              { id: 'no-sp', label: 'Sem SP' },
            ].map(f => (
              <button key={f.id} onClick={() => setBrawlerFilter(f.id)} className={'text-xs px-3 py-1.5 rounded-full border transition-all ' + (brawlerFilter === f.id ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white')}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500">{filtered.length} de {brawlers.length} brawlers</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map(b => {
            const brawlerInfo = allBrawlers.find(ab => ab.id === b.id);
            const rarity = brawlerInfo?.rarity?.name || 'Common';
            return (
              <button key={b.id} onClick={() => { setAdvisorBrawler(b.name); setActiveTab('advisor'); }} className="brawler-card glass rounded-xl p-3 text-center hover:border-amber-500/30 transition-all cursor-pointer group">
                <div className="w-16 h-16 mx-auto rounded-xl bg-white/5 flex items-center justify-center overflow-hidden mb-2 relative">
                  <img src={getBrawlerImg(b.id)} alt={b.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div className="absolute bottom-1 right-1 bg-black/60 text-[9px] px-1 rounded text-amber-400">P{b.power}</div>
                </div>
                <p className="text-sm font-medium text-white truncate group-hover:text-amber-400 transition-colors">{b.name}</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-xs text-amber-400">{b.trophies}🏆</span>
                  <span className="text-xs text-gray-600">R{b.rank}</span>
                </div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {b.gadgets.length > 0 && <span className="text-[9px] px-1 py-0.5 rounded bg-cyan-500/10 text-cyan-400">G</span>}
                  {b.starPowers.length > 0 && <span className="text-[9px] px-1 py-0.5 rounded bg-yellow-500/10 text-yellow-400">SP</span>}
                  {b.gears.length > 0 && <span className="text-[9px] px-1 py-0.5 rounded bg-purple-500/10 text-purple-400">GR</span>}
                </div>
                <div className="w-full bg-white/5 rounded-full h-1 mt-2">
                  <div className="h-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: Math.min((b.power / 11) * 100, 100) + '%' }} />
                </div>
              </button>
            );
          })}
        </div>
        {filtered.length === 0 && <p className="text-center text-gray-500 py-8">Nenhum brawler encontrado</p>}
      </div>
    );
  };

  // 3. EVENTS
  const renderEvents = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Radio className="w-5 h-5 text-emerald-400" />Rotação de Eventos</h2>
      {events.length === 0 ? <p className="text-gray-500 text-center py-8">Carregando eventos...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {events.map((e, i) => {
            const modeKey = Object.keys(APP_CONFIG.modeEmojis).find(k => e.event.mode.toLowerCase().includes(k.replace(/([A-Z])/g, ' $1').toLowerCase().trim())) || '';
            const emoji = APP_CONFIG.modeEmojis[modeKey] || '🎮';
            const modeColor = APP_CONFIG.modeColors[modeKey] || 'from-gray-500 to-gray-600';
            const endTime = new Date(e.endTime);
            const now = new Date();
            const hoursLeft = Math.max(0, Math.round((endTime.getTime() - now.getTime()) / (1000 * 60 * 60)));
            return (
              <div key={i} className="glass rounded-xl p-4 hover:border-amber-500/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className={'w-12 h-12 rounded-xl bg-gradient-to-br ' + modeColor + ' flex items-center justify-center text-xl'}>
                    {emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{e.event.map}</p>
                    <p className="text-xs text-gray-400">{e.event.mode}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-white/5 text-gray-400 border-white/10">Slot {e.slotId}</Badge>
                    <p className="text-[10px] text-gray-500 mt-1">{hoursLeft}h restantes</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Até {endTime.toLocaleDateString('pt-BR')} {endTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // 4. RANKINGS
  const renderRankings = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Medal className="w-5 h-5 text-blue-400" />Rankings</h2>
      <div className="flex items-center gap-3 flex-wrap">
        <select value={rankingRegion} onChange={e => setRankingRegion(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
          {APP_CONFIG.regions.map(r => <option key={r} value={r} className="bg-zinc-900">{r === 'global' ? 'Global' : r}</option>)}
        </select>
        <div className="flex gap-1">
          {['players', 'clubs'].map(t => (
            <button key={t} onClick={() => setRankingType(t as any)} className={'text-xs px-3 py-1.5 rounded-full border transition-all ' + (rankingType === t ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400')}>
              {t === 'players' ? 'Jogadores' : 'Clubes'}
            </button>
          ))}
        </div>
      </div>
      {rankingsLoading ? <div className="text-center py-8"><Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" /></div> : (
        <div className="space-y-1">
          {rankings.slice(0, 50).map((r: any, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <span className={'w-10 text-center text-sm font-bold ' + (i < 3 ? 'text-amber-400' : i < 10 ? 'text-gray-300' : 'text-gray-500')}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + r.rank}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{r.name}</p>
                {r.club && <p className="text-xs text-gray-500">{r.club.name}</p>}
              </div>
              <span className="text-sm font-bold text-amber-400">{formatNum(r.trophies)}🏆</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // 5. CLUB
  const renderClub = () => {
    const searchClub = async () => {
      if (!clubTag) return;
      setClubLoading(true);
      try {
        const res = await fetch('/api/club?tag=' + encodeURIComponent(clubTag.startsWith('#') ? clubTag : '#' + clubTag));
        const data = await res.json();
        setClub(data);
      } catch { setClub(null); }
      setClubLoading(false);
    };

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Users className="w-5 h-5 text-pink-400" />Clube</h2>
        <div className="flex gap-2">
          <Input placeholder="#TAGDOCLUBE" value={clubTag} onChange={e => setClubTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchClub()} className="bg-white/5 border-white/10 text-white flex-1" />
          <Button onClick={searchClub} disabled={clubLoading} className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">{clubLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buscar'}</Button>
        </div>
        {club && (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white">{club.name}</h2>
              <p className="text-sm text-gray-400">{club.tag} • {club.type === 'open' ? 'Aberto' : club.type === 'inviteOnly' ? 'Somente convite' : 'Fechado'}</p>
              {club.description && <p className="text-xs text-gray-500 mt-2 italic">"{club.description}"</p>}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {renderStatCard('Troféus', formatNum(club.trophies), <Trophy className="w-5 h-5" />)}
                {renderStatCard('Membros', club.members?.length || 0, <Users className="w-5 h-5" />, 'text-purple-400')}
                {renderStatCard('Mínimo', formatNum(club.requiredTrophies), <Shield className="w-5 h-5" />, 'text-emerald-400')}
              </div>
            </div>
            <div className="space-y-1">
              {club.members?.sort((a: any, b: any) => b.trophies - a.trophies).map((m: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                  <span className="text-sm text-gray-500 w-8">#{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm text-white">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.role === 'president' ? 'Presidente' : m.role === 'vicePresident' ? 'Vice' : m.role === 'senior' ? 'Sênior' : 'Membro'}</p>
                  </div>
                  <span className="text-sm font-bold text-amber-400">{formatNum(m.trophies)}🏆</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 6. COACH AI
  const renderCoach = () => (
    <div className="space-y-4 flex flex-col" style={{ height: 'calc(100vh - 10rem)' }}>
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Bot className="w-5 h-5 text-amber-400" />Coach AI</h2>
      <ScrollArea className="flex-1 glass rounded-2xl p-4">
        <div className="space-y-3">
          {chatMessages.map((m, i) => (
            <div key={i} className={'flex gap-2 ' + (m.role === 'user' ? 'justify-end' : 'justify-start')}>
              {m.role === 'assistant' && <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div>}
              <div className={'max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ' + (m.role === 'user' ? 'bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white rounded-br-md' : 'bg-white/8 text-gray-200 rounded-bl-md border border-white/5')}>
                {m.content}
              </div>
              {m.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"><Search className="w-4 h-4 text-white" /></div>}
            </div>
          ))}
          {chatLoading && (
            <div className="flex gap-2 justify-start">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div>
              <div className="bg-white/8 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                <span className="typing-dot w-2 h-2 rounded-full bg-purple-400" />
                <span className="typing-dot w-2 h-2 rounded-full bg-purple-400" />
                <span className="typing-dot w-2 h-2 rounded-full bg-purple-400" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>
      <div className="flex gap-2">
        <Input placeholder="Pergunte ao Coach AI..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendChat(); }} className="bg-white/5 border-white/10 text-white flex-1 h-12" disabled={chatLoading} />
        <Button onClick={sendChat} disabled={!chatInput.trim() || chatLoading} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white h-12 px-6">
          {chatLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );

  const sendChat = async () => {
    const msg = chatInput.trim();
    if (!msg) return;
    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, playerData: getPlayerContext(), battleLogData: null, history: chatMessages.slice(-8) }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Sem resposta' }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Erro de conexão. Tente novamente!' }]);
    }
    setChatLoading(false);
  };

  // 7. DRAFT AI
  const renderDraft = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Crown className="w-5 h-5 text-emerald-400" />Draft AI Ranqueado</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <select value={draftMap} onChange={e => setDraftMap(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white">
            <option value="" className="bg-zinc-900">Selecione o mapa</option>
            {RANKED_MAPS.map(m => <option key={m} value={m} className="bg-zinc-900">{m}</option>)}
          </select>
          <Input placeholder="Seus brawlers disponíveis (separados por vírgula)" value={draftBrawlers} onChange={e => setDraftBrawlers(e.target.value)} className="bg-white/5 border-white/10 text-white" />
          <Input placeholder="Brawlers inimigos (separados por vírgula)" value={draftEnemies} onChange={e => setDraftEnemies(e.target.value)} className="bg-white/5 border-white/10 text-white" />
          <Input placeholder="Brawlers aliados já pickados" value={draftAllies} onChange={e => setDraftAllies(e.target.value)} className="bg-white/5 border-white/10 text-white" />
          <Input placeholder="Bans (separados por vírgula)" value={draftBans} onChange={e => setDraftBans(e.target.value)} className="bg-white/5 border-white/10 text-white" />
          <Input placeholder="Situação adicional (ex: perdendo muito, primeiro pick)" value={draftSituacao} onChange={e => setDraftSituacao(e.target.value)} className="bg-white/5 border-white/10 text-white" />
          <Button onClick={async () => { const r = await callAI('draft', { mapa: draftMap, modo: 'Ranked', brawlers: draftBrawlers, inimigos: draftEnemies, aliados: draftAllies, bans: draftBans, situacao: draftSituacao }); if (r) setDraftResult(r); }} disabled={aiLoading || !draftMap} className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white h-12">
            {aiLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Crown className="w-5 h-5 mr-2" />}Analisar Draft
          </Button>
        </div>
        {aiLoading && !draftResult ? renderAILoading() : draftResult && (
          <ScrollArea className="max-h-[75vh]">
            <div className="space-y-3">
              <div className="glass rounded-xl p-4">
                <p className="text-sm text-gray-300">{draftResult.resumo}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className="bg-red-500/20 text-red-400 border-0">Ban: {draftResult.banSugerido}</Badge>
                  <span className="text-xs text-gray-500">{draftResult.banRazao}</span>
                </div>
              </div>
              {draftResult.picksPorPosicao?.map((p, i) => (
                <div key={i} className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-amber-500/20 text-amber-400 border-0">Pick {p.posicao}</Badge>
                    <span className="text-xs text-gray-500">{p.titulo}</span>
                  </div>
                  <p className="text-lg font-bold text-white">{p.pickRecomendado}</p>
                  <p className="text-sm text-gray-400 mt-1">{p.razao}</p>
                  {p.alternativas?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.alternativas.map((a, j) => (
                        <span key={j} className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">{a.nome}: {a.razao}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {draftResult.dicasGeral?.length > 0 && (
                <div className="glass rounded-xl p-4">
                  <h4 className="text-sm font-bold text-white mb-2">Dicas Gerais</h4>
                  <ul className="space-y-1">{draftResult.dicasGeral.map((d, i) => <li key={i} className="text-xs text-gray-400">• {d}</li>)}</ul>
                </div>
              )}
              <div className="glass rounded-xl p-4">
                <h4 className="text-sm font-bold text-white mb-2">Estratégia Geral</h4>
                <p className="text-sm text-gray-400">{draftResult.estrategiaGeral}</p>
              </div>
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );

  // 8. ADVISOR
  const renderAdvisor = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-400" />Conselheiro de Brawler</h2>
      <div className="flex gap-2 flex-wrap">
        <Input placeholder="Nome do brawler (ex: Spike)" value={advisorBrawler} onChange={e => setAdvisorBrawler(e.target.value)} className="bg-white/5 border-white/10 text-white flex-1 min-w-[200px]" />
        <Input placeholder="Modo (ex: Gem Grab)" value={advisorMode} onChange={e => setAdvisorMode(e.target.value)} className="bg-white/5 border-white/10 text-white w-40" />
        <Button onClick={async () => { const r = await callAI('brawler-advisor', { brawler: advisorBrawler, mode: advisorMode }); if (r?.optimalLoadout) setAdvisorResult(r); }} disabled={aiLoading || !advisorBrawler} className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
          {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        </Button>
      </div>
      {/* Quick brawler buttons */}
      <div className="flex flex-wrap gap-1">
        {['Shelly', 'Colt', 'Spike', 'Leon', 'Crow', 'El Primo', 'Poco', 'Rosa', 'Edgar', 'Cordelius'].map(b => (
          <button key={b} onClick={() => setAdvisorBrawler(b)} className={'text-xs px-2 py-1 rounded-full border transition-all ' + (advisorBrawler === b ? 'bg-purple-500/20 border-purple-500/30 text-purple-400' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white')}>{b}</button>
        ))}
      </div>
      {aiLoading && !advisorResult ? renderAILoading() : advisorResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-white">Loadout Ideal</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><Badge className="bg-blue-500/20 text-blue-400 border-0">Gadget</Badge><span className="text-sm text-white">{advisorResult.optimalLoadout?.gadget}</span></div>
              <div className="flex items-center gap-2"><Badge className="bg-yellow-500/20 text-yellow-400 border-0">Star Power</Badge><span className="text-sm text-white">{advisorResult.optimalLoadout?.starPower}</span></div>
              <div className="flex items-center gap-2"><Badge className="bg-purple-500/20 text-purple-400 border-0">Gears</Badge><span className="text-sm text-white">{advisorResult.optimalLoadout?.gears?.join(', ')}</span></div>
            </div>
            <div><h4 className="text-sm font-bold text-white mb-1">Estratégia</h4><p className="text-sm text-gray-400">{advisorResult.strategy}</p></div>
            <div><h4 className="text-sm font-bold text-white mb-1">Posicionamento</h4><p className="text-sm text-gray-400">{advisorResult.positioning}</p></div>
          </div>
          <div className="space-y-3">
            <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-white mb-2">Dicas</h4><ul className="space-y-1">{advisorResult.tips?.map((t, i) => <li key={i} className="text-xs text-gray-400">• {t}</li>)}</ul></div>
            <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-red-400 mb-2">Counters</h4><div className="flex flex-wrap gap-1">{advisorResult.counters?.map((c, i) => <Badge key={i} className="bg-red-500/10 text-red-400 border-0 text-xs">{c}</Badge>)}</div></div>
            <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-emerald-400 mb-2">Sinergias</h4><div className="flex flex-wrap gap-1">{advisorResult.synergies?.map((s, i) => <Badge key={i} className="bg-emerald-500/10 text-emerald-400 border-0 text-xs">{s}</Badge>)}</div></div>
          </div>
        </div>
      )}
    </div>
  );

  // 9. ANALYSIS
  const renderAnalysis = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 text-cyan-400" />Análise AI Completa</h2>
      {!player ? renderEmptyState(<TrendingUp className="w-8 h-8" />, 'Busque um jogador primeiro para analisar') : (
        <>
          <Button onClick={async () => { const r = await callAI('analyze', { playerData: getPlayerContext(), battleLogData: null }); if (r?.summary) setAnalysisResult(r); }} disabled={aiLoading} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white h-12">
            {aiLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <TrendingUp className="w-5 h-5 mr-2" />}Analisar Jogador Completo
          </Button>
          {aiLoading && !analysisResult ? renderAILoading() : analysisResult && (
            <div className="space-y-4">
              <div className="glass rounded-xl p-4">
                <p className="text-sm text-gray-300">{analysisResult.summary}</p>
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">True Skill: {analysisResult.trueSkillEstimate?.rating} ({analysisResult.trueSkillEstimate?.level})</p>
                  <Progress value={Math.min((analysisResult.trueSkillEstimate?.rating / 1500) * 100, 100)} className="h-2" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-emerald-400 mb-2">Forças</h4>{analysisResult.strengths?.map((s, i) => <p key={i} className="text-xs text-gray-400 mb-1">• {s}</p>)}</div>
                <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-red-400 mb-2">Fraquezas</h4>{analysisResult.weaknesses?.map((w, i) => <p key={i} className="text-xs text-gray-400 mb-1">• {w}</p>)}</div>
              </div>
              {analysisResult.recommendations?.length > 0 && (
                <div className="glass rounded-xl p-4">
                  <h4 className="text-sm font-bold text-white mb-2">Recomendações</h4>
                  <div className="space-y-2">
                    {analysisResult.recommendations.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
                        <Badge className={r.priority === 'high' ? 'bg-red-500/20 text-red-400 border-0' : r.priority === 'medium' ? 'bg-amber-500/20 text-amber-400 border-0' : 'bg-blue-500/20 text-blue-400 border-0'}>{r.priority}</Badge>
                        <div>
                          <p className="text-sm text-white font-medium">{r.title}</p>
                          <p className="text-xs text-gray-400">{r.description}</p>
                          <p className="text-xs text-amber-400 mt-1">{r.actionable}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {analysisResult.dailyPlan?.length > 0 && (
                <div className="glass rounded-xl p-4">
                  <h4 className="text-sm font-bold text-white mb-2">Plano Diário</h4>
                  <div className="space-y-1">
                    {analysisResult.dailyPlan.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                        <Badge className="bg-amber-500/20 text-amber-400 border-0">{d.priority}</Badge>
                        <span className="text-sm text-white">{d.brawler}</span>
                        <span className="text-xs text-gray-500">{d.mode} • {d.map}</span>
                        <span className="text-xs text-emerald-400 ml-auto">+{d.estimatedTrophies}🏆</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );

  // 10. BATTLE ANALYSIS
  const renderBattles = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Activity className="w-5 h-5 text-red-400" />Análise de Batalhas AI</h2>
      {!player ? renderEmptyState(<Activity className="w-8 h-8" />, 'Busque um jogador primeiro para analisar batalhas') : (
        <>
          <Button onClick={async () => {
            const battlesStr = formatBattleLog(battleLog, player.tag).map(b => b.brawler + ' no ' + b.mode + ' no mapa ' + b.map + ': ' + b.result + ' (' + (b.trophyChange >= 0 ? '+' : '') + b.trophyChange + ' troféus)').join('. ');
            const r = await callAI('battles', { battles: battlesStr, playerTag: player.tag });
            if (r?.summary) setBattleAnalysisResult(r);
          }} disabled={aiLoading} className="bg-gradient-to-r from-red-500 to-rose-600 text-white h-12">
            {aiLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Activity className="w-5 h-5 mr-2" />}Analisar Batalhas Recentes
          </Button>
          {aiLoading && !battleAnalysisResult ? renderAILoading() : battleAnalysisResult && (
            <div className="space-y-4">
              <div className="glass rounded-xl p-4"><p className="text-sm text-gray-300">{battleAnalysisResult.summary}</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-emerald-400 mb-2">O que deu certo</h4>{battleAnalysisResult.whatWentRight?.map((w, i) => <p key={i} className="text-xs text-gray-400 mb-1">• {w}</p>)}</div>
                <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-red-400 mb-2">O que deu errado</h4>{battleAnalysisResult.whatWentWrong?.map((w, i) => <p key={i} className="text-xs text-gray-400 mb-1">• {w}</p>)}</div>
              </div>
              <div className="glass rounded-xl p-4">
                <h4 className="text-sm font-bold text-white mb-2">Dicas de Melhoria</h4>
                {battleAnalysisResult.improvementTips?.map((t, i) => <p key={i} className="text-xs text-gray-400 mb-1">• {t}</p>)}
              </div>
              {battleAnalysisResult.mvpAnalysis && (
                <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-amber-400 mb-2">Análise MVP</h4><p className="text-sm text-gray-400">{battleAnalysisResult.mvpAnalysis}</p></div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );

  // 11. PUSH PLANNER
  const renderPush = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Flame className="w-5 h-5 text-orange-400" />Push Planner</h2>
      {!player ? renderEmptyState(<Flame className="w-8 h-8" />, 'Busque um jogador primeiro') : (
        <>
          <Button onClick={async () => { const r = await callAI('push-planner', { playerData: getPlayerContext(), targetTrophies: player.trophies + 500 }); if (r?.sessions) setPushResult(r); }} disabled={aiLoading} className="bg-gradient-to-r from-orange-500 to-amber-600 text-white h-12">
            {aiLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Flame className="w-5 h-5 mr-2" />}Planejar Push de Troféus
          </Button>
          {aiLoading && !pushResult ? renderAILoading() : pushResult && (
            <div className="space-y-4">
              <div className="glass rounded-xl p-4 flex items-center justify-between">
                <div><p className="text-lg font-bold text-white">Total Estimado</p><p className="text-sm text-gray-400">Troféus que pode ganhar</p></div>
                <span className="text-2xl font-bold gradient-text">+{pushResult.totalEstimatedTrophies}🏆</span>
              </div>
              {pushResult.tiltWarning && (
                <div className="glass rounded-xl p-4 border border-red-500/20">
                  <h4 className="text-sm font-bold text-red-400 mb-1">Alerta de Tilt</h4>
                  <p className="text-sm text-gray-400">{pushResult.tiltAdvice}</p>
                </div>
              )}
              {pushResult.sessions?.map((s, i) => (
                <div key={i} className="glass rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm font-bold text-white">{s.brawler}</p><p className="text-xs text-gray-400">{s.mode} • {s.map}</p></div>
                    <div className="text-right"><span className="text-sm font-bold text-emerald-400">+{s.estimatedTrophies}🏆</span><p className="text-xs text-gray-500">{s.duration} min</p></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{s.reason}</p>
                </div>
              ))}
              {pushResult.generalTips?.length > 0 && (
                <div className="glass rounded-xl p-4">
                  <h4 className="text-sm font-bold text-white mb-2">Dicas Gerais</h4>
                  {pushResult.generalTips.map((t, i) => <p key={i} className="text-xs text-gray-400 mb-1">• {t}</p>)}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );

  // 12. META TRACKER
  const renderMeta = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><BarChart3 className="w-5 h-5 text-indigo-400" />Meta Tracker AI</h2>
      <Button onClick={async () => { const r = await callAI('meta', { playerData: getPlayerContext() }); if (r?.topBrawlers) setMetaResult(r); }} disabled={aiLoading} className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white h-12">
        {aiLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <BarChart3 className="w-5 h-5 mr-2" />}Gerar Relatório do Meta
      </Button>
      {aiLoading && !metaResult ? renderAILoading() : metaResult && (
        <div className="space-y-4">
          {metaResult.topBrawlers?.length > 0 && (
            <div className="glass rounded-xl p-4">
              <h4 className="text-sm font-bold text-white mb-3">Top Brawlers do Meta</h4>
              <div className="space-y-2">
                {metaResult.topBrawlers.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                    <span className={'w-8 text-center font-bold ' + (i < 3 ? 'text-amber-400' : 'text-gray-500')}>#{i + 1}</span>
                    <div className="flex-1"><p className="text-sm text-white font-medium">{b.name}</p></div>
                    <Badge className={'border-0 text-xs ' + (b.tier === 'S' ? 'bg-red-500/20 text-red-400' : b.tier === 'A' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400')}>Tier {b.tier}</Badge>
                    <span className="text-xs text-gray-500">WR {b.winRate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {metaResult.bestComps?.length > 0 && (
            <div className="glass rounded-xl p-4">
              <h4 className="text-sm font-bold text-white mb-3">Melhores Composições</h4>
              {metaResult.bestComps.map((c, i) => (
                <div key={i} className="p-2 rounded-lg bg-white/5 mb-2">
                  <p className="text-sm text-white font-medium">{c.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">{c.brawlers.map((b, j) => <Badge key={j} className="bg-purple-500/10 text-purple-400 border-0 text-xs">{b}</Badge>)}</div>
                  <p className="text-xs text-gray-500 mt-1">{c.mode} • WR {c.winRate}</p>
                </div>
              ))}
            </div>
          )}
          {metaResult.trends?.length > 0 && (
            <div className="glass rounded-xl p-4">
              <h4 className="text-sm font-bold text-white mb-2">Tendências</h4>
              {metaResult.trends.map((t, i) => <p key={i} className="text-xs text-gray-400 mb-1">• {t}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // 13. COUNTER PICK
  const renderCounters = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Crosshair className="w-5 h-5 text-teal-400" />Counter Pick AI</h2>
      <div className="flex gap-2 flex-wrap">
        <Input placeholder="Brawlers inimigos (ex: Spike, Leon, Crow)" value={counterEnemies} onChange={e => setCounterEnemies(e.target.value)} className="bg-white/5 border-white/10 text-white flex-1 min-w-[250px]" />
        <Input placeholder="Modo (ex: Gem Grab)" value={counterMode} onChange={e => setCounterMode(e.target.value)} className="bg-white/5 border-white/10 text-white w-40" />
        <Button onClick={async () => { const r = await callAI('counters', { enemies: counterEnemies, mode: counterMode }); if (Array.isArray(r)) setCounterResult(r); else if (r?.counters) setCounterResult(r.counters); }} disabled={aiLoading || !counterEnemies} className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white">
          {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair className="w-4 h-4" />}
        </Button>
      </div>
      {aiLoading && !counterResult ? renderAILoading() : counterResult && (
        <div className="space-y-4">
          {counterResult.map((c, i) => (
            <div key={i} className="glass rounded-xl p-4">
              <h4 className="text-sm font-bold text-white mb-2">Contra {c.enemy}</h4>
              <div className="space-y-2">
                {c.counters?.map((counter, j) => (
                  <div key={j} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                    <span className="text-sm text-white font-medium">{counter.name}</span>
                    <span className="text-xs text-gray-400 flex-1">{counter.reason}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-2 bg-white/5 rounded-full"><div className="h-2 rounded-full bg-emerald-500" style={{ width: (counter.effectiveness || 80) + '%' }} /></div>
                      <span className="text-xs text-gray-500">{counter.effectiveness}%</span>
                    </div>
                  </div>
                ))}
              </div>
              {c.avoid?.length > 0 && (
                <div className="mt-2"><p className="text-xs text-red-400 mb-1">Evitar:</p><div className="flex flex-wrap gap-1">{c.avoid.map((a, j) => <Badge key={j} className="bg-red-500/10 text-red-400 border-0 text-xs">{a}</Badge>)}</div></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // 14. PROGRESSION PLAN
  const renderProgression = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Target className="w-5 h-5 text-amber-400" />Plano de Progressão 30 Dias</h2>
      <p className="text-sm text-gray-400">Plano personalizado para conta nova subir rápido e se tornar competitiva em 1 mês.</p>
      <Button onClick={async () => { const r = await callAI('progression', { playerData: getPlayerContext(), accountType: 'new' }); if (r) setProgressionResult(r); }} disabled={aiLoading} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white h-12">
        {aiLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Target className="w-5 h-5 mr-2" />}Gerar Plano de 30 Dias
      </Button>
      {aiLoading && !progressionResult ? renderAILoading() : progressionResult && (
        <div className="space-y-4">
          {progressionResult.weeks ? progressionResult.weeks.map((week: any, wi: number) => (
            <div key={wi} className="glass rounded-xl p-4">
              <h4 className="text-sm font-bold text-white mb-3">Semana {wi + 1}</h4>
              {week.days?.map((day: any, di: number) => (
                <div key={di} className="p-2 rounded-lg bg-white/5 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white font-medium">Dia {day.day}: {day.focus}</span>
                    <span className="text-xs text-emerald-400">+{day.estimatedTrophies}🏆</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Brawlers: {day.brawlers?.join(', ')} • Modos: {day.modes?.join(', ')}</p>
                  <p className="text-xs text-gray-600 mt-1">Metas: {day.goals?.join(', ')}</p>
                  {day.resourceTip && <p className="text-xs text-amber-400 mt-1">Dica: {day.resourceTip}</p>}
                </div>
              ))}
            </div>
          )) : progressionResult.days ? progressionResult.days.slice(0, 30).map((day: any, i: number) => (
            <div key={i} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div><span className="text-sm font-bold text-white">Dia {day.day}</span><span className="text-xs text-gray-500 ml-2">Semana {day.week}</span></div>
                <span className="text-xs text-emerald-400">+{day.estimatedTrophies}🏆</span>
              </div>
              <p className="text-sm text-amber-400 mt-1">{day.focus}</p>
              <p className="text-xs text-gray-400 mt-1">Brawlers: {day.brawlers?.join(', ')}</p>
              <p className="text-xs text-gray-500">Modos: {day.modes?.join(', ')}</p>
              {day.goals?.length > 0 && <p className="text-xs text-gray-500 mt-1">Metas: {day.goals.join(', ')}</p>}
              {day.resourceTip && <p className="text-xs text-cyan-400 mt-1">💡 {day.resourceTip}</p>}
            </div>
          )) : <div className="glass rounded-xl p-4"><pre className="text-xs text-gray-300 whitespace-pre-wrap">{JSON.stringify(progressionResult, null, 2)}</pre></div>}
        </div>
      )}
    </div>
  );

  // 15. F2P GUIDE
  const renderF2P = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Gift className="w-5 h-5 text-emerald-400" />Guia F2P - Maximizar Recursos</h2>
      <p className="text-sm text-gray-400">Estratégias para progredir sem gastar dinheiro real no jogo.</p>
      <Button onClick={async () => { const r = await callAI('f2p', { playerData: getPlayerContext() }); if (r) setF2pResult(r); }} disabled={aiLoading} className="bg-gradient-to-r from-emerald-500 to-green-600 text-white h-12">
        {aiLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Gift className="w-5 h-5 mr-2" />}Gerar Guia F2P
      </Button>
      {aiLoading && !f2pResult ? renderAILoading() : f2pResult && (
        <div className="space-y-4">
          <div className="glass rounded-xl p-4">
            <h4 className="text-sm font-bold text-white mb-2">Prioridade: {f2pResult.priority}</h4>
            {f2pResult.monthlyEstimate && <p className="text-xs text-amber-400 mb-3">Estimativa mensal: {f2pResult.monthlyEstimate}</p>}
            <div className="space-y-2">
              {f2pResult.items?.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                  <div className="flex-1"><p className="text-sm text-white">{item.name}</p><p className="text-xs text-gray-500">{item.reason}</p></div>
                  <div className="text-right"><Badge className="bg-amber-500/20 text-amber-400 border-0">{item.cost}</Badge><p className="text-xs text-gray-600">{item.value}</p></div>
                </div>
              ))}
            </div>
          </div>
          {f2pResult.tips?.length > 0 && (
            <div className="glass rounded-xl p-4">
              <h4 className="text-sm font-bold text-white mb-2">Dicas F2P</h4>
              {f2pResult.tips.map((t: string, i: number) => <p key={i} className="text-xs text-gray-400 mb-1">• {t}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // 16. CALCULATOR
  const renderCalculator = () => {
    const calc = () => {
      let totalCoins = 0;
      let totalPoints = 0;
      for (let i = calcCurrent; i < calcTarget; i++) {
        const cost = POWER_POINT_COSTS[i];
        if (cost) {
          totalCoins += cost.coins;
          totalPoints += cost.points;
        }
      }
      return { totalCoins, totalPoints };
    };
    const { totalCoins, totalPoints } = calc();

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Calculator className="w-5 h-5 text-blue-400" />Calculadora de Recursos</h2>
        <div className="glass rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Power Level Atual</label>
                <div className="flex items-center gap-3">
                  <Button onClick={() => setCalcCurrent(Math.max(1, calcCurrent - 1))} size="sm" className="bg-white/10 text-white hover:bg-white/20"><Minus className="w-4 h-4" /></Button>
                  <span className="text-3xl font-bold text-white w-12 text-center">{calcCurrent}</span>
                  <Button onClick={() => setCalcCurrent(Math.min(10, calcCurrent + 1))} size="sm" className="bg-white/10 text-white hover:bg-white/20"><Plus className="w-4 h-4" /></Button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Power Level Desejado</label>
                <div className="flex items-center gap-3">
                  <Button onClick={() => setCalcTarget(Math.max(calcCurrent + 1, calcTarget - 1))} size="sm" className="bg-white/10 text-white hover:bg-white/20"><Minus className="w-4 h-4" /></Button>
                  <span className="text-3xl font-bold gradient-text w-12 text-center">{calcTarget}</span>
                  <Button onClick={() => setCalcTarget(Math.min(11, calcTarget + 1))} size="sm" className="bg-white/10 text-white hover:bg-white/20"><Plus className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 uppercase">Moedas Necessárias</p>
                <p className="text-3xl font-bold text-amber-400">{formatNum(totalCoins)}</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 uppercase">Power Points</p>
                <p className="text-3xl font-bold text-cyan-400">{formatNum(totalPoints)}</p>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 uppercase">Níveis a Subir</p>
                <p className="text-3xl font-bold text-emerald-400">{calcTarget - calcCurrent}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Per-brawler calculator */}
        {player && (
          <div className="glass rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white mb-3">Custo para Maxar Todos os Brawlers</h3>
            {(() => {
              const notMaxed = player.brawlers.filter(b => b.power < 11);
              let totalMaxCoins = 0;
              let totalMaxPoints = 0;
              notMaxed.forEach(b => {
                for (let i = b.power; i < 11; i++) {
                  const cost = POWER_POINT_COSTS[i];
                  if (cost) { totalMaxCoins += cost.coins; totalMaxPoints += cost.points; }
                }
              });
              return (
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center"><p className="text-xs text-gray-500">Brawlers Não Maxados</p><p className="text-lg font-bold text-white">{notMaxed.length}</p></div>
                  <div className="text-center"><p className="text-xs text-gray-500">Moedas Totais</p><p className="text-lg font-bold text-amber-400">{formatNum(totalMaxCoins)}</p></div>
                  <div className="text-center"><p className="text-xs text-gray-500">Power Points</p><p className="text-lg font-bold text-cyan-400">{formatNum(totalMaxPoints)}</p></div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    );
  };

  // 17. GOALS
  const renderGoals = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Flag className="w-5 h-5 text-pink-400" />Metas Pessoais</h2>
      <div className="glass rounded-xl p-4">
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Nome da meta" value={newGoalTitle} onChange={e => setNewGoalTitle(e.target.value)} className="bg-white/5 border-white/10 text-white flex-1 min-w-[200px]" />
          <Input placeholder="Valor" type="number" value={newGoalTarget} onChange={e => setNewGoalTarget(e.target.value)} className="bg-white/5 border-white/10 text-white w-24" />
          <select value={newGoalUnit} onChange={e => setNewGoalUnit(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
            <option value="troféus" className="bg-zinc-900">Troféus</option>
            <option value="vitórias" className="bg-zinc-900">Vitórias</option>
            <option value="brawlers" className="bg-zinc-900">Brawlers</option>
            <option value="rank" className="bg-zinc-900">Rank</option>
          </select>
          <Button onClick={addGoal} className="bg-gradient-to-r from-pink-500 to-rose-600 text-white"><Plus className="w-4 h-4" /></Button>
        </div>
      </div>
      {goals.length === 0 ? <p className="text-gray-500 text-center py-8">Nenhuma meta criada. Adicione sua primeira meta acima!</p> : (
        <div className="space-y-3">
          {goals.map(g => {
            const pct = Math.min((g.current / g.target) * 100, 100);
            return (
              <div key={g.id} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div><p className="text-sm font-bold text-white">{g.title}</p><p className="text-xs text-gray-500">Prazo: {new Date(g.deadline).toLocaleDateString('pt-BR')}</p></div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => updateGoalProgress(g.id, g.unit === 'rank' ? 1 : 100)} size="sm" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 h-7"><Plus className="w-3 h-3" /></Button>
                    <Button onClick={() => updateGoalProgress(g.id, g.unit === 'rank' ? -1 : -100)} size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 h-7"><Minus className="w-3 h-3" /></Button>
                    <Button onClick={() => removeGoal(g.id)} size="sm" className="bg-white/5 text-gray-500 hover:text-red-400 h-7"><X className="w-3 h-3" /></Button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={pct} className="flex-1 h-2" />
                  <span className="text-xs text-gray-400 w-24 text-right">{g.current}/{g.target} {g.unit}</span>
                </div>
                {pct >= 100 && <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Meta alcançada!</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // 18. MILESTONES
  const renderMilestones = () => {
    if (!player) return renderEmptyState(<PieChart className="w-8 h-8" />, 'Busque um jogador para ver marcos');
    const milestones = [
      { category: 'Troféus', items: [
        { name: '1.000 troféus', target: 1000, current: player.trophies, unit: 'troféus' },
        { name: '5.000 troféus', target: 5000, current: player.trophies, unit: 'troféus' },
        { name: '10.000 troféus', target: 10000, current: player.trophies, unit: 'troféus' },
        { name: '25.000 troféus', target: 25000, current: player.trophies, unit: 'troféus' },
        { name: '50.000 troféus', target: 50000, current: player.trophies, unit: 'troféus' },
        { name: '100.000 troféus', target: 100000, current: player.trophies, unit: 'troféus' },
      ]},
      { category: 'Brawlers', items: [
        { name: '10 brawlers', target: 10, current: player.brawlers.length, unit: 'brawlers' },
        { name: '20 brawlers', target: 20, current: player.brawlers.length, unit: 'brawlers' },
        { name: 'Todos brawlers maxados', target: player.brawlers.length, current: player.brawlers.filter(b => b.power >= 11).length, unit: 'maxados' },
        { name: '5 brawlers Rank 25', target: 5, current: player.brawlers.filter(b => b.trophies >= 1000).length, unit: 'rank 25' },
      ]},
      { category: 'Vitórias', items: [
        { name: '1.000 vitórias 3v3', target: 1000, current: player['3vs3Victories'], unit: 'vitórias' },
        { name: '5.000 vitórias 3v3', target: 5000, current: player['3vs3Victories'], unit: 'vitórias' },
        { name: '100 solo victories', target: 100, current: player.soloVictories, unit: 'solo' },
        { name: '100 duo victories', target: 100, current: player.duoVictories, unit: 'duo' },
      ]},
    ];

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><PieChart className="w-5 h-5 text-purple-400" />Marcos de Progressão</h2>
        {milestones.map((cat, ci) => (
          <div key={ci} className="glass rounded-xl p-4">
            <h3 className="text-sm font-bold text-white mb-3">{cat.category}</h3>
            <div className="space-y-3">
              {cat.items.map((item, ii) => {
                const pct = Math.min((item.current / item.target) * 100, 100);
                const completed = pct >= 100;
                return (
                  <div key={ii}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={'text-sm ' + (completed ? 'text-emerald-400' : 'text-gray-300')}>{item.name}</span>
                      <span className="text-xs text-gray-500">{formatNum(item.current)}/{formatNum(item.target)}</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                    {completed && <p className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Completo!</p>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 19. CONTENT IDEAS
  const renderContent = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Film className="w-5 h-5 text-red-400" />Gerador de Conteúdo AI</h2>
      <div className="flex gap-2 flex-wrap">
        <Input placeholder="Tópico (ex: Subindo de liga, Novo brawler)" value={contentTopic} onChange={e => setContentTopic(e.target.value)} className="bg-white/5 border-white/10 text-white flex-1 min-w-[200px]" />
        <select value={contentPlatform} onChange={e => setContentPlatform(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
          {CONTENT_PLATFORMS.map(p => <option key={p} value={p} className="bg-zinc-900">{p}</option>)}
        </select>
        <select value={contentFormat} onChange={e => setContentFormat(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
          {CONTENT_FORMATS.map(f => <option key={f} value={f} className="bg-zinc-900">{f}</option>)}
        </select>
        <Button onClick={async () => { const r = await callAI('content', { topic: contentTopic || 'conta nova subindo', platform: contentPlatform, format: contentFormat }); if (r?.ideas) setContentIdeas(r.ideas); else if (Array.isArray(r)) setContentIdeas(r); }} disabled={aiLoading} className="bg-gradient-to-r from-red-500 to-rose-600 text-white">
          {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Film className="w-4 h-4" />}
        </Button>
      </div>
      {aiLoading && !contentIdeas ? renderAILoading() : contentIdeas && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {contentIdeas.map((idea, i) => (
            <div key={i} className="glass rounded-xl p-4 hover:border-amber-500/30 transition-all">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-bold text-white">{idea.title}</h4>
                <Badge className="bg-purple-500/10 text-purple-400 border-0 text-xs">{idea.platform}</Badge>
              </div>
              <p className="text-xs text-gray-400 mb-2">{idea.description}</p>
              {idea.hooks?.length > 0 && (
                <div className="mb-2"><p className="text-[10px] text-gray-500 mb-1">Hooks:</p><div className="flex flex-wrap gap-1">{idea.hooks.map((h, j) => <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">{h}</span>)}</div></div>
              )}
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <span>Estimativa: {idea.estimatedViews}</span>
                <span>Dificuldade: {idea.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // 20. TITLE GENERATOR
  const renderTitles = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Type className="w-5 h-5 text-amber-400" />Gerador de Títulos Virais</h2>
      <div className="flex gap-2 flex-wrap">
        <Input placeholder="Tópico do vídeo (ex: Novo brawler, Push rank)" value={titleTopic} onChange={e => setTitleTopic(e.target.value)} className="bg-white/5 border-white/10 text-white flex-1 min-w-[250px]" />
        <select value={titlePlatform} onChange={e => setTitlePlatform(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
          {CONTENT_PLATFORMS.map(p => <option key={p} value={p} className="bg-zinc-900">{p}</option>)}
        </select>
        <Button onClick={async () => { const r = await callAI('titles', { topic: titleTopic || 'brawl stars', platform: titlePlatform }); if (r?.titles) setTitleIdeas(r.titles); else if (Array.isArray(r)) setTitleIdeas(r); }} disabled={aiLoading} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
          {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Type className="w-4 h-4" />}
        </Button>
      </div>
      {aiLoading && !titleIdeas ? renderAILoading() : titleIdeas && (
        <div className="space-y-2">
          {titleIdeas.map((t: any, i: number) => (
            <div key={i} className="glass rounded-xl p-3 flex items-center gap-3 hover:bg-white/8 transition-colors group">
              <span className="text-sm text-gray-600 w-8">#{i + 1}</span>
              <p className="text-sm text-white flex-1">{typeof t === 'string' ? t : t.title || t.text}</p>
              <Button onClick={() => navigator.clipboard?.writeText(typeof t === 'string' ? t : t.title || t.text)} size="sm" className="bg-white/5 text-gray-500 hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity h-7">
                <Share2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // 21. SCHEDULE
  const renderSchedule = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-400" />Calendário de Conteúdo</h2>
      <div className="flex gap-2 flex-wrap">
        <select value={contentPlatform} onChange={e => setContentPlatform(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
          {CONTENT_PLATFORMS.map(p => <option key={p} value={p} className="bg-zinc-900">{p}</option>)}
        </select>
        <Input placeholder="Dias por semana" type="number" value={schedDaysPerWeek} onChange={e => setSchedDaysPerWeek(e.target.value)} className="bg-white/5 border-white/10 text-white w-32" />
        <Input placeholder="Horas por dia" type="number" value={schedHoursPerDay} onChange={e => setSchedHoursPerDay(e.target.value)} className="bg-white/5 border-white/10 text-white w-32" />
        <Button onClick={async () => { const r = await callAI('schedule', { platform: contentPlatform, daysPerWeek: schedDaysPerWeek, hoursPerDay: schedHoursPerDay }); if (r) setScheduleResult(r); }} disabled={aiLoading} className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
          {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
        </Button>
      </div>
      {aiLoading && !scheduleResult ? renderAILoading() : scheduleResult && (
        <div className="space-y-4">
          {scheduleResult.days?.map((day, di) => (
            <div key={di} className="glass rounded-xl p-4">
              <h4 className="text-sm font-bold text-white mb-2">{day.day}</h4>
              {day.slots?.map((slot, si) => (
                <div key={si} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 mb-1">
                  <span className="text-xs text-gray-500 w-16">{slot.time}</span>
                  <div className="flex-1"><p className="text-sm text-white">{slot.content}</p><p className="text-xs text-gray-500">{slot.platform}</p></div>
                  <Badge className={slot.status === 'ideal' ? 'bg-emerald-500/20 text-emerald-400 border-0 text-xs' : 'bg-amber-500/20 text-amber-400 border-0 text-xs'}>{slot.status}</Badge>
                </div>
              ))}
            </div>
          ))}
          {scheduleResult.tips?.length > 0 && (
            <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-white mb-2">Dicas de Programação</h4>{scheduleResult.tips.map((t, i) => <p key={i} className="text-xs text-gray-400 mb-1">• {t}</p>)}</div>
          )}
        </div>
      )}
    </div>
  );

  // 22. VIDEO SCRIPT
  const renderScript = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-emerald-400" />Roteiro de Vídeo AI</h2>
      <div className="flex gap-2 flex-wrap">
        <Input placeholder="Tópico do vídeo" value={scriptTopic} onChange={e => setScriptTopic(e.target.value)} className="bg-white/5 border-white/10 text-white flex-1 min-w-[200px]" />
        <select value={scriptPlatform} onChange={e => setScriptPlatform(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
          {CONTENT_PLATFORMS.map(p => <option key={p} value={p} className="bg-zinc-900">{p}</option>)}
        </select>
        <select value={scriptDuration} onChange={e => setScriptDuration(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
          <option value="1 min" className="bg-zinc-900">1 min (Short)</option>
          <option value="3 min" className="bg-zinc-900">3 min (Reels)</option>
          <option value="5 min" className="bg-zinc-900">5 min</option>
          <option value="10 min" className="bg-zinc-900">10 min</option>
          <option value="15 min" className="bg-zinc-900">15 min</option>
          <option value="20 min" className="bg-zinc-900">20 min+</option>
        </select>
        <Button onClick={async () => { const r = await callAI('script', { topic: scriptTopic || 'brawl stars gameplay', platform: scriptPlatform, duration: scriptDuration }); if (r?.sections) setScriptResult(r); }} disabled={aiLoading} className="bg-gradient-to-r from-emerald-500 to-green-600 text-white">
          {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
        </Button>
      </div>
      {aiLoading && !scriptResult ? renderAILoading() : scriptResult && (
        <div className="space-y-4">
          <div className="glass rounded-xl p-4">
            <h3 className="text-lg font-bold text-white">{scriptResult.title}</h3>
            <p className="text-xs text-gray-500">Duração: {scriptResult.duration}</p>
          </div>
          {scriptResult.sections?.map((s, i) => (
            <div key={i} className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-amber-500/20 text-amber-400 border-0">{s.duration}</Badge>
                <span className="text-sm font-bold text-white">{s.name}</span>
              </div>
              <p className="text-sm text-gray-300">{s.content}</p>
              {s.tips?.length > 0 && <div className="mt-2">{s.tips.map((t, j) => <p key={j} className="text-xs text-amber-400">💡 {t}</p>)}</div>}
            </div>
          ))}
          {scriptResult.thumbnailIdea && (
            <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-white mb-1">Ideia de Thumbnail</h4><p className="text-sm text-gray-400">{scriptResult.thumbnailIdea}</p></div>
          )}
          {scriptResult.tags?.length > 0 && (
            <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-white mb-2">Tags</h4><div className="flex flex-wrap gap-1">{scriptResult.tags.map((t, i) => <Badge key={i} className="bg-blue-500/10 text-blue-400 border-0 text-xs">{t}</Badge>)}</div></div>
          )}
          {scriptResult.cta && (
            <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-white mb-1">Call to Action</h4><p className="text-sm text-gray-400">{scriptResult.cta}</p></div>
          )}
        </div>
      )}
    </div>
  );

  // 23. RECORDING TIPS
  const renderRecording = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Camera className="w-5 h-5 text-purple-400" />Dicas de Gravação</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'Equipamento', icon: Camera, tips: ['Use gravador de tela nativo (iOS/Android)', 'Invista em um microfone lapela', 'Headset com mic é bom para começar', 'Iluminação não é essencial para gameplay', 'Fone de ouvido para evitar eco'] },
          { title: 'Configuração', icon: Settings, tips: ['Resolução mínima: 1080p', 'FPS: 60 para gameplay fluido', 'Ative "Do Not Disturb" ao gravar', 'Feche apps em segundo plano', 'Teste áudio antes de gravar'] },
          { title: 'Apresentação', icon: MessageSquare, tips: ['Fale com energia e entusiasmo', 'Prepare um roteiro antes', 'Use gatilhos de curiosidade', 'Conte histórias, não só gameplay', 'Peça engagement: like, comentário, inscrição'] },
          { title: 'Edição', icon: Film, tips: ['Corte silêncios e mortes', 'Adicione zoom nos momentos épicos', 'Música de fundo baixa', 'Textos na tela para highlights', 'Thumbnail customizada SEMPRE'] },
        ].map((section, i) => (
          <div key={i} className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3"><section.icon className="w-5 h-5 text-amber-400" /><h4 className="text-sm font-bold text-white">{section.title}</h4></div>
            <ul className="space-y-1.5">{section.tips.map((t, j) => <li key={j} className="text-xs text-gray-400">• {t}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  );

  // 24. TRENDS
  const renderTrends = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 text-cyan-400" />Tendências de Conteúdo</h2>
      <div className="flex gap-2">
        <select value={trendPlatform} onChange={e => setTrendPlatform(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white flex-1">
          {CONTENT_PLATFORMS.map(p => <option key={p} value={p} className="bg-zinc-900">{p}</option>)}
        </select>
        <Button onClick={async () => { const r = await callAI('trends', { platform: trendPlatform }); if (Array.isArray(r)) setTrendsResult(r); else if (r?.trends) setTrendsResult(r.trends); }} disabled={aiLoading} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
          {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
        </Button>
      </div>
      {aiLoading && !trendsResult ? renderAILoading() : trendsResult && (
        <div className="space-y-3">
          {trendsResult.map((t, i) => (
            <div key={i} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-white">{t.topic}</h4>
                <div className="flex items-center gap-2">
                  <Badge className={t.trend === 'rising' ? 'bg-emerald-500/20 text-emerald-400 border-0' : t.trend === 'stable' ? 'bg-amber-500/20 text-amber-400 border-0' : 'bg-red-500/20 text-red-400 border-0'}>
                    {t.trend === 'rising' ? 'Em Alta' : t.trend === 'stable' ? 'Estável' : 'Declinando'}
                  </Badge>
                  <Badge className="bg-white/5 text-gray-400 border-0 text-xs">{t.platform}</Badge>
                </div>
              </div>
              <p className="text-xs text-gray-500">Volume: {t.volume}</p>
              <p className="text-xs text-amber-400 mt-1">{t.suggestion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ============ TAB MAP ============
  const tabRenderers: Record<TabId, () => React.ReactNode> = {
    dashboard: renderDashboard,
    brawlers: renderBrawlers,
    events: renderEvents,
    rankings: renderRankings,
    club: renderClub,
    coach: renderCoach,
    draft: renderDraft,
    advisor: renderAdvisor,
    analysis: renderAnalysis,
    battles: renderBattles,
    push: renderPush,
    meta: renderMeta,
    counters: renderCounters,
    progression: renderProgression,
    f2p: renderF2P,
    calculator: renderCalculator,
    goals: renderGoals,
    milestones: renderMilestones,
    content: renderContent,
    titles: renderTitles,
    schedule: renderSchedule,
    script: renderScript,
    recording: renderRecording,
    trends: renderTrends,
  };

  // ============ MAIN LAYOUT ============
  return (
    <div className="flex h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/8 bg-[#0d0d14]">
        {/* Logo */}
        <div className="p-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Swords className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold gradient-text">BrawlTracker</h1>
              <p className="text-[10px] text-gray-600">v4.0 • AI Powered</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="flex gap-1">
            <Input placeholder="#TAG" value={searchTag} onChange={e => setSearchTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="bg-white/5 border-white/10 text-white h-8 text-xs" />
            <Button onClick={() => handleSearch()} disabled={loading} className="bg-amber-500 text-black h-8 w-8 p-0"><Search className="w-3 h-3" /></Button>
          </div>
          {player && (
            <div className="mt-2 p-2 rounded-lg bg-white/5">
              <p className="text-xs text-white font-medium truncate">{player.name}</p>
              <p className="text-[10px] text-amber-400">{formatNum(player.trophies)}🏆</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2">
          {NAV_SECTIONS.map((section, si) => (
            <div key={si} className="mb-4">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider px-3 mb-1">{section.label}</p>
              {section.items.map((item) => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={'nav-item w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ' + (activeTab === item.id ? 'active text-amber-400' : 'text-gray-400 hover:text-white')}>
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-white/8">
          <p className="text-[10px] text-gray-600 text-center">Powered by Groq AI + Brawl Stars API</p>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }} className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-[#0d0d14] border-r border-white/8 z-50 flex flex-col">
              <div className="p-4 border-b border-white/8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center"><Swords className="w-5 h-5 text-white" /></div>
                  <h1 className="text-sm font-bold gradient-text">BrawlTracker v4</h1>
                </div>
                <Button onClick={() => setSidebarOpen(false)} variant="ghost" size="sm" className="text-gray-500"><X className="w-5 h-5" /></Button>
              </div>
              <ScrollArea className="flex-1 px-2">
                {NAV_SECTIONS.map((section, si) => (
                  <div key={si} className="mb-4">
                    <p className="text-[10px] text-gray-600 uppercase tracking-wider px-3 mb-1">{section.label}</p>
                    {section.items.map((item) => (
                      <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} className={'nav-item w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ' + (activeTab === item.id ? 'active text-amber-400' : 'text-gray-400 hover:text-white')}>
                        <item.icon className="w-4 h-4" /><span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </ScrollArea>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-white/8 flex items-center px-4 gap-3 bg-[#0d0d14]/80 backdrop-blur-xl">
          <Button onClick={() => setSidebarOpen(true)} variant="ghost" size="sm" className="lg:hidden text-gray-400"><Menu className="w-5 h-5" /></Button>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-white">{NAV_SECTIONS.flatMap(s => s.items).find(i => i.id === activeTab)?.label || 'Dashboard'}</h2>
          </div>
          {/* Quick search in top bar */}
          <div className="hidden md:flex gap-2 items-center">
            <Input placeholder="#TAGDOJOGADOR" value={searchTag} onChange={e => setSearchTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="bg-white/5 border-white/10 text-white h-8 w-48 text-xs" />
            <Button onClick={() => handleSearch()} disabled={loading} className="bg-amber-500 text-black h-8 px-3 text-xs">{loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Buscar'}</Button>
          </div>
          {player && (
            <div className="flex items-center gap-2 ml-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white">{player.name.charAt(0)}</div>
              <span className="text-xs text-gray-400 hidden md:inline">{player.name}</span>
              <span className="text-xs text-amber-400 font-bold">{formatNum(player.trophies)}🏆</span>
            </div>
          )}
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {tabRenderers[activeTab]?.()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden h-16 border-t border-white/8 bg-[#0d0d14] flex items-center justify-around px-2">
          {MOBILE_NAV.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={'bottom-nav-item relative flex flex-col items-center gap-0.5 py-1 px-3 ' + (activeTab === item.id ? 'active' : 'text-gray-500')}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
          <button onClick={() => setSidebarOpen(true)} className="flex flex-col items-center gap-0.5 py-1 px-3 text-gray-500">
            <Menu className="w-5 h-5" />
            <span className="text-[10px]">Mais</span>
          </button>
        </nav>
      </main>
    </div>
  );
}

// Settings icon component (used in Recording tab)
function Settings({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
