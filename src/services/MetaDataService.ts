/**
 * Brawl Stars Meta Data - February 2026
 * Based on Noff.gg top 200, Brawllace daily stats, and pro opinions
 * @author Bruno Paulon
 */

import { BrawlerMeta } from '@/types';

// Meta Version Info - Update this when tier list changes
export const META_VERSION = {
  version: '2.0',
  lastUpdated: '2026-02-01',
  season: 'February 2026',
  source: 'Noff.gg, Brawllace, Pro opinions',
};

// Updated Tier List - February 2026
export const TIER_LIST_2026 = {
  S: ['Mortis', 'Rico', 'Emz', 'Frank', 'Glowbert', 'Colt', 'Spike', 'Hank'],
  A: ['Fang', 'Bibi', 'Mandy', 'Byron', 'Pierce', 'Poco', 'Surge', 'Lily', 'Griff', 'Edgar', 'Bo', 'Tara', 'Kenji'],
  B: ['Piper', 'Brock', 'Angelo', 'Nani', 'Grom', 'Stu', 'Gray', 'Cordelius', 'Charlie', 'Kit', 'Buzz', 'Willow', 'Bea', '8-Bit', 'Lumi', 'Chester'],
  C: ['Jessie', 'Nita', 'Dynamike', 'El Primo', 'Rosa', 'Jacky', 'Carl', 'Penny', 'Tick', 'Sprout', 'Meg', 'Buster', 'Lou', 'Gene', 'Max', 'Belle', 'Eve', 'Ash', 'Gale', 'Colette', 'Ruffs'],
  D: ['Shelly', 'Bull', 'Darryl', 'Pam', 'Crow', 'Leon', 'Sandy', 'Amber', 'Mr. P', 'Janet', 'Squeak', 'Lola', 'Draco', 'Berry', 'Sam', 'Otis', 'Finx', 'Moe'],
};

