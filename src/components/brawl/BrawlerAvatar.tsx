/**
 * Brawler Avatar Component with fallback
 * Uses API-provided images or fallback to generated avatars
 * @author Bruno Paulon
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getBrawlerTier } from '@/services/MetaDataService';
import { getBrawlerImage, hasLocalBrawlerImage } from '@/services/AssetService';

// Cache de URLs de imagens dos brawlers
let brawlerImageCache: Record<string, string> = {};

export function setBrawlerImageCache(cache: Record<string, string>) {
  brawlerImageCache = { ...brawlerImageCache, ...cache };
}

export function getBrawlerImageCache() {
  return brawlerImageCache;
}

interface BrawlerAvatarProps {
  name: string;
  id?: number;
  imageUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  trophies?: number;
  power?: number;
  showTier?: boolean;
  showInfo?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  xs: 'w-8 h-8 text-xs',
  sm: 'w-10 h-10 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-20 h-20 text-xl',
};

const TIER_COLORS: Record<string, string> = {
  S: 'from-yellow-400 via-amber-500 to-orange-600',
  A: 'from-emerald-400 via-green-500 to-teal-600',
  B: 'from-blue-400 via-cyan-500 to-indigo-600',
  C: 'from-gray-400 via-slate-500 to-zinc-600',
  D: 'from-red-400 via-rose-500 to-pink-600',
};

// Mapeamento de nomes para emojis/ícones
const BRAWLER_ICONS: Record<string, string> = {
  'Shelly': '🔫', 'Colt': '🤠', 'Bull': '🐂', 'Jessie': '👩‍🔧', 'Nita': '🐻',
  'Brock': '🚀', 'Rico': '🎱', 'Darryl': '🛢️', 'Penny': '💰', 'Piper': '🎯',
  'Pam': '👩‍⚕️', 'Frank': '🔨', 'Bibi': '⚾', 'Mortis': '🦇', 'Tara': '🔮',
  'Spike': '🌵', 'Crow': '🦅', 'Leon': '🦎', 'Sandy': '😴', 'Amber': '🔥',
  'Bea': '🐝', 'Nani': '🤖', 'Edgar': '🧛', 'Byron': '💊', 'Colette': '📚',
  'Grom': '💣', 'Belle': '🎯', 'Ash': '😤', 'Gene': '🧞', 'Max': '⚡',
  'Mr. P': '🐧', 'Jacky': '⛏️', 'Carl': '🪨', 'Gale': '💨', 'Surge': '🥤',
  'Lou': '🍦', 'Ruffs': '🦮', 'Amber': '🔥', 'Stu': '🏎️', 'Buzz': '🦈',
  'Fang': '🥋', 'Eve': '👽', 'Janet': '🎤', 'Bonnie': '💥', 'Otis': '🐙',
  'Sam': '🥊', 'Gus': '👻', 'Buster': '🎬', 'Pearl': '👧', 'Rosa': '🌹',
  'El Primo': '💪', 'Dynamike': '💣', 'Tick': '🤖', 'Sprout': '🌱', 'Squeak': '🎈',
  'Meg': '🤖', 'Lola': '🎭', 'Fang': '🥋', 'Willow': '🧙‍♀️', 'Kit': '🐱',
  'Charlie': '🕷️', 'Chester': '🃏', 'Maisie': '💫', 'Cordelius': '🌽',
  'Mandy': '👑', 'Angelo': '🏹', 'Pierce': '🎯', 'Draco': '🐉', 'Berry': '🎨',
  'Kenji': '🍣', 'Hank': '🫧', 'Gray': '👴', 'Draco': '🎸', 'Glowbert': '✨',
  'Lumi': '💡', 'Moe': '🐹', 'Finx': '🦊', 'Lily': '🦋', 'Bo': '🏹',
  '8-Bit': '👾', 'Emz': '💅', 'Poco': '🎸', 'Griff': '🏦',
};

export function BrawlerAvatar({ 
  name, 
  id, 
  imageUrl,
  size = 'md', 
  trophies, 
  power,
  showTier = true,
  showInfo = false,
  className = ''
}: BrawlerAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const tier = getBrawlerTier(name);
  
  // Generate avatar URL - priority: local asset > provided URL > cache > fallback
  const avatarUrl = useMemo(() => {
    // First check local assets
    if (hasLocalBrawlerImage(name)) {
      return getBrawlerImage(name, imageUrl);
    }
    
    if (imageUrl) return imageUrl;
    if (id && brawlerImageCache[id.toString()]) return brawlerImageCache[id.toString()];
    if (brawlerImageCache[name]) return brawlerImageCache[name];
    
    // Use official Brawl Stars assets via CDN
    if (id) {
      return `https://media.brawltime.ninja/brawlers/avatar/${id}.webp`;
    }
    
    // Try brawltime ninja as fallback
    const formattedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `https://media.brawltime.ninja/brawlers/avatar/${formattedName}.webp`;
  }, [id, name, imageUrl]);

  const tierColor = TIER_COLORS[tier] || TIER_COLORS.C;
  const icon = BRAWLER_ICONS[name] || name.charAt(0);

  return (
    <div className={`relative ${className}`}>
      {/* Avatar Container */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`${SIZE_CLASSES[size]} relative rounded-xl overflow-hidden shadow-lg`}
      >
        {/* Tier Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${tierColor} opacity-90`} />
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
        
        {/* Image or Fallback */}
        {!imageError ? (
          <img
            src={avatarUrl}
            alt={name}
            className="absolute inset-0 w-full h-full object-contain object-center scale-110 z-10"
            onError={() => setImageError(true)}
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative z-10">
            <span className="text-lg drop-shadow-lg">
              {icon}
            </span>
          </div>
        )}

        {/* Power Badge */}
        {power !== undefined && power < 11 && (
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg px-1.5 py-0.5 text-[8px] font-bold text-white shadow-lg z-20">
            P{power}
          </div>
        )}

        {/* Max Power Badge */}
        {power === 11 && (
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg px-1 py-0.5 text-[8px] font-bold text-white shadow-lg z-20">
            MAX
          </div>
        )}
      </motion.div>

      {/* Tier Badge */}
      {showTier && (
        <div className={`absolute -top-1 -left-1 w-5 h-5 rounded-lg bg-gradient-to-br ${tierColor} flex items-center justify-center shadow-lg z-20`}>
          <span className="text-[10px] font-bold text-white">{tier}</span>
        </div>
      )}

      {/* Info Display */}
      {showInfo && (
        <div className="mt-1 text-center">
          <p className="text-xs font-medium text-gray-300 truncate max-w-[60px]">{name}</p>
          {trophies !== undefined && (
            <p className="text-[10px] text-amber-400">{trophies} 🏆</p>
          )}
        </div>
      )}
    </div>
  );
}

// Grid component for multiple brawlers
interface BrawlerGridProps {
  brawlers: Array<{
    name: string;
    id?: number;
    imageUrl?: string;
    trophies?: number;
    power?: number;
  }>;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showInfo?: boolean;
  maxShow?: number;
}

export function BrawlerGrid({ brawlers, size = 'md', showInfo = false, maxShow }: BrawlerGridProps) {
  const displayBrawlers = maxShow ? brawlers.slice(0, maxShow) : brawlers;
  const remaining = maxShow && brawlers.length > maxShow ? brawlers.length - maxShow : 0;

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayBrawlers.map((brawler, i) => (
        <BrawlerAvatar
          key={`${brawler.name}-${i}`}
          name={brawler.name}
          id={brawler.id}
          imageUrl={brawler.imageUrl}
          size={size}
          trophies={brawler.trophies}
          power={brawler.power}
          showInfo={showInfo}
          showTier={true}
        />
      ))}
      {remaining > 0 && (
        <div className={`${SIZE_CLASSES[size]} rounded-xl bg-white/10 flex items-center justify-center`}>
          <span className="text-xs text-gray-400">+{remaining}</span>
        </div>
      )}
    </div>
  );
}

export default BrawlerAvatar;
