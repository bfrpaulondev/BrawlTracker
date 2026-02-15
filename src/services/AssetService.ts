/**
 * Asset Service - Static assets for BrawlTracker
 * Generated images for brawlers, maps, gadgets, star powers, and gears
 * @author Bruno Paulon
 */

// Base path for assets
const ASSETS_BASE = '/assets';

// ============ BRAWLER IMAGES ============
// Maps brawler name to local asset path
const BRAWLER_IMAGES: Record<string, string> = {
  'Mortis': `${ASSETS_BASE}/brawlers/mortis.png`,
  'Colt': `${ASSETS_BASE}/brawlers/colt.png`,
  'Spike': `${ASSETS_BASE}/brawlers/spike.png`,
  'Fang': `${ASSETS_BASE}/brawlers/fang.png`,
  'Bibi': `${ASSETS_BASE}/brawlers/bibi.png`,
  'El Primo': `${ASSETS_BASE}/brawlers/el-primo.png`,
  'Piper': `${ASSETS_BASE}/brawlers/piper.png`,
  'Edgar': `${ASSETS_BASE}/brawlers/edgar.png`,
  'Emz': `${ASSETS_BASE}/brawlers/emz.png`,
  // Add more as they're generated
};

// ============ MAP IMAGES ============
// Maps mode to background image
const MAP_IMAGES: Record<string, string> = {
  'brawlBall': `${ASSETS_BASE}/maps/brawl-ball.png`,
  'gemGrab': `${ASSETS_BASE}/maps/gem-grab.png`,
  'soloShowdown': `${ASSETS_BASE}/maps/showdown.png`,
  'duoShowdown': `${ASSETS_BASE}/maps/showdown.png`,
  'trioShowdown': `${ASSETS_BASE}/maps/showdown.png`,
  'knockout': `${ASSETS_BASE}/maps/knockout.png`,
  'hotZone': `${ASSETS_BASE}/maps/gem-grab.png`,
  'heist': `${ASSETS_BASE}/maps/brawl-ball.png`,
  'bounty': `${ASSETS_BASE}/maps/knockout.png`,
  'duels': `${ASSETS_BASE}/maps/knockout.png`,
  'wipeout': `${ASSETS_BASE}/maps/knockout.png`,
  'wipeout5V5': `${ASSETS_BASE}/maps/knockout.png`,
};

// Mode display names (for better UI)
const MODE_DISPLAY_NAMES: Record<string, string> = {
  'brawlBall': 'Brawl Ball',
  'gemGrab': 'Gem Grab',
  'soloShowdown': 'Solo Showdown',
  'duoShowdown': 'Duo Showdown',
  'trioShowdown': 'Trio Showdown',
  'knockout': 'Knockout',
  'hotZone': 'Hot Zone',
  'heist': 'Heist',
  'bounty': 'Bounty',
  'duels': 'Duels',
  'wipeout': 'Wipeout',
  'wipeout5V5': 'Wipeout 5v5',
  'unknown': 'Special Event',
};

// ============ ABILITY ICONS ============
const GADGET_ICON = `${ASSETS_BASE}/gadgets/gadget.png`;
const STAR_POWER_ICON = `${ASSETS_BASE}/star-powers/star-power.png`;
const GEAR_ICON = `${ASSETS_BASE}/gears/gear.png`;

// ============ HELPER FUNCTIONS ============

/**
 * Get brawler image URL
 * Returns local asset if available, otherwise falls back to API URL
 */
export function getBrawlerImage(name: string, apiImageUrl?: string): string {
  const localImage = BRAWLER_IMAGES[name];
  if (localImage) return localImage;
  
  // Fallback to API image or brawltime CDN
  if (apiImageUrl) return apiImageUrl;
  
  // Last resort: brawltime ninja CDN
  const formattedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `https://media.brawltime.ninja/brawlers/avatar/${formattedName}.webp`;
}

/**
 * Get map background image for a mode
 */
export function getMapImage(mode: string): string {
  return MAP_IMAGES[mode] || MAP_IMAGES['gemGrab'];
}

/**
 * Get mode display name
 */
export function getModeDisplayName(mode: string): string {
  return MODE_DISPLAY_NAMES[mode] || mode;
}

/**
 * Get gadget icon
 */
export function getGadgetIcon(): string {
  return GADGET_ICON;
}

/**
 * Get star power icon
 */
export function getStarPowerIcon(): string {
  return STAR_POWER_ICON;
}

/**
 * Get gear icon
 */
export function getGearIcon(): string {
  return GEAR_ICON;
}

/**
 * Check if local brawler image exists
 */
export function hasLocalBrawlerImage(name: string): boolean {
  return !!BRAWLER_IMAGES[name];
}

/**
 * Get all available local brawler images
 */
export function getAvailableBrawlerImages(): string[] {
  return Object.keys(BRAWLER_IMAGES);
}

// Export constants
export { BRAWLER_IMAGES, MAP_IMAGES, MODE_DISPLAY_NAMES };