// Complete Brawler Meta Data
export const BRAWLER_META_2026: Record<string, BrawlerMeta> = {
  // ============ TIER S - OP, Almost Mandatory ============
  'Mortis': {
    tier: 'S',
    bestModes: ['Brawl Ball', 'Gem Grab', 'Knockout'],
    bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Goldarm Gulch'],
    tips: [
      'Use super to catch groups of enemies',
      'Manage dashes - do not spend them all at once',
      'Excellent for flanking and eliminating supports',
      'Survival shovel gadget is essential for sustain'
    ]
  },
  'Rico': {
    tier: 'S',
    bestModes: ['Brawl Ball', 'Gem Grab', 'Bounty'],
    bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Snake Prairie'],
    tips: [
      'Use walls to maximize ricochets',
      'Super in corners is devastating',
      'Charged attacks deal much more damage',
      'Each bounce increases damage'
    ]
  },
  'Emz': {
    tier: 'S',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Long range spray controls area',
      'Super slow is devastating against tanks',
      'Hype combo gadget greatly increases damage',
      'Maintain maximum distance'
    ]
  },
  'Frank': {
    tier: 'S',
    bestModes: ['Brawl Ball', 'Gem Grab', 'Hot Zone'],
    bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Dueling Beetles'],
    tips: [
      'Use super to stun and eliminate',
      'Watch out for enemy CC - you become vulnerable',
      'Power of knowledge for healing',
      'Dominant in closed maps'
    ]
  },
  'Glowbert': {
    tier: 'S',
    bestModes: ['Gem Grab', 'Hot Zone', 'Knockout'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Goldarm Gulch'],
    tips: [
      'New brawler very strong in the meta',
      'Combine attacks for burst damage',
      'Use super for area control',
      'Great against tanks and assassins'
    ]
  },
  'Colt': {
    tier: 'S',
    bestModes: ['Brawl Ball', 'Gem Grab', 'Bounty'],
    bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Snake Prairie'],
    tips: [
      'Predict enemy movements',
      'Super to break walls and open paths',
      'Speed gadget helps with positioning',
      'High sustained damage'
    ]
  },
  'Spike': {
    tier: 'S',
    bestModes: ['Gem Grab', 'Brawl Ball', 'Showdown'],
    bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Cavern Churn'],
    tips: [
      'Use cactus to zone and control area',
      'Charged attack is devastating',
      'Super for slow and control',
      'Fertilize gadget increases super area'
    ]
  },
  'Hank': {
    tier: 'S',
    bestModes: ['Brawl Ball', 'Gem Grab', 'Hot Zone'],
    bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Dueling Beetles'],
    tips: [
      'Bubble charges while hidden',
      'Use objects to charge safely',
      'Super can one-shot fragile brawlers',
      'Very strong tank in current meta'
    ]
  },

  // ============ TIER A - Very Strong ============
  'Fang': {
    tier: 'A',
    bestModes: ['Brawl Ball', 'Knockout', 'Showdown'],
    bestMaps: ['Super Stadium', 'Goldarm Gulch', 'Cavern Churn'],
    tips: [
      'Use super to finish low health enemies',
      'Kick combo is devastating',
      'Fresh kicks gadget gives invincibility',
      'Great against low health brawlers'
    ]
  },
  'Bibi': {
    tier: 'A',
    bestModes: ['Brawl Ball', 'Gem Grab', 'Hot Zone'],
    bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Dueling Beetles'],
    tips: [
      'Rubber ball for knockback',
      'Use vitamin D for healing',
      'Move constantly',
      'Great against tanks'
    ]
  },
  'Mandy': {
    tier: 'A',
    bestModes: ['Bounty', 'Knockout', 'Gem Grab'],
    bestMaps: ['Snake Prairie', 'Goldarm Gulch', 'Hard Rock Mine'],
    tips: [
      'Charge attacks for maximum damage',
      'In my sights for vision',
      'Maintain maximum distance',
      'Watch out for flankers'
    ]
  },
  'Byron': {
    tier: 'A',
    bestModes: ['Gem Grab', 'Bounty', 'Hot Zone'],
    bestMaps: ['Hard Rock Mine', 'Snake Prairie', 'Dueling Beetles'],
    tips: [
      'Heal allies and damage enemies simultaneously',
      'Injection gadget for extra damage',
      'Maintain distance',
      'Communicate with team'
    ]
  },
  'Pierce': {
    tier: 'A',
    bestModes: ['Knockout', 'Bounty', 'Gem Grab'],
    bestMaps: ['Goldarm Gulch', 'Snake Prairie', 'Hard Rock Mine'],
    tips: [
      'Very strong sniper in the meta',
      'Use cover to reload',
      'Attack pierces through enemies',
      'Great against comps with multiple brawlers'
    ]
  },
  'Poco': {
    tier: 'A',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Constant healing for the team',
      'Super can turn games around',
      'Da capo gadget for damage',
      'Position behind the team'
    ]
  },
  'Surge': {
    tier: 'A',
    bestModes: ['Brawl Ball', 'Gem Grab', 'Hot Zone'],
    bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Dueling Beetles'],
    tips: [
      'Evolve to maximize potential',
      'Use clones to confuse',
      'Serve cold for slow',
      'Strong at all stages'
    ]
  },
  'Lily': {
    tier: 'A',
    bestModes: ['Gem Grab', 'Brawl Ball', 'Knockout'],
    bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Goldarm Gulch'],
    tips: [
      'New addition to tier A',
      'Use invisibility strategically',
      'Combine with team for flanking',
      'Great against snipers'
    ]
  },
  'Griff': {
    tier: 'A',
    bestModes: ['Gem Grab', 'Brawl Ball', 'Hot Zone'],
    bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Dueling Beetles'],
    tips: [
      'Use coins for burst damage',
      'Keep the change for sustain',
      'Super on groups is devastating',
      'Great against tanks'
    ]
  },
  'Edgar': {
    tier: 'A',
    bestModes: ['Brawl Ball', 'Showdown', 'Gem Grab'],
    bestMaps: ['Super Stadium', 'Cavern Churn', 'Hard Rock Mine'],
    tips: [
      'Super charges quickly',
      'Hard landing for stun',
      'Engage when enemy is isolated',
      'Watch out for CC'
    ]
  },
  'Bo': {
    tier: 'A',
    bestModes: ['Gem Grab', 'Bounty', 'Hot Zone'],
    bestMaps: ['Hard Rock Mine', 'Snake Prairie', 'Dueling Beetles'],
    tips: [
      'Mines for area control',
      'Snare a bear for stun',
      'Use totems for vision',
      'Great against assassins'
    ]
  },
  'Tara': {
    tier: 'A',
    bestModes: ['Gem Grab', 'Brawl Ball', 'Hot Zone'],
    bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Dueling Beetles'],
    tips: [
      'Super to pull groups',
      'Shadow void for extra damage',
      'Maintain constant pressure',
      'Great synergy with AOE'
    ]
  },
  'Kenji': {
    tier: 'A',
    bestModes: ['Gem Grab', 'Brawl Ball', 'Knockout'],
    bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Goldarm Gulch'],
    tips: [
      'Use mobility to flank',
      'Super to engage and escape',
      'Watch out for ranged brawlers',
      'Great in current meta'
    ]
  },

  // ============ TIER B - Good/Viable ============
  'Piper': {
    tier: 'B',
    bestModes: ['Bounty', 'Knockout', 'Gem Grab'],
    bestMaps: ['Snake Prairie', 'Goldarm Gulch', 'Hard Rock Mine'],
    tips: [
      'Maintain maximum distance',
      'Super to escape or finish',
      'Homemade recipe for damage',
      'Watch out for flankers'
    ]
  },
  'Brock': {
    tier: 'B',
    bestModes: ['Bounty', 'Gem Grab', 'Brawl Ball'],
    bestMaps: ['Snake Prairie', 'Hard Rock Mine', 'Super Stadium'],
    tips: [
      'Maintain distance',
      'Rocket rain for area',
      'Incendiary for control',
      'Predict movements'
    ]
  },
  'Angelo': {
    tier: 'B',
    bestModes: ['Gem Grab', 'Bounty', 'Knockout'],
    bestMaps: ['Hard Rock Mine', 'Snake Prairie', 'Goldarm Gulch'],
    tips: [
      'Charge arrows for maximum damage',
      'Use poison for pressure',
      'Maintain distance',
      'Watch out for dashes'
    ]
  },
  'Nani': {
    tier: 'B',
    bestModes: ['Bounty', 'Knockout', 'Gem Grab'],
    bestMaps: ['Snake Prairie', 'Goldarm Gulch', 'Hard Rock Mine'],
    tips: [
      'Peep for vision and damage',
      'Return to sender to reflect',
      'High damage per hit',
      'Positioning is everything'
    ]
  },
  'Grom': {
    tier: 'B',
    bestModes: ['Gem Grab', 'Hot Zone', 'Knockout'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Goldarm Gulch'],
    tips: [
      'Bombs for control',
      'Super for large area',
      'Maintain distance',
      'Zone routes'
    ]
  },
  'Stu': {
    tier: 'B',
    bestModes: ['Brawl Ball', 'Gem Grab', 'Hot Zone'],
    bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Dueling Beetles'],
    tips: [
      'Dash for mobility',
      'Zero drag for damage',
      'Hit super for burn',
      'Move constantly'
    ]
  },
  'Gray': {
    tier: 'B',
    bestModes: ['Brawl Ball', 'Gem Grab', 'Hot Zone'],
    bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Dueling Beetles'],
    tips: [
      'Portals for rotation',
      'Walk it off for sustain',
      'Area control',
      'Team synergy'
    ]
  },
  'Cordelius': {
    tier: 'B',
    bestModes: ['Brawl Ball', 'Gem Grab', 'Knockout'],
    bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Goldarm Gulch'],
    tips: [
      'Super to isolate targets',
      'Strong area control',
      'Maintain pressure',
      'Great against assassins'
    ]
  },
  'Charlie': {
    tier: 'B',
    bestModes: ['Gem Grab', 'Brawl Ball', 'Hot Zone'],
    bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Dueling Beetles'],
    tips: [
      'Cocoon to isolate',
      'Spider swarm for damage',
      'Area control',
      'Strategic positioning'
    ]
  },
  'Kit': {
    tier: 'B',
    bestModes: ['Brawl Ball', 'Gem Grab', 'Hot Zone'],
    bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Dueling Beetles'],
    tips: [
      'Super for CC',
      'Great support',
      'Manage resources',
      'Team synergy'
    ]
  },
  'Buzz': {
    tier: 'B',
    bestModes: ['Brawl Ball', 'Knockout', 'Gem Grab'],
    bestMaps: ['Super Stadium', 'Goldarm Gulch', 'Hard Rock Mine'],
    tips: [
      'Charge super quickly',
      'Stun for kills',
      'Residencia for recharge',
      'Engage with caution'
    ]
  },
  'Willow': {
    tier: 'B',
    bestModes: ['Gem Grab', 'Showdown', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Cavern Churn', 'Super Stadium'],
    tips: [
      'Strategic mind control',
      'Maintain distance',
      'Devastating combo',
      'Watch the timing'
    ]
  },
  'Bea': {
    tier: 'B',
    bestModes: ['Gem Grab', 'Bounty', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Snake Prairie', 'Super Stadium'],
    tips: [
      'Charge for extra damage',
      'Honeycomb for vision',
      'Maintain distance',
      'Controlled spam'
    ]
  },
  '8-Bit': {
    tier: 'B',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Booster for speed',
      'Plugged in for self-destruct',
      'Tank with range',
      'Position well'
    ]
  },
  'Lumi': {
    tier: 'B',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'New addition to the game',
      'Use abilities strategically',
      'Area control',
      'Good synergy'
    ]
  },
  'Chester': {
    tier: 'B',
    bestModes: ['Brawl Ball', 'Gem Grab', 'Knockout'],
    bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Goldarm Gulch'],
    tips: [
      'Manage venom stacks',
      'Multi ball for confusion',
      'Super for burst',
      'Unpredictable'
    ]
  },

  // ============ TIER C - Average/Situational ============
  'Jessie': {
    tier: 'C',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Position turret well',
      'Rebote for multiple hits',
      'Super on groups',
      'Area control'
    ]
  },
  'Nita': {
    tier: 'C',
    bestModes: ['Gem Grab', 'Brawl Ball', 'Hot Zone'],
    bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Dueling Beetles'],
    tips: [
      'Bear for pressure',
      'Bear with me for healing',
      'Hyper bear for speed',
      'Keep bear alive'
    ]
  },
  'Dynamike': {
    tier: 'C',
    bestModes: ['Brawl Ball', 'Gem Grab', 'Hot Zone'],
    bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Dueling Beetles'],
    tips: [
      'Predict movements',
      'Fidget spinner for bursts',
      'Super for control',
      'Zone areas'
    ]
  },
  'El Primo': {
    tier: 'C',
    bestModes: ['Showdown', 'Brawl Ball', 'Gem Grab'],
    bestMaps: ['Cavern Churn', 'Super Stadium', 'Hard Rock Mine'],
    tips: [
      'Bush camping works',
      'Suplex supplement for stun',
      'Super to engage',
      'Watch out for range'
    ]
  },
  'Rosa': {
    tier: 'C',
    bestModes: ['Gem Grab', 'Hot Zone', 'Showdown'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Cavern Churn'],
    tips: [
      'Bushes are your strength',
      'Plant life for healing',
      'Super to tank',
      'Use cover'
    ]
  },
  'Jacky': {
    tier: 'C',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Great against tanks',
      'Rebuild for healing',
      'Super for area',
      'Corner enemies'
    ]
  },
  'Carl': {
    tier: 'C',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Use pickaxe to roam',
      'Flying hook for mobility',
      'Super for spin-to-win',
      'Area control'
    ]
  },
  'Penny': {
    tier: 'C',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Position cannon well',
      'Balls of fire for damage',
      'Super on groups',
      'Area control'
    ]
  },
  'Tick': {
    tier: 'C',
    bestModes: ['Gem Grab', 'Hot Zone', 'Bounty'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Snake Prairie'],
    tips: [
      'Maintain distance',
      'Last hurrah for escape',
      'Mines for zone',
      'Watch out for assassins'
    ]
  },
  'Sprout': {
    tier: 'C',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Wall to block',
      'Photosynthesis for healing',
      'Area control',
      'Positioning is key'
    ]
  },
  'Meg': {
    tier: 'C',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Use robot mode',
      'Juggernaut for push',
      'Recharge when possible',
      'Timing is everything'
    ]
  },
  'Buster': {
    tier: 'C',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Shield to protect team',
      'Intercept to reflect',
      'Tank support',
      'Synergy with comps'
    ]
  },
  'Lou': {
    tier: 'C',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Slow for control',
      'Super for freeze',
      'Area control',
      'Maintain pressure'
    ]
  },
  'Gene': {
    tier: 'C',
    bestModes: ['Gem Grab', 'Bounty', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Snake Prairie', 'Super Stadium'],
    tips: [
      'Hand to pull',
      'Lamp for healing',
      'Maintain distance',
      'Super for clutch'
    ]
  },
  'Max': {
    tier: 'C',
    bestModes: ['Gem Grab', 'Brawl Ball', 'Hot Zone'],
    bestMaps: ['Hard Rock Mine', 'Super Stadium', 'Dueling Beetles'],
    tips: [
      'Speed for team',
      'Super for clutch',
      'Stay mobile',
      'Aggressive support'
    ]
  },
  'Belle': {
    tier: 'C',
    bestModes: ['Bounty', 'Gem Grab', 'Knockout'],
    bestMaps: ['Snake Prairie', 'Hard Rock Mine', 'Goldarm Gulch'],
    tips: [
      'Mark targets',
      'Nest for area',
      'Maintain distance',
      'Positioning is key'
    ]
  },
  'Eve': {
    tier: 'C',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Babies for pressure',
      'Super for spawns',
      'Area control',
      'Manage resources'
    ]
  },
  'Ash': {
    tier: 'C',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Manage rage',
      'First bash for stun',
      'Use bots to distract',
      'Aggressive tank'
    ]
  },
  'Gale': {
    tier: 'C',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Push for control',
      'Blizzard for area',
      'Position control',
      'Zone enemies'
    ]
  },
  'Colette': {
    tier: 'C',
    bestModes: ['Showdown', 'Gem Grab', 'Hot Zone'],
    bestMaps: ['Cavern Churn', 'Hard Rock Mine', 'Dueling Beetles'],
    tips: [
      '% damage against tanks',
      'Push it for control',
      'Great in SD',
      'Watch out for fragile brawlers'
    ]
  },
  'Ruffs': {
    tier: 'C',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Buff for team',
      'Air support for damage',
      'Power-up support',
      'Strong synergy'
    ]
  },

  // ============ TIER D - Weak in Current Meta ============
  'Shelly': {
    tier: 'D',
    bestModes: ['Brawl Ball', 'Showdown', 'Gem Grab'],
    bestMaps: ['Super Stadium', 'Cavern Churn', 'Hard Rock Mine'],
    tips: [
      'Super at medium distance',
      'Bush camping works',
      'Fast fingers for combo',
      'Situational in closed maps'
    ]
  },
  'Bull': {
    tier: 'D',
    bestModes: ['Showdown', 'Brawl Ball', 'Gem Grab'],
    bestMaps: ['Cavern Churn', 'Super Stadium', 'Hard Rock Mine'],
    tips: [
      'Bush camping is effective',
      'Super for escape or engage',
      'T-bone for healing',
      'Watch out for range'
    ]
  },
  'Darryl': {
    tier: 'D',
    bestModes: ['Showdown', 'Brawl Ball', 'Gem Grab'],
    bestMaps: ['Cavern Churn', 'Super Stadium', 'Hard Rock Mine'],
    tips: [
      'Super charges automatically',
      'Rolling reload for spam',
      'Bush camping works',
      'Watch out for CC'
    ]
  },
  'Pam': {
    tier: 'D',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Position healing turret well',
      'Mama bear for damage',
      'Tank support',
      'Out of current meta'
    ]
  },
  'Crow': {
    tier: 'D',
    bestModes: ['Showdown', 'Brawl Ball', 'Gem Grab'],
    bestMaps: ['Cavern Churn', 'Super Stadium', 'Hard Rock Mine'],
    tips: [
      'Constant poison',
      'Extra toxic for damage',
      'Maintain distance',
      'Recently nerfed'
    ]
  },
  'Leon': {
    tier: 'D',
    bestModes: ['Showdown', 'Brawl Ball', 'Gem Grab'],
    bestMaps: ['Cavern Churn', 'Super Stadium', 'Hard Rock Mine'],
    tips: [
      'Invisibility for flank',
      'Decoy to distract',
      'Engage when isolated',
      'Out of current meta'
    ]
  },
  'Sandy': {
    tier: 'D',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Super for vision',
      'Rude sands for damage',
      'Area control',
      'Recently nerfed'
    ]
  },
  'Amber': {
    tier: 'D',
    bestModes: ['Hot Zone', 'Gem Grab', 'Brawl Ball'],
    bestMaps: ['Dueling Beetles', 'Hard Rock Mine', 'Super Stadium'],
    tips: [
      'Fire to zone',
      'Super on groups',
      'Manage fuel',
      'Out of current meta'
    ]
  },
  'Mr. P': {
    tier: 'D',
    bestModes: ['Gem Grab', 'Bounty', 'Hot Zone'],
    bestMaps: ['Hard Rock Mine', 'Snake Prairie', 'Dueling Beetles'],
    tips: [
      'Penguins for pressure',
      'Rebote for range',
      'Area control',
      'Recently nerfed'
    ]
  },
  'Janet': {
    tier: 'D',
    bestModes: ['Gem Grab', 'Hot Zone', 'Bounty'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Snake Prairie'],
    tips: [
      'Super for escape',
      'Backup for damage',
      'Maintain distance',
      'Out of meta'
    ]
  },
  'Squeak': {
    tier: 'D',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Bombs for zone',
      'Super for area',
      'Area control',
      'Situational'
    ]
  },
  'Lola': {
    tier: 'D',
    bestModes: ['Gem Grab', 'Hot Zone', 'Bounty'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Snake Prairie'],
    tips: [
      'Ego for split',
      'Super for area',
      'Manage resources',
      'Out of meta'
    ]
  },
  'Draco': {
    tier: 'D',
    bestModes: ['Brawl Ball', 'Showdown', 'Gem Grab'],
    bestMaps: ['Super Stadium', 'Cavern Churn', 'Hard Rock Mine'],
    tips: [
      'Super for burst',
      'Mobility to roam',
      'Recently nerfed',
      'Situational'
    ]
  },
  'Berry': {
    tier: 'D',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Healing for team',
      'Attack for zone',
      'Recently nerfed',
      'Out of meta'
    ]
  },
  'Sam': {
    tier: 'D',
    bestModes: ['Brawl Ball', 'Gem Grab', 'Hot Zone'],
    bestMaps: ['Super Stadium', 'Hard Rock Mine', 'Dueling Beetles'],
    tips: [
      'Knuckles for control',
      'Super for engage',
      'Out of current meta',
      'Situational'
    ]
  },
  'Otis': {
    tier: 'D',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'Silence for control',
      'Super for area',
      'Situational',
      'Out of meta'
    ]
  },
  'Finx': {
    tier: 'D',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'New brawler',
      'Still in development',
      'Needs buffs',
      'Situational'
    ]
  },
  'Moe': {
    tier: 'D',
    bestModes: ['Gem Grab', 'Hot Zone', 'Brawl Ball'],
    bestMaps: ['Hard Rock Mine', 'Dueling Beetles', 'Super Stadium'],
    tips: [
      'New brawler',
      'Still in development',
      'Needs buffs',
      'Situational'
    ]
  },
};

// Default meta for unknown brawlers
export const DEFAULT_META: BrawlerMeta = {
  tier: 'C',
  bestModes: ['Gem Grab', 'Brawl Ball'],
  bestMaps: ['Hard Rock Mine', 'Super Stadium'],
  tips: ['Practice in training mode', 'Know the brawler\'s strengths', 'Watch the current meta'],
};

// Get brawler tier
export function getBrawlerTier(name: string): 'S' | 'A' | 'B' | 'C' | 'D' {
  const meta = BRAWLER_META_2026[name];
  return meta?.tier || 'C';
}

// Get all brawlers by tier
export function getBrawlersByTier(tier: 'S' | 'A' | 'B' | 'C' | 'D'): string[] {
  return TIER_LIST_2026[tier] || [];
}

// Get brawler meta
export function getBrawlerMeta(name: string): BrawlerMeta {
  return BRAWLER_META_2026[name] || DEFAULT_META;
}
