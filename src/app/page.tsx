'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Swords, Radio, Medal, Users, Bot, Crown, Sparkles,
  TrendingUp, Target, Calculator, Flag, Film, Type, Calendar,
  FileText, Camera, BarChart3, Search, Loader2, Send, X,
  Trophy, ChevronRight, Star, Zap, Shield, Flame, Clock,
  Heart, Share2, Lightbulb, RefreshCw, Menu, ChevronDown,
  Play, Info, Plus, Minus, CheckCircle, AlertCircle, ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { APP_CONFIG, RANKED_MAPS } from '@/lib/config';
import type {
  Player, BattleLogItem, BrawlerInfo, EventItem, TabId,
  DraftSuggestion, BrawlerAdvice, AIPlayerAnalysis, PushPlan, ContentIdea, VideoScript
} from '@/types';

// ============ NAVIGATION CONFIG ============
const NAV_SECTIONS = [
  { label: 'Principal', items: [
    { id: 'dashboard' as TabId, icon: Home, label: 'Dashboard' },
    { id: 'brawlers' as TabId, icon: Swords, label: 'Brawlers' },
    { id: 'events' as TabId, icon: Radio, label: 'Eventos' },
    { id: 'rankings' as TabId, icon: Medal, label: 'Rankings' },
    { id: 'club' as TabId, icon: Users, label: 'Clube' },
  ]},
  { label: 'Inteligência AI', items: [
    { id: 'coach' as TabId, icon: Bot, label: 'Coach AI' },
    { id: 'draft' as TabId, icon: Crown, label: 'Draft AI' },
    { id: 'advisor' as TabId, icon: Sparkles, label: 'Conselheiro' },
    { id: 'analysis' as TabId, icon: TrendingUp, label: 'Análise AI' },
    { id: 'push' as TabId, icon: Flame, label: 'Push Planner' },
    { id: 'meta' as TabId, icon: BarChart3, label: 'Meta Insights' },
  ]},
  { label: 'Progressão', items: [
    { id: 'progression' as TabId, icon: Target, label: 'Plano 30 Dias' },
    { id: 'f2p' as TabId, icon: Shield, label: 'Guia F2P' },
    { id: 'calculator' as TabId, icon: Calculator, label: 'Calculadora' },
    { id: 'goals' as TabId, icon: Flag, label: 'Metas' },
  ]},
  { label: 'Criador', items: [
    { id: 'content' as TabId, icon: Film, label: 'Conteúdo' },
    { id: 'titles' as TabId, icon: Type, label: 'Títulos' },
    { id: 'schedule' as TabId, icon: Calendar, label: 'Calendário' },
    { id: 'script' as TabId, icon: FileText, label: 'Roteiro' },
    { id: 'recording' as TabId, icon: Camera, label: 'Gravação' },
    { id: 'trends' as TabId, icon: TrendingUp, label: 'Tendências' },
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
  return battles.slice(0, 15).map(b => {
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
    return { mode: b.battle.mode, map: b.event?.map || '?', result: b.battle.result || 'unknown', brawler, trophyChange: b.battle.trophyChange || 0 };
  });
}

// ============ MAIN COMPONENT ============
export default function BrawlTrackerV3() {
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
  const [trendsResult, setTrendsResult] = useState<any[] | null>(null);
  const [progressionResult, setProgressionResult] = useState<any | null>(null);

  // Coach Chat State
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Olá! Sou o Coach AI do BrawlTracker. Como posso te ajudar? 🎮' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Sub-component States (moved from render functions for React hooks rules)
  const [brawlerFilter, setBrawlerFilter] = useState('all');
  const [brawlerSearch, setBrawlerSearch] = useState('');
  const [rankingRegion, setRankingRegion] = useState('global');
  const [rankingType, setRankingType] = useState<'players' | 'clubs'>('players');
  const [rankings, setRankings] = useState<any[]>([]);
  const [rankingsLoading, setRankingsLoading] = useState(false);
  const [clubTag, setClubTag] = useState('');
  const [club, setClub] = useState<any>(null);
  const [clubLoading, setClubLoading] = useState(false);
  const [calcCurrent, setCalcCurrent] = useState(1);
  const [calcTarget, setCalcTarget] = useState(11);
  const [schedData, setSchedData] = useState<any>(null);

  // Form States
  const [draftMap, setDraftMap] = useState('');
  const [draftBrawlers, setDraftBrawlers] = useState('');
  const [draftEnemies, setDraftEnemies] = useState('');
  const [draftAllies, setDraftAllies] = useState('');
  const [draftBans, setDraftBans] = useState('');
  const [draftSituacao, setDraftSituacao] = useState('');
  const [advisorBrawler, setAdvisorBrawler] = useState('');
  const [advisorMode, setAdvisorMode] = useState('');
  const [contentTopic, setContentTopic] = useState('');
  const [contentPlatform, setContentPlatform] = useState('YouTube');
  const [titleTopic, setTitleTopic] = useState('');
  const [scriptTopic, setScriptTopic] = useState('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bt_history');
    if (saved) setSearchHistory(JSON.parse(saved));
    const savedPlayer = localStorage.getItem('bt_player_tag');
    if (savedPlayer) handleSearch(savedPlayer);
  }, []);

  // Fetch brawlers & events once
  useEffect(() => {
    fetch('/api/brawlers').then(r => r.json()).then(d => setAllBrawlers(d.items || [])).catch(() => {});
    fetch('/api/events').then(r => r.json()).then(d => setEvents(d.items || [])).catch(() => {});
  }, []);

  // Fetch rankings when region/type changes
  useEffect(() => {
    setRankingsLoading(true);
    fetch('/api/rankings?region=' + rankingRegion + '&type=' + rankingType).then(r => r.json()).then(d => { setRankings(d.items || []); setRankingsLoading(false); }).catch(() => setRankingsLoading(false));
  }, [rankingRegion, rankingType]);

  // Fetch schedule data once
  useEffect(() => {
    fetch('/api/ai/schedule', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform: 'YouTube' }) }).then(r => r.json()).then(setSchedData).catch(() => {});
  }, []);

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
    } catch (e: any) {
      setError('Erro ao buscar jogador');
    } finally {
      setLoading(false);
    }
  }, [searchTag]);

  // ============ AI CALLS ============
  const getPlayerContext = () => {
    if (!player) return null;
    const top = [...player.brawlers].sort((a, b) => b.trophies - a.trophies).slice(0, 10);
    return player.name + ' | Troféus: ' + player.trophies + ' | Top brawlers: ' + top.map(b => b.name + '(' + b.trophies + ')').join(', ');
  };

  const callAI = async (endpoint: string, body: any) => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/' + endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      return await res.json();
    } catch { return null; }
    finally { setAiLoading(false); }
  };

  // ============ RENDER HELPERS ============
  const renderStatCard = (label: string, value: string | number, icon: any, color = 'text-amber-400') => (
    <div className="glass rounded-xl p-4 flex items-center gap-3">
      <div className={'w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 ' + color}>{icon}</div>
      <div><p className="text-xs text-gray-500 uppercase">{label}</p><p className="text-lg font-bold text-white">{value}</p></div>
    </div>
  );

  const renderBrawlerImg = (id: number, name: string, size = 'w-12 h-12') => (
    <div className={size + ' rounded-lg bg-white/5 flex items-center justify-center overflow-hidden'}>
      <img src={getBrawlerImg(id)} alt={name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      <span className="text-lg absolute">{name?.charAt(0) || '?'}</span>
    </div>
  );

  // ============ TAB RENDERERS ============
  const renderDashboard = () => {
    if (!player) return renderWelcome();
    const totalV = player['3vs3Victories'] + player.soloVictories + player.duoVictories;
    const maxed = player.brawlers.filter(b => b.power >= 11).length;
    const at1000 = player.brawlers.filter(b => b.trophies >= 1000).length;
    const recentBattles = formatBattleLog(battleLog, player.tag);
    const wins = recentBattles.filter(b => b.result === 'victory').length;
    const wr = recentBattles.length > 0 ? Math.round((wins / recentBattles.length) * 100) : 0;

    return (
      <div className="space-y-6">
        {/* Hero Card */}
        <div className="glass rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-bl-full" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-amber-500/30">
              {player.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{player.name}</h2>
              <p className="text-sm text-gray-400">{player.tag} {player.club ? '• ' + player.club.name : ''}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold gradient-text">{formatNum(player.trophies)}</p>
              <p className="text-xs text-gray-500">🏆 Troféus</p>
            </div>
          </div>
          {/* Progress to goal */}
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

        {/* Quick AI Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Análise AI', tab: 'analysis' as TabId, icon: TrendingUp, color: 'from-purple-500 to-violet-600' },
            { label: 'Coach AI', tab: 'coach' as TabId, icon: Bot, color: 'from-amber-500 to-orange-600' },
            { label: 'Draft AI', tab: 'draft' as TabId, icon: Crown, color: 'from-emerald-500 to-green-600' },
          ].map(a => (
            <button key={a.tab} onClick={() => setActiveTab(a.tab)} className={'glass rounded-xl p-4 text-left hover:bg-white/10 transition-all group'}>
              <div className={'w-10 h-10 rounded-lg bg-gradient-to-br ' + a.color + ' flex items-center justify-center mb-2 group-hover:scale-110 transition-transform'}>
                <a.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-white">{a.label}</p>
              <p className="text-xs text-gray-500">Powered by Groq</p>
            </button>
          ))}
        </div>

        {/* Recent Battles */}
        <div className="glass rounded-2xl p-4">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Clock className="w-5 h-5 text-amber-400" />Batalhas Recentes</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentBattles.map((b, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/8 transition-colors">
                <div className="flex items-center gap-3">
                  <Badge variant={b.result === 'victory' ? 'default' : 'destructive'} className={b.result === 'victory' ? 'bg-emerald-500/20 text-emerald-400 border-0' : 'bg-red-500/20 text-red-400 border-0'}>
                    {b.result === 'victory' ? 'Vitória' : 'Derrota'}
                  </Badge>
                  <div>
                    <p className="text-sm text-white font-medium">{b.brawler}</p>
                    <p className="text-xs text-gray-500">{b.mode} • {b.map}</p>
                  </div>
                </div>
                <span className={'text-sm font-bold ' + (b.trophyChange >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                  {b.trophyChange >= 0 ? '+' : ''}{b.trophyChange}🏆
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl shadow-amber-500/30 pulse-glow">
        <Swords className="w-12 h-12 text-white" />
      </div>
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">BrawlTracker v3</h1>
        <p className="text-gray-400 text-lg">Seu companheiro completo de Brawl Stars</p>
      </div>
      <div className="w-full max-w-md space-y-3">
        <div className="flex gap-2">
          <Input placeholder="#TAGDOJOGADOR" value={searchTag} onChange={e => setSearchTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="bg-white/5 border-white/10 text-white" />
          <Button onClick={() => handleSearch()} disabled={loading} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {searchHistory.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(0, 5).map(h => (
              <button key={h} onClick={() => handleSearch(h)} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-amber-400 hover:border-amber-500/30 transition-all">
                {h}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl mt-4">
        {[
          { icon: Bot, label: 'Coach AI', desc: 'Tire dúvidas com IA' },
          { icon: Crown, label: 'Draft AI', desc: 'Assistente de draft' },
          { icon: Film, label: 'Criador', desc: 'Gere conteúdo' },
          { icon: Target, label: 'Progressão', desc: 'Plano de 30 dias' },
        ].map(f => (
          <div key={f.label} className="glass rounded-xl p-3 text-center">
            <f.icon className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <p className="text-xs font-medium text-white">{f.label}</p>
            <p className="text-[10px] text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBrawlers = () => {
    const brawlers = player?.brawlers || [];
    const filtered = brawlers.filter(b => {
      if (brawlerSearch && !b.name.toLowerCase().includes(brawlerSearch.toLowerCase())) return false;
      if (brawlerFilter === 'maxed') return b.power >= 11;
      if (brawlerFilter === 'need-upgrade') return b.power < 9 && b.trophies >= 500;
      if (brawlerFilter === 'rank25') return b.trophies >= 1000;
      return true;
    }).sort((a, b) => b.trophies - a.trophies);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Input placeholder="Buscar brawler..." value={brawlerSearch} onChange={e => setBrawlerSearch(e.target.value)} className="bg-white/5 border-white/10 text-white flex-1" />
          <div className="flex gap-1">
            {['all', 'maxed', 'need-upgrade', 'rank25'].map(f => (
              <button key={f} onClick={() => setBrawlerFilter(f)} className={'text-xs px-3 py-1.5 rounded-full border transition-all ' + (brawlerFilter === f ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400')}>
                {f === 'all' ? 'Todos' : f === 'maxed' ? 'Max' : f === 'need-upgrade' ? 'Upar' : 'Rank 25'}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map(b => (
            <button key={b.id} onClick={() => { setAdvisorBrawler(b.name); setActiveTab('advisor'); }} className="brawler-card glass rounded-xl p-3 text-center hover:border-amber-500/30 transition-all cursor-pointer">
              <div className="w-16 h-16 mx-auto rounded-xl bg-white/5 flex items-center justify-center overflow-hidden mb-2 relative">
                <img src={getBrawlerImg(b.id)} alt={b.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <p className="text-sm font-medium text-white truncate">{b.name}</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-xs text-amber-400">{b.trophies}🏆</span>
                <span className="text-xs text-gray-500">P{b.power}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1 mt-2">
                <div className="h-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" style={{ width: Math.min((b.power / 11) * 100, 100) + '%' }} />
              </div>
            </button>
          ))}
        </div>
        {filtered.length === 0 && <p className="text-center text-gray-500 py-8">Nenhum brawler encontrado</p>}
      </div>
    );
  };

  const renderEvents = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Radio className="w-5 h-5 text-amber-400" />Rotação de Eventos</h2>
      {events.length === 0 ? <p className="text-gray-500 text-center py-8">Carregando eventos...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {events.map((e, i) => {
            const modeKey = e.event.mode.replace(/\s/g, '').replace(/([A-Z])/g, (m) => m);
            const emoji = APP_CONFIG.modeEmojis[Object.keys(APP_CONFIG.modeEmojis).find(k => e.event.mode.toLowerCase().includes(k.replace(/([A-Z])/g, ' $1').toLowerCase().trim())) || ''] || '🎮';
            return (
              <div key={i} className="glass rounded-xl p-4 hover:border-amber-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{e.event.map}</p>
                    <p className="text-xs text-gray-400">{e.event.mode}</p>
                  </div>
                  <Badge className="bg-white/5 text-gray-400 border-white/10">{e.slotId}</Badge>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Até {new Date(e.endTime).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderRankings = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <select value={rankingRegion} onChange={e => setRankingRegion(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
            {APP_CONFIG.regions.map(r => <option key={r} value={r} className="bg-zinc-900">{r === 'global' ? 'Global' : r}</option>)}
          </select>
          <div className="flex gap-1">
            <button onClick={() => setRankingType('players')} className={'text-xs px-3 py-1.5 rounded-full border transition-all ' + (rankingType === 'players' ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400')}>Jogadores</button>
            <button onClick={() => setRankingType('clubs')} className={'text-xs px-3 py-1.5 rounded-full border transition-all ' + (rankingType === 'clubs' ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-gray-400')}>Clubes</button>
          </div>
        </div>
        {rankingsLoading ? <div className="text-center py-8"><Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" /></div> : (
          <div className="space-y-1">
            {rankings.slice(0, 50).map((r: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <span className={'w-8 text-center text-sm font-bold ' + (i < 3 ? 'text-amber-400' : 'text-gray-500')}>#{r.rank}</span>
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
  };

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
        <div className="flex gap-2">
          <Input placeholder="#TAGDOCLUBE" value={clubTag} onChange={e => setClubTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchClub()} className="bg-white/5 border-white/10 text-white flex-1" />
          <Button onClick={searchClub} disabled={clubLoading} className="bg-amber-500 text-black">{clubLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buscar'}</Button>
        </div>
        {club && (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white">{club.name}</h2>
              <p className="text-sm text-gray-400">{club.tag} • {club.type === 'open' ? 'Aberto' : club.type === 'inviteOnly' ? 'Somente convite' : 'Fechado'}</p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {renderStatCard('Troféus', formatNum(club.trophies), <Trophy className="w-5 h-5" />)}
                {renderStatCard('Membros', club.members?.length || 0, <Users className="w-5 h-5" />, 'text-purple-400')}
                {renderStatCard('Mínimo', formatNum(club.requiredTrophies), <Shield className="w-5 h-5" />, 'text-emerald-400')}
              </div>
            </div>
            <div className="space-y-1">
              {club.members?.sort((a: any, b: any) => b.trophies - a.trophies).map((m: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                  <span className="text-sm text-gray-500 w-6">#{i + 1}</span>
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

  const renderCoach = () => (
    <div className="space-y-4 h-[calc(100vh-12rem)] flex flex-col">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Bot className="w-5 h-5 text-amber-400" />Coach AI</h2>
      <ScrollArea className="flex-1 glass rounded-2xl p-4">
        <div className="space-y-3">
          {chatMessages.map((m, i) => (
            <div key={i} className={'flex gap-2 ' + (m.role === 'user' ? 'justify-end' : 'justify-start')}>
              {m.role === 'assistant' && <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center"><Bot className="w-3.5 h-3.5 text-white" /></div>}
              <div className={'max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ' + (m.role === 'user' ? 'bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white rounded-br-md' : 'bg-white/8 text-gray-200 rounded-bl-md border border-white/5')}>
                {m.content}
              </div>
              {m.role === 'user' && <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"><Search className="w-3.5 h-3.5 text-white" /></div>}
            </div>
          ))}
          {chatLoading && (
            <div className="flex gap-2 justify-start">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center"><Bot className="w-3.5 h-3.5 text-white" /></div>
              <div className="bg-white/8 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                <span className="typing-dot w-2 h-2 rounded-full bg-purple-400" />
                <span className="typing-dot w-2 h-2 rounded-full bg-purple-400" />
                <span className="typing-dot w-2 h-2 rounded-full bg-purple-400" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="flex gap-2">
        <Input placeholder="Pergunte ao Coach AI..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendChat(); }} className="bg-white/5 border-white/10 text-white flex-1" disabled={chatLoading} />
        <Button onClick={sendChat} disabled={!chatInput.trim() || chatLoading} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
          {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
        body: JSON.stringify({ message: msg, playerData: getPlayerContext(), battleLogData: null, history: chatMessages.slice(-6) }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Sem resposta' }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Erro de conexão. Tente novamente! 🔧' }]);
    }
    setChatLoading(false);
  };

  const renderDraft = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Crown className="w-5 h-5 text-amber-400" />Draft AI</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <select value={draftMap} onChange={e => setDraftMap(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
            <option value="" className="bg-zinc-900">Selecione o mapa</option>
            {RANKED_MAPS.map(m => <option key={m} value={m} className="bg-zinc-900">{m}</option>)}
          </select>
          <Input placeholder="Seus brawlers (separados por vírgula)" value={draftBrawlers} onChange={e => setDraftBrawlers(e.target.value)} className="bg-white/5 border-white/10 text-white" />
          <Input placeholder="Brawlers inimigos (separados por vírgula)" value={draftEnemies} onChange={e => setDraftEnemies(e.target.value)} className="bg-white/5 border-white/10 text-white" />
          <Input placeholder="Brawlers aliados (separados por vírgula)" value={draftAllies} onChange={e => setDraftAllies(e.target.value)} className="bg-white/5 border-white/10 text-white" />
          <Input placeholder="Bans (separados por vírgula)" value={draftBans} onChange={e => setDraftBans(e.target.value)} className="bg-white/5 border-white/10 text-white" />
          <Input placeholder="Situação adicional (ex: estou perdendo muito)" value={draftSituacao} onChange={e => setDraftSituacao(e.target.value)} className="bg-white/5 border-white/10 text-white" />
          <Button onClick={async () => { const r = await callAI('draft', { mapa: draftMap, modo: 'Ranked', brawlers: draftBrawlers, inimigos: draftEnemies, aliados: draftAllies, bans: draftBans, situacao: draftSituacao }); if (r) setDraftResult(r); }} disabled={aiLoading || !draftMap} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white">
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Crown className="w-4 h-4 mr-2" />}Analisar Draft
          </Button>
        </div>
        {draftResult && (
          <ScrollArea className="max-h-[70vh]">
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
                  <h4 className="text-sm font-bold text-white mb-2">💡 Dicas</h4>
                  <ul className="space-y-1">{draftResult.dicasGeral.map((d, i) => <li key={i} className="text-xs text-gray-400">• {d}</li>)}</ul>
                </div>
              )}
              <div className="glass rounded-xl p-4">
                <h4 className="text-sm font-bold text-white mb-2">🎯 Estratégia</h4>
                <p className="text-sm text-gray-400">{draftResult.estrategiaGeral}</p>
              </div>
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );

  const renderAdvisor = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-400" />Conselheiro de Brawler</h2>
      <div className="flex gap-2">
        <Input placeholder="Nome do brawler (ex: Spike)" value={advisorBrawler} onChange={e => setAdvisorBrawler(e.target.value)} className="bg-white/5 border-white/10 text-white flex-1" />
        <Input placeholder="Modo (ex: Gem Grab)" value={advisorMode} onChange={e => setAdvisorMode(e.target.value)} className="bg-white/5 border-white/10 text-white w-40" />
        <Button onClick={async () => { const r = await callAI('brawler-advisor', { brawler: advisorBrawler, mode: advisorMode }); if (r?.optimalLoadout) setAdvisorResult(r); }} disabled={aiLoading || !advisorBrawler} className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
          {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        </Button>
      </div>
      {advisorResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-white">⚔️ Loadout Ideal</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><Badge className="bg-blue-500/20 text-blue-400 border-0">Gadget</Badge><span className="text-sm text-white">{advisorResult.optimalLoadout?.gadget}</span></div>
              <div className="flex items-center gap-2"><Badge className="bg-yellow-500/20 text-yellow-400 border-0">Star Power</Badge><span className="text-sm text-white">{advisorResult.optimalLoadout?.starPower}</span></div>
              <div className="flex items-center gap-2"><Badge className="bg-purple-500/20 text-purple-400 border-0">Gears</Badge><span className="text-sm text-white">{advisorResult.optimalLoadout?.gears?.join(', ')}</span></div>
            </div>
            <div><h4 className="text-sm font-bold text-white mb-1">📋 Estratégia</h4><p className="text-sm text-gray-400">{advisorResult.strategy}</p></div>
            <div><h4 className="text-sm font-bold text-white mb-1">📍 Posicionamento</h4><p className="text-sm text-gray-400">{advisorResult.positioning}</p></div>
          </div>
          <div className="space-y-3">
            <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-white mb-2">💡 Dicas</h4><ul className="space-y-1">{advisorResult.tips?.map((t, i) => <li key={i} className="text-xs text-gray-400">• {t}</li>)}</ul></div>
            <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-red-400 mb-2">⚠️ Counters</h4><div className="flex flex-wrap gap-1">{advisorResult.counters?.map((c, i) => <Badge key={i} className="bg-red-500/10 text-red-400 border-0 text-xs">{c}</Badge>)}</div></div>
            <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-emerald-400 mb-2">✅ Sinergias</h4><div className="flex flex-wrap gap-1">{advisorResult.synergies?.map((s, i) => <Badge key={i} className="bg-emerald-500/10 text-emerald-400 border-0 text-xs">{s}</Badge>)}</div></div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 text-amber-400" />Análise AI</h2>
      {!player ? <p className="text-gray-500 text-center py-8">Busque um jogador primeiro</p> : (
        <>
          <Button onClick={async () => { const r = await callAI('analyze', { playerData: getPlayerContext(), battleLogData: null }); if (r?.summary) setAnalysisResult(r); }} disabled={aiLoading} className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TrendingUp className="w-4 h-4 mr-2" />}Analisar Jogador
          </Button>
          {analysisResult && (
            <div className="space-y-4">
              <div className="glass rounded-xl p-4"><p className="text-sm text-gray-300">{analysisResult.summary}</p>
                <div className="mt-3"><p className="text-xs text-gray-500 mb-1">True Skill: {analysisResult.trueSkillEstimate?.rating} ({analysisResult.trueSkillEstimate?.level})</p>
                  <Progress value={Math.min((analysisResult.trueSkillEstimate?.rating / 1500) * 100, 100)} className="h-2" /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-emerald-400 mb-2">💪 Forças</h4>{analysisResult.strengths?.map((s, i) => <p key={i} className="text-xs text-gray-400 mb-1">• {s}</p>)}</div>
                <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-red-400 mb-2">📈 Melhorias</h4>{analysisResult.weaknesses?.map((w, i) => <p key={i} className="text-xs text-gray-400 mb-1">• {w}</p>)}</div>
              </div>
              <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-amber-400 mb-2">🎯 Recomendações</h4>
                <div className="space-y-2">{analysisResult.recommendations?.map((r, i) => (
                  <div key={i} className="p-2 rounded-lg bg-white/5"><div className="flex items-center gap-2"><Badge className={'border-0 text-xs ' + (r.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400')}>{r.priority}</Badge><span className="text-sm font-medium text-white">{r.title}</span></div><p className="text-xs text-gray-400 mt-1">{r.description}</p><p className="text-xs text-amber-400/70 mt-1">→ {r.actionable}</p></div>
                ))}</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderPushPlanner = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Flame className="w-5 h-5 text-amber-400" />Push Planner</h2>
      <Button onClick={async () => { const r = await callAI('push-planner', { playerData: getPlayerContext(), availableTime: 60, targetTrophies: 50 }); if (r?.sessions) setPushResult(r); }} disabled={aiLoading || !player} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Flame className="w-4 h-4 mr-2" />}Planejar Sessão
      </Button>
      {pushResult && (
        <div className="space-y-3">
          <div className="glass rounded-xl p-4 flex items-center justify-between">
            <div><p className="text-sm text-gray-400">Total estimado</p><p className="text-2xl font-bold text-emerald-400">+{pushResult.totalEstimatedTrophies}🏆</p></div>
            {pushResult.tiltWarning && <Badge className="bg-red-500/20 text-red-400 border-0">⚠️ Tilt Warning</Badge>}
          </div>
          {pushResult.sessions?.map((s, i) => (
            <div key={i} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white">{s.brawler}</span>
                <Badge className="bg-amber-500/20 text-amber-400 border-0">+{s.estimatedTrophies}🏆</Badge>
              </div>
              <p className="text-xs text-gray-400">{s.mode} • {s.map} • {s.duration}min</p>
              <p className="text-xs text-gray-500 mt-1">{s.reason}</p>
            </div>
          ))}
          {pushResult.tiltAdvice && <div className="glass rounded-xl p-4"><p className="text-sm text-amber-400">💡 {pushResult.tiltAdvice}</p></div>}
        </div>
      )}
    </div>
  );

  const renderMetaInsights = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><BarChart3 className="w-5 h-5 text-amber-400" />Meta Insights</h2>
      <Button onClick={async () => { const r = await callAI('meta', { playerData: getPlayerContext() }); if (Array.isArray(r)) setTrendsResult(r); }} disabled={aiLoading} className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
        {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BarChart3 className="w-4 h-4 mr-2" />}Analisar Meta
      </Button>
      {trendsResult && (
        <div className="space-y-3">{trendsResult.map((t: any, i: number) => (
          <div key={i} className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1"><Badge className={'border-0 ' + (t.relevance === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400')}>{t.relevance}</Badge><span className="font-bold text-white">{t.title}</span></div>
            <p className="text-sm text-gray-400">{t.description}</p>
            <p className="text-xs text-amber-400/70 mt-1">→ {t.actionable}</p>
          </div>
        ))}</div>
      )}
    </div>
  );

  const renderProgression = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Target className="w-5 h-5 text-amber-400" />Plano 30 Dias</h2>
      <p className="text-sm text-gray-400">Plano personalizado para conta nova subir rápido em 1 mês</p>
      <Button onClick={async () => { const r = await callAI('progression', { playerData: getPlayerContext() }); if (r?.days) setProgressionResult(r); }} disabled={aiLoading} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Target className="w-4 h-4 mr-2" />}Gerar Plano
      </Button>
      {progressionResult && (
        <div className="space-y-4">
          {progressionResult.weeks?.map((w: any, i: number) => (
            <div key={i} className="glass rounded-xl p-4">
              <h3 className="font-bold text-white mb-1">Semana {w.week}: {w.focus}</h3>
              <ul className="space-y-1">{w.goals?.map((g: string, j: number) => <li key={j} className="text-xs text-gray-400">• {g}</li>)}</ul>
            </div>
          ))}
          <div className="space-y-2">{progressionResult.days?.slice(0, 14).map((d: any, i: number) => (
            <div key={i} className="glass rounded-lg p-3 flex items-center gap-3">
              <Badge className="bg-amber-500/20 text-amber-400 border-0">Dia {d.day}</Badge>
              <div className="flex-1"><p className="text-sm text-white">{d.focus}</p><p className="text-xs text-gray-500">Brawlers: {d.brawlers?.join(', ')} • Modos: {d.modes?.join(', ')}</p></div>
              <span className="text-xs text-emerald-400">+{d.estimatedTrophies}🏆</span>
            </div>
          ))}</div>
        </div>
      )}
    </div>
  );

  const renderF2P = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Shield className="w-5 h-5 text-amber-400" />Guia F2P</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: '💎 Gems', tips: ['Nunca gaste gems com skins', 'Guarde para Brawl Pass', 'Gems são mais valiosas que moedas', 'Compre o Brawl Pass quando puder'] },
          { title: '🪙 Moedas', tips: ['Priorize upar brawlers do meta', 'Não gaste com skins no início', 'Guarde para hypercharges', 'Brawlers cromáticos primeiro'] },
          { title: '⚡ Power Points', tips: ['Foque em 3-5 brawlers principais', 'Não distribua igualmente', 'Brawlers com star power primeiro', 'Cheque a rotação de eventos'] },
          { title: '🎟️ Starr Drops', tips: ['Faça todas as missões diárias', 'Starr Drops podem dar hypercharges', 'Priorize missões de ranked', '3 vitórias = 1 drop'] },
          { title: '🎮 Brawl Pass', tips: ['Faça todas as missões semanais', 'Complete quest diárias todo dia', 'Track progresso no app', 'XP doubler é essencial'] },
          { title: '🏆 Troféus', tips: ['Suba com brawlers F2P primeiro', 'Evite push com brawlers fracos', '500-800 é a zona ideal de push', 'Não desista após tilt'] },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-4">
            <h3 className="font-bold text-white mb-2">{s.title}</h3>
            <ul className="space-y-1">{s.tips.map((t, j) => <li key={j} className="text-xs text-gray-400">• {t}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCalculator = () => {

    const powerCosts: Record<number, { coins: number; points: number }> = {
      2: { coins: 20, points: 20 }, 3: { coins: 35, points: 30 }, 4: { coins: 75, points: 50 },
      5: { coins: 140, points: 80 }, 6: { coins: 290, points: 130 }, 7: { coins: 480, points: 210 },
      8: { coins: 800, points: 340 }, 9: { coins: 1250, points: 550 }, 10: { coins: 1800, points: 850 },
      11: { coins: 2800, points: 1250 },
    };

    let totalCoins = 0, totalPoints = 0;
    for (let i = calcCurrent + 1; i <= calcTarget; i++) {
      const cost = powerCosts[i];
      if (cost) { totalCoins += cost.coins; totalPoints += cost.points; }
    }

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Calculator className="w-5 h-5 text-amber-400" />Calculadora de Recursos</h2>
        <div className="glass rounded-xl p-6 space-y-4">
          <div><label className="text-sm text-gray-400">Poder Atual</label><Input type="number" min={1} max={10} value={calcCurrent} onChange={e => setCalcCurrent(parseInt(e.target.value) || 1)} className="bg-white/5 border-white/10 text-white" /></div>
          <div><label className="text-sm text-gray-400">Poder Desejado</label><Input type="number" min={2} max={11} value={calcTarget} onChange={e => setCalcTarget(parseInt(e.target.value) || 11)} className="bg-white/5 border-white/10 text-white" /></div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="glass rounded-xl p-4 text-center"><p className="text-3xl font-bold text-amber-400">{formatNum(totalCoins)}</p><p className="text-sm text-gray-500">Moedas</p></div>
            <div className="glass rounded-xl p-4 text-center"><p className="text-3xl font-bold text-purple-400">{formatNum(totalPoints)}</p><p className="text-sm text-gray-500">Power Points</p></div>
          </div>
        </div>
      </div>
    );
  };

  const renderGoals = () => {
    const goals = [
      { label: '100k Troféus', current: player?.trophies || 0, target: 100000, icon: Trophy, color: 'from-amber-500 to-orange-600' },
      { label: '50k Troféus', current: player?.trophies || 0, target: 50000, icon: Trophy, color: 'from-emerald-500 to-green-600' },
      { label: 'Brawlers Max', current: player?.brawlers.filter(b => b.power >= 11).length || 0, target: player?.brawlers.length || 80, icon: Zap, color: 'from-purple-500 to-violet-600' },
      { label: 'Rank 25', current: player?.brawlers.filter(b => b.trophies >= 1000).length || 0, target: 10, icon: Star, color: 'from-blue-500 to-cyan-600' },
    ];
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Flag className="w-5 h-5 text-amber-400" />Metas</h2>
        <div className="space-y-3">
          {goals.map((g, i) => {
            const pct = Math.min((g.current / g.target) * 100, 100);
            return (
              <div key={i} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2"><g.icon className="w-4 h-4 text-amber-400" /><span className="text-sm font-medium text-white">{g.label}</span></div>
                  <span className="text-sm text-gray-400">{formatNum(g.current)}/{formatNum(g.target)}</span>
                </div>
                <Progress value={pct} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">{Math.round(pct)}% completo</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderContent = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Film className="w-5 h-5 text-amber-400" />Gerador de Conteúdo</h2>
      <div className="flex gap-2">
        <Input placeholder="Tópico (ex: Novo brawler, Dicas de ranked)" value={contentTopic} onChange={e => setContentTopic(e.target.value)} className="bg-white/5 border-white/10 text-white flex-1" />
        <select value={contentPlatform} onChange={e => setContentPlatform(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
          <option value="YouTube" className="bg-zinc-900">YouTube</option>
          <option value="TikTok" className="bg-zinc-900">TikTok</option>
          <option value="Instagram" className="bg-zinc-900">Instagram</option>
        </select>
        <Button onClick={async () => { const r = await callAI('content', { playerData: getPlayerContext(), platform: contentPlatform, topic: contentTopic }); if (Array.isArray(r)) setContentIdeas(r); }} disabled={aiLoading} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
          {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Film className="w-4 h-4" />}
        </Button>
      </div>
      {contentIdeas && (
        <div className="space-y-3">{contentIdeas.map((c, i) => (
          <div key={i} className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1"><Badge className="bg-amber-500/20 text-amber-400 border-0">{c.platform}</Badge><Badge className="bg-purple-500/20 text-purple-400 border-0">{c.format}</Badge><Badge className={'border-0 ' + (c.difficulty === 'Fácil' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400')}>{c.difficulty}</Badge></div>
            <h3 className="font-bold text-white">{c.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{c.description}</p>
            {c.hooks?.length > 0 && <div className="mt-2"><p className="text-xs text-gray-500 mb-1">Hooks:</p>{c.hooks.map((h: string, j: number) => <p key={j} className="text-xs text-amber-400/70">→ {h}</p>)}</div>}
          </div>
        ))}</div>
      )}
    </div>
  );

  const renderTitles = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Type className="w-5 h-5 text-amber-400" />Gerador de Títulos</h2>
      <div className="flex gap-2">
        <Input placeholder="Tópico do vídeo" value={titleTopic} onChange={e => setTitleTopic(e.target.value)} className="bg-white/5 border-white/10 text-white flex-1" />
        <Button onClick={async () => { const r = await callAI('titles', { topic: titleTopic, platform: 'YouTube' }); if (Array.isArray(r)) setTitleIdeas(r); }} disabled={aiLoading} className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
          {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Type className="w-4 h-4" />}
        </Button>
      </div>
      {titleIdeas && (
        <div className="space-y-2">{titleIdeas.map((t: any, i: number) => (
          <div key={i} className="glass rounded-xl p-4 hover:border-amber-500/30 transition-all cursor-pointer">
            <h3 className="font-bold text-white">{t.title}</h3>
            {t.thumbnail && <p className="text-xs text-gray-500 mt-1">🖼️ Thumbnail: {t.thumbnail}</p>}
            {t.style && <Badge className="bg-white/5 text-gray-400 border-0 text-xs mt-1">{t.style}</Badge>}
          </div>
        ))}</div>
      )}
    </div>
  );

  const renderSchedule = () => {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-amber-400" />Calendário de Posts</h2>
        {schedData && (
          <div className="space-y-3">
            <div className="glass rounded-xl p-4"><p className="text-sm text-gray-400">Frequência recomendada</p><p className="text-lg font-bold text-amber-400">{schedData.frequency}</p></div>
            <div className="space-y-2">{schedData.recommendations?.map((r: any, i: number) => (
              <div key={i} className="glass rounded-xl p-4 flex items-center justify-between">
                <div><p className="text-sm font-bold text-white">{r.day}</p><p className="text-xs text-gray-500">{r.time}</p></div>
                <p className="text-xs text-gray-400">{r.reason}</p>
              </div>
            ))}</div>
            <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-white mb-2">💡 Dicas</h4><ul className="space-y-1">{schedData.tips?.map((t: string, i: number) => <li key={i} className="text-xs text-gray-400">• {t}</li>)}</ul></div>
          </div>
        )}
      </div>
    );
  };

  const renderScript = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-amber-400" />Roteiro de Vídeo</h2>
      <div className="flex gap-2">
        <Input placeholder="Tópico do vídeo" value={scriptTopic} onChange={e => setScriptTopic(e.target.value)} className="bg-white/5 border-white/10 text-white flex-1" />
        <Button onClick={async () => { const r = await callAI('script', { topic: scriptTopic, platform: 'YouTube' }); if (r?.sections) setScriptResult(r); }} disabled={aiLoading} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
          {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
        </Button>
      </div>
      {scriptResult && (
        <div className="space-y-3">
          <div className="glass rounded-xl p-4"><h3 className="text-lg font-bold text-white">{scriptResult.title}</h3><p className="text-sm text-gray-400">Duração: {scriptResult.duration}</p></div>
          {scriptResult.sections?.map((s, i) => (
            <div key={i} className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2"><Badge className="bg-amber-500/20 text-amber-400 border-0">{s.name}</Badge><span className="text-xs text-gray-500">{s.duration}</span></div>
              <p className="text-sm text-gray-400">{s.content}</p>
              {s.tips?.length > 0 && <ul className="mt-2 space-y-1">{s.tips.map((t: string, j: number) => <li key={j} className="text-xs text-amber-400/70">💡 {t}</li>)}</ul>}
            </div>
          ))}
          <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-white mb-1">🖼️ Thumbnail</h4><p className="text-sm text-gray-400">{scriptResult.thumbnailIdea}</p></div>
          <div className="glass rounded-xl p-4"><h4 className="text-sm font-bold text-white mb-1">📌 CTA</h4><p className="text-sm text-gray-400">{scriptResult.cta}</p></div>
        </div>
      )}
    </div>
  );

  const renderRecording = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><Camera className="w-5 h-5 text-amber-400" />Dicas de Gravação</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: '📱 Configurações OBS', tips: ['Resolução: 1920x1080', 'FPS: 60', 'Bitrate: 6000 Kbps', 'Encoder: NVENC/H.264', 'Formato: MP4 ou MKV', 'Áudio: 160 Kbps AAC'] },
          { title: '✂️ Edição', tips: ['Use CapCut (grátis) ou Premiere', 'Corte silêncios e mortes', 'Adicione zoom nos momentos épicos', 'Música de fundo a 10-15% volume', 'Legendas aumentam retenção', 'Thumbnail antes do vídeo'] },
          { title: '🖼️ Thumbnails', tips: ['Use rosto expressivo', 'Texto grande e legível', 'Cores vibrantes (amarelo, vermelho)', 'Mostrar o brawler principal', 'Resolução 1280x720', 'A/B teste com 2 versões'] },
          { title: '📱 Gravação Mobile', tips: ['Use gravador nativo do iOS/Android', 'Desative notificações', 'Modo avião para evitar lags', 'Grave em paisagem (horizontal)', 'Use elástico ou suporte', 'Iluminação boa se mostrar rosto'] },
          { title: '🎤 Áudio', tips: ['Microfone decente (Blue Yeti, etc.)', 'Narração energética e natural', 'Evite "ehh" e "hum"', 'Áudio do jogo a 30%', 'Use noise gate no OBS', 'Grave narração separada'] },
          { title: '📈 SEO YouTube', tips: ['Título com palavras-chave', 'Descrição de 200+ palavras', 'Tags relevantes (10-15)', 'Cards e telas finais', 'Thumbnail personalizada', 'Poste nos primeiros 30 min'] },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-4">
            <h3 className="font-bold text-white mb-2">{s.title}</h3>
            <ul className="space-y-1">{s.tips.map((t, j) => <li key={j} className="text-xs text-gray-400">• {t}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 text-amber-400" />Tendências</h2>
      <Button onClick={async () => { const r = await callAI('trends', { playerData: getPlayerContext() }); if (Array.isArray(r)) setTrendsResult(r); }} disabled={aiLoading} className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        {aiLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TrendingUp className="w-4 h-4 mr-2" />}Analisar Tendências
      </Button>
      {trendsResult && (
        <div className="space-y-3">{trendsResult.map((t: any, i: number) => (
          <div key={i} className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1"><Badge className={'border-0 ' + (t.urgency === 'Alta' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400')}>{t.urgency}</Badge><span className="font-bold text-white">{t.trend}</span></div>
            <p className="text-sm text-gray-400">{t.description}</p>
            <p className="text-xs text-amber-400/70 mt-1">💡 Ângulo: {t.contentAngle}</p>
            {t.platforms && <div className="mt-1 flex gap-1">{t.platforms.map((p: string, j: number) => <Badge key={j} className="bg-white/5 text-gray-400 border-0 text-xs">{p}</Badge>)}</div>}
          </div>
        ))}</div>
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
    push: renderPushPlanner,
    meta: renderMetaInsights,
    progression: renderProgression,
    f2p: renderF2P,
    calculator: renderCalculator,
    goals: renderGoals,
    content: renderContent,
    titles: renderTitles,
    schedule: renderSchedule,
    script: renderScript,
    recording: renderRecording,
    trends: renderTrends,
  };

  // ============ MAIN RENDER ============
  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/8 bg-sidebar overflow-y-auto">
        <div className="p-4 border-b border-white/8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">BrawlTracker</h1>
              <p className="text-[10px] text-gray-500">v3.0 • Powered by Groq AI</p>
            </div>
          </div>
          {/* Search in sidebar */}
          <div className="mt-3 flex gap-1">
            <Input placeholder="#TAG" value={searchTag} onChange={e => setSearchTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="bg-white/5 border-white/10 text-white text-xs h-8" />
            <Button onClick={() => handleSearch()} size="sm" className="bg-amber-500 text-black h-8 w-8 p-0"><Search className="w-3 h-3" /></Button>
          </div>
        </div>
        <nav className="flex-1 py-2">
          {NAV_SECTIONS.map((section, si) => (
            <div key={si}>
              <p className="px-4 py-2 text-[10px] uppercase tracking-wider text-gray-600 font-medium">{section.label}</p>
              {section.items.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={'nav-item w-full flex items-center gap-3 px-4 py-2 text-sm ' + (activeTab === item.id ? 'active' : 'text-gray-400 hover:text-white')}>
                  <item.icon className="w-4 h-4" /><span>{item.label}</span>
                </button>
              ))}
              {si < NAV_SECTIONS.length - 1 && <div className="my-2 mx-4 border-t border-white/5" />}
            </div>
          ))}
        </nav>
        {player && (
          <div className="p-4 border-t border-white/8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-bold text-white">{player.name.charAt(0)}</div>
              <div><p className="text-sm text-white font-medium truncate max-w-[140px]">{player.name}</p><p className="text-xs text-amber-400">{formatNum(player.trophies)}🏆</p></div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-3 border-b border-white/8">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-8 h-8 flex items-center justify-center"><Menu className="w-5 h-5 text-white" /></button>
            <h1 className="text-lg font-bold gradient-text">BrawlTracker</h1>
          </div>
          <div className="flex gap-1">
            <Input placeholder="#TAG" value={searchTag} onChange={e => setSearchTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="bg-white/5 border-white/10 text-white text-xs h-8 w-28" />
            <Button onClick={() => handleSearch()} size="sm" className="bg-amber-500 text-black h-8 w-8 p-0"><Search className="w-3 h-3" /></Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {loading && <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 text-amber-400 animate-spin" /></div>}
          {!loading && tabRenderers[activeTab]?.()}
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden flex items-center justify-around border-t border-white/8 bg-sidebar/95 backdrop-blur-xl py-2 px-1">
          {MOBILE_NAV.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={'bottom-nav-item relative flex flex-col items-center gap-0.5 px-3 py-1 ' + (activeTab === item.id ? 'active text-amber-400' : 'text-gray-500')}>
              <item.icon className="w-5 h-5" /><span className="text-[10px]">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 z-50 bg-black/60" onClick={() => setSidebarOpen(false)}>
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="w-64 h-full bg-sidebar border-r border-white/8 overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-white/8 flex items-center justify-between">
                <h1 className="text-lg font-bold gradient-text">BrawlTracker</h1>
                <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <nav className="py-2">
                {NAV_SECTIONS.map((section, si) => (
                  <div key={si}>
                    <p className="px-4 py-2 text-[10px] uppercase tracking-wider text-gray-600 font-medium">{section.label}</p>
                    {section.items.map(item => (
                      <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} className={'nav-item w-full flex items-center gap-3 px-4 py-2 text-sm ' + (activeTab === item.id ? 'active' : 'text-gray-400 hover:text-white')}>
                        <item.icon className="w-4 h-4" /><span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Loading Overlay */}
      <AnimatePresence>
        {aiLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed bottom-20 lg:bottom-6 right-6 z-40 glass rounded-xl px-4 py-3 flex items-center gap-2 shadow-xl">
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="text-sm text-white">Pensando...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
